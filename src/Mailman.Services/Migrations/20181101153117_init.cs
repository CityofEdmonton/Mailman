using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mailman.Services.Migrations
{
    public partial class init : Migration
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
                    TimestampColumn_ShouldPrefixNameWithMergeTemplateTitle = table.Column<bool>(nullable: false),
                    TimestampColumn_Title = table.Column<string>(nullable: true),
                    Discriminator = table.Column<string>(nullable: false),
                    EmailTemplate_To = table.Column<string>(nullable: true),
                    EmailTemplate_Cc = table.Column<string>(nullable: true),
                    EmailTemplate_Bcc = table.Column<string>(nullable: true),
                    EmailTemplate_Subject = table.Column<string>(nullable: true),
                    EmailTemplate_Body = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MergeTemplates", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MergeTemplates");
        }
    }
}
