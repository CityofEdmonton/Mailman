using EnsureThat;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class GmailServiceImpl : GoogleServiceBase, IEmailService
    {
        private readonly ILogger _logger;

        public GmailServiceImpl(IGoogleServicesAccessor googleSheetsServiceAccessor,
            ILogger logger) : base(googleSheetsServiceAccessor, logger)
        {
            EnsureArg.IsNotNull(logger);
            _logger = logger;
        }


        public Task SendEmailAsync(string to, 
            string cc, 
            string bcc, 
            string subject, 
            string body)
        {
            throw new NotImplementedException();
        }
    }
}
