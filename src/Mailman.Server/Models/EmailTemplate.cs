using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class EmailTemplate
    {
        public string To { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
