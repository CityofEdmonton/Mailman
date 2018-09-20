using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mailman.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
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
                return base.Redirect("/" + Request.QueryString.Value);
            else
            {
                // this should be moved to an MVC view -DC
                return new ContentResult()
                {
                    // note the "targetOrigin" (the second parameter of '*'):
                    // It is highly recommended to put a tartget url there, but
                    // appscript origins do not have consistent urls.
                    // This is also ok because we are not sending sensitive data is this message
                    Content = "<html><body>\n<script>\nwindow.addEventListener('message', function(e) { console.log('got accessToken, now to POST it to /api/signin'); document.getElementById('accessToken').value = e.data; document.getElementById('signinform').submit(); }); window.parent.postMessage('loaded', '*');\n</script>\n<form action='/api/login/signin' method='post' id='signinform'><input type='hidden' name='AccessToken' id='accessToken'></form></body></html>",
                    ContentType = "text/html"
                };
            }
        }

        [HttpGet("[action]")]
        public IActionResult Signin()
        {
            return new ContentResult()
            {
                Content = "<html><body>\n<script>\nwindow.close();</script>\n</body></html>",
                ContentType = "text/html"
            };
        }

        [HttpPost("signin")]
        [AllowAnonymous]
        public IActionResult SigninWithToken([FromForm]SignInModel model)
        {
            // once here we can use the accessToken to get information about our user
            // and then issue a new ClaimsPrincipal on HttpContext.User

            if (string.IsNullOrWhiteSpace(model?.AccessToken))
                throw new ArgumentNullException("AccessToken");



            return new ContentResult()
            {
                Content = "<html><body>\n<script>\nwindow.close();</script>\n</body></html>",
                ContentType = "text/html"
            };
        }

        public class SignInModel
        {
            public string AccessToken { get; set; }
        }

    }
}
