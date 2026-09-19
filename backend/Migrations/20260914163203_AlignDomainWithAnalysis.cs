using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternshipManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AlignDomainWithAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_StudentProfiles_StudentId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_InternshipPeriods_PeriodId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Applications_ApplicationId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Users_MentorId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Applications_ApplicationId",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluationCriteria_Evaluations_EvaluationId",
                table: "EvaluationCriteria");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentProfiles_Users_UserId",
                table: "StudentProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Companies_CompanyId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_EvaluationCriteria_EvaluationId",
                table: "EvaluationCriteria");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_MentorId",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Applications_PeriodId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_StudentId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "FinalStatus",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "Field",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Assignments");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Assignments",
                newName: "AssignedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "varchar(320)",
                maxLength: 320,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "FailedLoginCount",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Users",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "StudentProfiles",
                keyColumn: "StudentCode",
                keyValue: null,
                column: "StudentCode",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "StudentProfiles",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Major",
                table: "StudentProfiles",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ClassName",
                table: "StudentProfiles",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Cohort",
                table: "StudentProfiles",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Notifications",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Notifications",
                type: "varchar(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<bool>(
                name: "IsRead",
                table: "Notifications",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "InternshipPeriods",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "InternshipPeriods",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "InternshipPeriods",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalScore",
                table: "Evaluations",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AddColumn<string>(
                name: "Classification",
                table: "Evaluations",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MentorComment",
                table: "Evaluations",
                type: "varchar(2000)",
                maxLength: 2000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "MentorId",
                table: "Evaluations",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "Evaluations",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Result",
                table: "Evaluations",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ReturnReason",
                table: "Evaluations",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Evaluations",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReviewerId",
                table: "Evaluations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<long>(
                name: "RowVersion",
                table: "Evaluations",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Evaluations",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "DRAFT")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "Evaluations",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TemplateId",
                table: "Evaluations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Evaluations",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightTotal",
                table: "Evaluations",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Score",
                table: "EvaluationCriteria",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "EvaluationCriteria",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "EvaluationCriteria",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "EvaluationCriteria",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsMandatory",
                table: "EvaluationCriteria",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "MinPassScore",
                table: "EvaluationCriteria",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SourceItemId",
                table: "EvaluationCriteria",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Companies",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Companies",
                type: "varchar(320)",
                maxLength: 320,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Companies",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxCode",
                table: "Companies",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Applications",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DecidedAt",
                table: "Applications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DecidedBy",
                table: "Applications",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ActorUserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Action = table.Column<string>(type: "varchar(60)", maxLength: 60, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EntityType = table.Column<string>(type: "varchar(40)", maxLength: 40, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EntityId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    OldStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NewStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Reason = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CorrelationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditLogs_Users_ActorUserId",
                        column: x => x.ActorUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CriteriaTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PeriodId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Version = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "DRAFT")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MinItems = table.Column<int>(type: "int", nullable: false, defaultValue: 3),
                    MaxItems = table.Column<int>(type: "int", nullable: false, defaultValue: 8),
                    AllowWeightEdit = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    IssuedBy = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    IssuedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CriteriaTemplates", x => x.Id);
                    table.CheckConstraint("CK_CriteriaTemplates_MinMaxItems", "`MinItems` <= `MaxItems`");
                    table.CheckConstraint("CK_CriteriaTemplates_Status", "`Status` IN ('DRAFT','PUBLISHED','ARCHIVED')");
                    table.ForeignKey(
                        name: "FK_CriteriaTemplates_InternshipPeriods_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "InternshipPeriods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CriteriaTemplates_Users_IssuedBy",
                        column: x => x.IssuedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EvaluationPublications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EvaluationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Version = table.Column<int>(type: "int", nullable: false),
                    SnapshotJson = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotalScore = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    Classification = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Result = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PublishedBy = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PublishedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluationPublications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluationPublications_Evaluations_EvaluationId",
                        column: x => x.EvaluationId,
                        principalTable: "Evaluations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EvaluationPublications_Users_PublishedBy",
                        column: x => x.PublishedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Code = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TokenHash = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReplacedById = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_RefreshTokens_ReplacedById",
                        column: x => x.ReplacedById,
                        principalTable: "RefreshTokens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CriteriaTemplateItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TemplateId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DefaultWeight = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    IsMandatory = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    MinPassScore = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CriteriaTemplateItems", x => x.Id);
                    table.CheckConstraint("CK_CriteriaTemplateItems_DefaultWeight", "`DefaultWeight` > 0 AND `DefaultWeight` <= 100");
                    table.CheckConstraint("CK_CriteriaTemplateItems_MinPassScore", "`MinPassScore` IS NULL OR (`MinPassScore` >= 0 AND `MinPassScore` <= 10)");
                    table.ForeignKey(
                        name: "FK_CriteriaTemplateItems_CriteriaTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "CriteriaTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PermissionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Scope = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "SELF")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GrantedBy = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    GrantedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.CheckConstraint("CK_RolePermissions_Scope", "`Scope` IN ('SELF','ASSIGNED','COMPANY','ALL')");
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Users_GrantedBy",
                        column: x => x.GrantedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RoleId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StudentProfiles_StudentCode",
                table: "StudentProfiles",
                column: "StudentCode",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_InternshipPeriods_DateRange",
                table: "InternshipPeriods",
                sql: "`EndDate` > `StartDate`");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_MentorId",
                table: "Evaluations",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_ReviewerId",
                table: "Evaluations",
                column: "ReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_Status_SubmittedAt",
                table: "Evaluations",
                columns: new[] { "Status", "SubmittedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_TemplateId",
                table: "Evaluations",
                column: "TemplateId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Evaluations_Result",
                table: "Evaluations",
                sql: "`Result` IS NULL OR `Result` IN ('PASSED','FAILED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Evaluations_SeparationOfDuties",
                table: "Evaluations",
                sql: "`ReviewerId` IS NULL OR `ReviewerId` <> `MentorId`");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Evaluations_Status",
                table: "Evaluations",
                sql: "`Status` IN ('DRAFT','SUBMITTED','RETURNED','PUBLISHED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Evaluations_TotalScore",
                table: "Evaluations",
                sql: "`TotalScore` IS NULL OR (`TotalScore` >= 0 AND `TotalScore` <= 10)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Evaluations_WeightTotal",
                table: "Evaluations",
                sql: "`WeightTotal` >= 0 AND `WeightTotal` <= 100");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCriteria_EvaluationId_DisplayOrder",
                table: "EvaluationCriteria",
                columns: new[] { "EvaluationId", "DisplayOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCriteria_EvaluationId_Name",
                table: "EvaluationCriteria",
                columns: new[] { "EvaluationId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCriteria_SourceItemId",
                table: "EvaluationCriteria",
                column: "SourceItemId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_EvaluationCriteria_MinPassScore",
                table: "EvaluationCriteria",
                sql: "`MinPassScore` IS NULL OR (`MinPassScore` >= 0 AND `MinPassScore` <= 10)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_EvaluationCriteria_Score",
                table: "EvaluationCriteria",
                sql: "`Score` IS NULL OR (`Score` >= 0 AND `Score` <= 10)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_EvaluationCriteria_Weight",
                table: "EvaluationCriteria",
                sql: "`Weight` > 0 AND `Weight` <= 100");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_TaxCode",
                table: "Companies",
                column: "TaxCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_Mentor_Application",
                table: "Assignments",
                columns: new[] { "MentorId", "ApplicationId" });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_DecidedBy",
                table: "Applications",
                column: "DecidedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_Period_Company_Status",
                table: "Applications",
                columns: new[] { "PeriodId", "CompanyId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_StudentId_PeriodId",
                table: "Applications",
                columns: new[] { "StudentId", "PeriodId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_ActorUserId",
                table: "AuditLogs",
                column: "ActorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Entity_Time",
                table: "AuditLogs",
                columns: new[] { "EntityType", "EntityId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_CriteriaTemplateItems_TemplateId_DisplayOrder",
                table: "CriteriaTemplateItems",
                columns: new[] { "TemplateId", "DisplayOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CriteriaTemplateItems_TemplateId_Name",
                table: "CriteriaTemplateItems",
                columns: new[] { "TemplateId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CriteriaTemplates_IssuedBy",
                table: "CriteriaTemplates",
                column: "IssuedBy");

            migrationBuilder.CreateIndex(
                name: "IX_CriteriaTemplates_PeriodId_Code_Version",
                table: "CriteriaTemplates",
                columns: new[] { "PeriodId", "Code", "Version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationPublications_Evaluation_Version",
                table: "EvaluationPublications",
                columns: new[] { "EvaluationId", "Version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationPublications_PublishedBy",
                table: "EvaluationPublications",
                column: "PublishedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_Code",
                table: "Permissions",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ReplacedById",
                table: "RefreshTokens",
                column: "ReplacedById");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_TokenHash",
                table: "RefreshTokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_GrantedBy",
                table: "RolePermissions",
                column: "GrantedBy");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                table: "Roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_InternshipPeriods_PeriodId",
                table: "Applications",
                column: "PeriodId",
                principalTable: "InternshipPeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Users_DecidedBy",
                table: "Applications",
                column: "DecidedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Users_StudentId",
                table: "Applications",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Applications_ApplicationId",
                table: "Assignments",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Users_MentorId",
                table: "Assignments",
                column: "MentorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluationCriteria_CriteriaTemplateItems_SourceItemId",
                table: "EvaluationCriteria",
                column: "SourceItemId",
                principalTable: "CriteriaTemplateItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Applications_ApplicationId",
                table: "Evaluations",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluationCriteria_Evaluations_EvaluationId",
                table: "EvaluationCriteria",
                column: "EvaluationId",
                principalTable: "Evaluations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_CriteriaTemplates_TemplateId",
                table: "Evaluations",
                column: "TemplateId",
                principalTable: "CriteriaTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Users_MentorId",
                table: "Evaluations",
                column: "MentorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Users_ReviewerId",
                table: "Evaluations",
                column: "ReviewerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentProfiles_Users_UserId",
                table: "StudentProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Companies_CompanyId",
                table: "Users",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_InternshipPeriods_PeriodId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Users_DecidedBy",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Users_StudentId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Applications_ApplicationId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Users_MentorId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluationCriteria_CriteriaTemplateItems_SourceItemId",
                table: "EvaluationCriteria");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluationCriteria_Evaluations_EvaluationId",
                table: "EvaluationCriteria");

            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Applications_ApplicationId",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_CriteriaTemplates_TemplateId",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Users_MentorId",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Users_ReviewerId",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentProfiles_Users_UserId",
                table: "StudentProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Companies_CompanyId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "CriteriaTemplateItems");

            migrationBuilder.DropTable(
                name: "EvaluationPublications");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "CriteriaTemplates");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_StudentProfiles_StudentCode",
                table: "StudentProfiles");

            migrationBuilder.DropCheckConstraint(
                name: "CK_InternshipPeriods_DateRange",
                table: "InternshipPeriods");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_MentorId",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_ReviewerId",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_Status_SubmittedAt",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_TemplateId",
                table: "Evaluations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Evaluations_Result",
                table: "Evaluations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Evaluations_SeparationOfDuties",
                table: "Evaluations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Evaluations_Status",
                table: "Evaluations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Evaluations_TotalScore",
                table: "Evaluations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Evaluations_WeightTotal",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_EvaluationCriteria_EvaluationId_DisplayOrder",
                table: "EvaluationCriteria");

            migrationBuilder.DropIndex(
                name: "IX_EvaluationCriteria_EvaluationId_Name",
                table: "EvaluationCriteria");

            migrationBuilder.DropIndex(
                name: "IX_EvaluationCriteria_SourceItemId",
                table: "EvaluationCriteria");

            migrationBuilder.DropCheckConstraint(
                name: "CK_EvaluationCriteria_MinPassScore",
                table: "EvaluationCriteria");

            migrationBuilder.DropCheckConstraint(
                name: "CK_EvaluationCriteria_Score",
                table: "EvaluationCriteria");

            migrationBuilder.DropCheckConstraint(
                name: "CK_EvaluationCriteria_Weight",
                table: "EvaluationCriteria");

            migrationBuilder.DropIndex(
                name: "IX_Companies_TaxCode",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_Mentor_Application",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Applications_DecidedBy",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_Period_Company_Status",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_StudentId_PeriodId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FailedLoginCount",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClassName",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "Cohort",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "InternshipPeriods");

            migrationBuilder.DropColumn(
                name: "Classification",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "MentorComment",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "MentorId",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "Result",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "ReturnReason",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "ReviewerId",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "WeightTotal",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "IsMandatory",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "MinPassScore",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "SourceItemId",
                table: "EvaluationCriteria");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "TaxCode",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "DecidedAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "DecidedBy",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "AssignedAt",
                table: "Assignments",
                newName: "UpdatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(320)",
                oldMaxLength: 320)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "StudentProfiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Major",
                table: "StudentProfiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(150)",
                oldMaxLength: 150,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "StudentProfiles",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "StudentProfiles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Notifications",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Notifications",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(2000)",
                oldMaxLength: 2000)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<bool>(
                name: "IsRead",
                table: "Notifications",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "InternshipPeriods",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "InternshipPeriods",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalScore",
                table: "Evaluations",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Evaluations",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FinalStatus",
                table: "Evaluations",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Evaluations",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<decimal>(
                name: "Score",
                table: "EvaluationCriteria",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "EvaluationCriteria",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EvaluationCriteria",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EvaluationCriteria",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Companies",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Field",
                table: "Companies",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Assignments",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Applications",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCriteria_EvaluationId",
                table: "EvaluationCriteria",
                column: "EvaluationId");

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluationCriteria_Evaluations_EvaluationId",
                table: "EvaluationCriteria",
                column: "EvaluationId",
                principalTable: "Evaluations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_MentorId",
                table: "Assignments",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_PeriodId",
                table: "Applications",
                column: "PeriodId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_InternshipPeriods_PeriodId",
                table: "Applications",
                column: "PeriodId",
                principalTable: "InternshipPeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.CreateIndex(
                name: "IX_Applications_StudentId",
                table: "Applications",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_StudentProfiles_StudentId",
                table: "Applications",
                column: "StudentId",
                principalTable: "StudentProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Applications_ApplicationId",
                table: "Assignments",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Users_MentorId",
                table: "Assignments",
                column: "MentorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Applications_ApplicationId",
                table: "Evaluations",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentProfiles_Users_UserId",
                table: "StudentProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Companies_CompanyId",
                table: "Users",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
