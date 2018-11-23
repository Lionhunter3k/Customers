using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Tests
{
    public abstract class BaseFixture
    {
        protected virtual void OnFixtureSetup() { }
        protected virtual void OnFixtureTeardown() { }
        protected virtual void OnSetup() { }
        protected virtual void OnTeardown() { }

        [OneTimeSetUp]
        public void FixtureSetup()
        {
            OnFixtureSetup();
        }

        [OneTimeTearDown]
        public void FixtureTeardown()
        {
            OnFixtureTeardown();
        }

        [SetUp]
        public void Setup()
        {
            OnSetup();
        }

        [TearDown]
        public void Teardown()
        {
            OnTeardown();
        }
    }
}
