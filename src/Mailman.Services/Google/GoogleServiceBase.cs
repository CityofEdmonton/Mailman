using EnsureThat;
using Google.Apis.Sheets.v4;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal class GoogleServiceBase
    {
        private readonly IGoogleSheetsServiceAccessor _googleSheetsServiceAccessor;
        private readonly ILogger _logger;

        public GoogleServiceBase(IGoogleSheetsServiceAccessor googleSheetsServiceAccessor,
            ILogger logger)
        {
            EnsureArg.IsNotNull(googleSheetsServiceAccessor);
            EnsureArg.IsNotNull(logger);
            _googleSheetsServiceAccessor = googleSheetsServiceAccessor;
            _logger = logger;
        }

        protected Task<SheetsService> GetSheetsServiceAsync()
        {
            return _googleSheetsServiceAccessor.GetSheetsServiceAsync();
        }
    }
}
