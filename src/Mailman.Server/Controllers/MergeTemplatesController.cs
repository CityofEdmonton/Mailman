using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EnsureThat;
using Mailman.Server.Models;
using Mailman.Services;
using Mailman.Services.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MergeTemplatesController : ControllerBase
    {
        private readonly IMergeTemplateRepository _mergeTemplateRepository;
        private readonly IMapper _mapper;

        public MergeTemplatesController(
            IMergeTemplateRepository mergeTemplateRepository,
            IMapper mapper)
        {
            EnsureArg.IsNotNull(mergeTemplateRepository, nameof(mergeTemplateRepository));
            EnsureArg.IsNotNull(mapper, nameof(mapper));
            _mergeTemplateRepository = mergeTemplateRepository;
            _mapper = mapper;
        }

        // GET: api/MergeTemplate
        [HttpGet("{spreadsheetId}")]
        public async Task<IEnumerable<MergeTemplate>> Get(string spreadsheetId)
        {
            var mergeTemplates = await _mergeTemplateRepository.GetMergeTemplatesAsync(spreadsheetId);
            return Mapper.Map<IEnumerable<Services.Data.MergeTemplate>, IEnumerable<MergeTemplate>>(mergeTemplates);
        }
       

        // POST: api/MergeTemplate
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/MergeTemplate/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
