using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mailman.Services.Security
{
    // these classes should only be used for development
    internal class OAuthTokenContext : DbContext
    {
        public OAuthTokenContext(DbContextOptions<OAuthTokenContext> options) : base(options) { }

        public DbSet<TokenInfo> Tokens { get; set; }
    }

    internal class TokenInfo
    {
        [Key]
        [MaxLength(320)]
        public string Email { get; set; }
        [Required]
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpiryUtc{ get; set; }
    }

}
