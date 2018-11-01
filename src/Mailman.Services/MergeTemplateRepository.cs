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

        internal const string ENTIRE_SHEET_RANGE = "A1:B5000";

        public async Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId, CancellationToken cancellationToken = default(CancellationToken))
        {
            var returnValue = new List<MergeTemplate>();
            foreach (var row in await _sheetsService.GetValuesAsync(spreadsheetId, range: string.Concat("mm-config!", ENTIRE_SHEET_RANGE)))
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
    }
}
