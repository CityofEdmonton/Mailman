using Google.Apis.Sheets.v4.Data;
using Mailman.Services;
using Mailman.Services.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Controllers
{
    /// <summary>
    /// Controller for interacting with Google Sheets
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    public class SheetsController : Controller
    {
        private readonly ISheetsService _sheetsService;

        /// <summary>
        /// SheetsController Constructor
        /// </summary>
        /// <param name="sheetsService"></param>
        public SheetsController(ISheetsService sheetsService)
        {
            _sheetsService = sheetsService;
        }

        /// <summary>
        /// Retrieves the names of the tabs in a Google Sheet
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     GET /api/Sheets/SheetNames/1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY
        /// </remarks>
        /// <param name="spreadsheetId">The id of the spreadsheet, as in the url when editing a sheet.</param>
        /// <param name="includeHidden">Specifies whether to include hidden tabs in the returned values.</param>
        /// <returns>A list of strings with the names of the tabs</returns>
        /// <response code="200">Returns the tab names of the Sheet</response>
        /// <response code="404">If the Google Sheet cannot be found</response>
        [HttpGet("[action]")]
        public Task<IEnumerable<string>> SheetNames(string spreadsheetId, bool includeHidden = false)
        {
            return _sheetsService.GetSheetNamesAsync(spreadsheetId, includeHidden);
        }

    }
}
