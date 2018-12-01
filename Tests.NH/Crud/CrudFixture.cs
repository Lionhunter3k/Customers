using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using Tests.NH.SessionFactoryBuilders;

namespace Tests.NH.Crud
{
    public abstract class CrudFixture<TEntity, TId> : NHibernateFixture<SQLiteHbmSessionFactoryBuilder> where TEntity : class
    {
        protected abstract TId ExtractId(TEntity entity);

        [Test]
        public void Can_select_entity()
        {
            Session.CreateCriteria<TEntity>().SetMaxResults(1).List();
        }

        [Test]
        public void Can_create_entity()
        {
            var entity = BuildEntity();
            InsertEntity(entity);
            Session.Evict(entity);
            var id = this.ExtractId(entity);
            var reloadedEntity = Session.Get<TEntity>(id);
            Assert.IsNotNull(reloadedEntity);
            AssertAreEqual(entity, reloadedEntity);
            AssertValidId(entity);
        }

        [Test]
        public void Can_update_entity()
        {
            var entity = BuildEntity();
            InsertEntity(entity);
            ModifyEntity(entity);
            Session.Flush();
            Session.Evict(entity);
            var id = this.ExtractId(entity);
            var reloadedEntity = Session.Get<TEntity>(id);
            AssertAreEqual(entity, reloadedEntity);
        }

        [Test]
        public void Can_delete_entity()
        {
            var entity = BuildEntity();
            InsertEntity(entity);
            DeleteEntity(entity);
            var id = this.ExtractId(entity);
            Assert.IsNull(Session.Get<TEntity>(id));
        }

        protected virtual TId InsertEntity(TEntity entity)
        {
            var id = (TId)Session.Save(entity);
            Session.Flush();
            return id;
        }

        protected virtual void OnBeforeDelete(TEntity entity)
        {
            //noop
        }

        protected virtual void DeleteEntity(TEntity entity)
        {
            OnBeforeDelete(entity);
            Session.Delete(entity);
            Session.Flush();
        }

        protected abstract TEntity BuildEntity();
        protected abstract void ModifyEntity(TEntity entity);
        protected abstract void AssertAreEqual(TEntity expectedEntity, TEntity actualEntity);
        protected abstract void AssertValidId(TEntity entity);
    }
}
