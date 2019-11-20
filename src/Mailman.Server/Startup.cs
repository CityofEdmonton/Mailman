using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Mailman.Services;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AutoMapper;
using Mailman.Server;
using Mailman.Server.Hubs;
using Mailman.Server.Controllers;

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
        /// <param name="hostingEnvironment"></param>
        public Startup(IConfiguration configuration,
            IWebHostEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// The configuration of the application. Combines config files,
        /// Environment variables, and startup arguments.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Provides information about the web hosting environment an application is running in. 
        /// </summary>
        public IWebHostEnvironment HostingEnvironment { get; }

        /// <summary>
        /// Configures the services required by Mailman.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // Add Automapper
            services.AddAutoMapper(System.Reflection.Assembly.GetEntryAssembly());

            services.ConfigureLogging("MailMan Server", Configuration);

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMailmanAuthentication(Configuration);
            services.AddMailmanServices(Configuration);
            services.AddScoped<MergeTemplatesController, MergeTemplatesController>();

            // Add Appication Insights, if available
            string applicationInsightsInstrumentationKey = Environment.GetEnvironmentVariable("APP_INSIGHTS_KEY");
            if (string.IsNullOrWhiteSpace(applicationInsightsInstrumentationKey))
                applicationInsightsInstrumentationKey = Configuration["ApplicationInsights:InstrumentationKey"];
            if (!string.IsNullOrWhiteSpace(applicationInsightsInstrumentationKey))
                services.AddApplicationInsightsTelemetry(options =>
                {
                    options.InstrumentationKey = applicationInsightsInstrumentationKey;
                });

            services.AddMvc();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Add Swagger
            services.ConfigureSwagger(modelBaseClasses: new Type[] { typeof(Server.Models.MergeTemplate)});

            // Add SignalR
            services.AddSignalR();
            services.AddCors();

            // Add Wyrm
            ConfigureWyrm(services);
        }

        private void ConfigureWyrm(IServiceCollection services)
        {
            string rabbitmqHost = Environment.GetEnvironmentVariable("RABBIT_URL");
            if (string.IsNullOrWhiteSpace(rabbitmqHost))
            {
                rabbitmqHost = Configuration["RabbitMq:Host"];
            }
            if (string.IsNullOrWhiteSpace(rabbitmqHost))
            {
                // default to name in docker-compose file
                rabbitmqHost = "rabbitmq";
            }
            services.AddWyrm(options => 
            {
                options.UseRabbitMq(rabbitmqHost);

                options.AddEventHandler<MergeTemplateNotificationService>(); 
            });

        }


        /// <summary>
        /// Configures the ASP.NET web application. Standard ASP.NET stuff.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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

            app.UseRouting();

            app.UseMailmanAuthentication();
            app.UseSpaStaticFiles();

            app.UseEndpoints(endpoints => 
            {
                app.UseRouting();
                endpoints.MapHub<MailmanHub>("/hub");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}"
                );
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            app.EnsureMailmanDbCreated();
        }
    }
}
