using HandsForHire.DataAccesLayer.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HandsForHire.DataAccesLayer.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260610043000_AddReportTargetsAndUserWarnings")]
    public partial class AddReportTargetsAndUserWarnings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TargetEmail",
                table: "Reports",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "WarningCount",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetEmail",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "WarningCount",
                table: "Users");
        }
    }
}
