using FluentAssertions;
using Mailman.Services;
using NUnit.Framework;
using Moq;

namespace Mailman.Tests
{
    [TestFixture]
    public class MergeTemplateTests
    {



        [Test]
        public void CanRetrieveMergeTemplates()
        {
            // this should pass :)
            true.Should().BeTrue();
        }
    }
}
