using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Mailman.Tests
{
    public static class StringExtensions
    {
        public static string NormalizeLineEndings(this string str)
        {
            if (str == null)
                return null;
            else
                return Regex.Replace(str, @"\r\n|\n\r|\n|\r", "\r\n");
        }
    }
}
