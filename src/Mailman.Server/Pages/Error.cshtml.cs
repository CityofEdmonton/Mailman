using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Mailman.Pages
{
    /// <summary>
    /// Model for displaying error pages.
    /// </summary>
    public class ErrorModel : PageModel
    {
        /// <summary>
        /// The id of the HTTP request.
        /// </summary>
        public string RequestId { get; set; }

        /// <summary>
        /// Constrols whether the page should display the <see cref="RequestId"/>.
        /// </summary>
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        /// <summary>
        /// Method invoked on every GET request.
        /// </summary>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public void OnGet()
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
        }
    }
}
