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
using System.Collections;
using System.Text.RegularExpressions;
using System.Net;
using MimeKit;

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


        public async Task SendEmailAsync(
            IEnumerable <string> to, 
            IEnumerable <string> cc, 
            IEnumerable <string> bcc, 
            string subject, 
            string body)
        {   
        
            using (var gmailservice = await _googleSheetsServiceAccessor.GetGmailServiceAsync())
            {    
                Boolean noReciver = true;
                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                var msg = new MailMessage() {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                foreach (var address in to)
                {
                    if (!string.IsNullOrEmpty(address)){
                        noReciver = false;
                        msg.To.Add(new MailAddress(address));
                    }
                }
                foreach (var address in cc)
                {                    
                    if (!string.IsNullOrEmpty(address)){
                        noReciver = false;
                        msg.CC.Add(new MailAddress(address));
                    }
                }
                foreach (var address in bcc)
                {
                    if (!string.IsNullOrEmpty(address)){
                        noReciver = false;
                        msg.Bcc.Add(new MailAddress(address));
                    }
                }
                //foreach (string path in attachments)
                //{
                //    Attachment attachment = new Attachment(path);
                //    msg.Attachments.Add(attachment);
                //}

                if (noReciver != true)  
                {
                    MimeKit.MimeMessage mimeMessage = MimeMessage.CreateFromMailMessage(msg);
                    Message message = new Message(){Raw = Base64UrlEncode(mimeMessage.ToString())};
                    try
                    { 
                        var result =  gmailservice.Users.Messages.Send(message, "me").Execute();
                        _logger.Information("Just sent the email");
                    }
                    catch (Exception e)
                    {
                        _logger.Error("An error occurred: " + e.Message);
                    }
                }
                else if (noReciver == true){
                    _logger.Warning("No recivers for this email");
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
