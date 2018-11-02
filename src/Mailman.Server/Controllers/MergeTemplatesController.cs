using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using EnsureThat;
using Mailman.Server.Hubs;
using Mailman.Server.Models;
using Mailman.Services;
using Mailman.Services.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Mailman.Server.Controllers
{
    /// <summary>
    /// Controller for Merge Templates.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class MergeTemplatesController : ControllerBase
    {
        private readonly IMergeTemplateRepository _mergeTemplateRepository;
        private readonly IHubContext<MailmanHub> _mailmanHub;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        /// <summary>
        /// Constructor for merge templates
        /// </summary>
        /// <param name="mergeTemplateRepository">Service to merge template persistance store.</param>
        /// <param name="mapper">Automapper instance</param>
        /// <param name="logger">Serilog logger</param>
        public MergeTemplatesController(
            IMergeTemplateRepository mergeTemplateRepository,
            IHubContext<MailmanHub> mailmanHub,
            IMapper mapper,
            ILogger logger)
        {
            EnsureArg.IsNotNull(mergeTemplateRepository, nameof(mergeTemplateRepository));
            EnsureArg.IsNotNull(mailmanHub, nameof(mailmanHub));
            EnsureArg.IsNotNull(mapper, nameof(mapper));
            EnsureArg.IsNotNull(logger, nameof(logger));
            _mergeTemplateRepository = mergeTemplateRepository;
            _mailmanHub = mailmanHub;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/MergeTemplate
        /// <summary>
        /// Retrieves all the merge templates for a given spreadsheet.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     GET /api/MergeTemplates/1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY
        /// </remarks>
        /// <param name="spreadsheetId">The id of the spreadsheet, as in the url when editing a sheet.</param>
        /// <returns>A list of merge templates for the given spreadsheet.</returns>
        /// <response code="200">Returns the merge templates for the Sheet.</response>
        /// <response code="404">If the Google Sheet cannot be found.</response>
        [HttpGet("{spreadsheetId}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<MergeTemplate>))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> Get(string spreadsheetId)
        {
            IEnumerable<Services.Data.MergeTemplate> mergeTemplates;
            try { mergeTemplates = await _mergeTemplateRepository.GetMergeTemplatesAsync(spreadsheetId); }
            catch (SheetNotFoundException)
            {
                _logger.Warning("Spreadsheet '{SpreadSheetId} not foud", spreadsheetId);
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<Services.Data.MergeTemplate>, IEnumerable<MergeTemplate>>(mergeTemplates));
        }

        //// POST: api/MergeTemplate
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT: api/MergeTemplate/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}

        [HttpPost("start")]
        public async Task<IActionResult> StartMailMerge(StartMailMergeOptions options)
        {

        }

        public async Task<IActionResult> RunMailMerge(RunMailMergeOptions options)
        {

        }

        [HttpPost("run/updated")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task NotifyMailMergeUpdated([FromBody]MailMergeProgress progress)
        {
            //TODO; ensure only the "workers" can call this
            if (!string.IsNullOrWhiteSpace(progress.ConnectionId))
            {
                await _mailmanHub.Clients.Clients(progress.ConnectionId)
                    .SendAsync("mailMergeProgressUpdated", progress);
            }
        }

        [HttpPost("run/completed")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task NotifyMailMergeCompleted([FromBody]MailMergeProgress progress)
        {
            //TODO; ensure only the "workers" can call this
            if (!string.IsNullOrWhiteSpace(progress.ConnectionId))
            {
                await _mailmanHub.Clients.Clients(progress.ConnectionId)
                    .SendAsync("mailMergeCompleted", progress);
            }
        }
    }
}
