using FluentAssertions;
using Mailman.Services;
using NUnit.Framework;
using Moq;
using Mailman.Data;
using System.Threading.Tasks;
using System.Threading;
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

        [TestCase(null, null)]
        [TestCase("", null)]
        [TestCase(null, "")]
        [TestCase("", "")]
        [TestCase(null, "something")]
        [TestCase("", "something")]
        [TestCase("something", null)]
        [TestCase("something", "")]
        public void TestCreateEmptyMergeTemplateThrows(string name, string spreadsheetId)
        {
            Action action = () => MergeTemplate.Create(name, spreadsheetId);
            action.Should().Throw< ArgumentNullException>();
        }


        [TestCase("MergeTemplate1", "SpreadSheetId")]
        [TestCase("MergeTemplate - example of a name of a merge template", "askdjaskldj-3423-sdfksfjnsdf=-dfkljsdf")]
        public void TestCreateMergeTemplate(string name, string spreadsheetId)
        {
            MergeTemplate.Create(name, spreadsheetId).Should().NotBeNull();
        }
    }
}
