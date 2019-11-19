using EnsureThat;
using Mailman.Services.Data;
using Mailman.Services.Google;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Mailman.Services
{
    internal class MergeTemplateService : IMergeTemplateService
    {
        private readonly ISheetsService _sheetsService;
        private readonly IEmailService _emailService;
        private readonly ILogger _logger;

        public MergeTemplateService(ISheetsService sheetsService,
            IEmailService emailService,
            ILogger logger)
        {
            EnsureArg.IsNotNull(sheetsService);
            EnsureArg.IsNotNull(emailService);
            EnsureArg.IsNotNull(logger);
            _sheetsService = sheetsService;
            _emailService = emailService;
            _logger = logger;
        }

        

        public async Task<RunMergeTemplateProgress> RunMergeTemplateAsync(
            MergeTemplate mergeTemplate,
            Action<RunMergeTemplateProgress> progressReporter = null,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (mergeTemplate == null)
                throw new ArgumentNullException(nameof(mergeTemplate));
            var emailMergeTemplate = mergeTemplate as EmailMergeTemplate;
            if (emailMergeTemplate == null)
                throw new InvalidOperationException("Currently only mergeTemplates of type Email are supported.");
            if (emailMergeTemplate.EmailTemplate == null)
                throw new InvalidOperationException("MergeTemplate.EmailTemplate cannot ben null");

            string range = mergeTemplate.SheetName;
            var dataRange = await _sheetsService.GetDataRangeAsync(
                mergeTemplate.SpreadSheetId, mergeTemplate.SheetName);

            if (mergeTemplate.HeaderRowNumber > 1)
            {
                // we'll define a custom range
                range = new A1Notation(mergeTemplate.SheetName,
                    dataRange.StartColumn, 
                    mergeTemplate.HeaderRowNumber, 
                    dataRange.EndColumn, 
                    dataRange.EndRow).ToString();
            }

            if (!dataRange.EndRow.HasValue)
                throw new InvalidOperationException($"Could not retrieve the number of rows in sheet {mergeTemplate.SheetName}");

            var progress = new RunMergeTemplateProgress(
                dataRange.EndRow.Value - (dataRange.StartRow ?? 1));
            await _sheetsService.GetValuesAsDictionaryDataPump(mergeTemplate.SpreadSheetId,
                range, async values =>
                {
                    if (!ShouldProcess(mergeTemplate, values))
                    {
                        progress.AddSkipped();
                        return;
                    }

                    try
                    {
                        await ProcessMergeTemplateAsync(emailMergeTemplate.EmailTemplate, values);
                        progress.AddProcessed();
                    }
                    catch (Exception err)
                    {
                        _logger.Error(err, "Error processing merge template");
                        progress.AddError();
                    }
                    finally
                    {
                        progressReporter?.Invoke(progress);
                    }
                });

            return progress;
        }

        private bool ShouldProcess(MergeTemplate mergeTemplate, IDictionary<string, object> values)
        {
            //TODO: skip rows that don't meet
            if (!string.IsNullOrWhiteSpace(mergeTemplate.Conditional))
            {
                string conditional = Render(mergeTemplate.Conditional, values);
                bool shouldProcess;
                if (bool.TryParse(conditional, out shouldProcess))
                {
                    return shouldProcess;
                }
                else
                {
                    _logger.Warning("Could not interpret conditional value {Conditional}", conditional);
                }
            }
            return true;
        }

        private Task ProcessMergeTemplateAsync(EmailTemplate template, 
            IDictionary<string, object> values)
        {
            var to = new List<string>();
            var cc = new List<string>();
            var bcc = new List<string>();
            if (!string.IsNullOrEmpty(template.To))
            {
                to = template.To.Split(',').Select(x => Render(x, values)).ToList();
            }
            if (!string.IsNullOrEmpty(template.Cc))
            {
                cc = template.Cc.Split(',').Select(x => Render(x, values)).ToList();
            }
            if (!string.IsNullOrEmpty(template.Bcc)){
                bcc = template.Bcc.Split(',').Select(x => Render(x, values)).ToList();
            }

            return _emailService.SendEmailAsync(
                to,
                cc,
                bcc,
                subject: Render(template.Subject, values),
                body: Render(template.Body, values)
            );
        }

        private static Regex _tagRegex = new Regex("<<(.*?)>>|&lt;&lt;(.*?)&gt;&gt;", RegexOptions.Compiled);
        private static Regex _nbspRegex = new Regex("&nbsp;", RegexOptions.Compiled);
        private static Regex _spaceRegex = new Regex("^\\s+|\\s+", RegexOptions.Compiled);
        private const string _emptyString = "";
        private string Render(string template, IDictionary<string, object> values)
        {
            if (string.IsNullOrWhiteSpace(template))
                return string.Empty;

            return _tagRegex.Replace(template, match =>
            {
                foreach (var m in ((IEnumerable<Group>)match.Groups).Skip(1))
                {
                    if (m.Success)
                    {
                        string key = _spaceRegex.Replace(
                            _nbspRegex.Replace(m.Value, _emptyString),
                            _emptyString);
                        if (values.ContainsKey(key))
                            return values[key]?.ToString();
                        else
                            return _emptyString;
                    }
                }
                return _emptyString;
            });
        }




    }
}
