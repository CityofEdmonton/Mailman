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
using System;

namespace Mailman.Services
{
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
