using Google.Apis.Gmail.v1;
using Google.Apis.Sheets.v4;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal interface IGoogleServicesAccessor
    {
        Task<SheetsService> GetSheetsServiceAsync();
        Task<GmailService> GetGmailServiceAsync();
    }
}
