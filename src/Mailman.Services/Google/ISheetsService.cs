using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services.Google
{
    // because of the Dependency Inversion Principle (https://en.wikipedia.org/wiki/Dependency_inversion_principle)
    // we decouple Google services from our application and provide this abstraction
    public interface ISheetsService
    {
        Task<IEnumerable<string>> GetSheetNames(string sheetId, bool includeHidden = false);
    }
}
