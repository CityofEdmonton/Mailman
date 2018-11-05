using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using EnsureThat;
using Mailman.Server.Models;
using Mailman.Services;
using Microsoft.Extensions.Options;

namespace Mailman.Server
{
    internal class MailMergeService : IMailMergeService
    {
        public MailMergeService(IOptions<MailMergeServiceOptions> options)
        {
            EnsureArg.IsNotNull(options);
            _options = options.Value;
            EnsureArg.IsNotNullOrWhiteSpace(_options.MailmanWorkerServerBaseUrl);
            _httpClient.BaseAddress = new Uri(_options.MailmanWorkerServerBaseUrl);
        }

        private readonly MailMergeServiceOptions _options;
        private static HttpClient _httpClient = new HttpClient();


        public async Task<RunMergeTemplateProgress> RunMailMergeAsync(
            RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
                throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

            var response = await _httpClient.PostAsJsonAsync(
                "api/MailMerge/run",
                new RunMailMergeOptions()
                {
                    MergeTemplateId = options.MergeTemplateId,
                    ConnectionId = options.ConnectionId
                },
                cancellationToken);

            //TODO; form the response as a RunMergeTemplateProgress object
            //response.Content.
            throw new NotImplementedException();
        }


        public Task StartMailMergeAsync(
            RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
                throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

            _httpClient.PostAsJsonAsync(
                "api/MailMerge/run",
                new RunMailMergeOptions()
                {
                    MergeTemplateId = options.MergeTemplateId,
                    ConnectionId = options.ConnectionId
                },
                cancellationToken);
            return Task.CompletedTask;
        }
    }
}
