using Google.Apis.Sheets.v4;
using Mailman.Services.Google;
using Moq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    internal class MockSheetService : SheetsServiceImpl
    {
        public MockSheetService() : base(MockGoogleSheetsServiceAccessor, Log.Logger) { }

        private static IGoogleSheetsServiceAccessor MockGoogleSheetsServiceAccessor
        {
            get
            {
                return new MockGoogleSheetServiceAccessor();
            }
        }


        public override Task<IList<IList<object>>> GetValuesAsync(string spreadsheetId, string range)
        {
            if (spreadsheetId == Mocks.Spreadsheet1Id)
            {
                if (range.StartsWith("mm-config", StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult(MockMMConfigData);
                }
                else if (range.StartsWith("Data", StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult(MockSheetData);
                }

            }
            else if (spreadsheetId == Mocks.SpreadsheetWithBadValues)
            {
                if (range.StartsWith("mm-config", StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult(MockMMConfigWithBadData);
                }
            }

            return base.GetValuesAsync(spreadsheetId, range);
        }

        public override async Task GetValuesAsDataPumpAsync(string spreadsheetId, string range, Func<IList<object>, Task> dataPump)
        {
            var values = await GetValuesAsync(spreadsheetId, range);
            var taskPool = new List<Task>();
            foreach (var value in values)
            {
                taskPool.Add(dataPump(value));
            }
            await Task.WhenAll(taskPool);
        }

        public override Task<A1Notation> GetDataRangeAsync(string spreadsheetId, string sheetName)
        {
            if (spreadsheetId == Mocks.Spreadsheet1Id)
            {
                if (sheetName == "Data")
                {
                    return Task.FromResult(new A1Notation("Data!A1:F6"));
                }
            }

            return base.GetDataRangeAsync(spreadsheetId, sheetName);
        }

        private static IList<IList<object>> _mockMMConfigData;
        private static IList<IList<object>> MockMMConfigData
        {
            get
            {
                if (_mockMMConfigData == null)
                {
                    _mockMMConfigData = new List<IList<object>>()
                    {
                        new List<object> { "TemplateId1", Mocks.SAMPLE_MM_JSON },
                        new List<object> { "TemplateId2", Mocks.SAMPLE_MM_JSON }
                    };
                }
                return _mockMMConfigData;
            }
        }

        private static IList<IList<object>> _mockMMConfigWithBadData;
        private static IList<IList<object>> MockMMConfigWithBadData
        {
            get
            {
                if (_mockMMConfigWithBadData == null)
                {
                    _mockMMConfigWithBadData = new List<IList<object>>()
                    {
                        new List<object> { "TemplateId3", null },
                        new List<object> { "TemplateId4" },
                        new List<object> { }
                    };
                }
                return _mockMMConfigWithBadData;
            }
        }

        private static IList<IList<object>> _mockSheetData;
        private static IList<IList<object>> MockSheetData
        {
            get
            {
                if (_mockSheetData == null)
                {
                    _mockSheetData = new List<IList<object>>()
                    {
                        new List<object>() { "Email", "Name", "Notes", "Mailman Email Timestamp", "ShouldSend", "SomeUrl" },
                        new List<object>() { "noone@edmonton.ca", "Dan", "Hey there from mailman!", null, "TRUE", "http://www.google.com" },
                        new List<object>() { null, "Jared", null, null, "FALSE", "http://www.microsoft.com" },
                        new List<object>() { "nonexisty@edmonton.ca", "Gregory", "Some notes.", null, "TRUE", "http://www.google.com" },
                        new List<object>() { "bad.formed.email.address", "Stephen", null, null, "FALSE", "http://www.facebook.com" },
                        new List<object>() { null, "Dana", null, null, "FALSE", "http://www.edmonton.ca" },
                    };
                }
                return _mockSheetData;
            }
        }


        private class MockGoogleSheetServiceAccessor : IGoogleSheetsServiceAccessor
        {
            public Task<SheetsService> GetSheetsServiceAsync()
            {
                throw new NotSupportedException();
            }
        }

    }
}
