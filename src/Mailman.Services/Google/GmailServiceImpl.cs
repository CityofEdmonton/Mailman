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
        private readonly IGoogleServicesAccessor _googleSheetsServiceAccessor;

        public GmailServiceImpl(IGoogleServicesAccessor googleSheetsServiceAccessor,
            ILogger logger) : base(googleSheetsServiceAccessor, logger)
        {
            EnsureArg.IsNotNull(googleSheetsServiceAccessor);
            EnsureArg.IsNotNull(logger);
            _googleSheetsServiceAccessor = googleSheetsServiceAccessor;
            _logger = logger;
        }


        public Task SendEmailAsync(string to, 
            string cc, 
            string bcc, 
            string subject, 
            string body)
        {
            using (var gmailservice = await _googleSheetsServiceAccessor.GetGmailServiceAsync())
            {
                throw new NotImplementedException();
            }

        }
    }
}
