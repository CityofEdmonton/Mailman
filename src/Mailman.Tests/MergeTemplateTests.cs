using FluentAssertions;
using Mailman.Services.Data;
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
            Action action = () => MergeTemplate.Create(name, spreadsheetId, createdBy, now);
            action.Should().Throw<ArgumentNullException>();
        }


        [TestCase("MergeTemplate1", "SpreadSheetId", "Snow.White@edmonton.ca")]
        [TestCase("MergeTemplate - example of a name of a merge template", "askdjaskldj-3423-sdfksfjnsdf=-dfkljsdf", "Snow.White@edmonton.ca")]
        public void CreateMergeTemplate(string name, string spreadsheetId, string createdBy)
        {
            MergeTemplate.Create(name, spreadsheetId, createdBy, DateTime.UtcNow).Should().NotBeNull();
        }

    }
}
