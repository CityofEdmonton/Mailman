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

        /// <summary>
        /// Creates a new instance of LoginController.
        /// </summary>
        public LoginController(IHubContext<MailmanHub> hub)
        {
            _hub = hub;
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
            await this._hub.Clients.Client(SignalrId).SendAsync("REDUX_ACTION", "RECEIVE_LOGIN", new 
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
    }
}
