namespace Mailman.Services.Security
{
    internal class JwtOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string AuthKey { get; set; }
    }
}