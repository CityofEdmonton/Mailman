using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mailman.Services;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AutoMapper;
using Swashbuckle.AspNetCore.Swagger;
using System.Reflection;
using System.IO;

namespace Mailman
{
    /// <summary>
    /// Standard ASP.NET MVC Startup class.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Constructor for the startup class.
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// The configuration of the application. Combines config files,
        /// Environment variables, and startup arguments.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Configures the services required by Mailman.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // Add Automapper
            services.AddAutoMapper();

            services.ConfigureLogging("MailMan Server", Configuration);

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMailmanAuthentication(Configuration);
            services.AddMailmanServices(Configuration);

            // Add Appication Insights, if available
            string applicationInsightsInstrumentationKey = Environment.GetEnvironmentVariable("APP_INSIGHTS_KEY");
            if (string.IsNullOrWhiteSpace(applicationInsightsInstrumentationKey))
                applicationInsightsInstrumentationKey = Configuration["ApplicationInsights:InstrumentationKey"];
            if (!string.IsNullOrWhiteSpace(applicationInsightsInstrumentationKey))
                services.AddApplicationInsightsTelemetry(options =>
                {
                    options.InstrumentationKey = applicationInsightsInstrumentationKey;
                });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Add Swagger
            services.ConfigureSwagger(modelBaseClasses: new Type[] { typeof(Server.Models.MergeTemplate)});
        }

        /// <summary>
        /// Configures the ASP.NET web application. Standard ASP.NET stuff.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = "api/docs";
            });


            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseMailmanAuthentication();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
