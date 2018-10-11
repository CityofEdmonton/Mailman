using System;
using System.Runtime.Serialization;
using Google;

namespace Mailman.Services.Google
{
    /// <summary>
    /// Represents the error that occurs when a Google Sheet cannot be found.
    /// </summary>
    [Serializable]
    public class SheetNotFoundException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the Mailman.Services.Google.SheetNotFoundException
        /// class using default property values.
        /// </summary>
        public SheetNotFoundException() { }

        /// <summary>
        /// Initializes a new instance of the Mailman.Services.Google.SheetNotFoundException
        /// class with the specified error message.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public SheetNotFoundException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the Mailman.Services.Google.SheetNotFoundException
        /// class with the specified error message and a reference to the inner exception
        /// that is the cause of this exception.
        /// </summary>
        /// <param name="message">The error message that explains the reason for the exception.</param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception. If the innerException
        /// parameter is not null, the current exception is raised in a catch block that
        /// handles the inner exception.</param>
        public SheetNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }

        /// <summary>
        /// Initializes a new instance of the Mailman.Services.Google.SheetNotFoundException
        //     class with serialized data.
        /// </summary>
        /// <param name="info">
        /// The System.Runtime.Serialization.SerializationInfo that holds the serialized
        /// object data about the exception being thrown.
        /// </param>
        /// <param name="context">
        /// The System.Runtime.Serialization.StreamingContext that contains contextual information
        /// about the source or destination.
        /// </param>
        protected SheetNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}