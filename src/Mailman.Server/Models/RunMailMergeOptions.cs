using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class RunMailMergeOptions
    {
        public string MergeTemplateId { get; set; }
        /// <summary>
        /// SignalR connection id for progress updates, can be null
        /// </summary>
        public string ConnectionId { get; set; }

    }
}
