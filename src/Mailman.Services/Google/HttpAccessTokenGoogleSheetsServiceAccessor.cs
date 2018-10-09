using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using EnsureThat;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Mailman.Services.Google
{
    internal class HttpAccessTokenGoogleSheetsServiceAccessor : IGoogleSheetsServiceAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger _logger;

        public HttpAccessTokenGoogleSheetsServiceAccessor(IHttpContextAccessor httpContextAccessor,
            ILogger logger)
        {
            EnsureArg.IsNotNull(httpContextAccessor);
            EnsureArg.IsNotNull(logger);
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task<SheetsService> GetSheetsServiceAsync()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                _logger.Error("Unable to get current HttpContext");
                throw new InvalidOperationException("Unable to get current HttpContext");
            }
            var accessToken = await context.GetTokenAsync("access_token");
            var credential = GoogleCredential.FromAccessToken(accessToken);
            var serviceInitializer = new BaseClientService.Initializer() { HttpClientInitializer = credential };
            return new SheetsService(serviceInitializer);
        }
    }
}
