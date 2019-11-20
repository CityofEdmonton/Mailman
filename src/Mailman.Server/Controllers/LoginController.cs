using Mailman.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Mailman.Server.Hubs;
using System.IdentityModel.Tokens.Jwt;

namespace Mailman.Server.Controllers
{
    /// <summary>
    /// Controller for authorzation
    /// </summary>
    /// <remarks>
    /// This will be replaced by middleware at some point in the future
    /// </remarks>
    [Authorize]
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class LoginController : Controller
    {
        private readonly IHubContext<MailmanHub> _hub;
        private readonly IJwtSigner _jwtSigner;

        /// <summary>
        /// Creates a new instance of LoginController.
        /// </summary>
        public LoginController(IHubContext<MailmanHub> hub, IJwtSigner signer)
        {
            _hub = hub;
            _jwtSigner = signer;
        }

        /// <summary>
        /// Logs in a user using the AppScriptOAuth scheme by communicating with
        /// the parent appscript window.
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// If a user is already logged it, it redirects to the home page "/",
        /// otherwise returns some html that asks the parent window for an OAuth token.
        /// Once the parent window returns the token, it then posts back to the server
        /// through the SigninWithToken method, which signs in the user.
        /// </remarks>
        [HttpGet()]
        [AllowAnonymous]
        public IActionResult Login()
        {
            // because this class has the [Authorize] attribute, it forces a login 
            // if the user isn't logged in yet.
            // Once logged in, we redirect to the homepage of the app
            // (the React app) and it can then communicate with the API
            // with a cookie that give the API a valid OAuth token
            if (User.Identity.IsAuthenticated)
            {
                var returnUrl = Request?.Query?["returnUrl"];
                if (string.IsNullOrWhiteSpace(returnUrl))
                    returnUrl = "/#/";
                return base.Redirect(returnUrl + Request.QueryString.Value);
            }
            else
            {
                return View();
            }
        }

        /// <summary>
        /// Authenticates a user using the Google scheme, and then 
        /// tell the browser to close the window.
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// This action handles the case where a user is using the full OAuth 2.0 flow
        /// in a child window to get consent.
        /// </remarks>
        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> Signin(String SignalrId)
        {
            // Send the user information to the client.
            await this._hub.Clients.Client(SignalrId).SendAsync("USER_LOGIN", new 
            {
                user = new
                {
                  email = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
                  name = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value,
                  givenName = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value,
                  surname = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Surname)?.Value,
                }
            });
            return new ContentResult()
            {
                Content = "<html><body>\n<script>\nwindow.close();</script>\n</body></html>",
                ContentType = "text/html"
            };
        }

        /// <summary>
        /// Retrieves a JWT for a user that is already authenticated. The
        /// flow would look something like this: 
        /// 1. Follow standard auth flow: a cookie is set.
        /// 2. Hit this endpoint: a JWT is returned.
        /// In future requests, you could use an Authorization header with
        /// a value of Bearer {JWT_HERE}
        /// </summary>
        /// <returns>A JWT string.</returns>
        /// <remarks>
        /// This action can't be used to sign in or out. It just grants a 
        /// JWT to an already authenticated user.
        /// </remarks>
        [HttpGet("[action]")]
        [Authorize]
        public IActionResult Jwt()
        {
            return Ok(_jwtSigner.CreateJwtToken(new Claim[]
            {
                new Claim("email", User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value),
                new Claim("name", User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value),
                new Claim("givenName", User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value),
                new Claim("surname", User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Surname)?.Value)
            }));
        }
    }
}
