using Mailman.Server.Models;
using Mailman.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Server
{
    /// <summary>
    /// Service to start a mail merge in the worker service
    /// </summary>
    public interface IMailMergeService
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
    }
}
