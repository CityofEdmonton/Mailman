using EnsureThat;
using Mailman.Server.Controllers;
using Mailman.Services;
using Mailman.Services.Data;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Server.Hubs
{
    /// <summary>
    /// SignalR hub for interacting with MailMan
    /// </summary>
    public class MailmanHub : Hub
    {
        /// <summary>
        /// Constructs a new instance of the MailmanHub
        /// </summary>
        /// <param name="mergeTemplatesController"></param>
        public MailmanHub(MergeTemplatesController mergeTemplatesController)
        {
            EnsureArg.IsNotNull(mergeTemplatesController);
            _mergeTemplatesController = mergeTemplatesController;
        }

        private readonly MergeTemplatesController _mergeTemplatesController;

        /// <summary>
        /// Starts running a new mail merge, and set up notifications for
        /// progress updates for the calling client.
        /// </summary>
        /// <param name="mergeTemplateId">The unique identifier of the Merge Template</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task StartMailMerge(string mergeTemplateId,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            await _mergeTemplatesController.StartMailMerge(
                new RunMailMergeOptions()
                {
                    MergeTemplateId = mergeTemplateId,
                    ConnectionId = Context.ConnectionId
                }, cancellationToken);
        }
    }
}
