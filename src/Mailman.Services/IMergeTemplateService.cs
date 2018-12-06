using Mailman.Services.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface IMergeTemplateService
    {
        Task<RunMergeTemplateProgress> RunMergeTemplateAsync(
            MergeTemplate mergeTemplate,
            Action<RunMergeTemplateProgress> progressReporter = null,
            CancellationToken cancellationToken = default(CancellationToken));
    }
}
