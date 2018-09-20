using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Sheets.v4;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace Mailman.Services
{
    internal class SheetsServiceFactory : ISheetsServiceFactory
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SheetsServiceFactory(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<SheetsService> GetSheetsServiceAsync()
        {
            var context = _httpContextAccessor.HttpContext;
            var accessToken = await context.GetTokenAsync("access_token");
            var credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromAccessToken(accessToken);
            var serviceInitializer = new Google.Apis.Services.BaseClientService.Initializer() { HttpClientInitializer = credential };
            return new SheetsService(serviceInitializer);
        }
    }
}
