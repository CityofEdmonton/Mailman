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
using Serilog;

namespace Mailman.Server
{
    internal class MailMergeService : IMailMergeService
    {
        public MailMergeService(IOptions<MailMergeServiceOptions> options,
            ILogger logger)
        {
            EnsureArg.IsNotNull(options);
            EnsureArg.IsNotNull(logger);
            _options = options.Value;
            _logger = logger;
            EnsureArg.IsNotNullOrWhiteSpace(_options.MailmanWorkerServerBaseUrl);
            _httpClient.BaseAddress = new Uri(_options.MailmanWorkerServerBaseUrl);
        }

        private readonly MailMergeServiceOptions _options;
        private readonly ILogger _logger;
        private static HttpClient _httpClient = new HttpClient();


        public async Task<RunMergeTemplateProgress> RunMailMergeAsync(
            RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
                throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

            try
            {
                var response = await _httpClient.PostAsJsonAsync(
                    "api/MailMerge/run",
                    new RunMailMergeOptions()
                    {
                        MergeTemplateId = options.MergeTemplateId,
                        ConnectionId = options.ConnectionId
                    },
                    cancellationToken);
            }
            catch (Exception err)
            {
                _logger.Error(err, "Unable to communicate with worker process");
                throw;
            }

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
