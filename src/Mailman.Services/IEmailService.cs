using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(IEnumerable <string> to, IEnumerable <string> cc, IEnumerable <string> bcc,
            string subject, string body);
    }
}
