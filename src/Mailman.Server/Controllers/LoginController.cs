using Mailman.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.Google.GoogleDefaults.AuthenticationScheme)]
        public IActionResult Signin()
        {
            return new ContentResult()
            {
                Content = "<html><body>\n<script>\nwindow.close();</script>\n</body></html>",
                ContentType = "text/html"
            };
        }

        /// <summary>
        /// Completes the AppScriptOAuth login flow by submitting an OAuth token from 
        /// a parent appscript window
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("signin")]
        [Authorize(AuthenticationSchemes = AppScriptOAuthAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult SigninWithToken([FromForm]SignInModel model)
        {
            // this code is never called because the AppScriptOAuthAuthenticationHandler redirects 
            // after a successfull challenge.
            return Ok();
        }

        /// <summary>
        /// structure for submitting an accessToken to the <see cref="SigninWithToken(SignInModel)">SigninWithToken</see> method
        /// </summary>
        public class SignInModel
        {
            /// <summary>
            /// An OAuth 2.0 Access Token
            /// </summary>
            public string AccessToken { get; set; }
        }

    }
}
