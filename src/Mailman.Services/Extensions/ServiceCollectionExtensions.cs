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
                    var documentFilterMethod = c.GetType().GetMethod("DocumentFilter");
                    var schemaFilterMethod = c.GetType().GetMethod("SchemaFilter");
                    foreach (var t in modelBaseClasses)
                    {
                        documentFilterMethod.MakeGenericMethod(
                            typeof(PolymorphismDocumentFilter<>).MakeGenericType(t))
                            .Invoke(c, new object[] { Array.Empty<object>() });

                        schemaFilterMethod.MakeGenericMethod(
                            typeof(PolymorphismSchemaFilter<>).MakeGenericType(t))
                            .Invoke(c, new object[] { Array.Empty<object>() });
                    }
                }

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, true);
            });


            return services;
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


        public static IServiceCollection AddMailmanAuthentication(this IServiceCollection services, IConfiguration configuration = null)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = AppScriptOAuthAuthenticationDefaults.AuthenticationScheme; //GoogleDefaults.AuthenticationScheme;
            })
                .AddCookie(configuration)
                .AddGoogle(configuration);

            // configure the service that saves the tokens to a cache
            services.ConfureGoogleOAuthTokenService(configuration);

            return services;
        }

        public static IServiceCollection AddMailmanServices(this IServiceCollection services, 
            IConfiguration configuration = null,
            IConfigurableHttpClientInitializer googleCredentials = null)
        {
            // configure the Google Sheets service
            if (googleCredentials == null)
            {
                services.AddScoped<IGoogleSheetsServiceAccessor, HttpAccessTokenGoogleSheetsServiceAccessor>();
            }
            else
            {
                // this support using static credentials for accessing Google Sheets (i.e. ServiceCredentials)
                services.AddScoped<IGoogleSheetsServiceAccessor>(x => new StaticGoogleSheetsServiceAccessor(googleCredentials));
            }
            services.AddScoped<ISheetsService, SheetsServiceImpl>();

            services.AddScoped<IMergeTemplateRepository, MergeTemplateRepository>();

            return services;
        }

        internal static AuthenticationBuilder AddCookie(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
           authenticationBuilder.AddCookie(options =>
           {
                
           });

            return authenticationBuilder;
        }

        internal static AuthenticationBuilder AddGoogle(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
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
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.CallbackPath = "/login/signin-google";
                options.SaveTokens = true;
                options.AccessType = "offline";
            });

            authenticationBuilder.AddAppScriptOAuth(options =>
            {
                // options can be added here
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
                    connectionString = "Data Source=oauth.db";
                services.AddDbContext<OAuthTokenContext>(options => options.UseSqlite(connectionString));
                services.AddScoped<IGoogleOAuthTokenService, EntityFrameworkGoogleOAuthTokenService>();
            }

        }
    }
}
