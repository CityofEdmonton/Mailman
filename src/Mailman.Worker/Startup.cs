using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Mailman.Services;
using Mailman.Worker;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Mailman.Worker
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
            IHostEnvironment hostingEnvironment)
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
        public IHostEnvironment HostingEnvironment { get; }


        // This method gets called by the runtime. Use this method to add services to the container.
        /// <summary>
        /// Configures the services required by the Mail Merge worker.
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

            // Add Swagger
            services.ConfigureSwagger();
            
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

                options.AddEventHandler<StartMergeTemplateService>(); 
            });

        }        
    }
}
