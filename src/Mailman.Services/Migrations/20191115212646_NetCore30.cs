using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mailman.Services.Migrations
{
    public partial class NetCore30 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MergeTemplates",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    SpreadSheetId = table.Column<string>(nullable: true),
                    SheetName = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    CreatedDateUtc = table.Column<DateTime>(nullable: false),
                    HeaderRowNumber = table.Column<int>(nullable: false),
                    TimestampColumn_Name = table.Column<string>(nullable: true),
                    TimestampColumn_ShouldPrefixNameWithMergeTemplateTitle = table.Column<bool>(nullable: true),
                    TimestampColumn_Title = table.Column<string>(nullable: true),
                    Conditional = table.Column<string>(nullable: true),
                    Discriminator = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MergeTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpreadSheets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ImportDateUtc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpreadSheets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MergeTemplates1",
                columns: table => new
                {
                    EmailMergeTemplateId = table.Column<string>(nullable: false),
                    To = table.Column<string>(nullable: true),
                    Cc = table.Column<string>(nullable: true),
                    Bcc = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MergeTemplates1", x => x.EmailMergeTemplateId);
                    table.ForeignKey(
                        name: "FK_MergeTemplates1_MergeTemplates_EmailMergeTemplateId",
                        column: x => x.EmailMergeTemplateId,
                        principalTable: "MergeTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MergeTemplates1");

            migrationBuilder.DropTable(
                name: "SpreadSheets");

            migrationBuilder.DropTable(
                name: "MergeTemplates");
        }
    }
}
