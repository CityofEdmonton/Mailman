using Mailman.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Worker
{
    public interface IMailMergeNotificationService
    {
        Task NotifyMailMergeUpdatedAsync(
            string mergeTemplateId,
            string connectionId,
            RunMergeTemplateProgress progressUpdated,
            CancellationToken cancellationToken = default(CancellationToken));

        Task NotifyMailMergeCompletedAsync(
            string mergeTemplateId,
            string connectionId,
            RunMergeTemplateProgress progressUpdated,
            CancellationToken cancellationToken = default(CancellationToken));

    }
}
