using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// Merge templates that are sent out through email.
    /// </summary>
    public class EmailMergeTemplate : MergeTemplate
    {
        /// <summary>
        /// The email definition for the merge template.
        /// </summary>
        public EmailTemplate EmailTemplate { get; set; }
    }
}
