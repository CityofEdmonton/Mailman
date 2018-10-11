using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models.MappingProfiles
{
    /// <summary>
    /// Autmapper profile fo the Server.Models.Mergetemplate dto
    /// </summary>
    public class MergeTemplateProfile : Profile
    {
        /// <summary>
        /// Constructor for automapper profile
        /// </summary>
        public MergeTemplateProfile()
        {
            CreateMap<Services.Data.MergeTemplate, MergeTemplate>()
                .Include<Services.Data.EmailMergeTemplate, EmailMergeTemplate>();
            CreateMap<Services.Data.EmailMergeTemplate, EmailMergeTemplate>();
        }
    }
}
