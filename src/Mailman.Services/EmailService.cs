using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services
{
    internal class EmailService : IEmailService
    {
        public Task SendEmailAsync(string to, string cc, string bcc, string subject, string body)
        {
            throw new NotImplementedException();
        }
    }
}
