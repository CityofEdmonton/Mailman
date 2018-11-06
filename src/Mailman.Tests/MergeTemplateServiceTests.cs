using FluentAssertions;
using Mailman.Services;
using Mailman.Services.Google;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateServiceTests
    {
        public MergeTemplateServiceTests()
        {
            var serviceCollection = new ServiceCollection();
            _serviceProvider = serviceCollection
                .AddSingleton(x => Log.Logger)
                .AddSingleton(x => Mocks.SheetsService)
                .AddSingleton(x => Mocks.MergeTemplateRepository)
                .AddSingleton<IEmailService>(x => Mocks.EmailService)
                .AddSingleton(x => Mocks.EmailService)
                .AddSingleton<IMergeTemplateService, MergeTemplateService>()
                .BuildServiceProvider();
        }

        private readonly IServiceProvider _serviceProvider;


        [TestCase]
        public async Task RunMergeTemplateAsync()
        {
            IMergeTemplateService mergeTemplateService = _serviceProvider
                .GetRequiredService<IMergeTemplateService>();
            var mockEmailService = _serviceProvider
                .GetRequiredService<MockEmailService>();

            var mergeTemplate = (await _serviceProvider
                .GetRequiredService<IMergeTemplateRepository>()
                .GetMergeTemplatesAsync(Mocks.Spreadsheet1Id))
                .First();

            int count = 0;
            Action<RunMergeTemplateProgress> onProgressUpdated = progress =>
            {
                progress.Should().NotBeNull();
                progress.Processed.Should().Be(++count);
            };
            var result = await mergeTemplateService.RunMergeTemplateAsync(mergeTemplate, onProgressUpdated);
            result.Should().NotBeNull();
            count.Should().Be(2);
            result.Processed.Should().Be(2);
            result.Skipped.Should().Be(3);
            result.Errors.Should().Be(0);
            result.Total.Should().Be(5);

            // verify that emails should have been sent
            var sentEmails = mockEmailService.SentEmails;
            sentEmails.Count.Should().Be(2);
            sentEmails[0].Body.Should().Be("<p>This is a test email to Dan.</p>\n<p>&nbsp;</p>\n<p>Here are some notes: Hey there from mailman!</p>");
            sentEmails[1].Body.Should().Be("<p>This is a test email to Gregory.</p>\n<p>&nbsp;</p>\n<p>Here are some notes: Some notes.</p>");
        }
    }
}
