using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class EmailMergeTemplate : MergeTemplate
    {
        public EmailTemplate EmailTemplate { get; set; }
    }
}
