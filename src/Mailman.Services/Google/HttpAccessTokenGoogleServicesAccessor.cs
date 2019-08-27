using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnsureThat;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Mailman.Services.Google
{
    internal class HttpAccessTokenGoogleServicesAccessor : IGoogleServicesAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger _logger;

        public HttpAccessTokenGoogleServicesAccessor(IHttpContextAccessor httpContextAccessor,
            ILogger logger)
        {
            EnsureArg.IsNotNull(httpContextAccessor);
            EnsureArg.IsNotNull(logger);
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        private async Task<string> GetAccessTokenAsync()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                _logger.Error("Unable to get current HttpContext");
                throw new InvalidOperationException("Unable to get current HttpContext");
            }
            string accessToken = null;
            if (context.Request.Headers.ContainsKey("accessToken"))
            {
                accessToken = context.Request.Headers["accessToken"];

            }
            // The Mailman server/Worker service uses JWT authentication with 
            // the OAuth token as a claim.  Check there first.
            //if (context.User.Identity.AuthenticationType == "Jwt")

            if (string.IsNullOrWhiteSpace(accessToken))
            {
                accessToken = context.User.Claims?.FirstOrDefault(c => c.Type == "access_token")?.Value;

                if (string.IsNullOrWhiteSpace(accessToken))
                    accessToken = await context.GetTokenAsync("access_token");

            }

            return accessToken;
        }

        public async Task<GmailService> GetGmailServiceAsync()
        {
            string accessToken = await GetAccessTokenAsync();
            var credential = GoogleCredential.FromAccessToken(accessToken);
            var serviceInitializer = new BaseClientService.Initializer() { HttpClientInitializer = credential };
            return new GmailService(serviceInitializer);
        }

        public async Task<SheetsService> GetSheetsServiceAsync()
        {
            string accessToken = await GetAccessTokenAsync();
            var credential = GoogleCredential.FromAccessToken(accessToken);
            var serviceInitializer = new BaseClientService.Initializer() { HttpClientInitializer = credential };
            return new SheetsService(serviceInitializer);
        }
    }
}
