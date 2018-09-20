using Mailman.Data;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface IMergeTemplateRepository
    {
        Task<MergeTemplate> AddMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId, CancellationToken cancellationToken = default(CancellationToken));
    }
}
