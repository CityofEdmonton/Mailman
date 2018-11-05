using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// Parameters needed to start a Mail Merge
    /// </summary>
    public class RunMailMergeOptions
    {
        /// <summary>
        /// The unique identifier of the <see cref="MergeTemplate"/>
        /// </summary>
        [Required]
        public string MergeTemplateId { get; set; }

        /// <summary>
        /// (Optional) SignalR connectionId to receive progress updates
        /// </summary>
        public string ConnectionId { get; set; }

    }
}
