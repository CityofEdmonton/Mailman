using EnsureThat;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class StaticGoogleSheetsServiceAccessor : IGoogleSheetsServiceAccessor
    {
        private IConfigurableHttpClientInitializer _credentials;

        public StaticGoogleSheetsServiceAccessor(IConfigurableHttpClientInitializer credentials)
        {
            EnsureArg.IsNotNull(credentials);
            _credentials = credentials;
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
