using EnsureThat;
using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    internal class MailmanServicesLocalProxy : IMailmanServicesProxy
    {
        public MailmanServicesLocalProxy(
            IMergeTemplateRepository mergeTemplateRepository,
            IMergeTemplateService mergeTemplateService,
            ILogger logger)
        {
            EnsureArg.IsNotNull(mergeTemplateRepository);
            EnsureArg.IsNotNull(mergeTemplateService);
            EnsureArg.IsNotNull(logger);

            _mergeTemplateRepository = mergeTemplateRepository;
            _mergeTemplateService = mergeTemplateService;
            _logger = logger;

        }

        private readonly IMergeTemplateRepository _mergeTemplateRepository;
        private readonly IMergeTemplateService _mergeTemplateService;
        private readonly ILogger _logger;



        public Task NotifyMailMergeCompletedAsync(
            string mergeTemplateId, 
            string connectionId, 
            RunMergeTemplateProgress progressUpdated, 
            CancellationToken cancellationToken = default(CancellationToken))
        {
            // TODO: actually send notificaiton to MailmanHub like in the MergeTemplatesController
            _logger.Information("Mail merge of template {MergeTemplateId} complete: Success={NumberProcessed}, Skipped={NumberSkipped}, Errors={NumberOfErrors}, Total={TotalNumber}", 
                mergeTemplateId, 
                progressUpdated.Processed,
                progressUpdated.Skipped,
                progressUpdated.Errors,
                progressUpdated.Total);
            return Task.CompletedTask;
        }

        public Task NotifyMailMergeUpdatedAsync(string mergeTemplateId, string connectionId, RunMergeTemplateProgress progressUpdated, CancellationToken cancellationToken = default(CancellationToken))
        {
            // TODO: actually send notificaiton to MailmanHub like in the MergeTemplatesController
            _logger.Information("Mail merge of template {MergeTemplateId}: {NumberCompleted}/{TotalNumber}",
                mergeTemplateId,
                progressUpdated.Completed,
                progressUpdated.Total);
            return Task.CompletedTask;
        }

        public async Task<RunMergeTemplateProgress> RunMailMergeAsync(
            RunMailMergeOptions options, 
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var mergeTemplate = await _mergeTemplateRepository.GetMergeTemplate(options.MergeTemplateId);
            if (mergeTemplate == null)
                throw new KeyNotFoundException($"MergeTemplate with Id {options.MergeTemplateId} not found");

            Task notifyProgressUpdatedTask = Task.CompletedTask;

            var result = await _mergeTemplateService.RunMergeTemplateAsync(mergeTemplate,
                progress =>
                {
                    // only notify is the last one is done already.
                    if (!string.IsNullOrWhiteSpace(options.ConnectionId) &&
                        notifyProgressUpdatedTask.IsCompleted)
                    {
                        notifyProgressUpdatedTask = 
                            NotifyMailMergeUpdatedAsync(
                                options.MergeTemplateId,
                                options.ConnectionId,
                                progress,
                                cancellationToken);
                    }
                },
                cancellationToken);

            if (!string.IsNullOrWhiteSpace(options.ConnectionId))
            {
                await NotifyMailMergeCompletedAsync(options.MergeTemplateId,
                        options.ConnectionId,
                        result,
                        cancellationToken);
            }
            return result;
        }

        public async Task StartMailMergeAsync(
            RunMailMergeOptions options, 
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var mergeTemplate = await _mergeTemplateRepository.GetMergeTemplate(options.MergeTemplateId);
            if (mergeTemplate == null)
                throw new KeyNotFoundException($"MergeTemplate with Id {options.MergeTemplateId} not found");

            Task notifyProgressUpdatedTask = Task.CompletedTask;

            var task = _mergeTemplateService.RunMergeTemplateAsync(mergeTemplate,
                progress =>
                {
                    // only notify is the last one is done already.
                    if (!string.IsNullOrWhiteSpace(options.ConnectionId) &&
                        notifyProgressUpdatedTask.IsCompleted)
                    {
                        notifyProgressUpdatedTask =
                            NotifyMailMergeUpdatedAsync(
                                options.MergeTemplateId,
                                options.ConnectionId,
                                progress,
                                cancellationToken);
                    }
                }
                /* NO CANCELLATION TOKEN */ );

            // start the task but don't wait for it to finish
        }
    }
}
