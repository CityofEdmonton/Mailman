using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Security
{
    internal class GoogleUserInfo
    {
        [JsonProperty("sub")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string DisplayName { get; set; }

        [JsonProperty("given_name")]
        public string GivenName { get; set; }

        [JsonProperty("family_name")]
        public string FamilyName { get; set; }

        [JsonProperty("picture")]
        public string PictureUrl { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }
}
