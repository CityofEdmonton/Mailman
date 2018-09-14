using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Mailman.Server.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return Ok("Auth page!");
        }
    }
}