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
            var mockSheetsService = new Mock<ISheetsService>();
            IList<object> config1 = new List<object> { "TemplateId1", MergeTemplateTests.SAMPLE_MM_JSON };
            IList<object> config2 = new List<object> { "TemplateId2", MergeTemplateTests.SAMPLE_MM_JSON };
            IList<object> configBad1 = new List<object> { "TemplateId3", null };
            IList<object> configBad2 = new List<object> { "TemplateId4" };
            IList<object> configBad3 = new List<object> { };

            IList<IList<object>> mockValues = new List<IList<object>> { config1, config2 };
            IList<IList<object>> mockValuesWithBadValues = new List<IList<object>> { configBad1, configBad2, configBad3 };

            mockSheetsService.Setup(x => x.GetValuesAsync(
                    It.Is<string>(s => s.Equals("MockSpreadSheet1", StringComparison.OrdinalIgnoreCase)),
                    It.Is<string>(s => s.Equals(string.Concat("mm-config!", MergeTemplateRepository.ENTIRE_SHEET_RANGE), StringComparison.OrdinalIgnoreCase))))
                .Returns<string, string>((sheetId, range) => Task.FromResult(mockValues));

            mockSheetsService.Setup(x => x.GetValuesAsync(
                    It.Is<string>(s => s.Equals("MockSpreadSheetWithBadValues", StringComparison.OrdinalIgnoreCase)),
                    It.Is<string>(s => s.Equals(string.Concat("mm-config!", MergeTemplateRepository.ENTIRE_SHEET_RANGE), StringComparison.OrdinalIgnoreCase))))
                .Returns<string, string>((sheetId, range) => Task.FromResult(mockValuesWithBadValues));

            var sheetsService = mockSheetsService.Object;

            var serviceCollection = new ServiceCollection();
            _serviceProvider = serviceCollection
                .AddScoped(x => Log.Logger)
                .AddScoped(x => sheetsService)
                .AddScoped<IMergeTemplateRepository, MergeTemplateRepository>()
                .BuildServiceProvider();

        }

        private readonly IServiceProvider _serviceProvider;


        //[TestCase]
        public async Task GetMergeTemplates()
        {
            var repository = _serviceProvider.GetRequiredService<IMergeTemplateRepository>();
            var templates = await repository.GetMergeTemplatesAsync("MockSpreadSheet1");
            templates.Should().NotBeNullOrEmpty();

            int templatesCount = templates.Count();
            templatesCount.Should().Be(2);
            templates.ElementAt(0).Id.Should().Be("TemplateId1");
            templates.ElementAt(1).Id.Should().Be("TemplateId2");
        }

        //[TestCase]
        public async Task GetMergeTemplatesWithBadDataShouldExclude()
        {
            var repository = _serviceProvider.GetRequiredService<IMergeTemplateRepository>();
            var templates = await repository.GetMergeTemplatesAsync("MockSpreadSheetWithBadValues");
            templates.Should().NotBeNull();
            templates.Should().BeEmpty();
        }
    }
}
