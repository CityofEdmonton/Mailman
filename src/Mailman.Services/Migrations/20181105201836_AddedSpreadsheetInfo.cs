using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mailman.Services.Migrations
{
    public partial class AddedSpreadsheetInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Conditional",
                table: "MergeTemplates",
                nullable: true);

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpreadSheets");

            migrationBuilder.DropColumn(
                name: "Conditional",
                table: "MergeTemplates");
        }
    }
}
