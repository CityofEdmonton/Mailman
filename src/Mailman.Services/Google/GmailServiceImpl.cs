using EnsureThat;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Gmail.v1;
using System.Net.Mail;
using System.IO;

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


        public async Task SendEmailAsync(string to, 
            string cc, 
            string bcc, 
            string subject, 
            string body)
        {
            using (var gmailservice = await _googleSheetsServiceAccessor.GetGmailServiceAsync())
            {
                var msg = new AE.Net.Mail.MailMessage {
                    Subject = subject,
                    Body = body,
                };
                msg.To.Add(new MailAddress(to));
                var msgStr = new StringWriter();
                msg.Save(msgStr);

                // Context is a separate bit of code that provides OAuth context;
                // your construction of GmailService will be different from mine.

                var message = new Message {Raw = Base64UrlEncode(msgStr.ToString())};
                try
                {   var service = new GmailService(); // should be var service = new GmailService(Google authorization token);
                    var result =  service.Users.Messages.Send(message, "me").Execute();
                    _logger.Information("Just sent the email");

                }
                catch (Exception e)
                {
                    _logger.Error("An error occurred: " + e.Message);
                }
            }

        }

        private static string Base64UrlEncode(string input) 
        {
            var inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
            // Special "url-safe" base64 encode.
            return Convert.ToBase64String(inputBytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .Replace("=", "");
        }
    }
}
