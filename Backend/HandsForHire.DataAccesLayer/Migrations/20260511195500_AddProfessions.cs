using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HandsForHire.DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Professions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professions", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Professions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Electrician" },
                    { 2, "Plumber" },
                    { 3, "Carpenter" },
                    { 4, "Painter" },
                    { 5, "HVAC" },
                    { 6, "Handyman" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Professions_Name",
                table: "Professions",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Professions");
        }
    }
}
