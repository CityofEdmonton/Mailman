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
    public class SheetsController : Controller
    {
        private readonly ISheetsServiceFactory _sheetsServiceFactory;

        public SheetsController(ISheetsServiceFactory sheetsServiceFactory)
        {
            _sheetsServiceFactory = sheetsServiceFactory;
        }

        public async Task<IEnumerable<string>> GetSheetNames(string sheetId, bool includeHidden = false)
        {
            var service = await _sheetsServiceFactory.GetSheetsServiceAsync();
            var request = service.Spreadsheets.Get(sheetId);
            var response = await request.ExecuteAsync();
            IQueryable<Sheet> sheets = response.Sheets.AsQueryable();
            if (!includeHidden)
                sheets = sheets.Where(x => !x.Properties.Hidden.HasValue || !x.Properties.Hidden.Value);

            return sheets.Select(x => x.Properties.Title);
        }

    }
}
