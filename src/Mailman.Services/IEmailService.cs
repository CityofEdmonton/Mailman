using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string cc, string bcc,
            string subject, string body);
    }
}
