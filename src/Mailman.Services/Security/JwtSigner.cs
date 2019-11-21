using EnsureThat;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using System.Security.Claims;
using System;

namespace Mailman.Services.Security
{
    class JwtSigner : IJwtSigner
    {
        public JwtSigner(IOptions<JwtOptions> options)
        {
            EnsureArg.IsNotNull(options);

            _options = options.Value;
            EnsureArg.IsNotNullOrWhiteSpace(_options.Issuer);
            EnsureArg.IsNotNullOrWhiteSpace(_options.Audience);
            EnsureArg.IsNotNullOrWhiteSpace(_options.AuthKey);

            // set the JWT signing credentials for outgoing requests
            var serverAuthKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _options.AuthKey));
            var serverCredentials = new SigningCredentials(serverAuthKey,
                SecurityAlgorithms.HmacSha256Signature);
            _serverJwtHeader = new JwtHeader(serverCredentials);
        }

        public string CreateJwtToken(IEnumerable<Claim> claims)
        {
            var payload = new JwtPayload(
                _options.Issuer, 
                _options.Audience, 
                claims, 
                DateTime.Now, 
                DateTime.Now.AddMonths(1));

            var secToken = new JwtSecurityToken(_serverJwtHeader, payload);
            return _jwtSecurityTokenHandler.WriteToken(secToken);
        }

        private readonly JwtOptions _options;
        private readonly JwtHeader _serverJwtHeader;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
    }
}