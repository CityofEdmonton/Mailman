using Mailman.Services.Data;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface IMergeTemplateRepository
    {
        Task<IEnumerable<MergeTemplate>> GetMergeTemplatesAsync(string spreadsheetId,
            bool upgradeFromLegacyMailmanIfFirstRead = true,
            CancellationToken cancellationToken = default(CancellationToken));
        Task<MergeTemplate> GetMergeTemplate(string id);
        Task<MergeTemplate> AddMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task<MergeTemplate> UpdateMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task DeleteMergeTemplateAsync(MergeTemplate mergeTemplate, CancellationToken cancellationToken = default(CancellationToken));
    }
}
