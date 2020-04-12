using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace SchultzTablesService.Controllers
{
    [Produces("application/json")]
    [Route("/")]
    public class HomeController : Controller
    {
        private readonly ILogger logger;

        public HomeController(ILogger<ScoresController> logger)
        {
            this.logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                Time = DateTimeOffset.UtcNow,
                Message = "Service is running"
            });
        }
    }
}
