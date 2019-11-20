using Mailman.Services;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;
using Wyrm.Events;
using Wyrm.RabbitMq.Extentions.DependencyInjection;

namespace Mailman.Worker
{
    /// <summary>
    /// Handler class for listening to a RabbitMQ queue and running merge templates when
    /// events are added to that queue
    /// </summary>
    [Event("mailman.mergetemplate.start")]
    [Event("mailman.mergetemplate.progress.notification", Direction=Direction.Out)]
    public class StartMergeTemplateService : IEventHandler<RunMailMergeOptions, MailMergeProgress>
    {
        /// <summary>
        /// Merge Template handler constructor
        /// </summary>
        /// <param name="mergeTemplateRepository">Merge template repository, use to retrieve merge template info</param>
        /// <param name="mergeTemplateService">Merge template service, for running the actual merges</param>
        /// <param name="queueService">RabbitMQ queue service, provided by Wyrm. Use to update on progress</param>
        /// <param name="logger">Logger</param>
        public StartMergeTemplateService(
            IMergeTemplateRepository mergeTemplateRepository,
            IMergeTemplateService mergeTemplateService,
            IQueueService queueService,
            ILogger logger)
        {
            _mergeTemplateRepository = mergeTemplateRepository;
            _mergeTemplateService = mergeTemplateService;
            _queueService = queueService;
            _logger = logger;
        }

        private readonly IMergeTemplateRepository _mergeTemplateRepository;
        private readonly IMergeTemplateService _mergeTemplateService;
        private readonly IQueueService _queueService;
        private readonly ILogger _logger;


        /// <summary>
        /// Handler for the start merge template event
        /// </summary>
        /// <param name="options"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<MailMergeProgress> HandleAsync(RunMailMergeOptions options, CancellationToken cancellationToken)
        {
            _logger.Information("Starting mail merge for id {MergeTemplateId}", options?.MergeTemplateId);

            var mergeTemplate = await _mergeTemplateRepository.GetMergeTemplate(options.MergeTemplateId);
            if (mergeTemplate == null)
                return new MailMergeProgress() { ErrorMessage = $"MergeTemplate with id {options.MergeTemplateId} was not found" };

            var result = await _mergeTemplateService.RunMergeTemplateAsync(mergeTemplate,
                progress =>
                {
                    // notify client UI if we have a signalR connectionId specified
                    if (!string.IsNullOrWhiteSpace(options.ConnectionId))
                    {
                        _queueService.SendMessage("mailman.mergetemplate.progress.notification", 
                            new MailMergeProgress() 
                            { 
                                MergeTemplateId = options.MergeTemplateId, 
                                ConnectionId = options.ConnectionId, 
                                Progress = progress  
                            });
                    }
                },
                cancellationToken);

            return new MailMergeProgress() 
            { 
                MergeTemplateId = options.MergeTemplateId, 
                ConnectionId = options.ConnectionId, 
                Progress = result  
            };
        }

        /// <summary>
        /// Wyrm Event context, not used but required for IEventHandler interface
        /// </summary>
        /// <value></value>
        EventContext IEventHandler.Context { get; set; }

    }   
}