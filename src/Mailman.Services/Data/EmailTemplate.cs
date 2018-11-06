using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    public class EmailTemplate
    {
        public string To { get; private set; }
        public string Cc { get; private set; }
        public string Bcc { get; private set; }
        public string Subject { get; private set; }
        public string Body { get; private set; }

        internal static EmailTemplate CreateFrom(string serialized)
        {
            dynamic value = Newtonsoft.Json.Linq.JObject.Parse(serialized);
            var mergeData = value.mergeData;
            var emailTemplateData = mergeData.data;

            return new EmailTemplate()
            {
                To = emailTemplateData.to,
                Cc = emailTemplateData.cc,
                Bcc = emailTemplateData.bcc,
                Subject = emailTemplateData.subject,
                Body = emailTemplateData.body
            };

        }
    }
}
