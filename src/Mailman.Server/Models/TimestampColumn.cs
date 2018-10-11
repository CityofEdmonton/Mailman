using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// Defines how Mailman should use a column for putting in 
    /// timestamps after sending mail.
    /// </summary>
    public class TimestampColumn
    {
        /// <summary>
        /// The name of the column
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Specifies whether to include the name of the merge template
        /// before the column name when referencing the column
        /// </summary>
        public bool ShouldPrefixNameWithMergeTemplateTitle { get; set; }

        /// <summary>
        /// If <see cref="ShouldPrefixNameWithMergeTemplateTitle"/> is on,
        /// this returns the merge template's title <see cref="Name"/>. 
        /// Otherwise just returns <see cref="Name"/>.
        /// </summary>
        public string Title { get; set; }
    }
}
