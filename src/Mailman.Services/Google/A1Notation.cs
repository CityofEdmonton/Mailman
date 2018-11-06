using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Mailman.Services.Google
{
    public class A1Notation
    {
        public A1Notation(string range)
        {
            if (string.IsNullOrWhiteSpace(range))
            {
                SheetName = string.Empty;
                StartColumn = string.Empty;
                EndColumn = string.Empty;
                // startRow and endRow will be null
            }
            else
            {
                var (sheetName, updatedRange) = ParseSheetName(range);
                var (startRange, endRange) = ParseStartAndEndOfRange(updatedRange);
                var (startCell, startRow) = ParseA1(startRange);
                var (endCell, endRow) = ParseA1(endRange);

                SheetName = sheetName;
                StartRow = startRow;
                EndRow = endRow;
                StartColumn = startCell;
                EndColumn = endCell;
            }

            Validate();
        }

        public A1Notation(string sheetName,
            string startColumn,
            int? startRow,
            string endColumn,
            int? endRow)
        {
            SheetName = sheetName ?? string.Empty;
            StartColumn = startColumn;
            StartRow = startRow;
            EndColumn = endColumn;
            EndRow = endRow;

            Validate();
        }


        /// <summary>
        /// Creates a range in A1 notation
        /// </summary>
        /// <param name="sheetName">The name of the sheet (tab)</param>
        /// <param name="startColumnIndex">1-based index of the column. i.e. 1=A,26=Z,27=AA</param>
        /// <param name="startRow">Index of the row. 1 is the first row in a sheet</param>
        /// <param name="endColumnIndex">1-based index of the column. i.e. 1=A,26=Z,27=AA</param>
        /// <param name="endRow">>Index of the row. 1 is the first row in a sheet</param>
        public A1Notation(string sheetName,
            int? startColumnIndex,
            int? startRow,
            int? endColumnIndex,
            int? endRow)
        {
            SheetName = sheetName ?? string.Empty;
            StartColumn = GetColumnReferenceFromIndex(startColumnIndex);
            StartRow = startRow;
            EndColumn = GetColumnReferenceFromIndex(endColumnIndex);
            EndRow = endRow;

            Validate();
        }


        private void Validate()
        {
            int? startColumnIndex = !string.IsNullOrWhiteSpace(StartColumn)
                ? (int?)GetColumnReferenceIndex(StartColumn) : null;
            int? endColumnIndex = !string.IsNullOrWhiteSpace(EndColumn)
                ? (int?)GetColumnReferenceIndex(EndColumn) : null;

            bool isEndColumnBeforeStartColumn = startColumnIndex.HasValue
                && endColumnIndex.HasValue
                && endColumnIndex.Value < startColumnIndex.Value;

            bool isEndRowBeforeStartRow = EndRow.HasValue
                && StartRow.HasValue
                && EndRow.Value < StartRow.Value;

            if (isEndColumnBeforeStartColumn)
            {
                if (isEndRowBeforeStartRow)
                    throw new ArgumentException("The end of the range is before start of range");
                else
                    throw new ArgumentException("The column at the end of the range is before the column at the start of the range");
            }
            else if (isEndRowBeforeStartRow)
                throw new ArgumentException("The row at the end of the range is before the row at the start of the range");
        }

        private (string, string) ParseSheetName(string range)
        {
            int bangIndex = range.IndexOf('!');
            string sheetName, newRange;
            if (bangIndex > 0)
            {
                sheetName = range.Substring(0, bangIndex);
                if (bangIndex + 1 < range.Length)
                    newRange = range.Substring(bangIndex + 1);
                else
                    newRange = string.Empty;
            }
            else
            {
                if (range.IndexOf(':') >= 0)
                {
                    sheetName = string.Empty;
                    newRange = range;
                }
                else
                {
                    sheetName = range;
                    newRange = string.Empty;
                }
            }

            return (sheetName, newRange);
        }

        private (string, string) ParseStartAndEndOfRange(string range)
        {
            int colonIndex = range.IndexOf(':');
            string startRange, endRange;
            if (colonIndex > 0)
            {
                startRange = range.Substring(0, colonIndex);
                if (colonIndex + 1 < range.Length)
                    endRange = range.Substring(colonIndex + 1);
                else
                    endRange = startRange;
            }
            else
            {
                startRange = range;
                endRange = range;
            }
            return (startRange, endRange);
        }

        private static readonly Regex digitRegex = new Regex(@"\d+");
        private (string, int?) ParseA1(string cell)
        {
            string cellLetter;
            int? row;
            var match = digitRegex.Match(cell);
            if (match.Success)
            {
                if (match.Index > 0)
                {
                    cellLetter = cell.Substring(0, match.Index);
                }
                else
                {
                    cellLetter = string.Empty;
                }
                try
                {
                    row = int.Parse(cell.Substring(match.Index));
                }
                catch (FormatException fe)
                {
                    throw new InvalidOperationException("Unable to determine row number from range", fe);
                }
            }
            else
            {
                cellLetter = cell;
                row = null;
            }
            return (cellLetter, row);
        }

        public string SheetName { get; private set; }
        public int? StartRow { get; private set; }
        public int? EndRow { get; private set; }
        public string StartColumn { get; private set; }
        public string EndColumn { get; private set; }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            bool hasSheetName = !string.IsNullOrWhiteSpace(SheetName);
            if (hasSheetName)
                sb.Append(SheetName);
            bool hasStartColumn = !string.IsNullOrWhiteSpace(StartColumn);
            bool hasStartRow = StartRow.HasValue;
            if (hasStartColumn || hasStartRow)
            {
                if (hasSheetName)
                    sb.Append("!");
                if (hasStartColumn)
                    sb.Append(StartColumn);
                if (hasStartRow)
                    sb.Append(StartRow);
            }
            bool hasEndColumn = !string.IsNullOrWhiteSpace(EndColumn);
            bool hasEndRow = EndRow.HasValue;
            if (hasEndColumn || hasEndRow)
            {
                sb.Append(":");
                if (hasEndColumn)
                    sb.Append(EndColumn);
                if (hasEndRow)
                    sb.Append(EndRow);
            }
            return sb.ToString();
        }

        internal static int? GetColumnReferenceIndex(string column)
        {
            // borrowed from https://cityofedmonton.visualstudio.com/PAC-ARA/_versionControl?path=%24%2FPAC-ARA%2FMain%2FSource%2FPAC%20ARA%2FData%20Import%2FCoE.PacAra.DataImport.Core%2FCommon%2FOpenXmlExtensions.cs&line=158&lineStyle=plain&lineEnd=159&lineStartColumn=1&lineEndColumn=1
            if (string.IsNullOrWhiteSpace(column))
                return null;

            var columnRef = column.ToUpperInvariant().ToCharArray();
            //A-Z returns 1-26,
            //AA-AZ returns 27 - 52
            //BA-BZ returns 53 - 78
            //AAA-AAZ returns 703 - 728
            // etc.
            int returnValue = 0, len = columnRef.Length - 1;
            for (int i = 0; i <= len; i++)
            {
                char c = columnRef[i];
                //Note A=65, Z=90
                if (i < len)
                {
                    int offset = (int)Math.Pow(26, len - i);
                    offset = offset * (c - 64);
                    returnValue += offset;
                }
                else
                    returnValue += (c - 65);
            }
            return returnValue + 1;
        }

        internal static string GetColumnReferenceFromIndex(int? index)
        {
            if (!index.HasValue)
                return string.Empty;

            if (index <= 0)
                throw new ArgumentOutOfRangeException(nameof(index), "index must be greater than zero");

            int number = index.Value;
            //1-26 returns A-Z
            //27-52 returns AA-AZ
            //53-78 returns BA-BZ
            //703-728 returns AAA-AAZ
            //etc.
            int length = index <= 26 ? 1
                : (int)Math.Ceiling(Math.Log(index.Value, 26));
            char[] values = new char[length];
            for (int i = 0; i < length; i++)
            {

                if (i == 0)
                {
                    int offset = (number - 1) % 26;
                    values[length - 1] = (char)(offset + 65);
                    number = number - offset;
                }
                else
                {
                    double offset2 = number / Math.Pow(26, i) % 26;
                    values[length - i - 1] = (char)(Math.Floor(offset2) + 64);
                    number = number - (int)offset2;
                }
            }

            return new string(values);
        }
    }
}
