using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;


namespace Mailman.Services.Data
{
    public class TimestampColumn
    {
        // no public constructors.
        private TimestampColumn() { }

        public string Name { get; private set; }
        public bool ShouldPrefixNameWithMergeTemplateTitle { get; private set; }
        public string Title { get; private set; }

        internal static TimestampColumn Create(string name, bool shouldPrefixNameWithMergeTemplateTitle, string mergeTemplateTitle)
        {
            return new TimestampColumn()
            {
                Name = name,
                ShouldPrefixNameWithMergeTemplateTitle = shouldPrefixNameWithMergeTemplateTitle,
                Title = shouldPrefixNameWithMergeTemplateTitle
                    ? string.Concat(mergeTemplateTitle, " - ", name)
                    : name
            };
        }
    }
}
