using FluentAssertions;
using Mailman.Services.Data;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateTests
    {
        // I don't think we need a Mock Repository for these tests, but it took me a little while to set this up
        // so I'll leaving it it for now in case I need it again -DC

        //private readonly IMergeTemplateRepository _mergeTemplateRepository;
        //public MergeTemplateTests()
        //{
        //    var repo = new Mock<IMergeTemplateRepository>();
        //    repo.Setup(x => x.AddMergeTemplateAsync(It.IsAny<MergeTemplate>(), default(CancellationToken)))
        //        .Returns<MergeTemplate, CancellationToken>((mt, token) => Task.FromResult(mt));
        //    _mergeTemplateRepository = repo.Object;
        //}

        [TestCase(null, null, null)]
        [TestCase("", null, null)]
        [TestCase(null, "", null)]
        [TestCase("", "", null)]
        [TestCase(null, "something", null)]
        [TestCase("", "something", null)]
        [TestCase("something", null, null)]
        [TestCase("something", "", null)]
        [TestCase("something", "someId", null)]
        [TestCase(null, null, "")]
        [TestCase("", null, "")]
        [TestCase(null, "", "")]
        [TestCase("", "", "")]
        [TestCase(null, "someId", "")]
        [TestCase("", "someId", "")]
        [TestCase("someId", null, "")]
        [TestCase("someId", "", "")]
        [TestCase(null, null, "someone")]
        [TestCase("", null, "someone")]
        [TestCase(null, "", "someone")]
        [TestCase("", "", "someone")]
        [TestCase(null, "someId", "someone")]
        [TestCase("", "someId", "someone")]
        [TestCase("someId", null, "someone")]
        [TestCase("someId", "", "someone")]
        public void CreateEmptyMergeTemplateThrows(string name, string spreadsheetId, string createdBy)
        {
            DateTime now = DateTime.UtcNow;
            Action action = () => new EmailMergeTemplate() {SheetName = name, SpreadSheetId = spreadsheetId, CreatedBy = createdBy, CreatedDateUtc = now};
            action.Should().Throw<ArgumentNullException>();
        }


        [TestCase("MergeTemplate1", "SpreadSheetId", "Snow.White@edmonton.ca")]
        [TestCase("MergeTemplate - example of a name of a merge template", "askdjaskldj-3423-sdfksfjnsdf=-dfkljsdf", "Snow.White@edmonton.ca")]
        public void CreateMergeTemplate(string name, string spreadsheetId, string createdBy)
        {
            new EmailMergeTemplate() {SheetName = name, SpreadSheetId = spreadsheetId, CreatedBy = createdBy, CreatedDateUtc = DateTime.UtcNow}.Should().NotBeNull();
        }

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
      ""conditional"":null,
      ""repeater"":""off"",
      ""usetitle"":true
   },
   ""createdBy"":""Unknown user"",
   ""createdDatetime"":""8/15/2018 9:24:11"",
   ""id"":""_lif0ru2r8"",
   ""version"":""1.2.3""
}";

        [TestCase]
        public void CreateMergeTemplateWithInvalidDateThrows()
        {
            Action action = () => new EmailMergeTemplate() {SheetName = "Test Merge Template", SpreadSheetId = "Id123", CreatedBy = "someone", DateTime.MinValue};
            action.Should().Throw<ArgumentOutOfRangeException>();

            Action action2 = () => new EmailMergeTemplate() {SheetName = "Test Merge Template", SpreadSheetId = "Id123", CreatedBy = "someone",  DateTime.UtcNow.AddHours(1)};
            action2.Should().Throw<ArgumentOutOfRangeException>();
        }

        [TestCase(true)]
        [TestCase(false)]
        public void CreateMergeTemplateFromSerializedData(bool timeStampShouldPrefixNameWithMergeTemplateTitle)
        {
            dynamic templateJsonObject = JObject.Parse(SAMPLE_MM_JSON);

            // set "usetitle" as per the timeStampShouldPrefixNameWithMergeTemplateTitle parameter
            templateJsonObject.mergeData.usetitle = timeStampShouldPrefixNameWithMergeTemplateTitle ? "true" : "false";
            string templateJson = templateJsonObject.ToString();

            var template = MergeTemplate.CreateFrom("Id1", "SheetId", templateJson);
            ValidateTemplateFromJson(template, templateJson);
            template.SpreadSheetId.Should().Be("SheetId");
        }

        [TestCase]
        public void CreateMergeTempalteFromSerializedDataWithInvalidTypeThrows()
        {
            dynamic templateJsonObject = JObject.Parse(SAMPLE_MM_JSON);
            templateJsonObject.mergeData.type = "badType";
            string templateJson = templateJsonObject.ToString();

            Action action = () => MergeTemplate.CreateFrom("Id1", "SheetId", templateJson);
            action.Should().Throw<InvalidOperationException>();
        }



        [TestCase]
        public void CreateMergeTemplateFromSerializedDataWithoutUser()
        {
            var template = MergeTemplate.CreateFrom("Id1", "SheetId", SAMPLE_MM_JSON);
            template.Should().NotBeNull();
            template.CreatedBy.Should().Be("Unknown user");

            dynamic templateJsonObject = JObject.Parse(SAMPLE_MM_JSON);
            templateJsonObject.createdBy = null;
            string templateJson = templateJsonObject.ToString();

            template = MergeTemplate.CreateFrom("Id1", "SheetId", templateJson);
            template.Should().NotBeNull();
            template.CreatedBy.Should().Be("Unknown user");
        }

        [TestCase]
        public void CreateMergeTemplateFromSerializedDataWithBadHeaderRowNumber()
        {
            dynamic templateJsonObject = JObject.Parse(SAMPLE_MM_JSON);
            templateJsonObject.mergeData.headerRow = "NotANumber";
            string templateJson = templateJsonObject.ToString();

            var template = MergeTemplate.CreateFrom("Id1", "SheetId", templateJson);
            template.HeaderRowNumber.Should().Be(1);
        }

        [TestCase]
        public void CreateMergeTemplateFromSerializedDataWithWithoutCreatedDate()
        {
            dynamic templateJsonObject = JObject.Parse(SAMPLE_MM_JSON);
            templateJsonObject.createdDatetime = null;
            string templateJson = templateJsonObject.ToString();

            DateTime utcMin = DateTime.UtcNow;
            var template = MergeTemplate.CreateFrom("Id1", "SheetId", templateJson);
            DateTime utcMax = DateTime.UtcNow;
            template.CreatedDateUtc.Should().BeOnOrAfter(utcMin).And.BeOnOrBefore(utcMax);
        }


        [TestCase]
        public void SetMergeTemplateTitle()
        {
            var template = EmailMergeTemplate.CreateFrom("Id1", "SheetId", SAMPLE_MM_JSON);
            template.Should().NotBeNull();
            template.Title = "New Title";
        }


        protected void ValidateTemplateFromJson(MergeTemplate template, string templateJson)
        {
            template.Should().NotBeNull();

            dynamic templateJsonObject = JObject.Parse(templateJson);
            string expectedTitle = templateJsonObject.mergeData.title;
            string expectedCreatedBy = templateJsonObject.createdBy;
            DateTime expectedCreatedDate = templateJsonObject.createdDatetime;
            expectedCreatedDate = expectedCreatedDate.ToUniversalTime();
            int expectedHeaderRowNumber = templateJsonObject.mergeData.headerRow;
            string expectedSheetname = templateJsonObject.mergeData.sheet;
            string expectedTimestampColumn = templateJsonObject.mergeData.timestampColumn;
            bool expectedShouldPrefixNameWithMergeTemplateTitle = templateJsonObject.mergeData.usetitle;

            template.Title.Should().Be(expectedTitle);
            template.CreatedBy.Should().Be(expectedCreatedBy);
            template.CreatedDateUtc.Should().Be(expectedCreatedDate);

            template.HeaderRowNumber.Should().Be(expectedHeaderRowNumber);
            template.SheetName.Should().Be(expectedSheetname);
            template.TimestampColumn.Should().NotBeNull();
            template.TimestampColumn.Name.Should().Be(expectedTimestampColumn);

            // validation if the mergeTemplate is of type "Email"
            var emailMergeTemplate = template as EmailMergeTemplate;
            if (emailMergeTemplate != null)
            {
                template.Type.Should().Be(MergeTemplateType.Email);

                string expectedTo = templateJsonObject.mergeData.data.to;
                string expectedCc = templateJsonObject.mergeData.data.cc;
                string expectedBcc = templateJsonObject.mergeData.data.bcc;
                string expectedSubject = templateJsonObject.mergeData.data.subject;
                string expectedBody = templateJsonObject.mergeData.data.body;

                emailMergeTemplate.EmailTemplate.Should().NotBeNull();
                emailMergeTemplate.EmailTemplate.To.Should().Be(expectedTo);
                emailMergeTemplate.EmailTemplate.Cc.Should().Be(expectedCc);
                emailMergeTemplate.EmailTemplate.Bcc.Should().Be(expectedBcc);
                emailMergeTemplate.EmailTemplate.Subject.Should().Be(expectedSubject);
                emailMergeTemplate.EmailTemplate.Body.Should().Be(expectedBody);
            }

            // default should be to add 
            template.TimestampColumn.ShouldPrefixNameWithMergeTemplateTitle.Should().Be(expectedShouldPrefixNameWithMergeTemplateTitle);
        }
    }
}
