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


        public Task SendEmailAsync(string to, string cc, string bcc, string subject, string body)
        {
            SentEmails.Add(new Email(to, cc, bcc, subject, body));
            return Task.CompletedTask;
        }

        public Task SendEmailAsync(IEnumerable<string> to, IEnumerable<string> cc, IEnumerable<string> bcc, string subject, string body)
        {
            throw new NotImplementedException();
        }

        public class Email
        {
            public Email(string to, string cc, string bcc, string subject, string body)
            {
                To = to;
                Cc = cc;
                Bcc = bcc;
                Subject = subject;
                Body = body;
            }

            public string To { get; private set; }
            public string Cc { get; private set; }
            public string Bcc { get; private set; }
            public string Subject { get; private set; }
            public string Body { get; private set; }
        }
    }
}
