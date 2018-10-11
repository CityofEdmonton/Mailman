using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    public class EmailMergeTemplate : MergeTemplate
    {
        public EmailTemplate EmailTemplate { get; set; }


        internal static MergeTemplate CreateFrom(string id, string spreadsheetId, string serialized)
        {
            var returnValue = new EmailMergeTemplate();
            Initialize(returnValue, id, spreadsheetId, serialized);

            returnValue.EmailTemplate = EmailTemplate.CreateFrom(serialized);

            return returnValue;
        }
    }
}
