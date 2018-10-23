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
        public string Id { get; private set; }

        /// <summary>
        /// The title of this merge template, for display purposes
        /// </summary>
        public string Title { get; private set; }
        public void SetTitle(string title)
        {
            Title = title;
            if (TimestampColumn.ShouldPrefixNameWithMergeTemplateTitle)
            {
                TimestampColumn = TimestampColumn.Create(TimestampColumn.Name, true, title);
            }
        }

        /// <summary>
        /// This id of the Google Sheet this merge template belongs to
        /// </summary>
        /// <remarks>
        /// This is the same id as shown in the address bar of a browser when
        /// editing the Google Sheet
        /// </remarks>
        public string SpreadSheetId { get; private set; }

        /// <summary>
        /// The name of the sheet that this merge template gets its data from
        /// </summary>
        public string SheetName { get; private set; }

        /// <summary>
        /// The type of merge template
        /// </summary>
        /// <remarks>
        /// Currently, this can only be "Email", but in the future may
        /// hold values like "Document" or "Gmail"
        /// </remarks>
        public MergeTemplateType Type { get; private set; } = MergeTemplateType.Email;

        /// <summary>
        /// The user who created the merge template
        /// </summary>
        public string CreatedBy { get; private set; }

        /// <summary>
        /// The date and time this merge template was originally create, in UTC
        /// </summary>
        public DateTime CreatedDateUtc { get; private set; }
        //public string Version { get; set; }

        public int HeaderRowNumber { get; private set; }

        public TimestampColumn TimestampColumn { get; private set; }
        public void SetTimestampColumn(string columnTemplate, bool prefixWithMergeTemplateTitle)
        {
            TimestampColumn = TimestampColumn.Create(columnTemplate, prefixWithMergeTemplateTitle, Title);
        }

        //public string Conditional { get; set; }
        //public RepeaterType Repeater { get; set; }


        protected void Initialize(string spreadsheetId,
            string title, string createdBy, DateTime createdDateUtc)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentNullException(nameof(title));
            if (string.IsNullOrWhiteSpace(spreadsheetId))
                throw new ArgumentNullException(nameof(spreadsheetId));
            if (string.IsNullOrWhiteSpace(createdBy))
                throw new ArgumentNullException(nameof(createdBy));
            if (createdDateUtc == DateTime.MinValue)
                throw new ArgumentOutOfRangeException(nameof(createdDateUtc), createdDateUtc, "createdDateUtc must be recent");
            var utcNow = DateTime.UtcNow;
            if (createdDateUtc > utcNow)
                throw new ArgumentOutOfRangeException(nameof(createdDateUtc), createdDateUtc, "createdDateUtc cannot be in the future, it is now " + utcNow);

            Id = Guid.NewGuid().ToString();
            SpreadSheetId = spreadsheetId;
            Title = title;
            CreatedBy = createdBy;
            CreatedDateUtc = createdDateUtc;
        }

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
            DateTime createdDate = string.IsNullOrWhiteSpace(createdDateString)
                ? DateTime.UtcNow
                : DateTime.ParseExact(createdDateString,
                    "M/d/yyyy H:m:s",
                    System.Globalization.CultureInfo.InvariantCulture);
            // hopefuly the servers are in the right time zone (MDT for City of Edmonton)
            var createdDateUtc = TimeZoneInfo.ConvertTimeToUtc(createdDate, TimeZoneInfo.Local);

            string headerRow = mergeData.headerRow;
            if (!int.TryParse(headerRow, out int headerRowNumber))
            {
                // log warning that headerRow could not be determined.
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
            SetTimestampColumn(timestampColumn, timestampColumnShouldUseTitle);
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
