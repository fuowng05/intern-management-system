using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<InternshipPeriod> InternshipPeriods => Set<InternshipPeriod>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Evaluation> Evaluations => Set<Evaluation>();
    public DbSet<EvaluationCriterion> EvaluationCriteria => Set<EvaluationCriterion>();
    public DbSet<Notification> Notifications => Set<Notification>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Company>(entity =>
{
    entity.ToTable("Companies");

    entity.HasKey(c => c.Id);

    entity.Property(c => c.Name)
        .IsRequired();

    entity.Property(c => c.Field)
        .IsRequired();

    entity.Property(c => c.CreatedAt)
        .IsRequired();

    entity.Property(c => c.UpdatedAt)
        .IsRequired();
});

        modelBuilder.Entity<User>(entity =>
{
    entity.HasKey(u => u.Id);

    entity.Property(u => u.Email)
        .IsRequired()
        .HasMaxLength(255);

    entity.HasIndex(u => u.Email)
        .IsUnique();

    entity.Property(u => u.PasswordHash)
        .IsRequired();

    entity.Property(u => u.Role)
        .IsRequired();

    entity.Property(u => u.CompanyId)
        .IsRequired(false);

    entity.Property(u => u.CreatedAt)
        .IsRequired();

    entity.Property(u => u.UpdatedAt)
        .IsRequired();

    entity.HasOne(u => u.Company)
        .WithMany(c => c.Users)
        .HasForeignKey(u => u.CompanyId)
        .OnDelete(DeleteBehavior.SetNull);
});
modelBuilder.Entity<StudentProfile>(entity =>
{
    entity.HasKey(s => s.Id);

    entity.HasOne(s => s.User)
        .WithOne()
        .HasForeignKey<StudentProfile>(s => s.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.Property(s => s.FullName)
        .IsRequired();

    entity.Property(s => s.StudentCode)
        .IsRequired(false);

    entity.Property(s => s.Major)
        .IsRequired(false);

    entity.Property(s => s.Phone)
        .IsRequired(false);
});

modelBuilder.Entity<InternshipPeriod>(entity =>
{
    entity.HasKey(p => p.Id);

    entity.Property(p => p.Code)
        .IsRequired()
        .HasMaxLength(255);

    entity.HasIndex(p => p.Code)
        .IsUnique();

    entity.Property(p => p.StartDate)
        .IsRequired();

    entity.Property(p => p.EndDate)
        .IsRequired();

    entity.Property(p => p.Status)
        .IsRequired();

    entity.Property(p => p.CreatedAt)
        .IsRequired();

    entity.Property(p => p.UpdatedAt)
        .IsRequired();
});

modelBuilder.Entity<Application>(entity =>
{
    entity.HasKey(a => a.Id);

    entity.Property(a => a.Status)
        .IsRequired();

    entity.Property(a => a.CreatedAt)
        .IsRequired();

    entity.Property(a => a.UpdatedAt)
        .IsRequired();

    entity.HasOne(a => a.Student)
        .WithMany()
        .HasForeignKey(a => a.StudentId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasOne(a => a.Period)
        .WithMany()
        .HasForeignKey(a => a.PeriodId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(a => a.Company)
        .WithMany()
        .HasForeignKey(a => a.CompanyId)
        .OnDelete(DeleteBehavior.Restrict);
});
modelBuilder.Entity<Assignment>(entity =>
{
    entity.HasKey(a => a.Id);

    entity.Property(a => a.CreatedAt)
        .IsRequired();

    entity.Property(a => a.UpdatedAt)
        .IsRequired();

    entity.HasOne(a => a.Application)
        .WithOne()
        .HasForeignKey<Assignment>(a => a.ApplicationId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasOne(a => a.Mentor)
        .WithMany()
        .HasForeignKey(a => a.MentorId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(a => a.AssignedByUser)
        .WithMany()
        .HasForeignKey(a => a.AssignedBy)
        .OnDelete(DeleteBehavior.Restrict);
});
modelBuilder.Entity<Evaluation>(entity =>
{
    entity.HasKey(e => e.Id);

    entity.Property(e => e.TotalScore)
        .IsRequired()
        .HasPrecision(5, 2);

    entity.Property(e => e.FinalStatus)
        .IsRequired();

    entity.Property(e => e.CreatedAt)
        .IsRequired();

    entity.Property(e => e.UpdatedAt)
        .IsRequired();

    entity.HasOne(e => e.Application)
        .WithOne()
        .HasForeignKey<Evaluation>(e => e.ApplicationId)
        .OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<EvaluationCriterion>(entity =>
{
    entity.HasKey(c => c.Id);

    entity.Property(c => c.Name)
        .IsRequired();

    entity.Property(c => c.Weight)
        .IsRequired()
        .HasPrecision(5, 2);

    entity.Property(c => c.Score)
        .IsRequired(false)
        .HasPrecision(5, 2);

    entity.Property(c => c.CreatedAt)
        .IsRequired();

    entity.Property(c => c.UpdatedAt)
        .IsRequired();

    entity.HasOne(c => c.Evaluation)
        .WithMany(e => e.Criteria)
        .HasForeignKey(c => c.EvaluationId)
        .OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<Notification>(entity =>
{
    entity.HasKey(n => n.Id);

    entity.Property(n => n.Title)
        .IsRequired();

    entity.Property(n => n.Message)
        .IsRequired();

    entity.Property(n => n.IsRead)
        .IsRequired();

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
