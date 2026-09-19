using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // =========================================================
    // DbSets
    // =========================================================

    // Identity & Access
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    // Internship
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<InternshipPeriod> InternshipPeriods => Set<InternshipPeriod>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Assignment> Assignments => Set<Assignment>();

    // Evaluation
    public DbSet<CriteriaTemplate> CriteriaTemplates => Set<CriteriaTemplate>();
    public DbSet<CriteriaTemplateItem> CriteriaTemplateItems => Set<CriteriaTemplateItem>();
    public DbSet<Evaluation> Evaluations => Set<Evaluation>();
    public DbSet<EvaluationCriterion> EvaluationCriteria => Set<EvaluationCriterion>();
    public DbSet<EvaluationPublication> EvaluationPublications => Set<EvaluationPublication>();

    // Optional / existing module
    public DbSet<Notification> Notifications => Set<Notification>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureCompany(modelBuilder);
        ConfigureUser(modelBuilder);
        ConfigureStudentProfile(modelBuilder);

        ConfigureRole(modelBuilder);
        ConfigurePermission(modelBuilder);
        ConfigureUserRole(modelBuilder);
        ConfigureRolePermission(modelBuilder);
        ConfigureRefreshToken(modelBuilder);
        ConfigureAuditLog(modelBuilder);

        ConfigureInternshipPeriod(modelBuilder);
        ConfigureApplication(modelBuilder);
        ConfigureAssignment(modelBuilder);

        ConfigureCriteriaTemplate(modelBuilder);
        ConfigureCriteriaTemplateItem(modelBuilder);

        ConfigureEvaluation(modelBuilder);
        ConfigureEvaluationCriterion(modelBuilder);
        ConfigureEvaluationPublication(modelBuilder);

        ConfigureNotification(modelBuilder);
    }


    // =========================================================
    // COMPANY
    // =========================================================

    private static void ConfigureCompany(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Companies");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(c => c.TaxCode)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(c => c.TaxCode)
                .IsUnique();

            entity.Property(c => c.ContactEmail)
                .HasMaxLength(320);

            entity.Property(c => c.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(c => c.CreatedAt)
                .IsRequired();

            entity.Property(c => c.UpdatedAt)
                .IsRequired();
        });
    }


    // =========================================================
    // USER
    // =========================================================

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(320);

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(150);


            entity.Property(u => u.CompanyId)
                .IsRequired(false);

            entity.Property(u => u.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(u => u.FailedLoginCount)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(u => u.CreatedAt)
                .IsRequired();

            entity.Property(u => u.UpdatedAt)
                .IsRequired();

            entity.HasOne(u => u.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }


    // =========================================================
    // STUDENT PROFILE
    // =========================================================

    private static void ConfigureStudentProfile(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StudentProfile>(entity =>
        {
            entity.ToTable("StudentProfiles");

            entity.HasKey(s => s.Id);

            entity.Property(s => s.StudentCode)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(s => s.ClassName)
                .HasMaxLength(100);

            entity.Property(s => s.Major)
                .HasMaxLength(150);

            entity.Property(s => s.Cohort)
                .HasMaxLength(50);

            entity.HasIndex(s => s.UserId)
                .IsUnique();

            entity.HasIndex(s => s.StudentCode)
                .IsUnique();

            entity.HasOne(s => s.User)
                .WithOne(u => u.StudentProfile)
                .HasForeignKey<StudentProfile>(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }


    // =========================================================
    // ROLE
    // =========================================================

    private static void ConfigureRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");

            entity.HasKey(r => r.Id);

            entity.Property(r => r.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(r => r.Description)
                .HasMaxLength(500);

            entity.HasIndex(r => r.Code)
                .IsUnique();
        });
    }


    // =========================================================
    // PERMISSION
    // =========================================================

    private static void ConfigurePermission(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("Permissions");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.Code)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(p => p.Description)
                .HasMaxLength(500);

            entity.HasIndex(p => p.Code)
                .IsUnique();
        });
    }


    // =========================================================
    // USER ROLE
    // =========================================================

    private static void ConfigureUserRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("UserRoles");

            entity.HasKey(ur => new
            {
                ur.UserId,
                ur.RoleId
            });

            entity.HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }


    // =========================================================
    // ROLE PERMISSION
    // =========================================================

    private static void ConfigureRolePermission(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.ToTable("RolePermissions");

            entity.HasKey(rp => new
            {
                rp.RoleId,
                rp.PermissionId
            });

            entity.Property(rp => rp.Scope)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("SELF");

            entity.Property(rp => rp.GrantedAt)
                .IsRequired();

            entity.HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rp => rp.GrantedByUser)
                .WithMany()
                .HasForeignKey(rp => rp.GrantedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.ToTable(t =>
                t.HasCheckConstraint(
                    "CK_RolePermissions_Scope",
                    "`Scope` IN ('SELF','ASSIGNED','COMPANY','ALL')"));
        });
    }


    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    private static void ConfigureRefreshToken(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");

            entity.HasKey(r => r.Id);

            entity.Property(r => r.TokenHash)
                .IsRequired()
                .HasMaxLength(64);

            entity.HasIndex(r => r.TokenHash)
                .IsUnique();

            entity.Property(r => r.ExpiresAt)
                .IsRequired();

            entity.Property(r => r.RevokedAt)
                .IsRequired(false);

            entity.Property(r => r.ReplacedById)
                .IsRequired(false);

            entity.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.ReplacedBy)
                .WithMany()
                .HasForeignKey(r => r.ReplacedById)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }


    // =========================================================
    // INTERNSHIP PERIOD
    // =========================================================

    private static void ConfigureInternshipPeriod(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InternshipPeriod>(entity =>
        {
            entity.ToTable("InternshipPeriods");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(p => p.Code)
                .IsUnique();

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.StartDate)
                .IsRequired();

            entity.Property(p => p.EndDate)
                .IsRequired();

            entity.Property(p => p.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(p => p.CreatedAt)
                .IsRequired();

            entity.Property(p => p.UpdatedAt)
                .IsRequired();

            entity.ToTable(t =>
                t.HasCheckConstraint(
                    "CK_InternshipPeriods_DateRange",
                    "`EndDate` > `StartDate`"));
        });
    }


    // =========================================================
    // APPLICATION
    // =========================================================

    private static void ConfigureApplication(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Application>(entity =>
        {
            entity.ToTable("Applications");

            entity.HasKey(a => a.Id);

            entity.Property(a => a.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(a => a.DecidedBy)
                .IsRequired(false);

            entity.Property(a => a.DecidedAt)
                .IsRequired(false);

            entity.Property(a => a.CreatedAt)
                .IsRequired();

            entity.Property(a => a.UpdatedAt)
                .IsRequired();

            /*
             * BR-05:
             * Một sinh viên chỉ có một hồ sơ trong một đợt.
             */
            entity.HasIndex(a => new
            {
                a.StudentId,
                a.PeriodId
            })
            .IsUnique();

            /*
             * StudentId -> Users.Id
             *
             * Không trỏ StudentProfile.
             */
            entity.HasOne(a => a.Student)
                .WithMany()
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Period)
                .WithMany(p => p.Applications)
                .HasForeignKey(a => a.PeriodId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Company)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.DecidedByUser)
                .WithMany()
                .HasForeignKey(a => a.DecidedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => new
            {
                a.PeriodId,
                a.CompanyId,
                a.Status
            })
            .HasDatabaseName("IX_Applications_Period_Company_Status");
        });
    }


    // =========================================================
    // ASSIGNMENT
    // =========================================================

    private static void ConfigureAssignment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.ToTable("Assignments");

            entity.HasKey(a => a.Id);

            entity.Property(a => a.AssignedAt)
                .IsRequired();

            /*
             * Application 1 -> 0..1 Assignment
             */
            entity.HasIndex(a => a.ApplicationId)
                .IsUnique();

            entity.HasOne(a => a.Application)
                .WithOne(a => a.Assignment)
                .HasForeignKey<Assignment>(a => a.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Mentor)
                .WithMany()
                .HasForeignKey(a => a.MentorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.AssignedByUser)
                .WithMany()
                .HasForeignKey(a => a.AssignedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => new
            {
                a.MentorId,
                a.ApplicationId
            })
            .HasDatabaseName("IX_Assignments_Mentor_Application");
        });
    }


    // =========================================================
    // CRITERIA TEMPLATE
    // =========================================================

    private static void ConfigureCriteriaTemplate(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CriteriaTemplate>(entity =>
        {
            entity.ToTable("CriteriaTemplates");

            entity.HasKey(t => t.Id);

            entity.Property(t => t.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(t => t.Version)
                .IsRequired()
                .HasDefaultValue(1);

            entity.Property(t => t.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("DRAFT");

            entity.Property(t => t.MinItems)
                .IsRequired()
                .HasDefaultValue(3);

            entity.Property(t => t.MaxItems)
                .IsRequired()
                .HasDefaultValue(8);

            entity.Property(t => t.AllowWeightEdit)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(t => t.IssuedAt)
                .IsRequired(false);

            /*
             * UNIQUE(period_id, code, version)
             */
            entity.HasIndex(t => new
            {
                t.PeriodId,
                t.Code,
                t.Version
            })
            .IsUnique();

            entity.HasOne(t => t.Period)
                .WithMany()
                .HasForeignKey(t => t.PeriodId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(t => t.IssuedByUser)
                .WithMany()
                .HasForeignKey(t => t.IssuedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_CriteriaTemplates_MinMaxItems",
                    "`MinItems` <= `MaxItems`");

                t.HasCheckConstraint(
                    "CK_CriteriaTemplates_Status",
                    "`Status` IN ('DRAFT','PUBLISHED','ARCHIVED')");
            });
        });
    }


    // =========================================================
    // CRITERIA TEMPLATE ITEM
    // =========================================================

    private static void ConfigureCriteriaTemplateItem(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CriteriaTemplateItem>(entity =>
        {
            entity.ToTable("CriteriaTemplateItems");

            entity.HasKey(i => i.Id);

            entity.Property(i => i.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(i => i.DefaultWeight)
                .IsRequired()
                .HasPrecision(5, 2);

            entity.Property(i => i.IsMandatory)
                .IsRequired();

            entity.Property(i => i.MinPassScore)
                .IsRequired(false)
                .HasPrecision(4, 2);

            entity.Property(i => i.DisplayOrder)
                .IsRequired();

            entity.HasIndex(i => new
            {
                i.TemplateId,
                i.Name
            })
            .IsUnique();

            entity.HasIndex(i => new
            {
                i.TemplateId,
                i.DisplayOrder
            })
            .IsUnique();

            entity.HasOne(i => i.Template)
                .WithMany(t => t.Items)
                .HasForeignKey(i => i.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_CriteriaTemplateItems_DefaultWeight",
                    "`DefaultWeight` > 0 AND `DefaultWeight` <= 100");

                t.HasCheckConstraint(
                    "CK_CriteriaTemplateItems_MinPassScore",
                    "`MinPassScore` IS NULL OR " +
                    "(`MinPassScore` >= 0 AND `MinPassScore` <= 10)");
            });
        });
    }


    // =========================================================
    // EVALUATION
    // =========================================================

    private static void ConfigureEvaluation(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Evaluation>(entity =>
        {
            entity.ToTable("Evaluations");

            entity.HasKey(e => e.Id);

            /*
             * Application 1 -> 0..1 Evaluation
             */
            entity.HasIndex(e => e.ApplicationId)
                .IsUnique();

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("DRAFT");

            entity.Property(e => e.WeightTotal)
                .IsRequired()
                .HasPrecision(5, 2)
                .HasDefaultValue(0m);

            /*
             * TotalScore phải nullable.
             * DRAFT chưa có điểm tổng.
             */
            entity.Property(e => e.TotalScore)
                .IsRequired(false)
                .HasPrecision(4, 2);

            entity.Property(e => e.Classification)
                .IsRequired(false)
                .HasMaxLength(20);

            entity.Property(e => e.Result)
                .IsRequired(false)
                .HasMaxLength(20);

            entity.Property(e => e.MentorComment)
                .IsRequired(false)
                .HasMaxLength(2000);

            entity.Property(e => e.ReturnReason)
                .IsRequired(false)
                .HasMaxLength(500);

            entity.Property(e => e.Version)
                .IsRequired()
                .HasDefaultValue(1);

            /*
             * Theo tài liệu: BIGINT row_version.
             *
             * Service phải tăng RowVersion mỗi lần update.
             */
            entity.Property(e => e.RowVersion)
                .IsRequired()
                .HasDefaultValue(0L)
                .IsConcurrencyToken();

            entity.Property(e => e.SubmittedAt)
                .IsRequired(false);

            entity.Property(e => e.ReviewedAt)
                .IsRequired(false);

            entity.Property(e => e.PublishedAt)
                .IsRequired(false);

            entity.HasOne(e => e.Application)
                .WithOne(a => a.Evaluation)
                .HasForeignKey<Evaluation>(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Template)
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Mentor)
                .WithMany()
                .HasForeignKey(e => e.MentorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Reviewer)
                .WithMany()
                .HasForeignKey(e => e.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new
            {
                e.Status,
                e.SubmittedAt
            })
            .HasDatabaseName("IX_Evaluations_Status_SubmittedAt");

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_Evaluations_Status",
                    "`Status` IN ('DRAFT','SUBMITTED','RETURNED','PUBLISHED')");

                t.HasCheckConstraint(
                    "CK_Evaluations_WeightTotal",
                    "`WeightTotal` >= 0 AND `WeightTotal` <= 100");

                t.HasCheckConstraint(
                    "CK_Evaluations_TotalScore",
                    "`TotalScore` IS NULL OR " +
                    "(`TotalScore` >= 0 AND `TotalScore` <= 10)");

                /*
                 * BR-08:
                 * Người duyệt không được là mentor chấm.
                 */
                t.HasCheckConstraint(
                    "CK_Evaluations_SeparationOfDuties",
                    "`ReviewerId` IS NULL OR `ReviewerId` <> `MentorId`");

                t.HasCheckConstraint(
                    "CK_Evaluations_Result",
                    "`Result` IS NULL OR `Result` IN ('PASSED','FAILED')");
            });
        });
    }


    // =========================================================
    // EVALUATION CRITERION
    // =========================================================

    private static void ConfigureEvaluationCriterion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EvaluationCriterion>(entity =>
        {
            entity.ToTable("EvaluationCriteria");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(c => c.Weight)
                .IsRequired()
                .HasPrecision(5, 2);

            entity.Property(c => c.Score)
                .IsRequired(false)
                .HasPrecision(4, 2);

            entity.Property(c => c.IsMandatory)
                .IsRequired();

            entity.Property(c => c.MinPassScore)
                .IsRequired(false)
                .HasPrecision(4, 2);

            entity.Property(c => c.Comment)
                .IsRequired(false)
                .HasMaxLength(500);

            entity.Property(c => c.DisplayOrder)
                .IsRequired();

            entity.HasIndex(c => new
            {
                c.EvaluationId,
                c.Name
            })
            .IsUnique();

            entity.HasIndex(c => new
            {
                c.EvaluationId,
                c.DisplayOrder
            })
            .IsUnique();

            entity.HasOne(c => c.Evaluation)
                .WithMany(e => e.Criteria)
                .HasForeignKey(c => c.EvaluationId)
                .OnDelete(DeleteBehavior.Cascade);

            /*
             * SourceItemId nullable:
             * null = mentor tự thêm.
             */
            entity.HasOne(c => c.SourceItem)
                .WithMany()
                .HasForeignKey(c => c.SourceItemId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_EvaluationCriteria_Weight",
                    "`Weight` > 0 AND `Weight` <= 100");

                t.HasCheckConstraint(
                    "CK_EvaluationCriteria_Score",
                    "`Score` IS NULL OR (`Score` >= 0 AND `Score` <= 10)");

                t.HasCheckConstraint(
                    "CK_EvaluationCriteria_MinPassScore",
                    "`MinPassScore` IS NULL OR " +
                    "(`MinPassScore` >= 0 AND `MinPassScore` <= 10)");
            });
        });
    }


    // =========================================================
    // EVALUATION PUBLICATION
    // =========================================================

    private static void ConfigureEvaluationPublication(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EvaluationPublication>(entity =>
        {
            entity.ToTable("EvaluationPublications");

            entity.HasKey(p => p.Id);

            /*
             * BR-10:
             * Mỗi version của Evaluation chỉ có một snapshot.
             */
            entity.HasIndex(p => new
            {
                p.EvaluationId,
                p.Version
            })
            .IsUnique();

            entity.Property(p => p.Version)
                .IsRequired();

            entity.Property(p => p.SnapshotJson)
                .IsRequired()
                .HasColumnType("json");

            entity.Property(p => p.TotalScore)
                .IsRequired()
                .HasPrecision(4, 2);

            entity.Property(p => p.Classification)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(p => p.Result)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(p => p.PublishedAt)
                .IsRequired();

            entity.HasOne(p => p.Evaluation)
                .WithMany(e => e.Publications)
                .HasForeignKey(p => p.EvaluationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.PublishedByUser)
                .WithMany()
                .HasForeignKey(p => p.PublishedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(p => new
            {
                p.EvaluationId,
                p.Version
            })
            .HasDatabaseName("IX_EvaluationPublications_Evaluation_Version");
        });
    }


    // =========================================================
    // AUDIT LOG
    // =========================================================

    private static void ConfigureAuditLog(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs");

            entity.HasKey(a => a.Id);

            entity.Property(a => a.Action)
                .IsRequired()
                .HasMaxLength(60);

            entity.Property(a => a.EntityType)
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(a => a.OldStatus)
                .IsRequired(false)
                .HasMaxLength(20);

            entity.Property(a => a.NewStatus)
                .IsRequired(false)
                .HasMaxLength(20);

            entity.Property(a => a.Reason)
                .IsRequired(false)
                .HasMaxLength(500);

            entity.Property(a => a.CorrelationId)
                .IsRequired()
                .HasMaxLength(36);

            entity.Property(a => a.CreatedAt)
                .IsRequired();

            entity.HasOne(a => a.ActorUser)
                .WithMany()
                .HasForeignKey(a => a.ActorUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => new
            {
                a.EntityType,
                a.EntityId,
                a.CreatedAt
            })
            .HasDatabaseName("IX_AuditLogs_Entity_Time");
        });
    }


    // =========================================================
    // NOTIFICATION
    // =========================================================

    private static void ConfigureNotification(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");

            entity.HasKey(n => n.Id);

            entity.Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(n => n.IsRead)
                .IsRequired()
                .HasDefaultValue(false);

            entity.Property(n => n.CreatedAt)
                .IsRequired();

            entity.Property(n => n.UpdatedAt)
                .IsRequired();

            entity.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}