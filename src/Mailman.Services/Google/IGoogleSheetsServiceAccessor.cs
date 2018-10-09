using Google.Apis.Sheets.v4;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    internal interface IGoogleSheetsServiceAccessor
    {
        Task<SheetsService> GetSheetsServiceAsync();
    }
}
