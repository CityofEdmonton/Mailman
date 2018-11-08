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
                var bodyText = HtmlToPlainText(body);

                var msg = new AE.Net.Mail.MailMessage {
                    Subject = subject,
                    Body = bodyText,
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
                        msg.Cc.Add(new MailAddress(address));
                    }
                }
                foreach (var address in bcc)
                {
                    if (!string.IsNullOrEmpty(address)){
                        noReciver = false;
                        msg.Bcc.Add(new MailAddress(address));
                    }
                }

                if (noReciver != true)  
                {
                    Message message;
                    using (var msgStr = new StringWriter())
                    {
                        msg.Save(msgStr);
                        message = new Message {Raw = Base64UrlEncode(msgStr.ToString())};
                    }

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

        private static string HtmlToPlainText(string html)
        {
            const string tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var lineBreakRegex = new Regex(lineBreak, RegexOptions.Multiline);
            var stripFormattingRegex = new Regex(stripFormatting, RegexOptions.Multiline);
            var tagWhiteSpaceRegex = new Regex(tagWhiteSpace, RegexOptions.Multiline);

            var text = html;
            //Decode html specific characters
            text = System.Net.WebUtility.HtmlDecode(text); 
            //Remove tag whitespace/line breaks
            text = tagWhiteSpaceRegex.Replace(text, "><");
            //Replace <br /> with line breaks
            text = lineBreakRegex.Replace(text, Environment.NewLine);
            //Strip formatting
            text = stripFormattingRegex.Replace(text, string.Empty);

            return text;
        }
        
    }
}
