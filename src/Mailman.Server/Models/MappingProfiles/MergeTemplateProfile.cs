using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailman.Server.Models.MappingProfiles
{
    public class MergeTemplateProfile : Profile
    {
        public MergeTemplateProfile()
        {
            CreateMap<Services.Data.MergeTemplate, MergeTemplate>();

        }
    }
}
