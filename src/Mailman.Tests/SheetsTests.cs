using FluentAssertions;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Mailman.Server.Controllers;
using Mailman.Services;
using Mailman.Services.Google;
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
        public async Task ReadSheetNames()
        {
            var sheetsController = _serviceProvider.GetRequiredService<SheetsController>();
            var sheetNames = (await sheetsController.SheetNames(TEST_SHEET_ID)).ToList();
            sheetNames.Should().HaveCount(2);
            sheetNames.First().Should().Be("Data");
            sheetNames.ElementAt(1).Should().Be("Sheet5");
        }

        [TestCase]
        [IntegrationTest]
        public async Task ReadSheetWithDataPump()
        {
            var sheetsService = _serviceProvider.GetRequiredService<ISheetsService>();
            sheetsService.Should().BeAssignableTo<SheetsServiceImpl>();

            int counter = 0;
            await sheetsService.GetValuesAsDataPumpAsync(TEST_SHEET_ID, "Data", row =>
            {
                switch (counter++)
                {
                    case 0:
                        row[1].ToString().Should().Be("Name");
                        break;
                    case 1:
                        row[1].ToString().Should().Be("Dan");
                        break;
                    case 2:
                        row[1].ToString().Should().Be("Jared");
                        break;
                    case 3:
                        row[1].ToString().Should().Be("Gregory");
                        break;
                    case 4:
                        row[1].ToString().Should().Be("Stephen");
                        break;
                    case 5:
                        row[1].ToString().Should().Be("Dana");
                        break;
                    default:
                        break;
                }

                return Task.CompletedTask;
            });

            counter.Should().Be(6);
        }

        [TestCase]
        [IntegrationTest]
        public async Task ReadSheetWithDictionaryDataPump()
        {
            var sheetsService = _serviceProvider.GetRequiredService<ISheetsService>();
            sheetsService.Should().BeAssignableTo<SheetsServiceImpl>();

            int counter = 0;
            await sheetsService.GetValuesAsDictionaryDataPump(TEST_SHEET_ID, "Data", values =>
            {
                switch (counter++)
                {
                    case 0:
                        values["Name"].Should().Be("Dan");
                        break;
                    case 1:
                        values["Name"].Should().Be("Jared");
                        break;
                    case 2:
                        values["Name"].Should().Be("Gregory");
                        break;
                    case 3:
                        values["Name"].Should().Be("Stephen");
                        break;
                    case 4:
                        values["Name"].Should().Be("Dana");
                        break;
                    default:
                        break;
                }

                return Task.CompletedTask;
            });

            counter.Should().Be(5);
        }
    }
}
