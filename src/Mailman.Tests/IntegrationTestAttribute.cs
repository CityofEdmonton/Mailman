using NUnit.Framework;
using NUnit.Framework.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Mailman.Tests
{
    public class IntegrationTestAttribute : Attribute, ITestAction
    {
        public ActionTargets Targets { get; private set; }

        public void AfterTest(ITest test) { }

        public void BeforeTest(ITest test)
        {
            // Our build server downloads this secure file to this location
            string credFilePath = Environment.GetEnvironmentVariable("DOWNLOADSECUREFILE_SECUREFILEPATH");

            // you can also drop a .json service credential file into the tests directory (it is .gitignored)
            if (string.IsNullOrWhiteSpace(credFilePath))
                credFilePath = Path.Combine(path1: Directory.GetCurrentDirectory(), path2: "Mailman-service-account.json");

            // only run integration tests if we have a service account credential file
            if (!File.Exists(credFilePath))
                Assert.Ignore("The INTEGRATION_TESTS environment variable must be set to run integration tests");
        }
    }
}
