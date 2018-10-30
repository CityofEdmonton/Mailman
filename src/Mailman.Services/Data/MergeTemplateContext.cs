using Microsoft.EntityFrameworkCore;

namespace Mailman.Services.Data
{
    public class MergeTemplateContext: DbContext 
    {        
        public MergeTemplateContext(DbContextOptions<MergeTemplateContext> options) : base(options) { }

        public DbSet<MergeTemplate> MergeTemplates {get;set;} 
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=mergetemplate.db");
        }
        
    }
}