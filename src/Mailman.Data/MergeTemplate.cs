using System;

namespace Mailman.Data
{
    public class MergeTemplate
    {
        public string Name { get; set; }
        public string SpreadSheetId { get; private set; }

        public static MergeTemplate Create(string name, string spreadsheetId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentNullException("name", "name cannot by null or empty");
            if (string.IsNullOrWhiteSpace(spreadsheetId))
                throw new ArgumentNullException("spreadsheetId", "spreadsheetId cannot be null or empty");

            return new MergeTemplate() { Name = name, SpreadSheetId = spreadsheetId };
        }
    }
}
