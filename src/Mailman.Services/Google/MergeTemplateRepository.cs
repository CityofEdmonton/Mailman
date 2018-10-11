using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EnsureThat;
using Google;
using Google.Apis.Sheets.v4.Data;
using Mailman.Services.Data;
using Newtonsoft.Json;
using Serilog;

namespace Mailman.Services.Google
{
    internal class MergeTemplateRepository : GoogleServiceBase, IMergeTemplateRepository
    {
        private readonly ILogger _logger;

        public MergeTemplateRepository(IGoogleSheetsServiceAccessor googleSheetsServiceAccessor,
            ILogger logger) : base(googleSheetsServiceAccessor, logger)
        {
            EnsureArg.IsNotNull(logger);
            _logger = logger;
        }

        public Task<MergeTemplate> AddMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId, CancellationToken cancellationToken = default(CancellationToken))
        {
            var watch = new Stopwatch();
            using (var service = await GetSheetsServiceAsync())
            {
                string mmConfigRange = "mm-config!A1:B5000";
                var request = service.Spreadsheets.Values.Get(spreadsheetId, mmConfigRange);
                ValueRange response;
                try { response = await request.ExecuteAsync(); }
                catch (GoogleApiException gex)
                {
                    throw new SheetNotFoundException("Sheet $spreadsheetId not found", gex);
                }
                catch (Exception err)
                {
                    _logger.Error(err, "Unable to read from Google Sheets: {ErrorMessage}", err.Message);
                    throw new ReadGoogleSheetsException("Unable to read from Google Sheets", err);
                }

                // now parse the response
                var returnValue = new List<MergeTemplate>();
                foreach (var row in response.Values)
                {
                    if (row.Count == 0)
                        _logger.Warning("Row {RowNumber} had no data, not contributing to returned merge templates", returnValue.Count+1);
                    else if (row.Count == 1)
                        _logger.Warning("Row {RowNumber} had only 1 cell, not contributing to returned merge templates", returnValue.Count+1);
                    else if (row[1] == null)
                        _logger.Warning("Row {RowNumber} did not contain a value in the second cell, not contributing to returned merge templates", returnValue.Count+1);
                    else
                    {
                        returnValue.Add(MergeTemplate.CreateFrom(row[0].ToString(), spreadsheetId, row[1].ToString()));
                    }
                }
                return returnValue;
            }
        }


    }
}
