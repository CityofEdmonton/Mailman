using Microsoft.AspNetCore.Authentication;
using System.Threading.Tasks;

namespace Mailman.Services.Security
{
    internal interface IGoogleOAuthTokenService
    {
        Task UpdateOAuthTokens(AuthenticateResult auth);
    }
}
