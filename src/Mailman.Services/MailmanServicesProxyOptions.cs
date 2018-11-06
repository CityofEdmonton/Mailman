namespace Mailman.Services
{
    internal class MailmanServicesProxyOptions
    {
        public string MailmanWorkerServerBaseUrl { get; set; }
        public string MailmanServerBaseUrl { get; set; }
        //public string WorkerAuthKey { get; set; }
        public string AuthKey { get; set; }

    }
}