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
        /// <param name="sheetId"></param>
        /// <param name="includeHidden"></param>
        /// <returns></returns>
        [HttpGet("[action]")]
        public Task<IEnumerable<string>> SheetNames(string sheetId, bool includeHidden = false)
        {
            return _sheetsService.GetSheetNames(sheetId, includeHidden);
        }

    }
}
