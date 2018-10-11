using NUnit.Framework;
using NUnit.Framework.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Tests
{
    public class IntegrationTestAttribute : Attribute, ITestAction
    {
        public ActionTargets Targets { get; private set; }

        public void AfterTest(ITest test) { }

        public void BeforeTest(ITest test)
        {
            string isIntegrationTest = Environment.GetEnvironmentVariable("INTEGRATION_TESTS");
            if (string.IsNullOrWhiteSpace(isIntegrationTest))
                Assert.Ignore("The INTEGRATION_TESTS environment variable must be set to run integration tests");
        }
    }
}
