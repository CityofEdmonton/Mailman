using EnsureThat;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    internal class MailmanServicesProxy : IMailmanServicesProxy
    {
        public MailmanServicesProxy(IOptions<MailmanServicesProxyOptions> options,
            IHttpContextAccessor httpContextAccessor,
            ILogger logger)
        {
            EnsureArg.IsNotNull(options);
            EnsureArg.IsNotNull(httpContextAccessor);
            EnsureArg.IsNotNull(logger);
            
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _options = options.Value;
            EnsureArg.IsNotNullOrWhiteSpace(_options.MailmanWorkerServerBaseUrl);
            EnsureArg.IsNotNullOrWhiteSpace(_options.AuthKey);

            // set the JWT signing credentials for outgoing requests
            var serverAuthKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _options.AuthKey));
            var serverCredentials = new SigningCredentials(serverAuthKey,
                SecurityAlgorithms.HmacSha256Signature);
            _serverJwtHeader = new JwtHeader(serverCredentials);
        }

        private async Task<string> CreateJwtToken(string issuer, string audience, params string[] scopes)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            string accessToken = await httpContext.GetTokenAsync("access_token");
            var payload = new JwtPayload(issuer, audience, new Claim[]
            {
                new Claim("access_token", accessToken)
            }, DateTime.Now, DateTime.Now.AddSeconds(30));

            if (scopes != null && scopes.Length > 0)
            {
                payload["scopes"] = string.Join(',', scopes);
            }

            var secToken = new JwtSecurityToken(_serverJwtHeader, payload);
            return _jwtSecurityTokenHandler.WriteToken(secToken);
        }

        private readonly MailmanServicesProxyOptions _options;
        private readonly JwtHeader _serverJwtHeader;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger _logger;
        //private readonly Uri _workerBaseUrl;
        private const string RUN_MAIL_MERGE_SCOPE = "http://mailman.edmonton.ca/mailmerge/run";
        private const string NOTIFICATION_SCOPE = "http://mailman.edmonton.ca/mailmerge/notification";

        protected virtual async Task WithWorker(string scope,
            Func<HttpClient, Task> callback)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(_options.MailmanWorkerServerBaseUrl);
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", 
                        await CreateJwtToken(
                            _options.MailmanServerBaseUrl, 
                            _options.MailmanWorkerServerBaseUrl, 
                            scope));
                await callback(httpClient);
            }
        }

        protected virtual async Task WithServer(string scope,
            Func<HttpClient, Task> callback)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(_options.MailmanServerBaseUrl);
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer",
                        await CreateJwtToken(
                            _options.MailmanWorkerServerBaseUrl,
                            _options.MailmanServerBaseUrl,
                            scope));
                await callback(httpClient);
            }

        }

        public async Task<RunMergeTemplateProgress> RunMailMergeAsync(RunMailMergeOptions options, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
                throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

            RunMergeTemplateProgress returnValue = null;
            await WithWorker(RUN_MAIL_MERGE_SCOPE, async httpClient =>
            {
                try
                {
                    var response = await httpClient.PostAsJsonAsync(
                        "api/MailMerge/run",
                        new RunMailMergeOptions()
                        {
                            MergeTemplateId = options.MergeTemplateId,
                            ConnectionId = options.ConnectionId
                        },
                        cancellationToken);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseString = await response.Content.ReadAsStringAsync();
                        returnValue = JsonConvert.DeserializeObject<RunMergeTemplateProgress>(responseString);
                    }
                    else
                    {
                        throw new InvalidOperationException($"Remote server did not return success ({response.StatusCode})");
                    }
                }
                catch (Exception err)
                {
                    _logger.Error(err, "Unable to communicate with worker process");
                    throw;
                }
            });

            return returnValue;
        }

        public async Task StartMailMergeAsync(RunMailMergeOptions options, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
                throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

            await WithWorker(RUN_MAIL_MERGE_SCOPE, httpClient =>
            {
                // start the task but don't wait for it to finish
                var task = httpClient.PostAsJsonAsync(
                    "api/MailMerge/run",
                    new RunMailMergeOptions()
                    {
                        MergeTemplateId = options.MergeTemplateId,
                        ConnectionId = options.ConnectionId
                    },
                    cancellationToken);
                task.Start();
                return Task.CompletedTask;
            });
        }

        public async Task NotifyMailMergeCompletedAsync(string mergeTemplateId, string connectionId, RunMergeTemplateProgress progressUpdated, CancellationToken cancellationToken = default(CancellationToken))
        {
            await WithServer(NOTIFICATION_SCOPE, async httpClient =>
            {
                await httpClient.PostAsJsonAsync(
                    "api/MergeTemplates/run/updated",
                    new MailMergeProgress()
                    {
                        MergeTemplateId = mergeTemplateId,
                        ConnectionId = connectionId,
                        Progress = progressUpdated
                    },
                    cancellationToken);
            });
        }

        public async Task NotifyMailMergeUpdatedAsync(string mergeTemplateId, string connectionId, RunMergeTemplateProgress progressUpdated, CancellationToken cancellationToken = default(CancellationToken))
        {
            await WithServer(NOTIFICATION_SCOPE, async httpClient =>
            {
                await httpClient.PostAsJsonAsync(
                    "api/MergeTemplates/run/updated",
                    new MailMergeProgress()
                    {
                        MergeTemplateId = mergeTemplateId,
                        ConnectionId = connectionId,
                        Progress = progressUpdated
                    },
                    cancellationToken);
            });
        }
    }
}
