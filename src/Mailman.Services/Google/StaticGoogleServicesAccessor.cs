using EnsureThat;
using Google.Apis.Gmail.v1;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class StaticGoogleServicesAccessor : IGoogleServicesAccessor
    {
        private IConfigurableHttpClientInitializer _credentials;

        public StaticGoogleServicesAccessor(IConfigurableHttpClientInitializer credentials)
        {
            EnsureArg.IsNotNull(credentials);
            _credentials = credentials;
        }

        public Task<GmailService> GetGmailServiceAsync()
        {
            return Task.FromResult(
                new GmailService(
                    new BaseClientService.Initializer()
                    {
                        HttpClientInitializer = _credentials
                    }));
        }

        public Task<SheetsService> GetSheetsServiceAsync()
        {
            return Task.FromResult(
                new SheetsService(
                    new BaseClientService.Initializer()
                    {
                        HttpClientInitializer = _credentials
                    }));
        }
    }
}
