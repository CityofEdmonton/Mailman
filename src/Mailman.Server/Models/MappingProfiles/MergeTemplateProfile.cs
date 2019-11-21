using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models.MappingProfiles
{
    /// <summary>
    /// Automapper profile for the Server.Models.MergeTemplate dto
    /// </summary>
    public class MergeTemplateProfile : Profile
    {
        /// <summary>
        /// Constructor for automapper profile
        /// </summary>
        public MergeTemplateProfile()
        {
            CreateMap<Services.Data.MergeTemplate, MergeTemplate>()
                .IncludeAllDerived();
            CreateMap<MergeTemplate, Services.Data.MergeTemplate>()
                .IncludeAllDerived();
            CreateMap<Services.Data.EmailMergeTemplate, EmailMergeTemplate>();
            CreateMap<EmailMergeTemplate, Services.Data.EmailMergeTemplate>();
            CreateMap<EmailTemplate, Services.Data.EmailTemplate>();
            CreateMap<Services.Data.EmailTemplate, EmailTemplate>();
            CreateMap<TimestampColumn, Services.Data.TimestampColumn>();
            CreateMap<Services.Data.TimestampColumn, TimestampColumn>();
        }
    }
}
