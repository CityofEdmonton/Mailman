using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    /// <summary>
    /// Service to facilitate communication between the Worker server and the main
    /// Mailman Server.
    /// </summary>
    public interface IMailmanServicesProxy
    {
        /// <summary>
        /// Starts a new mail merge in a new worker process and returns immediately
        /// </summary>
        /// <param name="options">
        /// Parameters to start a mail merge, 
        /// including MergeTemplateId and optionally a SignalR connectionId 
        /// for proress notifications on the merge.
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task StartMailMergeAsync(
            RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken));

        /// <summary>
        /// Starts a new mail merge and blocks until the merge is complete
        /// </summary>
        /// <param name="options">
        /// Parameters to start a mail merge, 
        /// including MergeTemplateId and optionally a SignalR connectionId 
        /// for proress notifications on the merge.
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<RunMergeTemplateProgress> RunMailMergeAsync(
            RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken));

        /// <summary>
        /// Notifies clients that a mail merge has made progress.
        /// </summary>
        /// <param name="mergeTemplateId"></param>
        /// <param name="connectionId"></param>
        /// <param name="progressUpdated"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task NotifyMailMergeUpdatedAsync(
            string mergeTemplateId,
            string connectionId,
            RunMergeTemplateProgress progressUpdated,
            CancellationToken cancellationToken = default(CancellationToken));

        /// <summary>
        /// Notifies clients that a mail merge has made finished.
        /// </summary>
        /// <param name="mergeTemplateId"></param>
        /// <param name="connectionId"></param>
        /// <param name="progressUpdated"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task NotifyMailMergeCompletedAsync(
            string mergeTemplateId,
            string connectionId,
            RunMergeTemplateProgress progressUpdated,
            CancellationToken cancellationToken = default(CancellationToken));

    }
}
