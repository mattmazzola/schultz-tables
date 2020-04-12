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
    public class ScoresController : Controller
    {
        private readonly AadB2cApplicationOptions aadB2cApplicationOptions;
        private readonly AuthenticationContext authenticationContext;
        private readonly ClientCredential clientCredential;
        private readonly IDataProtector dataProtector;
        private readonly DocumentDbOptions documentDbOptions;
        private readonly DocumentClient documentClient;
        private readonly ILogger logger;

        public ScoresController(IDataProtectionProvider dataProtectionProvider, IOptions<DocumentDbOptions> documentDbOptions, DocumentClient documentClient, ILogger<ScoresController> logger, IOptions<AadB2cApplicationOptions> aadB2cApplicationOptions)
        {
            this.aadB2cApplicationOptions = aadB2cApplicationOptions.Value;
            this.authenticationContext = new AuthenticationContext($"https://login.microsoftonline.com/{aadB2cApplicationOptions.Value.Tenant}");
            this.clientCredential = new ClientCredential(aadB2cApplicationOptions.Value.ApplicationId, aadB2cApplicationOptions.Value.ApplicationKey);
            this.dataProtector = dataProtectionProvider.CreateProtector("schultztables");
            this.documentDbOptions = documentDbOptions.Value;
            this.documentClient = documentClient;
            this.logger = logger;
        }

        // GET: api/scores
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery]string userId, [FromQuery]string tableTypeId, [FromQuery]bool orderByDuration, [FromQuery]string continuationToken)
        {
            var queryOptions = new FeedOptions { MaxItemCount = 20 };
            if (!string.IsNullOrWhiteSpace(continuationToken))
            {
                queryOptions.RequestContinuation = continuationToken;
            }

            var scoresSqlQuery = new SqlQuerySpec("SELECT * FROM score");

            if (!string.IsNullOrWhiteSpace(tableTypeId))
            {
                scoresSqlQuery.Parameters.Add(new SqlParameter("@tableTypeId", tableTypeId));
                scoresSqlQuery = new SqlQuerySpec(scoresSqlQuery.QueryText += " WHERE score.tableTypeId = @tableTypeId", scoresSqlQuery.Parameters);
                //scoresDocumentQuery = scoresQuery.Where(score => score.TableTypeId == tableTypeId).AsDocumentQuery();

                if (!string.IsNullOrEmpty(userId))
                {
                    scoresSqlQuery.Parameters.Add(new SqlParameter("@userId", userId));
                    scoresSqlQuery = new SqlQuerySpec(scoresSqlQuery.QueryText += " AND score.userId = @userId", scoresSqlQuery.Parameters);
                    //scoresDocumentQuery = scoresQuery.Where(score => score.UserId == userId).AsDocumentQuery();
                }
            }
            else if (!string.IsNullOrEmpty(userId))
            {
                scoresSqlQuery.Parameters.Add(new SqlParameter("@userId", userId));
                scoresSqlQuery = new SqlQuerySpec(scoresSqlQuery.QueryText += " WHERE score.userId = @userId", scoresSqlQuery.Parameters);
                //scoresDocumentQuery = scoresQuery.Where(score => score.UserId == userId).AsDocumentQuery();
            }

            if (orderByDuration == true)
            {
                scoresSqlQuery = new SqlQuerySpec(scoresSqlQuery.QueryText += " ORDER BY score.durationMilliseconds ASC", scoresSqlQuery.Parameters);
            }
            else
            {
                scoresSqlQuery = new SqlQuerySpec(scoresSqlQuery.QueryText += " ORDER BY score._ts DESC", scoresSqlQuery.Parameters);
            }

            var scoresQuery = documentClient.CreateDocumentQuery<Documents.Score>(UriFactory.CreateDocumentCollectionUri(documentDbOptions.DatabaseName, documentDbOptions.ScoresCollectionName), scoresSqlQuery, queryOptions);
            var scoresDocumentQuery = scoresQuery.AsDocumentQuery();
            var scoresPage = await scoresDocumentQuery.ExecuteNextAsync<DomainModels.Score>();
            var scores = scoresPage.ToList();

            var authenticationResult = await authenticationContext.AcquireTokenAsync("https://graph.windows.net", clientCredential);

            var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, $"https://graph.windows.net/{aadB2cApplicationOptions.Tenant}/getObjectsByObjectIds?api-version=1.6");
            httpRequestMessage.Headers.Authorization = new AuthenticationHeaderValue(authenticationResult.AccessTokenType, authenticationResult.AccessToken);

            var objectIdsBody = new ObjectIdsBody
            {
                ObjectIds = scores.Select(s => s.UserId).ToList(),
                Types = new List<string> { "user" }
            };
            var stringContent = new StringContent(JsonConvert.SerializeObject(objectIdsBody), Encoding.UTF8, "application/json");
            httpRequestMessage.Content = stringContent;

            var httpClient = new HttpClient();
            var response = await httpClient.SendAsync(httpRequestMessage);
            var graphApiUsers = JsonConvert.DeserializeObject<OdataResponse<IList<GraphApiUser>>>(await response.Content.ReadAsStringAsync());
            var users = (graphApiUsers.Value != null) ? graphApiUsers.Value.Select(x => x.ToUser()).ToList() : new List<DomainModels.User>();

            var scoresWithUsers = new ScoresWithUsers
            {
                ContinuationToken = scoresDocumentQuery.HasMoreResults ? scoresPage.ResponseContinuation : null,
                Scores = scores,
                Users = users
            };

            return Ok(scoresWithUsers);
        }

        // GET: api/scores/5
        [HttpGet("{id}", Name = "GetScore")]
        public async Task<IActionResult> Get(string id)
        {
            Documents.Score score;
            Documents.TableLayout tableLayout;
            Documents.TableType tableType;

            try
            {
                score = await documentClient.ReadDocumentAsync<Documents.Score>(UriFactory.CreateDocumentUri(documentDbOptions.DatabaseName, documentDbOptions.ScoresCollectionName, id));
            }
            catch (DocumentClientException)
            {
                return NotFound($"Score with id {id} was not found");
            }

            try
            {
                tableLayout = await documentClient.ReadDocumentAsync<Documents.TableLayout>(UriFactory.CreateDocumentUri(documentDbOptions.DatabaseName, documentDbOptions.TableLayoutsCollectionName, score.TableLayoutId));
            }
            catch (DocumentClientException)
            {
                return NotFound($"Table Layout with id {score.TableLayoutId} was not found");
            }

            try
            {
                tableType = await documentClient.ReadDocumentAsync<Documents.TableType>(UriFactory.CreateDocumentUri(documentDbOptions.DatabaseName, documentDbOptions.TableTypesCollectionName, score.TableTypeId));
            }
            catch (DocumentClientException)
            {
                return NotFound($"Table Type with id {score.TableTypeId} was not found");
            }

            var scoreDetails = new ScoreDetails
            {
                Id = score.Id,
                StartTime = score.StartTime,
                EndTime = score.EndTime,
                Sequence = score.Sequence,
                TableLayout = tableLayout,
                TableType = tableType
            };

            return Ok(scoreDetails);
        }

        // GET: api/scores/start
        [HttpGet("start")]
        public IActionResult Start()
        {
            var timeByteArray = Encoding.UTF8.GetBytes(DateTimeOffset.UtcNow.ToString());
            var signedTime = dataProtector.Protect(timeByteArray);
            var base64time = Convert.ToBase64String(signedTime);

            return Ok(new { Value = base64time });
        }

        // POST: api/scores
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ScoreInput scoreInput)
        {
            var now = DateTimeOffset.UtcNow;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Save user id from Object Id ("oid") claim onto model
            var userId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            scoreInput.UserId = userId;


            var signedStartTime = Convert.FromBase64String(scoreInput.SignedStartTime);
            var unsigngedStartTime = dataProtector.Unprotect(signedStartTime);
            var startTime = DateTimeOffset.Parse(Encoding.UTF8.GetString(unsigngedStartTime));

            // Time data is not value log warning with user token for review later.
            var isTimeDataValid = IsTimeDataValid(
                startTime,
                now,
                scoreInput,
                TimeSpan.FromSeconds(10)
                );

            if (!isTimeDataValid)
            {
                return StatusCode((int)HttpStatusCode.Unauthorized, $"You have been logged for attempted cheating.  Your account will be reviewed and may be deleted.");
            }

            var tableLayout = new TableLayout()
            {
                Width = scoreInput.TableWidth,
                Height = scoreInput.TableHeight,
                ExpectedSequence = scoreInput.ExpectedSequence,
                RandomizedSequence = scoreInput.RandomizedSequence
            };

            var tableLayoutString = JsonConvert.SerializeObject(tableLayout);

            var tableType = new TableType()
            {
                Width = scoreInput.TableWidth,
                Height = scoreInput.TableHeight,
                Properties = scoreInput.TableProperties.OrderBy(p => p.Key).ToList()
            };

            var tableTypeString = JsonConvert.SerializeObject(tableType);

            using (var hashAlgorithm = SHA256.Create())
            {
                var tableLayoutHash = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(tableLayoutString));
                tableLayout.Id = Convert.ToBase64String(tableLayoutHash).Replace('/', '_');

                var tableTypeHash = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(tableTypeString));
                tableType.Id = Convert.ToBase64String(tableTypeHash).Replace('/', '_');
            }

            var scoreDocument = new Documents.Score()
            {
                Sequence = scoreInput.UserSequence,
                TableLayoutId = tableLayout.Id,
                TableTypeId = tableType.Id,
                StartTime = scoreInput.StartTime,
                EndTime = scoreInput.EndTime,
                Duration = scoreInput.EndTime - scoreInput.StartTime,
                DurationMilliseconds = (scoreInput.EndTime - scoreInput.StartTime).TotalMilliseconds,
                UserId = scoreInput.UserId
            };

            var newTableLayout = await documentClient.UpsertDocumentAsync(UriFactory.CreateDocumentCollectionUri(documentDbOptions.DatabaseName, documentDbOptions.TableLayoutsCollectionName), tableLayout);
            var newTableType = await documentClient.UpsertDocumentAsync(UriFactory.CreateDocumentCollectionUri(documentDbOptions.DatabaseName, documentDbOptions.TableTypesCollectionName), tableType);
            var newScoreDocument = await documentClient.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri(documentDbOptions.DatabaseName, documentDbOptions.ScoresCollectionName), scoreDocument);
            var createdUrl = Url.RouteUrl("GetScore", new { id = newScoreDocument.Resource.Id });

            var newScore = new DomainModels.Score()
            {
                Id = newScoreDocument.Resource.Id,
                DurationMilliseconds = scoreDocument.DurationMilliseconds,
                EndTime = scoreDocument.EndTime,
                StartTime = scoreDocument.StartTime,
                UserId = scoreDocument.UserId
            };

            return Created(createdUrl, newScore);
        }

        private bool IsTimeDataValid(
            DateTimeOffset serverStartTime,
            DateTimeOffset serverEndTime,
            ScoreInput scoreInput,
            TimeSpan maxTimeSpan
            )
        {
            if (scoreInput.EndTime < scoreInput.StartTime)
                return false;

            var startTimeSkew = serverStartTime - scoreInput.StartTime;
            if (startTimeSkew.Duration() > maxTimeSpan)
                return false;

            var endTimeSkew = serverEndTime - scoreInput.EndTime;
            if (endTimeSkew.Duration() > maxTimeSpan)
                return false;

            var durationDifference = (serverEndTime - serverStartTime) - (scoreInput.EndTime - scoreInput.StartTime);
            if (durationDifference.Duration() > maxTimeSpan)
                return false;

            var anyAnwsersOutsideOfSubmissionRange = scoreInput.UserSequence
                .Select(s => s.Time)
                .Any(time => (time < scoreInput.StartTime) || (time > scoreInput.EndTime));

            if (anyAnwsersOutsideOfSubmissionRange)
                return false;

            return true;
        }
    }
}
