using NUnit.Framework;
using System;
using AutoMapper;
using Mailman.Server.Models.MappingProfiles;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateMappingTest
    {
        [TestCase]
        public void IsMapConfigValid()
        {
            var config = new MapperConfiguration(cfg => {
              cfg.AddProfile<MergeTemplateProfile>();
            });
            config.AssertConfigurationIsValid();
        }
    }
}
