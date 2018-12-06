using System;

namespace Mailman.Services
{
    public class RunMergeTemplateProgress
    {
        internal RunMergeTemplateProgress(int total)
        {
            if (total < 0)
                throw new ArgumentOutOfRangeException(nameof(total));

            Total = total;
        }

        public int Processed { get; private set; }
        /// <summary>
        /// Adds one to processed
        /// </summary>
        internal void AddProcessed()
        {
            Processed++;
        }
        public int Skipped { get; private set; }
        internal void AddSkipped()
        {
            Skipped++;
        }
        public int Errors { get; private set; }
        internal void AddError()
        {
            Errors++;
        }
        public int Completed => Processed + Skipped;
        public int Total { get; private set; }
        public double PercentComplete
        {
            get
            {
                return Total <= 0 ? 100 : 100 * (Processed + Skipped) / Total;
            }
        }
    }
}