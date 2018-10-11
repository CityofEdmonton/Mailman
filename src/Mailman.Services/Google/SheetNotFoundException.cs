using System;
using System.Runtime.Serialization;
using Google;

namespace Mailman.Services.Google
{
    [Serializable]
    public class SheetNotFoundException : Exception
    {
        private GoogleApiException gex;
        private string v;

        public SheetNotFoundException()
        {
        }

        public SheetNotFoundException(string message) : base(message)
        {
        }

        public SheetNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected SheetNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}