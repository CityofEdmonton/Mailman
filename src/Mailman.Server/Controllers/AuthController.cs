using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Server.Controllers
{
    // see https://www.jerriepelser.com/blog/authenticate-oauth-aspnet-core-2/

    [Authorize]
    public class AuthController : Controller
    {
        public async Task<IActionResult> Index()
        {

            return Ok("Auth page!");
        }

    }
}