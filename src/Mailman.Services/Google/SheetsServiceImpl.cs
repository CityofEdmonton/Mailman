using EnsureThat;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class SheetsServiceImpl : GoogleServiceBase, ISheetsService
    {
        private readonly ILogger _logger;

        public SheetsServiceImpl(IGoogleSheetsServiceAccessor googleSheetsServiceAccessor,
            ILogger logger) : base(googleSheetsServiceAccessor, logger)
        {
            EnsureArg.IsNotNull(logger);
            _logger = logger;
        }

        public async Task<IEnumerable<string>> GetSheetNames(string sheetId, bool includeHidden = false)
        {
            var watch = new Stopwatch();
            using (var service = await GetSheetsServiceAsync())
            {
                _logger.Debug("Got sheets service in {EllapsedMilliseconds}", watch.ElapsedMilliseconds);
                watch.Restart();

                var request = service.Spreadsheets.Get(sheetId);
                Spreadsheet response;
                try
                {
                    response = await request.ExecuteAsync();
                }
                catch (Exception err)
                {
                    _logger.Error(err, "Unable to read from spreadsheet {SpreadSheetId}: {ErrorMessage}", sheetId, err.Message);
                    throw;
                }
                IQueryable<Sheet> sheets = response.Sheets.AsQueryable();
                if (!includeHidden)
                    sheets = sheets.Where(x => !x.Properties.Hidden.HasValue || !x.Properties.Hidden.Value);

                return sheets.Select(x => x.Properties.Title);
            }
        }
    }
}
