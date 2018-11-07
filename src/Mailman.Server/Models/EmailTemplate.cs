using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// Mailman templates for merging to data and sending emails
    /// </summary>
    public class EmailTemplate
    {
        /// <summary>
        /// Gets or sets the recipients of this email message.
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// The carbon copy (CC) recipients for this email message.
        /// </summary>
        public string Cc { get; set; }

        /// <summary>
        /// The blind carbon copy (BCC) recipients for this email message. 
        /// </summary>
        public string Bcc { get; set; }

        /// <summary>
        /// The subject line for this email message.
        /// </summary>
        public string Subject { get; set; }


        /// <summary>
        /// The message body.
        /// </summary>
        public string Body { get; set; }
    }
}
