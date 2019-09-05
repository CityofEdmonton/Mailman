using EnsureThat;
using Mailman.Server.Controllers;
using Mailman.Services;
using Mailman.Services.Data;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Server.Hubs
{
    /// <summary>
    /// SignalR hub for interacting with MailMan
    /// </summary>
    public class MailmanHub : Hub
    {
        /// <summary>
        /// Constructs a new instance of the MailmanHub
        /// </summary>
        /// <param name="mergeTemplatesController"></param>
        public MailmanHub(MergeTemplatesController mergeTemplatesController)
        {
            EnsureArg.IsNotNull(mergeTemplatesController);
            _mergeTemplatesController = mergeTemplatesController;
            _userIds = new Hashtable(20);
        }

        private readonly MergeTemplatesController _mergeTemplatesController;
        private static Hashtable _userIds;
        

        /// <summary>
        /// Starts running a new mail merge, and set up notifications for
        /// progress updates for the calling client.
        /// </summary>
        /// <param name="mergeTemplateId">The unique identifier of the Merge Template</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task StartMailMerge(string mergeTemplateId,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            await _mergeTemplatesController.StartMailMerge(
                new RunMailMergeOptions()
                {
                    MergeTemplateId = mergeTemplateId,
                    ConnectionId = Context.ConnectionId
                }, cancellationToken);
        }

        /// <summary>
        /// Registers a signed in user with a unique ID.
        /// </summary>
        /// <param name="id">The unique identifier of the Merge Template</param>
        /// <returns></returns>
        public String RegisterConnection()
        {
            if (!this.Context.User.Identity.IsAuthenticated) {
                return "Please log in.";
            }

            if(_userIds.ContainsKey(this.Context.UserIdentifier))
            {
                _userIds[this.Context.UserIdentifier] = Context.ConnectionId;
            }
            else
            {
              _userIds.Add(this.Context.UserIdentifier, Context.ConnectionId);
            }
            return "Success";
        }

        /// <summary>
        /// Gets the user's SignalR connection id.
        /// </summary>
        /// <returns>The connection id.</returns>
        public String GetConnectionId()
        {
          return Context.ConnectionId;
        }
    }
}
