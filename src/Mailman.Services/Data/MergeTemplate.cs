using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Data
{
    public abstract class MergeTemplate
    {
        /// <summary>
        /// The Identifier for this MergeTemplate within the SpreadSheet
        /// </summary>
        /// <remarks>
        /// Not currently guaranteed to be globally unique (but likely is)
        /// </remarks>
        public string Id { get; set; }

        /// <summary>
        /// The title of this merge template, for display purposes
        /// </summary>
        public string Title { get; set; }
    
        /// <summary>
        /// This id of the Google Sheet this merge template belongs to
        /// </summary>
        /// <remarks>
        /// This is the same id as shown in the address bar of a browser when
        /// editing the Google Sheet
        /// </remarks>
        public string SpreadSheetId { get; set; }

        /// <summary>
        /// The name of the sheet that this merge template gets its data from
        /// </summary>
        public string SheetName { get; set; }

        /// <summary>
        /// The type of merge template
        /// </summary>
        /// <remarks>
        /// Currently, this can only be "Email", but in the future may
        /// hold values like "Document" or "Gmail"
        /// </remarks>
        public MergeTemplateType Type { get; set; } = MergeTemplateType.Email;

        /// <summary>
        /// The user who created the merge template
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// The date and time this merge template was originally create, in UTC
        /// </summary>
        public DateTime CreatedDateUtc { get; set; }
        //public string Version { get; set; }

        public int HeaderRowNumber { get; set; }

        public TimestampColumn TimestampColumn { get; set; }

        //public string Conditional { get; set; }
        //public RepeaterType Repeater { get; set; }


        protected void Initialize(string id, string spreadsheetId, string serialized)
        {
            dynamic value = Newtonsoft.Json.Linq.JObject.Parse(serialized);
            var mergeData = value.mergeData;
            string createdBy = value.createdBy;
            string createdDateString = value.createdDatetime;
            if (string.IsNullOrWhiteSpace(createdBy))
            {
                // warning!
                createdBy = "Unknown user";
            }

            DateTime createdDateUtc;
            if (string.IsNullOrWhiteSpace(createdDateString))
            {
                createdDateUtc = DateTime.UtcNow;
            }
            else
            {
                DateTime createdDate = DateTime.ParseExact(createdDateString,
                    "M/d/yyyy H:m:s",
                    System.Globalization.CultureInfo.InvariantCulture);

                // hopefuly the servers are in the right time zone (MDT for City of Edmonton)
                createdDateUtc = TimeZoneInfo.ConvertTimeToUtc(createdDate, TimeZoneInfo.Local);
            }

            string headerRow = mergeData.headerRow;
            if (!int.TryParse(headerRow, out int headerRowNumber))
            {
                // log warning that headerRow could not be determined.
                headerRowNumber = 1;
            }
            string timestampColumn = mergeData.timestampColumn;
            string useTitleString = mergeData.usetitle;
            bool.TryParse(useTitleString, out bool timestampColumnShouldUseTitle);

            Id = id;
            SpreadSheetId = spreadsheetId;
            Title = mergeData.title;
            CreatedBy = createdBy;
            CreatedDateUtc = createdDateUtc;
            SheetName = mergeData.sheet;
            HeaderRowNumber = headerRowNumber;
            
            //SetTimestampColumn(timestampColumn, timestampColumnShouldUseTitle);
        }

        // Used by repository to create object from its store (in the Google Sheet)
        internal static MergeTemplate CreateFrom(string id, string spreadsheetId, string serialized)
        {
            dynamic value = Newtonsoft.Json.Linq.JObject.Parse(serialized);
            var mergeData = value.mergeData;

            if (string.Equals((string)mergeData.type, "email", StringComparison.OrdinalIgnoreCase))
                return EmailMergeTemplate.CreateFrom(id, spreadsheetId, serialized);
            else
                throw new InvalidOperationException("Unable to find MergeTemplateType from serialized data");
        }
    }
}
