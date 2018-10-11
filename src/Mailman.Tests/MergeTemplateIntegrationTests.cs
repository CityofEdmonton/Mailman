using FluentAssertions;
using Mailman.Controllers;
using Mailman.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateIntegrationTests : GoogleIntegrationTestBase
    {
        private static string newline = Environment.NewLine;

        public MergeTemplateIntegrationTests()
        {
            var serviceCollection = new ServiceCollection();
            var services = AddBasicServices(serviceCollection)
                .AddScoped<MergeTemplatesController>()
                .BuildServiceProvider();

            _mergeTemplatesController = services.GetRequiredService<MergeTemplatesController>();

        }

        private readonly MergeTemplatesController _mergeTemplatesController;


        [TestCase]
        [IntegrationTest]
        public async Task ReadMergeTemplatesAsync()
        {
            var mergeTemplatesResult = await _mergeTemplatesController.Get(TEST_SHEET_ID);
            mergeTemplatesResult.Should().BeOfType<OkObjectResult>();

            var okMergeTemplatesResult = (OkObjectResult)mergeTemplatesResult;
            okMergeTemplatesResult.Value.Should().BeAssignableTo<IEnumerable<MergeTemplate>>();

            var mergeTemplates = (IEnumerable<MergeTemplate>)okMergeTemplatesResult.Value;
            mergeTemplates.Should().HaveCount(2);

            // First MergeTemplate
            var mergeTemplate1 = mergeTemplates.First();
            mergeTemplate1.Id.Should().Be("_lif0ru2r8");
            mergeTemplate1.Title.Should().Be("test2");
            mergeTemplate1.SheetName.Should().Be("Data");
            mergeTemplate1.HeaderRowNumber.Should().Be(1);
            mergeTemplate1.Conditional.Should().BeNull();
            mergeTemplate1.Repeater.Should().Be(RepeaterType.Off);
            mergeTemplate1.TimestampColumn.Should().NotBeNull();
            mergeTemplate1.TimestampColumn.Name.Should().Be("<<Mailman test2 Timestamp>>");
            mergeTemplate1.TimestampColumn.ShouldPrefixNameWithMergeTemplateTitle.Should().BeTrue();

            mergeTemplate1.Should().BeOfType<EmailMergeTemplate>();
            var emailTemplate1 = ((EmailMergeTemplate)mergeTemplate1).EmailTemplate;
            emailTemplate1.Should().NotBeNull();
            emailTemplate1.To.Should().Be("<<Email>>");
            emailTemplate1.Cc.Should().BeNull();
            emailTemplate1.Bcc.Should().BeNull();
            emailTemplate1.Subject.Should().Be("Hello <<Name>>!");
            string bodyShouldBe = @"<p>This is a test email to &lt;&lt;Name&gt;&gt;.</p>" + newline +
                "<p>&nbsp;</p>" + newline +
                "<p>Here are some notes: &lt;&lt;Notes&gt;&gt;</p>";
            emailTemplate1.Body.NormalizeLineEndings().Should().Be(bodyShouldBe.NormalizeLineEndings());

            // Second MergeTemplate
            mergeTemplates.Skip(1).First().Id.Should().Be("_3w5ri295a");
        }

    }
}
