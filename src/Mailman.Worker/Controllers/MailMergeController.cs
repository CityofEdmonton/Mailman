using EnsureThat;
using Mailman.Services;
using Mailman.Worker.Models;
using Microsoft.AspNetCore.Mvc;
//using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Worker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailMergeController : ControllerBase
    {
        public MailMergeController(
            IMergeTemplateRepository mergeTemplateRepository,
            IMergeTemplateService mergeTemplateService,
            IMailMergeNotificationService mailMergeNotificationService)
        {
            EnsureArg.IsNotNull(mergeTemplateRepository);
            EnsureArg.IsNotNull(mergeTemplateService);
            EnsureArg.IsNotNull(mailMergeNotificationService);
            _mergeTemplateRepository = mergeTemplateRepository;
            _mergeTemplateService = mergeTemplateService;
            _mailMergeNotificationService = mailMergeNotificationService;
        }

        private readonly IMergeTemplateRepository _mergeTemplateRepository;
        private readonly IMergeTemplateService _mergeTemplateService;
        private readonly IMailMergeNotificationService _mailMergeNotificationService;

        // POST api/values
        [HttpPost("run")]
        public async Task<IActionResult> Run([FromBody] RunMailMergeOptions options,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
            {
                return BadRequest("MergeTemplateId cannot be null");
            }

            var mergeTemplate = await _mergeTemplateRepository.GetMergeTemplate(options.MergeTemplateId);
            if (mergeTemplate == null)
                return NotFound($"MergeTemplate with id {options.MergeTemplateId} was not found");

            Task notifyProgressUpdatedTask = Task.CompletedTask;

            var result = await _mergeTemplateService.RunMergeTemplateAsync(mergeTemplate,
                progress =>
                {
                    // only notify is the last one is done already.
                    if (!string.IsNullOrWhiteSpace(options.ConnectionId) &&
                        notifyProgressUpdatedTask.IsCompleted)
                    {
                        notifyProgressUpdatedTask = _mailMergeNotificationService
                            .NotifyMailMergeUpdatedAsync(
                                options.MergeTemplateId, 
                                options.ConnectionId,
                                progress,
                                cancellationToken);
                    }
                },
                cancellationToken);

            if (!string.IsNullOrWhiteSpace(options.ConnectionId))
            {
                await _mailMergeNotificationService
                    .NotifyMailMergeCompletedAsync(options.MergeTemplateId,
                        options.ConnectionId,
                        result, 
                        cancellationToken);
            }

            return Ok(result);
        }

    }
}
