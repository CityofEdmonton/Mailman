using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class GmailService : IEmailService
    {
        public GmailService()
        {

        }
        public Task SendEmailAsync(string to, string cc, string bcc, string subject, string body)
        {
            throw new NotImplementedException();
        }
    }
}
