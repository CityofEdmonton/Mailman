using Google.Apis.Gmail.v1;
using Google.Apis.Http;
using Google.Apis.Sheets.v4;
using Mailman.Services.Google;
using Mailman.Services.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using Mailman.Services.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mailman.Services
{
    // excluding from code coverage because this is all about ASP.NET setup
    [ExcludeFromCodeCoverage()]
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureLogging(this IServiceCollection services,
            string module,
            IConfiguration configuration = null, 
            Action<LoggerConfiguration> config = null)
        {
            services.AddSingleton<ILogger>(x =>
            {
                var loggerConfig = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", "Mailman")
                    .Enrich.WithProperty("Module", module);

                if (configuration != null)
                    loggerConfig = loggerConfig.ReadFrom.Configuration(configuration);

                loggerConfig = loggerConfig.WriteTo.Console();
                    

                // give a chance for the caller to further configure the Logger
                config?.Invoke(loggerConfig);

                return loggerConfig
                    .CreateLogger();
            });

            return services;
        }

        public static IServiceCollection ConfigureSwagger(this IServiceCollection services,
            IEnumerable<Type> modelBaseClasses = null)
        {
            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", 
                    new Info
                    {
                        Title = "Mailman API",
                        Description = "API for interacting with Mailman templates and running mail merges",
                        License = new License()
                        {
                            Name = "GNU General Public License",
                            Url = "https://www.gnu.org/licenses/gpl-3.0.en.html"
                        },
                        Version = "v1"
                    });

                c.DescribeAllEnumsAsStrings();

                if (modelBaseClasses != null)
                {


                    // from https://stackoverflow.com/questions/34397349/how-do-i-include-subclasses-in-swagger-api-documentation-using-swashbuckle
                    var documentFilterMethod = typeof(SwaggerGenOptionsExtensions).GetMethod("DocumentFilter");
                    //var documentFilterMethod = c.GetType().GetMethod("DocumentFilter");
                    var schemaFilterMethod = typeof(SwaggerGenOptionsExtensions).GetMethod("SchemaFilter");
                    //var schemaFilterMethod = c.GetType().GetMethod("SchemaFilter");
                    foreach (var t in modelBaseClasses)
                    {
                        documentFilterMethod.MakeGenericMethod(
                            typeof(PolymorphismDocumentFilter<>).MakeGenericType(t))
                            .Invoke(null, new object[] { c, Array.Empty<object>() });

                        schemaFilterMethod.MakeGenericMethod(
                            typeof(PolymorphismSchemaFilter<>).MakeGenericType(t))
                            .Invoke(c, new object[] { c, Array.Empty<object>() });
                    }
                }

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, true);
            });


            return services;
        }



        public static AuthenticationBuilder AddMailmanAuthentication(this IServiceCollection services, 
            IConfiguration configuration = null)
        {
            var authenticationBuilder = services.AddAuthentication(options =>
           {
               options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
               options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
                .AddCookie(configuration)
                .AddServiceAuth(configuration)
                .AddGoogle(configuration);

            // configure the service that saves the tokens to a cache
            services.ConfureGoogleOAuthTokenService(configuration);

            return authenticationBuilder;
        }

        public static IServiceCollection AddMailmanServices(this IServiceCollection services, 
            IConfiguration configuration = null,
            Action<DbContextOptionsBuilder> dbOptionsAction = null,
            IConfigurableHttpClientInitializer googleCredentials = null)
        {
            // configure the Google Sheets service
            if (googleCredentials == null)
            {
                services.AddScoped<IGoogleServicesAccessor, HttpAccessTokenGoogleServicesAccessor>();
            }
            else
            {
                // this support using static credentials for accessing Google Sheets (i.e. ServiceCredentials)
                services.AddScoped<IGoogleServicesAccessor>(x => new StaticGoogleServicesAccessor(googleCredentials));
            }
            services.AddScoped<ISheetsService, SheetsServiceImpl>();

            if (dbOptionsAction == null)
            {
                dbOptionsAction = new Action<DbContextOptionsBuilder>(options =>
                {
                    options.UseSqlite("Data Source=../mergetemplate.db");
                });
            }
            services.AddDbContext<MergeTemplateContext>(dbOptionsAction);
            services.AddScoped<IMergeTemplateRepository, MergeTemplateRepository>();

            services.AddScoped<IEmailService, GmailServiceImpl>();
            services.AddScoped<IMergeTemplateService, MergeTemplateService>();

            services.AddMailMergeProxyServices(configuration);

            return services;
        }

        private static string GetMailmanWorkerServiceUrl(IConfiguration configuration)
        {
            string workerUrl = Environment.GetEnvironmentVariable("MAILMAN_WORKER_URL");
            if (string.IsNullOrWhiteSpace(workerUrl) && configuration != null)
            {
                workerUrl = configuration["WorkerServiceUrl"];
            }

            return workerUrl;
        }

        private static string GetMailmanServerUrl(IConfiguration configuration)
        {
            string serverUrl = Environment.GetEnvironmentVariable("MAILMAN_SERVER_URL");
            if (string.IsNullOrWhiteSpace(serverUrl) && configuration != null)
            {
                serverUrl = configuration["ServerUrl"];
            }

            return serverUrl;
        }

        private static string GetAuthKey(IConfiguration configuration)
        {
            string authKey = Environment.GetEnvironmentVariable("MAILMAN_AUTH_KEY");
            if (string.IsNullOrWhiteSpace(authKey) && configuration != null)
            {
                authKey = configuration["Security:AuthKey"];
            }

            return authKey;
        }

        internal static IServiceCollection AddMailMergeProxyServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            string mailmanWorkerServiceUrl = GetMailmanWorkerServiceUrl(configuration);
            string serverUrl = GetMailmanServerUrl(configuration);

            if (string.IsNullOrWhiteSpace(mailmanWorkerServiceUrl) ||
                string.IsNullOrWhiteSpace(serverUrl))
            {
                System.Diagnostics.Trace.TraceWarning("MAILMAN_WORKER_URL or MAILMAN_SERVER_URL environment variables not set, will run mail merges in process instead of worker service");
                services.AddScoped<IMailmanServicesProxy, MailmanServicesLocalProxy>();
            }
            else
            {
                string authKey = GetAuthKey(configuration);
                if (string.IsNullOrWhiteSpace(authKey))
                {
                    throw new InvalidOperationException("Cannot specify MAILMAN_WORKER_URL and MAILMAN_SERVER_URL without specifying MAILMAN_AUTH_KEY");
                }

                services.Configure<MailmanServicesProxyOptions>(x =>
                {
                    x.MailmanWorkerServerBaseUrl = mailmanWorkerServiceUrl;
                    x.MailmanServerBaseUrl = serverUrl;
                    x.AuthKey = authKey;
                });
                services.AddScoped<IMailmanServicesProxy, MailmanServicesProxy>();
            }
            return services;
        }

        internal static AuthenticationBuilder AddCookie(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
           authenticationBuilder.AddCookie(options =>
           {
                options.Cookie.SameSite = SameSiteMode.None;
           });

            return authenticationBuilder;
        }

        internal static AuthenticationBuilder AddServiceAuth(
            this AuthenticationBuilder authenticationBuilder, 
            IConfiguration configuration)
        {
            authenticationBuilder.AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(GetAuthKey(configuration)))
                };
            });
            return authenticationBuilder;
        }

        internal static AuthenticationBuilder AddGoogle(
            this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
            // Environment variables take precendence
            string googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
            if (string.IsNullOrWhiteSpace(googleClientId) && configuration != null)
                googleClientId = configuration["Authentication:Google:ClientId"];
            if (string.IsNullOrWhiteSpace(googleClientId))
                throw new InvalidOperationException("Google ClientId must be specified in a GOOGLE_CLIENT_ID environment variable or in a configuration file at Authentication:Google:ClientId");

                string googleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
            if (string.IsNullOrWhiteSpace(googleClientSecret) && configuration != null)
                googleClientSecret = configuration["Authentication:Google:ClientSecret"];
            if (string.IsNullOrWhiteSpace(googleClientSecret))
                throw new InvalidOperationException("Google ClientSecret must be specified in a GOOGLE_CLIENT_SECRET environment variable or in a configuration file at Authentication:Google:ClientSecret");

            authenticationBuilder.AddGoogle(options =>
            {
                options.ClientId = googleClientId;
                options.ClientSecret = googleClientSecret;
                options.Scope.Add(SheetsService.Scope.Spreadsheets);
                options.Scope.Add(GmailService.Scope.GmailSend);
                options.UserInformationEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
                options.ClaimActions.Clear();
                options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                options.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
                options.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
                options.ClaimActions.MapJsonKey("urn:google:profile", "url");
                options.ClaimActions.MapJsonKey("displayName", "displayName");
                options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                options.CallbackPath = "/login/signin-google";
                options.SaveTokens = true;
                options.AccessType = "offline";
                options.Events.OnRedirectToAuthorizationEndpoint = context =>
            {
                if (IsAjaxRequest(context.Request))
                {
                    context.Response.Headers["Location"] = context.RedirectUri;
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                }
                else
                {
                    context.Response.Redirect(context.RedirectUri);
                }
                return Task.CompletedTask;
            };
            });

            return authenticationBuilder;
        }

        internal static void ConfureGoogleOAuthTokenService(this IServiceCollection services, IConfiguration configuration)
        {
            string redisUrl = Environment.GetEnvironmentVariable("GOOGLE_TOKEN_CACHE_URL");
            if (!string.IsNullOrWhiteSpace(redisUrl))
            {
                throw new NotSupportedException("The Redis OAuth token cache has not been implemented yet");
                //services.AddSingleton<IGoogleOAuthTokenService, RedisGoogleOAuthTokenService>();
            }
            else
            {
                string connectionString = Environment.GetEnvironmentVariable("GOOGLE_TOKEN_CACHE_DB_CONN");
                if (string.IsNullOrWhiteSpace(connectionString))
                    connectionString = configuration.GetConnectionString("GoogleTokenCache");
                if (string.IsNullOrWhiteSpace(connectionString))
                    connectionString = "Data Source=../oauth.db";
                services.AddDbContext<OAuthTokenContext>(options => options.UseSqlite(connectionString));
                services.AddScoped<IGoogleOAuthTokenService, EntityFrameworkGoogleOAuthTokenService>();
            }
        }

        private static bool IsAjaxRequest(HttpRequest request)
        {
            return string.Equals(request.Query["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal) ||
                string.Equals(request.Headers["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal);
        }	

        #region Helper classes
        private class PolymorphismDocumentFilter<T> : IDocumentFilter
        {
            private static void RegisterSubClasses(ISchemaRegistry schemaRegistry, Type abstractType)
            {
                const string discriminatorName = "type";

                var parentSchema = schemaRegistry.Definitions[abstractType.Name];

                //set up a discriminator property (it must be required)
                parentSchema.Discriminator = discriminatorName;
                parentSchema.Required = new List<string> { discriminatorName };

                if (!parentSchema.Properties.ContainsKey(discriminatorName))
                    parentSchema.Properties.Add(discriminatorName, new Schema { Type = "string" });

                //register all subclasses
                var derivedTypes = abstractType.Assembly
                                               .GetTypes()
                                               .Where(x => abstractType != x && abstractType.IsAssignableFrom(x));

                foreach (var item in derivedTypes)
                    schemaRegistry.GetOrRegister(item);
            }

            public void Apply(SwaggerDocument swaggerDoc, DocumentFilterContext context)
            {
                RegisterSubClasses(context.SchemaRegistry, typeof(T));
            }
        }

        private class PolymorphismSchemaFilter<T> : ISchemaFilter
        {
            private readonly Lazy<HashSet<Type>> derivedTypes = new Lazy<HashSet<Type>>(Init);

            private static HashSet<Type> Init()
            {
                var abstractType = typeof(T);
                var dTypes = abstractType.Assembly
                                         .GetTypes()
                                         .Where(x => abstractType != x && abstractType.IsAssignableFrom(x));

                var result = new HashSet<Type>();

                foreach (var item in dTypes)
                    result.Add(item);

                return result;
            }

            public void Apply(Schema model, SchemaFilterContext context)
            {
                if (!derivedTypes.Value.Contains(context.SystemType)) return;

                var clonedSchema = new Schema
                {
                    Properties = model.Properties,
                    Type = model.Type,
                    Required = model.Required
                };

                //schemaRegistry.Definitions[typeof(T).Name]; does not work correctly in SwashBuckle
                var parentSchema = new Schema { Ref = "#/definitions/" + typeof(T).Name };

                model.AllOf = new List<Schema> { parentSchema, clonedSchema };

                //reset properties for they are included in allOf, should be null but code does not handle it
                model.Properties = new Dictionary<string, Schema>();
            }
        }
#endregion
    }
}
