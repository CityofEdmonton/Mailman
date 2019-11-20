namespace Mailman.Services
{
    public class MailMergeProgress
    {
        public MailMergeProgress()
        {
        }

        public string MergeTemplateId { get; set; }
        public string ConnectionId { get; set; }
        public RunMergeTemplateProgress Progress { get; set; }
        /// <summary>
        /// A string containing an error message if an error occurs while processing.
        /// Message is suitable for display (in English)
        /// </summary>
        /// <value></value>
        public string ErrorMessage { get; set; }
    }
}