using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Worker.Models
{
    public class RunMailMergeOptions
    {
        [Required]
        public string MergeTemplateId { get; set; }

        /// <summary>
        /// SignalR connection id for progress updates, can be null
        /// </summary>
        public string ConnectionId { get; set; }
    }
}
