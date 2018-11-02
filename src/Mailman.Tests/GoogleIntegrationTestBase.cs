using AutoMapper;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Http;
using Google.Apis.Sheets.v4;
using Mailman.Server.Models.MappingProfiles;
using Mailman.Services;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Mailman.Tests
{
    public class GoogleIntegrationTestBase
    {
        protected readonly string TEST_SHEET_ID;

        public GoogleIntegrationTestBase()
        {
            TEST_SHEET_ID = Environment.GetEnvironmentVariable("GOOGLE_TEST_SHEET");
            if (string.IsNullOrWhiteSpace(TEST_SHEET_ID))
            {
                // this is a test sheet with public access in the edmonton.ca domain
                TEST_SHEET_ID = "1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY";
            }
        }

        protected virtual IServiceCollection AddBasicServices(IServiceCollection collection)
        {
            collection.AddSingleton<ILogger>(x => Log.Logger)
                .AddMailmanServices(null, googleCredentials: GetGoogleCredential())
                //.AddAutoMapper();
                .AddScoped<IMapper>(s => {
                    var config = (Action<IMapperConfigurationExpression>)(cfg => cfg.AddProfile(new MergeTemplateProfile()));
                    Mapper.Initialize(config);
                    return new Mapper(new MapperConfiguration(config));
                });

            return collection;
        }

        private IConfigurableHttpClientInitializer _googleCredential;
        protected IConfigurableHttpClientInitializer GetGoogleCredential()
        {
            if (_googleCredential == null)
            {
                // Our build server downloads this secure file to this location
                string credFilePath = Environment.GetEnvironmentVariable("DOWNLOADSECUREFILE_SECUREFILEPATH");

                // you can also drop a .json service credential file into the tests directory (it is .gitignored)
                if (string.IsNullOrWhiteSpace(credFilePath))
                    credFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Mailman-service-account.json");

                if (string.IsNullOrWhiteSpace(credFilePath))
                    throw new InvalidOperationException("A service credential must be specified by placing a file named 'Mailman-service-account.json' in the tests directory");

                if (File.Exists(credFilePath))
                {
                    try
                    {
                        dynamic serviceAccount = JObject.Parse(File.ReadAllText(credFilePath));

                        string clientEmail = serviceAccount.client_email;
                        string privateKey = serviceAccount.private_key;
                        _googleCredential = new ServiceAccountCredential(new ServiceAccountCredential.Initializer(clientEmail)
                        {
                            Scopes = GetCredentialScopes()
                        }.FromPrivateKey(privateKey));
                    }
                    catch (Exception err)
                    {
                        throw new InvalidOperationException("A valid service credential must be specified (file specified but couldn't read json file correctly): " + err.Message, err);
                    }
                }

            }

            return _googleCredential;
        }


        protected virtual string[] GetCredentialScopes()
        {
            return new[] {
                SheetsService.Scope.Spreadsheets
            };
        }
    }
}
