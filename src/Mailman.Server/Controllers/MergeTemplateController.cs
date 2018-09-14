using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnsureThat;
using Mailman.Data;
using Mailman.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MergeTemplateController : ControllerBase
    {
        private readonly IMergeTemplateRepository _mergeTemplateRepository;

        public MergeTemplateController(IMergeTemplateRepository mergeTemplateRepository)
        {
            EnsureArg.IsNotNull(mergeTemplateRepository, nameof(mergeTemplateRepository));
            _mergeTemplateRepository = mergeTemplateRepository;
        }

        // GET: api/MergeTemplate
        [HttpGet]
        public Task<IEnumerable<MergeTemplate>> Get(string spreadsheetId)
        {
            return _mergeTemplateRepository.GetMergeTemplatesAsync(spreadsheetId);
        }

        // GET: api/MergeTemplate/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
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
