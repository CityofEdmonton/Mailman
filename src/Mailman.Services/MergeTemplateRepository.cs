using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EnsureThat;
using Google;
using Google.Apis.Sheets.v4.Data;
using Mailman.Services.Data;
using Mailman.Services.Google;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Mailman.Services
{
    internal class MergeTemplateRepository : IMergeTemplateRepository
    {
        private readonly ILogger _logger;
        private readonly ISheetsService _sheetsService;
        private readonly MergeTemplateContext _mergeTemplateContext;

        public MergeTemplateRepository(MergeTemplateContext mergeTemplateContext,
            ISheetsService sheetsService,
            ILogger logger)
        {
            EnsureArg.IsNotNull(sheetsService);
            EnsureArg.IsNotNull(logger);
            EnsureArg.IsNotNull(mergeTemplateContext);
            _sheetsService = sheetsService;
            _logger = logger;
            _mergeTemplateContext = mergeTemplateContext;
        }

        public async Task<MergeTemplate> AddMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            _mergeTemplateContext.MergeTemplates.Add(mergeTemplate);
            await _mergeTemplateContext.SaveChangesAsync(cancellationToken);

            return mergeTemplate;
        }

        internal const string MM_CONFIG_ENTIRE_SHEET_RANGE = "A1:B5000";

        public async Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId,
            bool upgradeFromLegacyMailmanIfFirstRead = true,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var values = await _mergeTemplateContext.MergeTemplates.Where(x => x.SpreadSheetId == spreadsheetId).ToListAsync();
            if (values == null || !values.Any())
            {
                // it could be that we've never read from the sheet before,
                // if so, we'll create a new entry here
                var spreadsheetInfo = await _mergeTemplateContext.SpreadSheets.FindAsync(new object[] { spreadsheetId }, cancellationToken);;
                if (spreadsheetInfo == null)
                {
                    _logger.Information("Reading from legacy mailman (mm-config) into Mailman 2.0 database");
                    var legacyValues = await GetLegacyMergeTemplates(spreadsheetId, cancellationToken);
                    if (legacyValues != null)
                    {
                        foreach (var val in legacyValues)
                            _mergeTemplateContext.MergeTemplates.Add(val);
                        _mergeTemplateContext.SpreadSheets.Add(new SpreadsheetInfo() { Id = spreadsheetId, ImportDateUtc = DateTime.UtcNow });
                        await _mergeTemplateContext.SaveChangesAsync();
                        values = legacyValues.ToList();
                    }
                }
            }
            return values.AsEnumerable();
        }

        private async Task<IEnumerable<MergeTemplate>> GetLegacyMergeTemplates(string spreadsheetId,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var returnValue = new List<MergeTemplate>();
            foreach (var row in await _sheetsService.GetValuesAsync(spreadsheetId, range: string.Concat("mm-config!", MM_CONFIG_ENTIRE_SHEET_RANGE)))
            {
                if (row.Count == 0)
                    _logger.Warning("Row {RowNumber} had no data, not contributing to returned merge templates", returnValue.Count + 1);
                else if (row.Count == 1)
                    _logger.Warning("Row {RowNumber} had only 1 cell, not contributing to returned merge templates", returnValue.Count + 1);
                else if (row[1] == null)
                    _logger.Warning("Row {RowNumber} did not contain a value in the second cell, not contributing to returned merge templates", returnValue.Count + 1);
                else
                {
                    returnValue.Add(MergeTemplate.CreateFrom(row[0].ToString(), spreadsheetId, row[1].ToString()));
                }
            }
            return returnValue;
        }
    

        public async Task<MergeTemplate> UpdateMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {       
            var entry = _mergeTemplateContext.Entry(mergeTemplate);
            entry.State = EntityState.Modified;
            await _mergeTemplateContext.SaveChangesAsync(cancellationToken);
            return mergeTemplate;
        }

        public async Task DeleteMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            _mergeTemplateContext.MergeTemplates.Remove(mergeTemplate);
            await _mergeTemplateContext.SaveChangesAsync(cancellationToken);
        }

        public Task<MergeTemplate> GetMergeTemplate(string id)
        {
            return _mergeTemplateContext.MergeTemplates.FindAsync(id);
        }
    }
}
