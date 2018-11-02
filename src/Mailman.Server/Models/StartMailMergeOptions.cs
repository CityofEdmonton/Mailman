using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    public class StartMailMergeOptions : RunMailMergeOptions
    {
        /// <summary>
        /// SignalR connectionId to receive progress updates
        /// </summary>
        public string ConnectionId { get; set; }
    }
}
