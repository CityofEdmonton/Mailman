using Google.Apis.Sheets.v4.Data;
using Mailman.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class SheetsController : Controller
    {
        private readonly ISheetsServiceFactory _sheetsServiceFactory;

        public SheetsController(ISheetsServiceFactory sheetsServiceFactory)
        {
            _sheetsServiceFactory = sheetsServiceFactory;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<string>> SheetNames(string sheetId, bool includeHidden = false)
        {
            var service = await _sheetsServiceFactory.GetSheetsServiceAsync();
            var request = service.Spreadsheets.Get(sheetId);
            Spreadsheet response;
            try
            {
                response = await request.ExecuteAsync();
            }
            catch (Exception err)
            {
                // log error here.
                System.Diagnostics.Debugger.Log(0, "", err.Message);
                throw;
            }
            IQueryable<Sheet> sheets = response.Sheets.AsQueryable();
            if (!includeHidden)
                sheets = sheets.Where(x => !x.Properties.Hidden.HasValue || !x.Properties.Hidden.Value);

            return sheets.Select(x => x.Properties.Title);
        }

    }
}
