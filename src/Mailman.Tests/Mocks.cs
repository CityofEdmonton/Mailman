using Mailman.Services;
using Mailman.Services.Data;
using Mailman.Services.Google;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    public static class Mocks
    {
        private static ISheetsService _sheetsService;
        public static ISheetsService SheetsService
        {
            get
            {
                if (_sheetsService == null)
                {
                    _sheetsService = new MockSheetService();
                    //var mockSheetsService = new Mock<ISheetsService>();
                    //mockSheetsService.Setup(x => x.GetValuesAsync(
                    //        It.Is<string>(s => s.Equals(Spreadsheet1Id, StringComparison.OrdinalIgnoreCase)),
                    //        It.Is<string>(s => s.Equals(
                    //            string.Concat("mm-config!", Services.MergeTemplateRepository.MM_CONFIG_ENTIRE_SHEET_RANGE),
                    //            StringComparison.OrdinalIgnoreCase))))
                    //    .Returns<string, string>((sheetId, range) => Task.FromResult(MockMMConfigData));

                    //mockSheetsService.Setup(x => x.GetValuesAsync(
                    //        It.Is<string>(s => s.Equals(SpreadsheetWithBadValues, StringComparison.OrdinalIgnoreCase)),
                    //        It.Is<string>(s => s.Equals(
                    //            string.Concat("mm-config!", Services.MergeTemplateRepository.MM_CONFIG_ENTIRE_SHEET_RANGE),
                    //            StringComparison.OrdinalIgnoreCase))))
                    //    .Returns<string, string>((sheetId, range) => Task.FromResult(MockMMConfigWithBadData));

                    //mockSheetsService.Setup(x => x.GetDataRangeAsync(
                    //    It.Is<string>(s => s.Equals(Spreadsheet1Id, StringComparison.OrdinalIgnoreCase)),
                    //    It.Is<string>(s => s == "Data")))
                    //    .Returns<string, string>((sheetId, sheetName) => Task.FromResult(new A1Notation("Data!A1:F6")));

                    //mockSheetsService.Setup(x => x.GetValuesAsync(
                    //        It.Is<string>(s => s.Equals(Spreadsheet1Id, StringComparison.OrdinalIgnoreCase)),
                    //        It.Is<string>(s => s == "Data")))
                    //    .Returns<string, string>((sheetId, range) => Task.FromResult(MockSheetData));

                    //_sheetsService = mockSheetsService.Object;
                }
                return _sheetsService;
            }
        }

        private static IMergeTemplateRepository _mergeTemplateRepository;
        public static IMergeTemplateRepository MergeTemplateRepository
        {
            get
            {
                if (_mergeTemplateRepository == null)
                {
                    var mockRepository = new Mock<IMergeTemplateRepository>();
                    var template1 = MergeTemplate.CreateFrom(Template1Id, Spreadsheet1Id, SAMPLE_MM_JSON);
                    var template2 = MergeTemplate.CreateFrom(Template2Id, Spreadsheet1Id, SAMPLE_MM_JSON);
                    mockRepository.Setup(x => x.GetMergeTemplatesAsync(
                        It.Is<string>(s => s.Equals(Spreadsheet1Id, StringComparison.OrdinalIgnoreCase)),
                        It.IsAny<CancellationToken>()))
                        .Returns<string, CancellationToken>((sheetId, ct) => Task.FromResult(
                            (IEnumerable<MergeTemplate>)(new List<MergeTemplate>() { template1, template2 })
                        ));
                    _mergeTemplateRepository = mockRepository.Object;
                }
                return _mergeTemplateRepository;
            }
        }

        private static MockEmailService _emailService;
        public static MockEmailService EmailService
        {
            get
            {
                if (_emailService == null)
                {
                    _emailService = new MockEmailService();
                }
                return _emailService;
            }
        }

        internal const string Spreadsheet1Id = "MockSpreadSheet1";
        internal const string SpreadsheetWithBadValues = "MockSpreadSheetWithBadValues";
        internal const string Template1Id = "TemplateId1";
        internal const string Template2Id = "TemplateId2";
        internal const string SAMPLE_MM_JSON = @"{  
   ""mergeData"":{  
      ""type"":""Email"",
      ""data"":{
         ""to"":""<<Email>>"",
         ""cc"":null,
         ""bcc"":null,
         ""subject"":""Hello <<Name>>!"",
         ""body"":""<p>This is a test email to &lt;&lt;Name&gt;&gt;.</p>\n<p>&nbsp;</p>\n<p>Here are some notes: &lt;&lt;Notes&gt;&gt;</p>""
      },
      ""title"":""test2"",
      ""sheet"":""Data"",
      ""headerRow"":""1"",
      ""timestampColumn"":""<<Mailman test2 Timestamp>>"",
      ""conditional"":""<<ShouldSend>>"",
      ""repeater"":""off"",
      ""usetitle"":true
   },
   ""createdBy"":""Unknown user"",
   ""createdDatetime"":""8/15/2018 9:24:11"",
   ""id"":""_lif0ru2r8"",
   ""version"":""1.2.3""
}";

    }
}
