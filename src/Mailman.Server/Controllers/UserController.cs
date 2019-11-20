using Mailman.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mailman.Server.Controllers
{
    /// <summary>
    /// Controller for managing users.
    /// </summary>
    [ApiController]
    [Authorize(AuthenticationSchemes = AuthSchemes)]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private const string AuthSchemes =
            CookieAuthenticationDefaults.AuthenticationScheme + "," +
            JwtBearerDefaults.AuthenticationScheme;

        /// <summary>
        /// Gets the currently authenticated user.
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// A 401 is returned if no user is signed in.
        /// </remarks>
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            return new JsonResult(new
                {
                  email = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
                  name = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value,
                  givenName = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value,
                  surname = User.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Surname)?.Value,
                });
        }
    }
}
