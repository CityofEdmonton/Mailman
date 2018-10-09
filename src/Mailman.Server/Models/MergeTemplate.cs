using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class MergeTemplate
    {
        public string Id { get; set; }
        public MergeTemplateType Type { get;set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDateUtc { get; set; }
        public string Version { get; set; }

        public string Title { get; set; }
        public string SheetName { get; set; }
        public int HeaderRowNumber { get; set; }
        public TimestampColumn TimestampColumn { get; set; }
        public string Conditional { get; set; }
        public RepeaterType Repeater { get; set; }

    }
}
