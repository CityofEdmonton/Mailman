using System;
using System.Collections.Generic;
using System.Text;
using Mailman.Data;
using SharedKernel.Data;

namespace Mailman.Services
{
    internal class MergeTemplateRepository : IMergeTemplateRepository
    {
        public PagedResultSet<MergeTemplate> GetMergeTemplates()
        {
            throw new NotImplementedException();
        }
    }
}
