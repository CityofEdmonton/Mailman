using FluentAssertions;
using Google.Apis.Sheets.v4;
using Mailman.Server.Controllers;
using Mailman.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
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
            string googleClientId = Environment.GetEnvironmentVariable("GOOGLE_SVC");
            TEST_SHEET_ID = Environment.GetEnvironmentVariable("GOOGLE_TEST_SHEET");
            var credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromJson(googleClientId);
            
            var serviceInitializer = new Google.Apis.Services.BaseClientService.Initializer()
            {
                HttpClientInitializer = credential
            };
            var sheetsService = Task.FromResult(new SheetsService(serviceInitializer));

            var sheetsServiceFactory = new Mock<ISheetsServiceFactory>();
            sheetsServiceFactory.Setup(x => x.GetSheetsServiceAsync()).Returns(sheetsService);

            var services = new ServiceCollection()
                .AddScoped(x => sheetsServiceFactory.Object)
                .AddScoped<SheetsController>()
                .BuildServiceProvider();

            _sheetsController = services.GetRequiredService<SheetsController>();
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
