using System;

namespace Mailman.Data
{
    public class MergeTemplate
    {
        public string Title { get; set; }
        public string SpreadSheetId { get; private set; }

        public static MergeTemplate Create(string title, string spreadsheetId)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentNullException(nameof(title));
            if (string.IsNullOrWhiteSpace(spreadsheetId))
                throw new ArgumentNullException(nameof(spreadsheetId));

            return new MergeTemplate() { Title = title, SpreadSheetId = spreadsheetId };
        }

        public static 
    }
}
