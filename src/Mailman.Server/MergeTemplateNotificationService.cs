using Mailman.Server.Hubs;
using Mailman.Services;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;
using Wyrm.Events;
using Wyrm.RabbitMq.Extentions.DependencyInjection;

namespace Mailman.Server
{
    /// <summary>
    /// Handler class for listening to a RabbitMQ queue and sending progress update
    /// events to connected signalR clients
    /// </summary>
    [Event("mailman.mergetemplate.progress.notification")]
    public class MergeTemplateNotificationService : IEventHandler<MailMergeProgress>
    {
        /// <summary>
        /// Constructor for the notification service
        /// </summary>
        /// <param name="mailmanHub">SignalR hub for connected clients</param>
        /// <param name="logger">Logger</param>
        public MergeTemplateNotificationService(
            IHubContext<MailmanHub> mailmanHub,
            ILogger logger)
        {
            _mailmanHub = mailmanHub;
            _logger = logger;
        }

        private readonly IHubContext<MailmanHub> _mailmanHub;
        private readonly ILogger _logger;


        /// <summary>
        /// Handler for the merge template notification update 
        /// </summary>
        /// <param name="progress">Progress update, contains amount processed, etc.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task HandleAsync(MailMergeProgress progress, CancellationToken cancellationToken)
        {
            _logger.Information("{MergeTemplateId}: {Complete} / {Total} ({PercentComplete}%)", 
                progress.MergeTemplateId, 
                progress.Progress.Completed, 
                progress.Progress.Total, 
                progress.Progress.PercentComplete);
                
            if (!string.IsNullOrWhiteSpace(progress.ConnectionId))
            {
                await _mailmanHub.Clients.Clients(progress.ConnectionId)
                    .SendAsync(
                        progress.Progress.PercentComplete >= 100 ? "mailMergeCompleted" : "mailMergeProgressUpdated", 
                        progress);
            }
        }

        /// <summary>
        /// Wyrm Event context, not used but required for IEventHandler interface
        /// </summary>
        /// <value></value>
        EventContext IEventHandler.Context { get; set; }

    }   
}