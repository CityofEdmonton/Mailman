using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    public class EmailMergeTemplate : MergeTemplate
    {
        public EmailTemplate EmailTemplate { get; set; }




        internal new static EmailMergeTemplate CreateFrom(string id, string spreadsheetId, string serialized)
        {
            var returnValue = new EmailMergeTemplate();
            returnValue.Initialize(id, spreadsheetId, serialized);

            returnValue.EmailTemplate = EmailTemplate.CreateFrom(serialized);

            return returnValue;
        }
    }
}
