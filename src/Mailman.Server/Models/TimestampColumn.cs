using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class TimestampColumn
    {
        public string Name { get; set; }
        public bool ShouldPrefixNameWithMergeTemplateTitle { get; set; }
        public string Title { get; set; }
    }
}
