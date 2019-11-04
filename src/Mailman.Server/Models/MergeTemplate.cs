using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models
{
    /// <summary>
    /// A template for merging string templates with Google Sheet data
    /// </summary>
    public class MergeTemplate
    {
        /// <summary>
        /// Identifier for the merge tempalte
        /// </summary>
        public string Id { get; set; }
        
        /// <summary>
        /// The type of merge template. 
        /// Currently only "Email" type is supported.
        /// </summary>
        [Required]
        [JsonConverter(typeof(StringEnumConverter))]
        public MergeTemplateType Type { get;set; }

        /// <summary>
        /// The user who created this merge template.
        /// </summary>
        [Required]
        public string CreatedBy { get; set; }
        private DateTime createdDateUtc;
        /// <summary>
        /// The date and time the merge tempalte was creatd.
        /// </summary>
        [Required]
        public DateTime CreatedDateUtc
        {
            get => createdDateUtc;
            set
            {          
                if (value > DateTime.MinValue && value <= DateTime.UtcNow)
                    createdDateUtc = value;
                else
                    throw new ArgumentOutOfRangeException(nameof(CreatedDateUtc), value, "CreatedDateUtc cannot be in the future");

            }            
        }

        private string spreadSheetId;
        [Required]
        public string SpreadSheetId
        {
            get => spreadSheetId;
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                    spreadSheetId = value;
                else
                    throw new ArgumentNullException(nameof(SpreadSheetId));
            }
        }

        /// <summary>
        /// The version of Mailman at the time this merge 
        /// template was last saved.
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// The title of the template, for display purposes.
        /// </summary>
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// The sheet that this merge template gets its data from.
        /// </summary>
        [Required]
        public string SheetName { get; set; }

        /// <summary>
        /// The row number in <see cref="SheetName"/> that defines
        /// the name of the data fields in the sheet.
        /// 
        /// </summary>
        [Required]
        public int HeaderRowNumber { get; set; }

        /// <summary>
        /// The column where a simestamp is put after running a mail merge
        /// </summary>
        public TimestampColumn TimestampColumn { get; set; }

        /// <summary>
        /// A condition that specifies whether a mail merge should be performed.
        /// This condition is evaluated for every row.
        /// </summary>
        public string Conditional { get; set; }

        /// <summary>
        /// Specifies if merges run manually (Off),
        /// time based (hourly or some time period),
        /// or when a form is submitted to the sheet.
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public RepeaterType Repeater { get; set; }

    }
}
