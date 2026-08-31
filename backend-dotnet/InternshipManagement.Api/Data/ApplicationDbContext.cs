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

    public DbSet<User> Users => Set<User>();

    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();

    public DbSet<Company> Companies => Set<Company>();

    public DbSet<InternshipPeriod> InternshipPeriods => Set<InternshipPeriod>();

    public DbSet<Application> Applications => Set<Application>();

    public DbSet<Assignment> Assignments => Set<Assignment>();

    public DbSet<Evaluation> Evaluations => Set<Evaluation>();

    public DbSet<EvaluationCriterion> EvaluationCriteria => Set<EvaluationCriterion>();

    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        // Company
        modelBuilder.Entity<Company>()
            .HasKey(x => x.Id);

        // Student Profile
        modelBuilder.Entity<StudentProfile>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<StudentProfile>()
            .HasIndex(x => x.UserId)
            .IsUnique();

        modelBuilder.Entity<StudentProfile>()
            .HasOne(x => x.User)
            .WithOne(x => x.StudentProfile)
            .HasForeignKey<StudentProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User - Company
        modelBuilder.Entity<User>()
            .HasOne(x => x.Company)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.SetNull);

        // Internship Period
        modelBuilder.Entity<InternshipPeriod>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<InternshipPeriod>()
            .HasIndex(x => x.Code)
            .IsUnique();

        // Application
        modelBuilder.Entity<Application>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<Application>()
            .HasOne(x => x.Student)
            .WithMany(x => x.Applications)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Application>()
            .HasOne(x => x.Company)
            .WithMany(x => x.Applications)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Application>()
            .HasOne(x => x.Period)
            .WithMany(x => x.Applications)
            .HasForeignKey(x => x.PeriodId)
            .OnDelete(DeleteBehavior.Restrict);

        // Assignment
        modelBuilder.Entity<Assignment>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<Assignment>()
            .HasIndex(x => x.ApplicationId)
            .IsUnique();

        modelBuilder.Entity<Assignment>()
            .HasOne(x => x.Application)
            .WithOne(x => x.Assignment)
            .HasForeignKey<Assignment>(x => x.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Assignment>()
            .HasOne(x => x.Mentor)
            .WithMany(x => x.MentorAssignments)
            .HasForeignKey(x => x.MentorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Assignment>()
            .HasOne(x => x.Assigner)
            .WithMany(x => x.CreatedAssignments)
            .HasForeignKey(x => x.AssignedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Evaluation
        modelBuilder.Entity<Evaluation>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<Evaluation>()
            .HasIndex(x => x.ApplicationId)
            .IsUnique();

        modelBuilder.Entity<Evaluation>()
            .HasOne(x => x.Application)
            .WithOne(x => x.Evaluation)
            .HasForeignKey<Evaluation>(x => x.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Evaluation>()
            .Property(x => x.TotalScore)
            .HasPrecision(5, 2);

        // Evaluation Criteria
        modelBuilder.Entity<EvaluationCriterion>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<EvaluationCriterion>()
            .Property(x => x.Weight)
            .HasPrecision(5, 2);

        modelBuilder.Entity<EvaluationCriterion>()
            .Property(x => x.Score)
            .HasPrecision(5, 2);

        modelBuilder.Entity<EvaluationCriterion>()
            .HasOne(x => x.Evaluation)
            .WithMany(x => x.Criteria)
            .HasForeignKey(x => x.EvaluationId)
            .OnDelete(DeleteBehavior.Cascade);

        // Notification
        modelBuilder.Entity<Notification>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<Notification>()
            .HasOne(x => x.User)
            .WithMany(x => x.Notifications)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}