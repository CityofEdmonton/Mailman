using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    public class MergeTemplateContext: DbContext 
    {        
        public MergeTemplateContext(DbContextOptions<MergeTemplateContext> options) : base(options) { }

        public DbSet<MergeTemplate> MergeTemplates {get;set;} 
        public DbSet<TimestampColumn> TimestampColumns {get;set;} 

        public class MergeTemplateContextFactory : IDesignTimeDbContextFactory<MergeTemplateContext>
        {   
            public MergeTemplateContext CreateDbContext(string[] args)
            {
            var builder = new DbContextOptionsBuilder<MergeTemplateContext>();
            builder.UseSqlite("Data Source=mergetemplate.db");
            return new MergeTemplateContext(builder.Options);
            }
        }
        
    }

}