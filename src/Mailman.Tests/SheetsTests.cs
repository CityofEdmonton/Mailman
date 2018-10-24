using FluentAssertions;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Mailman.Server.Controllers;
using Mailman.Services;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using Serilog;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    [TestFixture]
    public class SheetsTests : GoogleIntegrationTestBase
    {
        public SheetsTests()
        {
            var serviceCollection = new ServiceCollection();
            _serviceProvider = AddBasicServices(serviceCollection)
                .AddScoped<SheetsController>()
                .BuildServiceProvider();
        }

        private readonly IServiceProvider _serviceProvider;

        [TestCase]
        [IntegrationTest]
        public async Task TestReadSheetNames()
        {
            var sheetsController = _serviceProvider.GetRequiredService<SheetsController>();
            var sheetNames = (await sheetsController.SheetNames(TEST_SHEET_ID)).ToList();
            sheetNames.Should().HaveCount(2);
            sheetNames.First().Should().Be("Data");
            sheetNames.ElementAt(1).Should().Be("Sheet5");
        }
    }
}
