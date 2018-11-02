using Mailman.Services;
using Mailman.Services.Google;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Serilog;
using FluentAssertions;
using System.Linq;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateRepositoryTests
    {
        public MergeTemplateRepositoryTests()
        {
            var serviceCollection = new ServiceCollection();
            _serviceProvider = serviceCollection
                .AddScoped(x => Log.Logger)
                .AddScoped(x => Mocks.SheetsService)
                .AddScoped<IMergeTemplateRepository, MergeTemplateRepository>()
                .BuildServiceProvider();
        }

        private readonly IServiceProvider _serviceProvider;


        [TestCase]
        public async Task GetMergeTemplates()
        {
            var repository = _serviceProvider.GetRequiredService<IMergeTemplateRepository>();
            var templates = await repository.GetMergeTemplatesAsync(Mocks.Spreadsheet1Id);
            templates.Should().NotBeNullOrEmpty();

            int templatesCount = templates.Count();
            templatesCount.Should().Be(2);
            templates.ElementAt(0).Id.Should().Be("TemplateId1");
            templates.ElementAt(1).Id.Should().Be("TemplateId2");
        }

        [TestCase]
        public async Task GetMergeTemplatesWithBadDataShouldExclude()
        {
            var repository = _serviceProvider.GetRequiredService<IMergeTemplateRepository>();
            var templates = await repository.GetMergeTemplatesAsync(Mocks.SpreadsheetWithBadValues);
            templates.Should().NotBeNull();
            templates.Should().BeEmpty();
        }
    }
}
