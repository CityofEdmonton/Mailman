using Mailman.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Worker.Models
{
    public class MailMergeProgress
    {
        public string MergeTemplateId { get; set; }

        public string ConnectionId { get; set; }
        public RunMergeTemplateProgress Progress { get; set; }
    }
}
