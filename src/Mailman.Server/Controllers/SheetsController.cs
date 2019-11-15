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
        [HttpGet("SheetNames/{spreadsheetId}")]
        public Task<IEnumerable<string>> SheetNames(string spreadsheetId, bool includeHidden = false)
        {
            return _sheetsService.GetSheetNamesAsync(spreadsheetId, includeHidden);
        }

        /// <summary>
        /// Retrieves the values of the specified row (default 1) in a tab of a Google Sheet
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     GET /api/Sheets/SheetNames/1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY/Data?rowNumber=8
        /// </remarks>
        /// <param name="spreadsheetId">The id of the spreadsheet, as in the url when editing a sheet.</param>
        /// <param name="sheetName">Specifies the selected tab in the sheet.</param>
        /// <param name="rowNumber">Specified the row to get the values for.</param>
        /// <returns>A list of strings representing the values in the specified row</returns>
        /// <response code="200">Returns the values in the row of the Sheet tab</response>
        /// <response code="404">If the Google Sheet cannot be found</response>
        [HttpGet("RowValues/{spreadsheetId}/{sheetName}/{rowNumber?}")]
        public async Task<IEnumerable<string>> RowValues(string spreadsheetId, string sheetName, int rowNumber = 1)
        {
            return (await _sheetsService.GetValuesAsync(spreadsheetId, $"{sheetName}!A{rowNumber}:ZZ{rowNumber}")).First().Select(x => x.ToString());
        }

    }
}
