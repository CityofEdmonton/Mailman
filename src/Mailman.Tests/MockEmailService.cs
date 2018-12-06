using Mailman.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    public class MockEmailService : IEmailService
    {
        public MockEmailService()
        {
            SentEmails = new List<Email>();
        }

        public IList<Email> SentEmails { get; }

        public Task SendEmailAsync(IEnumerable<string> to, IEnumerable<string> cc, IEnumerable<string> bcc, string subject, string body)
        {
            SentEmails.Add(new Email(to, cc, bcc, subject, body));
            return Task.CompletedTask;
        }

        public class Email
        {
            public Email(IEnumerable<string> to, IEnumerable<string> cc, IEnumerable<string> bcc, string subject, string body)
            {
                To = to;
                Cc = cc;
                Bcc = bcc;
                Subject = subject;
                Body = body;
            }

            public IEnumerable<string> To { get; private set; }
            public IEnumerable<string> Cc { get; private set; }
            public IEnumerable<string> Bcc { get; private set; }
            public string Subject { get; private set; }
            public string Body { get; private set; }
        }
    }
}
