using Mailman.Data;
using SharedKernel.Data;
using System;
using System.Collections.Generic;

namespace Mailman.Services
{
    public interface IMergeTemplateRepository
    {
        PagedResultSet<MergeTemplate> GetMergeTemplates();
    }
}
