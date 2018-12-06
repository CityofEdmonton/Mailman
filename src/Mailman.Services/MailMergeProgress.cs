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
    }
}