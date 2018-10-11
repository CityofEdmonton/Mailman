using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// The type of merge template. Currently
    /// only supports merging with emails.
    /// </summary>
    public enum MergeTemplateType
    {
        /// <summary>
        /// Email merge type.
        /// </summary>
        Email
    }
}
