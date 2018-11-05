using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    //dotnet ef migrations add -c MergeTemplateContext init
    //dotnet ef database update -c MergeTemplateContext
    public class MergeTemplateContext: DbContext 
    {        
        public MergeTemplateContext(DbContextOptions<MergeTemplateContext> options) : base(options) { }

        public DbSet<MergeTemplate> MergeTemplates {get;set;} 
        protected override void OnModelCreating(ModelBuilder builder)
        {
            var emailMergeTemplate = builder.Entity<EmailMergeTemplate>(); 
            emailMergeTemplate.OwnsOne(x => x.EmailTemplate);
            emailMergeTemplate.OwnsOne(x => x.TimestampColumn);
            base.OnModelCreating(builder);
 
        }
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