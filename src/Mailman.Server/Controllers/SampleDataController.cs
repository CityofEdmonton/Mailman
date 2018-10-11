using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Controllers
{
    /// <summary>
    /// Sample class that got created when this project was created.
    /// Will be removed eventually.
    /// </summary>
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        /// <summary>
        /// To be removed.
        /// </summary>
        /// <param name="startDateIndex"></param>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts(int startDateIndex)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        /// <summary>
        /// To be removed
        /// </summary>
        public class WeatherForecast
        {
            /// <summary>
            /// To be removed
            /// </summary>
            public string DateFormatted { get; set; }
            /// <summary>
            /// To be removed
            /// </summary>
            public int TemperatureC { get; set; }
            /// <summary>
            /// To be removed
            /// </summary>
            public string Summary { get; set; }

            /// <summary>
            /// To be removed
            /// </summary>
            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
