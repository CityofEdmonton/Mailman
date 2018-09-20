using FluentAssertions;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Mailman.Server.Controllers;
using Mailman.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    [TestFixture]
    public class SheetsTests
    {
        public SheetsTests()
        {
            TEST_SHEET_ID = Environment.GetEnvironmentVariable("GOOGLE_TEST_SHEET");
            if (string.IsNullOrWhiteSpace(TEST_SHEET_ID))
            {
                // this is a test sheet with public access in the edmonton.ca domain
                TEST_SHEET_ID = "1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY";
            }

            var services = new ServiceCollection()
                .AddScoped(x => SetupMockSheetsServiceFactory())
                .AddScoped<SheetsController>()
                .BuildServiceProvider();

            _sheetsController = services.GetRequiredService<SheetsController>();
        }

        private static ISheetsServiceFactory SetupMockSheetsServiceFactory()
        {
            var serviceInitializer = new Google.Apis.Services.BaseClientService.Initializer()
            {
                HttpClientInitializer = GetGoogleCredential()
            };
            var sheetsService = Task.FromResult(new SheetsService(serviceInitializer));

            var sheetsServiceFactory = new Mock<ISheetsServiceFactory>();
            sheetsServiceFactory.Setup(x => x.GetSheetsServiceAsync()).Returns(sheetsService);

            return sheetsServiceFactory.Object;
        }


        private static Google.Apis.Http.IConfigurableHttpClientInitializer _googleCredential;
        private static Google.Apis.Http.IConfigurableHttpClientInitializer GetGoogleCredential()
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

                if (!File.Exists(credFilePath))
                    throw new InvalidOperationException("A valid service credential must be specified (file specified but doesn't exist on disk): " + credFilePath);

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

            return _googleCredential;
        }


        private static string[] GetCredentialScopes()
        {
            return new[] {
                    SheetsService.Scope.Spreadsheets
                };
        }

        private readonly SheetsController _sheetsController;
        private readonly string TEST_SHEET_ID;

        [Test]
        public async Task TestReadSheetNames()
        {
            var sheetNames = (await _sheetsController.GetSheetNames(TEST_SHEET_ID)).ToList();
            sheetNames.Should().HaveCount(2);
            sheetNames.First().Should().Be("Data");
            sheetNames.ElementAt(1).Should().Be("Sheet5");
        }
    }
}
