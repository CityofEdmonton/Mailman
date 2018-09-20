using EnsureThat;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mailman.Services.Security
{
    internal class EntityFrameworkGoogleOAuthTokenService : IGoogleOAuthTokenService
    {
        private readonly OAuthTokenContext _oAuthTokenContext;
        private readonly ILogger _logger;
        public EntityFrameworkGoogleOAuthTokenService(OAuthTokenContext context,
            ILogger logger)
        {
            _oAuthTokenContext = context;
            _logger = logger;
        }

        public async Task UpdateOAuthTokens(AuthenticateResult auth)
        {
            EnsureArg.IsNotNull(auth);

            string email = auth.Principal?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            string accessToken = auth.Properties?.GetTokenValue("access_token");
            string refreshToken = auth.Properties?.GetTokenValue("refresh_token");
            string expiryDateString = auth.Properties?.GetTokenValue("expires_at");
            DateTime expiryUtc = string.IsNullOrWhiteSpace(expiryDateString) ? DateTime.MinValue : DateTime.Parse(expiryDateString).ToUniversalTime();

            TokenInfo tokenInfo;
                        // note the use of the query rather than Find(...)
            // this is to ensure we always get a fresh copy from the database
            try { tokenInfo = await _oAuthTokenContext.Tokens.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email); }
            catch (Exception err)
            {
                _logger.Warning(err, "Unable to read from Token database");

                // note that we currently eat the exception - this is so that in development
                // we don't stop just because we haven't set up the database yet (it is not critical)
                return;
            }
            if (tokenInfo == null)
            {
                _logger.Debug("Adding new token for {EmailAddress}", email);
                // easy case
                tokenInfo = new TokenInfo() { Email = email, AccessToken = accessToken, RefreshToken = refreshToken, ExpiryUtc = expiryUtc };
                _oAuthTokenContext.Tokens.Add(tokenInfo);
                await _oAuthTokenContext.SaveChangesAsync();
            }
            else
            {
                // now we just need to see if any of the fields have been updated
                if (!string.Equals(tokenInfo.AccessToken, accessToken) ||
                    !string.Equals(tokenInfo.RefreshToken, refreshToken) ||
                    tokenInfo.ExpiryUtc != expiryUtc)
                {
                    _logger.Debug("Updating token for {EmailAddress}", email);
                    tokenInfo.AccessToken = accessToken;
                    tokenInfo.RefreshToken = refreshToken;
                    tokenInfo.ExpiryUtc = expiryUtc;
                    _oAuthTokenContext.Entry(tokenInfo).State = EntityState.Modified;
                    await _oAuthTokenContext.SaveChangesAsync();
                }
            }
        }
    }
}
