using EnsureThat;
using Google;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class SheetsServiceImpl : GoogleServiceBase, ISheetsService
    {
        private readonly ILogger _logger;

        public SheetsServiceImpl(IGoogleServicesAccessor googleSheetsServiceAccessor,
            ILogger logger) : base(googleSheetsServiceAccessor, logger)
        {
            EnsureArg.IsNotNull(logger);
            _logger = logger;
        }

        public async Task<IEnumerable<string>> GetSheetNamesAsync(string spreadsheetId, bool includeHidden = false)
        {
            var watch = new Stopwatch();
            using (var service = await GetSheetsServiceAsync())
            {
                _logger.Debug("Got sheets service in {EllapsedMilliseconds}", watch.ElapsedMilliseconds);
                watch.Restart();

                var request = service.Spreadsheets.Get(spreadsheetId);
                Spreadsheet response;
                try
                {
                    response = await request.ExecuteAsync();
                }
                catch (Exception err)
                {
                    _logger.Error(err, "Unable to read from spreadsheet {SpreadsheetId}: {ErrorMessage}", spreadsheetId, err.Message);
                    throw;
                }
                IQueryable<Sheet> sheets = response.Sheets.AsQueryable();
                if (!includeHidden)
                    sheets = sheets.Where(x => !x.Properties.Hidden.HasValue || !x.Properties.Hidden.Value);

                return sheets.Select(x => x.Properties.Title);
            }
        }

        public virtual async Task<IList<IList<object>>> GetValuesAsync(string spreadsheetId, string range)
        {
            var watch = new Stopwatch();
            IList<IList<object>> returnValue;
            using (var service = await GetSheetsServiceAsync())
            {
                var request = service.Spreadsheets.Values.Get(spreadsheetId, range);
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

                returnValue = response.Values;
            }

            return returnValue;
        }


        public virtual async Task GetValuesAsDataPumpAsync(string spreadsheetId,
            string range,
            Func<IList<object>, Task> dataPump)
        {
            if (dataPump == null)
                throw new ArgumentNullException(nameof(dataPump));

            var watch = new Stopwatch();
            var pumpTasks = new ConcurrentBag<Task>();
            List<Exception> errors = new List<Exception>();

            using (var service = await GetSheetsServiceAsync())
            {
                var request = service.Spreadsheets.Values.Get(spreadsheetId, range);
                Stream response;
                try { response = await request.ExecuteAsStreamAsync(); }
                catch (GoogleApiException gex)
                {
                    throw new SheetNotFoundException($"Sheet {spreadsheetId} not found", gex);
                }
                catch (Exception err)
                {
                    _logger.Error(err, "Unable to read from Google Sheets: {ErrorMessage}", err.Message);
                    throw new ReadGoogleSheetsException("Unable to read from Google Sheets", err);
                }

                JsonSerializer serializer = new JsonSerializer();
                List<object> row;
                using (StreamReader sr = new StreamReader(response))
                using (JsonReader reader = new JsonTextReader(sr))
                {
                    while (reader.Read())
                    {
                        if (reader.TokenType == JsonToken.PropertyName &&
                            reader.Value as string == "values")
                        {
                            // move into the value
                            if (!reader.Read())
                                break;

                            if (reader.TokenType == JsonToken.StartArray)
                            {
                                while (reader.Read())
                                {
                                    if (reader.TokenType != JsonToken.StartArray)
                                        break;

                                    // read the single row and pump it out.
                                    row = serializer.Deserialize<List<object>>(reader);
                                    try
                                    {
                                        pumpTasks.Add(dataPump(row));
                                    }
                                    catch (Exception err)
                                    {
                                        _logger.Error(err, "Error calling dataPump: {ErorMessage}", err.Message);
                                        errors.Add(err);
                                    }
                                }
                                break;
                            }
                        }

                    }
                }
            }

            // wait for all the pumps to finish
            await Task.WhenAll(pumpTasks);

            if (errors.Count > 0)
            {
                throw new AggregateException(errors);
            }
        }

        public async Task GetValuesAsDictionaryDataPump(string spreadsheetId, string range, Func<IDictionary<string, object>, Task> dataPump)
        {
            List<string> headers = null;
            List<Task> pumpTasks = new List<Task>();
            await GetValuesAsDataPumpAsync(spreadsheetId, range, row =>
            {
                // assume first row is headers
                if (headers == null)
                {
                    headers = row.Select(x => x?.ToString()).ToList();
                }
                else
                {
                    var dict = new Dictionary<string, object>();
                    for (int i = 0; i < headers.Count; i++)
                    {
                        if (i < row.Count)
                            dict[headers[i]] = row[i];
                    }
                    pumpTasks.Add(dataPump(dict));
                }
                return Task.CompletedTask;
            });
            await Task.WhenAll(pumpTasks);
        }

        public virtual async Task<A1Notation> GetDataRangeAsync(string spreadsheetId, string sheetName)
        {
            using (var service = await GetSheetsServiceAsync())
            {
                var request = service.Spreadsheets.GetByDataFilter(new GetSpreadsheetByDataFilterRequest()
                {
                    DataFilters = new List<DataFilter>()
                        {
                            new DataFilter() { A1Range = sheetName }
                        }
                }, spreadsheetId);
                try
                {
                    var response = await request.ExecuteAsync();
                    if (response.Sheets.Count == 0)
                        throw new InvalidOperationException($"Unable to find sheet with name {sheetName}");
                    else if (response.Sheets.Count != 1)
                        throw new InvalidOperationException($"Unexpected number of sheets info returned from Sheets Service. Got {response.Sheets.Count} but expected 1");
                    var dataProperties = response.Sheets[0].Properties?.GridProperties;
                    return new A1Notation(sheetName, 1, 1, dataProperties.ColumnCount, dataProperties.RowCount);
                }
                catch (Exception e)
                {
                    _logger.Error(e, "Unexpected error reading from google sheet: {ErrorMessage}", e.Message);
                    throw;
                }
            }
        }
    }
}
