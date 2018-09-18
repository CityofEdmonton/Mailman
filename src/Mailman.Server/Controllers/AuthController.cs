using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Server.Controllers
{
    [Authorize]
    public class AuthController : Controller
    {
        // placeholder just to trigger a oauth call
        public async Task<IActionResult> Index()
        {

            return Ok("Auth page!");
        }

    }
}