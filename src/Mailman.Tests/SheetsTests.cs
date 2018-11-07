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

        [TestCase("My Sheet!A1:Z100", "My Sheet!A1:Z100", "My Sheet", "A", 1, "Z", 100)]
        [TestCase("Another Sheet!A2:E", "Another Sheet!A2:E", "Another Sheet", "A", 2, "E", null)]
        [TestCase("Yet Another Sheet!A", "Yet Another Sheet!A:A", "Yet Another Sheet", "A", null, "A", null)]
        [TestCase("Yet Another Sheet2!7", "Yet Another Sheet2!7:7", "Yet Another Sheet2", "", 7, "", 7)]
        [TestCase("Yet Another Sheet3", "Yet Another Sheet3", "Yet Another Sheet3", "", null, "", null)]
        [TestCase("B2:AB4", "B2:AB4", "", "B", 2, "AB", 4)]
        [TestCase("BC:BC", "BC:BC", "", "BC", null, "BC", null)]
        [TestCase("9:9", "9:9", "", "", 9, "", 9)]
        [TestCase("", "", "", "", null, "", null)]
        public void A1NotationRange(string range, 
            string expectedParsedRange,
            string expectedSheetName,
            string expectedStartColumn,
            int? expectedStartRow,
            string expectedEndColumn,
            int? expectedEndRow)
        {
            var a1 = new A1Notation(range);
            a1.SheetName.Should().Be(expectedSheetName);
            a1.StartColumn.Should().Be(expectedStartColumn);
            a1.EndColumn.Should().Be(expectedEndColumn);
            a1.EndRow.Should().Be(expectedEndRow);
            a1.ToString().Should().Be(expectedParsedRange);
        }

        [TestCase("A", 1)]
        [TestCase("B", 2)]
        [TestCase("Z", 26)]
        [TestCase("AA", 27)]
        [TestCase("AZ", 52)]
        [TestCase("BA", 53)]
        [TestCase("BZ", 78)]
        [TestCase("AAA", 703)]
        [TestCase("AAZ", 728)]
        public void A1ColumnIndex(string columnReference, int expectedIndex)
        {
            A1Notation.GetColumnReferenceIndex(columnReference)
                .Should().Be(expectedIndex);
        }
        [TestCase(1, "A")]
        [TestCase(2, "B")]
        [TestCase(26, "Z")]
        [TestCase(27, "AA")]
        [TestCase(52, "AZ")]
        [TestCase(53, "BA")]
        [TestCase(78, "BZ")]
        [TestCase(703, "AAA")]
        [TestCase(728, "AAZ")]
        public void A1ColumnReferenceFromIndex(int index, string expectedColumnReference)
        {
            A1Notation.GetColumnReferenceFromIndex(index)
                .Should().Be(expectedColumnReference);
        }

        [TestCase("My Sheet", "A", 1, "Z", 1000, "My Sheet!A1:Z1000")]
        [TestCase("My Sheet", "A", 13, "BC", 100, "My Sheet!A13:BC100")]
        [TestCase(null, "A", 1, "Z", 1000, "A1:Z1000")]
        [TestCase("", "B", 2, "C", 4, "B2:C4")]
        [TestCase("My Sheet", "A", 13, "", null, "My Sheet!A13")]
        [TestCase("My Sheet", "A", 13, "B", null, "My Sheet!A13:B")]
        [TestCase(null, "A", 13, "B", null, "A13:B")]
        public void A1NotationParts(string sheetName,
            string startColumn,
            int? startRow,
            string endColumn,
            int? endRow,
            string expectedA1Notation)
        {
            var a1 = new A1Notation(sheetName, 
                startColumn, startRow, endColumn, endRow);
            a1.ToString().Should().Be(expectedA1Notation);
        }

        [TestCase("Sheet1!B2:A1", "The end of the range is before start of range")]
        [TestCase("Sheet1!AA1:Z2", "The column at the end of the range is before the column at the start of the range")]
        [TestCase("Sheet1!BC:Z", "The column at the end of the range is before the column at the start of the range")]
        [TestCase("Sheet1!A100:Z9", "The row at the end of the range is before the row at the start of the range")]
        [TestCase("Sheet1!200:3", "The row at the end of the range is before the row at the start of the range")]
        public void InvalidA1Throws(string range, string expectedMessage)
        {
            Action action = () => new A1Notation(range);
            action.Should().Throw<ArgumentException>().WithMessage(expectedMessage);
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
