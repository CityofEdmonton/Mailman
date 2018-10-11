using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// The repeater type for the merge template. Defines how 
    /// the merge template can run when the user is offline.
    /// </summary>
    public enum RepeaterType
    {
        /// <summary>
        /// Does not run when the user is offline.
        /// </summary>
        Off = 0,

        /// <summary>
        /// Runs on a periodic basis. Historically has been
        /// every hour, but they may change in the future.
        /// </summary>
        Repeatedly = 1,

        /// <summary>
        /// Run when a Google Form is submitted to the Google Sheet.
        /// </summary>
        OnFormSubmit = 2
    }
}
