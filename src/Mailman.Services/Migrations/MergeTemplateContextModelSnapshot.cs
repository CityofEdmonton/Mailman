﻿// <auto-generated />
using System;
using Mailman.Services.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Mailman.Services.Migrations
{
    [DbContext(typeof(MergeTemplateContext))]
    partial class MergeTemplateContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("Mailman.Services.Data.MergeTemplate", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDateUtc");

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.Property<int>("HeaderRowNumber");

                    b.Property<string>("SheetName");

                    b.Property<string>("SpreadSheetId");

                    b.Property<string>("Title");

                    b.Property<int>("Type");

                    b.HasKey("Id");

                    b.ToTable("MergeTemplates");

                    b.HasDiscriminator<string>("Discriminator").HasValue("MergeTemplate");
                });

            modelBuilder.Entity("Mailman.Services.Data.EmailMergeTemplate", b =>
                {
                    b.HasBaseType("Mailman.Services.Data.MergeTemplate");


                    b.ToTable("EmailMergeTemplate");

                    b.HasDiscriminator().HasValue("EmailMergeTemplate");
                });

            modelBuilder.Entity("Mailman.Services.Data.MergeTemplate", b =>
                {
                    b.OwnsOne("Mailman.Services.Data.TimestampColumn", "TimestampColumn", b1 =>
                        {
                            b1.Property<string>("MergeTemplateId");

                            b1.Property<string>("Name");

                            b1.Property<bool>("ShouldPrefixNameWithMergeTemplateTitle");

                            b1.Property<string>("Title");

                            b1.ToTable("MergeTemplates");

                            b1.HasOne("Mailman.Services.Data.MergeTemplate")
                                .WithOne("TimestampColumn")
                                .HasForeignKey("Mailman.Services.Data.TimestampColumn", "MergeTemplateId")
                                .OnDelete(DeleteBehavior.Cascade);
                        });
                });

            modelBuilder.Entity("Mailman.Services.Data.EmailMergeTemplate", b =>
                {
                    b.OwnsOne("Mailman.Services.Data.EmailTemplate", "EmailTemplate", b1 =>
                        {
                            b1.Property<string>("EmailMergeTemplateId");

                            b1.Property<string>("Bcc");

                            b1.Property<string>("Body");

                            b1.Property<string>("Cc");

                            b1.Property<string>("Subject");

                            b1.Property<string>("To");

                            b1.ToTable("MergeTemplates");

                            b1.HasOne("Mailman.Services.Data.EmailMergeTemplate")
                                .WithOne("EmailTemplate")
                                .HasForeignKey("Mailman.Services.Data.EmailTemplate", "EmailMergeTemplateId")
                                .OnDelete(DeleteBehavior.Cascade);
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
