using System;
using System.Runtime.Serialization;

namespace Mailman.Services.Google
{
    [Serializable]
    internal class ReadGoogleSheetsException : Exception
    {
        public ReadGoogleSheetsException()
        {
        }

        public ReadGoogleSheetsException(string message) : base(message)
        {
        }

        public ReadGoogleSheetsException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected ReadGoogleSheetsException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}