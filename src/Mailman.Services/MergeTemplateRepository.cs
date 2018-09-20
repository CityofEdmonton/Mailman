using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Mailman.Data;

namespace Mailman.Services
{
    internal class MergeTemplateRepository : IMergeTemplateRepository
    {
        public Task<MergeTemplate> AddMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId, CancellationToken cancellationToken = default(CancellationToken))
        {
            throw new NotImplementedException();
        }
    }
}
