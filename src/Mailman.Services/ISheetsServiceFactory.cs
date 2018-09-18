using Google.Apis.Sheets.v4;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public interface ISheetsServiceFactory
    {
        Task<SheetsService> GetSheetsServiceAsync();
    }
}
