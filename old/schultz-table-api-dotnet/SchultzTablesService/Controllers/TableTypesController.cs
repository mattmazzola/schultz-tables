using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using SchultzTablesService.Documents;
using SchultzTablesService.DomainModels;
using SchultzTablesService.Models;
using SchultzTablesService.Options;

namespace SchultzTablesService.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class TableTypesController : Controller
    {
        private readonly AadB2cApplicationOptions aadB2cApplicationOptions;
        private readonly AuthenticationContext authenticationContext;
        private readonly ClientCredential clientCredential;
        private readonly IDataProtector dataProtector;
        private readonly DocumentDbOptions documentDbOptions;
        private readonly DocumentClient documentClient;
        private readonly ILogger logger;

        public TableTypesController(IDataProtectionProvider dataProtectionProvider, IOptions<DocumentDbOptions> documentDbOptions, DocumentClient documentClient, ILogger<ScoresController> logger, IOptions<AadB2cApplicationOptions> aadB2cApplicationOptions)
        {
            this.aadB2cApplicationOptions = aadB2cApplicationOptions.Value;
            this.authenticationContext = new AuthenticationContext($"https://login.microsoftonline.com/{aadB2cApplicationOptions.Value.Tenant}");
            this.clientCredential = new ClientCredential(aadB2cApplicationOptions.Value.ApplicationId, aadB2cApplicationOptions.Value.ApplicationKey);
            this.dataProtector = dataProtectionProvider.CreateProtector("schultztables");
            this.documentDbOptions = documentDbOptions.Value;
            this.documentClient = documentClient;
            this.logger = logger;
        }

        // GET: api/tableTypes
        [HttpGet]
        public IActionResult Search()
        {
            var tableTypes = documentClient.CreateDocumentQuery<Documents.TableType>(UriFactory.CreateDocumentCollectionUri(documentDbOptions.DatabaseName, documentDbOptions.TableTypesCollectionName))
                .ToList();

            return Ok(tableTypes);
        }
    }
}
