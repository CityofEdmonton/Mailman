using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using EnsureThat;
using Mailman.Services;
using Mailman.Worker.Models;
using Microsoft.Extensions.Options;

namespace Mailman.Worker
{
    internal class MailMergeNotificationService : IMailMergeNotificationService
    {
        public MailMergeNotificationService(
            IOptions<MailMergeNotificationServiceOptions> options)
        {
            EnsureArg.IsNotNull(options);
            _options = options.Value;
            EnsureArg.IsNotNullOrWhiteSpace(_options.MailmanServerBaseUrl);
            _httpClient.BaseAddress = new Uri(_options.MailmanServerBaseUrl);
        }

        private readonly MailMergeNotificationServiceOptions _options;
        private static HttpClient _httpClient = new HttpClient();

        public async Task NotifyMailMergeCompletedAsync(
            string mergeTemplateId,
            string connectionId,
            RunMergeTemplateProgress progressUpdated, 
            CancellationToken cancellationToken = default(CancellationToken))
        {
            await _httpClient.PostAsJsonAsync(
                "api/MergeTemplates/run/updated",
                new MailMergeProgress()
                {
                    MergeTemplateId = mergeTemplateId,
                    ConnectionId = connectionId,
                    Progress = progressUpdated
                }, 
                cancellationToken);
        }

        public async Task NotifyMailMergeUpdatedAsync(
            string mergeTemplateId, 
            string connectionId,
            RunMergeTemplateProgress progressUpdated, 
            CancellationToken cancellationToken = default(CancellationToken))
        {
            await _httpClient.PostAsJsonAsync(
                "api/MergeTemplates/run/updated",
                new MailMergeProgress()
                {
                    MergeTemplateId = mergeTemplateId,
                    ConnectionId = connectionId,
                    Progress = progressUpdated
                },
                cancellationToken);

        }
    }
}
