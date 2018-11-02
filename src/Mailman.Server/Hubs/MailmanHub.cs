using Mailman.Services;
using Mailman.Services.Data;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Server.Hubs
{
    public class MailmanHub : Hub
    {
        public async Task StartMailMerge(MergeTemplate template,
            CancellationToken cancellationToken = default(CancellationToken))
        {

        }
    }
}
