using Mailman.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Server
{
    public interface IMailMergeService
    {
        Task StartMailMergeAsync(
            string mergeTemplateId,
            string connectionId,
            CancellationToken cancellationToken = default(CancellationToken));

        Task<RunMergeTemplateProgress> RunMailMergeAsync(
            string mergeTemplateId,
            string connectionId,
            CancellationToken cancellationToken = default(CancellationToken));
    }
}
