using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Mailman.Worker
{
    /// <summary>
    /// Entry point for Mail Merge worker process
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Entry point for Mail Merge worker process
        /// </summary>
        /// <param name="args"></param>
        public static async Task Main(string[] args)
        {
            await CreateHostBuilder(args).RunConsoleAsync();
        }

        /// <summary>
        /// Creates the host worker process
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static IHostBuilder CreateHostBuilder(string[] args) 
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureHostConfiguration(configHost => 
                {
                    configHost.SetBasePath(Directory.GetCurrentDirectory());
                    configHost.AddJsonFile("appsettings.json", optional: false);
                    configHost.AddJsonFile("appsettings.Development.json", optional: true);
                    //configHost.AddEnvironmentVariables(prefix: "PREFIX_");
                    configHost.AddCommandLine(args);
                })
                .ConfigureServices((ctx, serviceCollection) =>
                {
                    new Startup(ctx.Configuration, ctx.HostingEnvironment)
                        .ConfigureServices(serviceCollection);
                });
        }
    }
}
