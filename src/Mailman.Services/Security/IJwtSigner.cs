using System.Collections.Generic;
using System.Security.Claims;

namespace Mailman.Services.Security
{
    public interface IJwtSigner
    {
        string CreateJwtToken(IEnumerable<Claim> claims);
    }
}