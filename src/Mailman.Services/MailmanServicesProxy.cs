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
using Wyrm.RabbitMq.Extentions.DependencyInjection;

namespace Mailman.Services
{
  internal class MailmanServicesProxy : IMailmanServicesProxy
  {
    public MailmanServicesProxy(IOptions<MailmanServicesProxyOptions> options,
        IHttpContextAccessor httpContextAccessor,
        IQueueService queueService,
        ILogger logger)
    {
      EnsureArg.IsNotNull(options);
      EnsureArg.IsNotNull(httpContextAccessor);
      EnsureArg.IsNotNull(queueService);
      EnsureArg.IsNotNull(logger);

      _httpContextAccessor = httpContextAccessor;
      _queueService = queueService;
      _logger = logger;
      _options = options.Value;
      EnsureArg.IsNotNullOrWhiteSpace(_options.AuthKey);

      // set the JWT signing credentials for outgoing requests
      var serverAuthKey = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(
              _options.AuthKey));
      var serverCredentials = new SigningCredentials(serverAuthKey,
          SecurityAlgorithms.HmacSha256Signature);
      _serverJwtHeader = new JwtHeader(serverCredentials);

      // ensure rabbitmq queues exist
      _queueService.EnsureQueue(START_MERGE_QUEUE_NAME);
      _queueService.EnsureQueue(PROGRESS_COMPLETED_QUEUE_NAME);
      _queueService.EnsureQueue(PROGRESS_NOTIFICATION_QUEUE_NAME);
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
    private readonly IQueueService _queueService;
    private readonly ILogger _logger;
    //private readonly Uri _workerBaseUrl;
    private const string RUN_MAIL_MERGE_SCOPE = "http://mailman.edmonton.ca/mailmerge/run";
    private const string NOTIFICATION_SCOPE = "http://mailman.edmonton.ca/mailmerge/notification";
    private const string START_MERGE_QUEUE_NAME = "mailman.mergetemplate.start";
    private const string PROGRESS_COMPLETED_QUEUE_NAME = "mailman.mergetemplate.progress.completed";
    private const string PROGRESS_NOTIFICATION_QUEUE_NAME = "mailman.mergetemplate.progress.notification";

    public void StartMailMerge(RunMailMergeOptions options)
    {
      if (options == null)
        throw new ArgumentNullException(nameof(options));
      if (string.IsNullOrWhiteSpace(options.MergeTemplateId))
        throw new ArgumentNullException("options.MergeTemplateId", "MergeTempalteId cannot be null or empty");

      _queueService.SendMessage(START_MERGE_QUEUE_NAME, options);
    }

    public void NotifyMailMergeCompleted(string mergeTemplateId, string connectionId, RunMergeTemplateProgress progressUpdated)
    {
      _queueService.SendMessage(PROGRESS_COMPLETED_QUEUE_NAME,
          new MailMergeProgress()
          {
            MergeTemplateId = mergeTemplateId,
            ConnectionId = connectionId,
            Progress = progressUpdated
          });
    }

    public void NotifyMailMergeUpdated(string mergeTemplateId, string connectionId, RunMergeTemplateProgress progressUpdated)
    {
      _queueService.SendMessage(PROGRESS_NOTIFICATION_QUEUE_NAME,
          new MailMergeProgress()
          {
            MergeTemplateId = mergeTemplateId,
            ConnectionId = connectionId,
            Progress = progressUpdated
          });
    }
  }
}
