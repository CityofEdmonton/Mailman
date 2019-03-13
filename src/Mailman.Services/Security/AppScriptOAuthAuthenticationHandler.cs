using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace Mailman.Services.Security
{
    internal class AppScriptOAuthAuthenticationHandler : AuthenticationHandler<AppScriptOAuthAuthenticationOptions>
    {
        public AppScriptOAuthAuthenticationHandler(IOptionsMonitor<AppScriptOAuthAuthenticationOptions> options,
            ILoggerFactory loggerFactory,
            UrlEncoder encoder,
            ISystemClock clock) : base(options, loggerFactory, encoder, clock)
        {
        }

        private static readonly string USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

        protected string SignInScheme => Options.SignInScheme;

        private Microsoft.AspNetCore.Http.IFormCollection GetForm()
        {
            // note sure why but Context.Request.Form doesn't work here, so we'll build our own formCollection
            if (Context.Request.HasFormContentType)
            {
                string s;
                using (var sr = new System.IO.StreamReader(Context.Request.Body))
                {
                    s = sr.ReadToEnd();
                }
                var formValues = s.Split("&")
                    .Select(x => x.Split("="))
                    .ToArray();

                for (int i=0; i<formValues.Length; i++)
                {
                    for (int j=0; j<formValues[i].Length; j++)
                    {
                        formValues[i][j] = System.Web.HttpUtility.UrlDecode(formValues[i][j]);
                    }
                }

                var formValuesDict = formValues
                    .ToDictionary(x => x[0], y => new Microsoft.Extensions.Primitives.StringValues(y.Skip(1).ToArray()));
                return new Microsoft.AspNetCore.Http.FormCollection(formValuesDict);
            }
            return null;
        }

        protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            var form = GetForm();
            if (form != null)
            {
                string accessToken = form["AccessToken"];
                if (!string.IsNullOrWhiteSpace(accessToken))
                {
                    var props = new AuthenticationProperties();

                    if (Options.SaveTokens)
                    {
                        // logic here similar to https://github.com/aspnet/Security/blob/beaa2b443d46ef8adaf5c2a89eb475e1893037c2/src/Microsoft.AspNetCore.Authentication.OAuth/OAuthHandler.cs#L103
                        var authTokens = new List<AuthenticationToken>
                        {
                            new AuthenticationToken { Name = "access_token", Value = accessToken }
                        };

                        // other tokens here if we can get them (currently access_token is the only one we can get from AppScript)
                        props.StoreTokens(authTokens);
                    }

                    // validate the token and get user info
                    bool isSuccess = false;

                    // I can't seem to find a client library for getting the userinfo,
                    // so we'll do it manually
                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                        var response = httpClient.GetAsync(USERINFO_ENDPOINT).Result;

                        string userInfoString = await response.Content.ReadAsStringAsync();
                        var userInfo = JsonConvert.DeserializeObject<GoogleUserInfo>(userInfoString);

                        var identity = new ClaimsIdentity(
                            new List<Claim>
                            {
                                new Claim(ClaimTypes.NameIdentifier, userInfo.Id),
                                new Claim(ClaimTypes.Name, userInfo.DisplayName),
                                new Claim(ClaimTypes.GivenName, userInfo.GivenName),
                                new Claim(ClaimTypes.Surname, userInfo.FamilyName),
                                new Claim("urn:google:picture", userInfo.PictureUrl ?? string.Empty),
                                new Claim(ClaimTypes.Email, userInfo.Email ?? string.Empty)
                            },
                            AppScriptOAuthAuthenticationDefaults.AuthenticationScheme);

                        var user = new ClaimsPrincipal(identity);

                        await Context.SignInAsync(SignInScheme, user, props);
                        isSuccess = true;
                    }

                    if (isSuccess)
                    {
                        string returnUrl = form["ReturnUrl"];
                        if (!string.IsNullOrWhiteSpace(returnUrl))
                        {
                            Context.Response.Redirect(returnUrl);
                        }
                    }
                }
            }
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // this should never be called because the challenge method 
            // directly signs in users.
            return Task.FromResult(AuthenticateResult.Fail("No token to authenticate"));
        }
    }
}