using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Data;

public static class DemoDataSeeder
{
    private const string DemoPassword = "Demo@123";

    public static async Task SeedAsync(
        ApplicationDbContext context)
    {
        Console.WriteLine("=== DEMO DATA SEED START ===");

        var now = DateTime.UtcNow;

        // =====================================================
        // ROLES
        // =====================================================

        var studentRole = await context.Roles
            .FirstAsync(r => r.Code == "STUDENT");

        var mentorRole = await context.Roles
            .FirstAsync(r => r.Code == "MENTOR");

        var reviewerRole = await context.Roles
            .FirstAsync(r => r.Code == "REVIEWER");

        // =====================================================
        // COMPANIES
        // =====================================================

        var companies = new[]
        {
            new
            {
                Name = "FPT Software",
                TaxCode = "DEMO-FPT-001",
                Email = "internship@fpt-demo.local"
            },
            new
            {
                Name = "Viettel Digital",
                TaxCode = "DEMO-VTD-002",
                Email = "internship@viettel-demo.local"
            },
            new
            {
                Name = "VNPT Technology",
                TaxCode = "DEMO-VNPT-003",
                Email = "internship@vnpt-demo.local"
            },
            new
            {
                Name = "MISA",
                TaxCode = "DEMO-MISA-004",
                Email = "internship@misa-demo.local"
            }
        };

        foreach (var item in companies)
        {
            var exists = await context.Companies
                .AnyAsync(c => c.TaxCode == item.TaxCode);

            if (exists)
                continue;

            context.Companies.Add(new Company
            {
                Id = Guid.NewGuid(),
                Name = item.Name,
                TaxCode = item.TaxCode,
                ContactEmail = item.Email,
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            });
        }

        await context.SaveChangesAsync();

        // =====================================================
        // LOAD COMPANIES
        // =====================================================

        var fpt = await context.Companies
            .FirstAsync(c => c.TaxCode == "DEMO-FPT-001");

        var viettel = await context.Companies
            .FirstAsync(c => c.TaxCode == "DEMO-VTD-002");

        var vnpt = await context.Companies
            .FirstAsync(c => c.TaxCode == "DEMO-VNPT-003");

        var misa = await context.Companies
            .FirstAsync(c => c.TaxCode == "DEMO-MISA-004");

        // =====================================================
        // STUDENTS
        // =====================================================

        var students = new[]
        {
            new
            {
                Email = "student03@gmail.com",
                Name = "Nguyễn Minh Anh",
                Code = "SVTEST003",
                ClassName = "CNTT D2024A",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student04@gmail.com",
                Name = "Trần Đức Anh",
                Code = "SVTEST004",
                ClassName = "CNTT D2024A",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student05@gmail.com",
                Name = "Lê Hoàng Nam",
                Code = "SVTEST005",
                ClassName = "CNTT D2024A",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student06@gmail.com",
                Name = "Phạm Thu Hà",
                Code = "SVTEST006",
                ClassName = "CNTT D2024B",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student07@gmail.com",
                Name = "Đỗ Minh Quân",
                Code = "SVTEST007",
                ClassName = "CNTT D2024B",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student08@gmail.com",
                Name = "Nguyễn Khánh Linh",
                Code = "SVTEST008",
                ClassName = "CNTT D2024B",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student09@gmail.com",
                Name = "Vũ Đức Long",
                Code = "SVTEST009",
                ClassName = "CNTT D2024C",
                CompanyId = (Guid?)null
            },
            new
            {
                Email = "student10@gmail.com",
                Name = "Bùi Ngọc Mai",
                Code = "SVTEST010",
                ClassName = "CNTT D2024C",
                CompanyId = (Guid?)null
            }
        };

        foreach (var student in students)
        {
            await EnsureUserAsync(
                context,
                student.Email,
                student.Name,
                student.CompanyId,
                studentRole,
                student.Code,
                student.ClassName,
                now);
        }

        // =====================================================
        // MENTORS
        // =====================================================

        await EnsureUserAsync(
            context,
            "mentor02@gmail.com",
            "Trần Văn Minh",
            fpt.Id,
            mentorRole,
            null,
            null,
            now);

        await EnsureUserAsync(
            context,
            "mentor03@gmail.com",
            "Lê Thu Trang",
            viettel.Id,
            mentorRole,
            null,
            null,
            now);

        await EnsureUserAsync(
            context,
            "mentor04@gmail.com",
            "Nguyễn Đức Hoàng",
            vnpt.Id,
            mentorRole,
            null,
            null,
            now);

        await EnsureUserAsync(
            context,
            "mentor05@gmail.com",
            "Phạm Minh Tuấn",
            misa.Id,
            mentorRole,
            null,
            null,
            now);

        // =====================================================
        // REVIEWER
        // =====================================================

        await EnsureUserAsync(
            context,
            "reviewer02@gmail.com",
            "Trần Thu Hương",
            null,
            reviewerRole,
            null,
            null,
            now);

        // =====================================================
        // BUSINESS DEMO DATA
        // =====================================================

        var admin = await context.Users
            .FirstAsync(u => u.Email == "admin@gmail.com");

        var reviewer = await context.Users
            .FirstAsync(u => u.Email == "reviewer02@gmail.com");

        var period = await context.InternshipPeriods
            .FirstAsync(p => p.Code == "TT-2026-02");

        var template = await context.CriteriaTemplates
            .Include(t => t.Items)
            .FirstAsync(t =>
                t.Code == "EVAL-2026-02" &&
                t.PeriodId == period.Id &&
                t.Status == "PUBLISHED");

        var vbi = await context.Companies
            .FirstAsync(c => c.Name == "VBI Tràng An");

        var mentor01 = await context.Users
            .FirstAsync(u => u.Email == "mentor01@gmail.com");

        var mentor02 = await context.Users
            .FirstAsync(u => u.Email == "mentor02@gmail.com");

        var mentor03 = await context.Users
            .FirstAsync(u => u.Email == "mentor03@gmail.com");

        var mentor04 = await context.Users
            .FirstAsync(u => u.Email == "mentor04@gmail.com");

        var mentor05 = await context.Users
            .FirstAsync(u => u.Email == "mentor05@gmail.com");


        // Student03 → PUBLISHED → Xuất sắc
        await EnsureDemoApplicationAsync(
            context,
            "student03@gmail.com",
            period,
            fpt,
            "APPROVED",
            admin,
            mentor02,
            reviewer,
            template,
            "PUBLISHED",
            new decimal[] { 9.5m, 9.0m, 9.0m, 9.5m },
            now);


        // Student04 → PUBLISHED → Giỏi
        await EnsureDemoApplicationAsync(
            context,
            "student04@gmail.com",
            period,
            viettel,
            "APPROVED",
            admin,
            mentor03,
            reviewer,
            template,
            "PUBLISHED",
            new decimal[] { 8.5m, 8.0m, 8.5m, 8.5m },
            now);


        // Student05 → PUBLISHED → Khá
        await EnsureDemoApplicationAsync(
            context,
            "student05@gmail.com",
            period,
            vnpt,
            "APPROVED",
            admin,
            mentor04,
            reviewer,
            template,
            "PUBLISHED",
            new decimal[] { 7.5m, 7.0m, 7.5m, 8.0m },
            now);


        // Student06 → SUBMITTED
        await EnsureDemoApplicationAsync(
            context,
            "student06@gmail.com",
            period,
            misa,
            "APPROVED",
            admin,
            mentor05,
            reviewer,
            template,
            "SUBMITTED",
            new decimal[] { 8.0m, 8.5m, 8.0m, 8.5m },
            now);


        // Student07 → RETURNED
        await EnsureDemoApplicationAsync(
            context,
            "student07@gmail.com",
            period,
            vbi,
            "APPROVED",
            admin,
            mentor01,
            reviewer,
            template,
            "RETURNED",
            new decimal[] { 7.0m, 7.5m, 7.0m, 7.5m },
            now);


        // Student08 → DRAFT
        await EnsureDemoApplicationAsync(
            context,
            "student08@gmail.com",
            period,
            fpt,
            "APPROVED",
            admin,
            mentor02,
            reviewer,
            template,
            "DRAFT",
            null,
            now);


        // Student09 → PENDING
        await EnsureDemoApplicationAsync(
            context,
            "student09@gmail.com",
            period,
            viettel,
            "PENDING",
            admin,
            null,
            null,
            template,
            null,
            null,
            now);


        // Student10 → REJECTED
        await EnsureDemoApplicationAsync(
            context,
            "student10@gmail.com",
            period,
            misa,
            "REJECTED",
            admin,
            null,
            null,
            template,
            null,
            null,
            now);
        Console.WriteLine("=== DEMO DATA SEED COMPLETED ===");
        Console.WriteLine(
            $"Demo accounts password: {DemoPassword}");
    }

    // =========================================================
    // ENSURE USER
    // =========================================================

    private static async Task<User> EnsureUserAsync(
        ApplicationDbContext context,
        string email,
        string fullName,
        Guid? companyId,
        Role role,
        string? studentCode,
        string? className,
        DateTime now)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                FullName = fullName,
                CompanyId = companyId,
                IsActive = true,
                FailedLoginCount = 0,
                CreatedAt = now,
                UpdatedAt = now
            };

            var passwordHasher =
                new PasswordHasher<User>();

            user.PasswordHash =
                passwordHasher.HashPassword(
                    user,
                    DemoPassword);

            context.Users.Add(user);

            await context.SaveChangesAsync();
        }

        var hasRole = await context.UserRoles
            .AnyAsync(ur =>
                ur.UserId == user.Id &&
                ur.RoleId == role.Id);

        if (!hasRole)
        {
            context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });

            await context.SaveChangesAsync();
        }

        // =====================================================
        // STUDENT PROFILE
        // =====================================================

        if (!string.IsNullOrWhiteSpace(studentCode))
        {
            var profileExists =
                await context.StudentProfiles
                    .AnyAsync(p => p.UserId == user.Id);

            if (!profileExists)
            {
                context.StudentProfiles.Add(
                    new StudentProfile
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        StudentCode = studentCode,
                        ClassName = className,
                        Major = "Công nghệ thông tin",
                        Cohort = "2024"
                    });

                await context.SaveChangesAsync();
            }
        }

        return user;
    }
    private static async Task EnsureDemoApplicationAsync(
    ApplicationDbContext context,
    string studentEmail,
    InternshipPeriod period,
    Company company,
    string applicationStatus,
    User admin,
    User? mentor,
    User? reviewer,
    CriteriaTemplate template,
    string? evaluationStatus,
    decimal[]? scores,
    DateTime now)
{
    var student = await context.Users
        .FirstAsync(u => u.Email == studentEmail);

    // =====================================================
    // APPLICATION
    // =====================================================

    var application = await context.Applications
        .FirstOrDefaultAsync(a =>
            a.StudentId == student.Id &&
            a.PeriodId == period.Id);

    if (application == null)
    {
        application = new Application
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            PeriodId = period.Id,
            CompanyId = company.Id,
            Status = applicationStatus,
            CreatedAt = now,
            UpdatedAt = now
        };

        if (applicationStatus == "APPROVED" ||
            applicationStatus == "REJECTED")
        {
            application.DecidedBy = admin.Id;
            application.DecidedAt = now;
        }

        context.Applications.Add(application);

        await context.SaveChangesAsync();
    }

    // PENDING / REJECTED không có Assignment/Evaluation
    if (applicationStatus != "APPROVED" ||
        mentor == null ||
        string.IsNullOrWhiteSpace(evaluationStatus))
    {
        return;
    }

    // =====================================================
    // ASSIGNMENT
    // =====================================================

    var assignment = await context.Assignments
        .FirstOrDefaultAsync(a =>
            a.ApplicationId == application.Id);

    if (assignment == null)
    {
        assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            ApplicationId = application.Id,
            MentorId = mentor.Id,
            AssignedBy = admin.Id,
            AssignedAt = now
        };

        context.Assignments.Add(assignment);

        await context.SaveChangesAsync();
    }

    // =====================================================
    // EVALUATION
    // =====================================================

    var evaluation = await context.Evaluations
        .Include(e => e.Criteria)
        .Include(e => e.Publications)
        .FirstOrDefaultAsync(e =>
            e.ApplicationId == application.Id);

    if (evaluation != null)
        return;

    evaluation = new Evaluation
    {
        Id = Guid.NewGuid(),
        ApplicationId = application.Id,
        TemplateId = template.Id,
        MentorId = mentor.Id,
        Status = evaluationStatus,
        WeightTotal = template.Items.Sum(i => i.DefaultWeight),
        Version = 1,
        RowVersion = 1
    };

    // Reviewer chỉ được gắn khi đã qua bước review
    if (evaluationStatus == "RETURNED" ||
        evaluationStatus == "PUBLISHED")
    {
        evaluation.ReviewerId = reviewer?.Id;
        evaluation.ReviewedAt = now;
    }

    if (evaluationStatus == "SUBMITTED" ||
        evaluationStatus == "RETURNED" ||
        evaluationStatus == "PUBLISHED")
    {
        evaluation.SubmittedAt = now;
    }

    if (evaluationStatus == "RETURNED")
    {
        evaluation.ReturnReason =
            "Vui lòng bổ sung nhận xét chi tiết hơn trước khi công bố.";
    }

    if (evaluationStatus == "PUBLISHED")
    {
        evaluation.PublishedAt = now;
    }

    context.Evaluations.Add(evaluation);

    // =====================================================
    // CRITERIA SNAPSHOT
    // =====================================================

    var orderedItems = template.Items
        .OrderBy(i => i.DisplayOrder)
        .ToList();

    for (var index = 0; index < orderedItems.Count; index++)
    {
        var item = orderedItems[index];

        decimal? score = null;

        if (scores != null && index < scores.Length)
            score = scores[index];

        context.EvaluationCriteria.Add(
            new EvaluationCriterion
            {
                Id = Guid.NewGuid(),
                EvaluationId = evaluation.Id,
                SourceItemId = item.Id,
                Name = item.Name,
                Weight = item.DefaultWeight,
                Score = score,
                IsMandatory = item.IsMandatory,
                MinPassScore = item.MinPassScore,
                Comment = score.HasValue
                    ? GetDemoCriterionComment(score.Value)
                    : null,
                DisplayOrder = item.DisplayOrder
            });
    }

    // =====================================================
    // SCORE
    // =====================================================

    if (scores != null)
    {
        var totalScore = CalculateTotalScore(
            orderedItems,
            scores);

        evaluation.TotalScore = totalScore;

        evaluation.Classification =
            GetClassification(totalScore);

        var mandatoryFailed = orderedItems
            .Select((item, index) => new
            {
                Item = item,
                Score = scores[index]
            })
            .Any(x =>
                x.Item.IsMandatory &&
                x.Item.MinPassScore.HasValue &&
                x.Score < x.Item.MinPassScore.Value);

        evaluation.Result =
            totalScore < 5m || mandatoryFailed
                ? "FAILED"
                : "PASSED";

        evaluation.MentorComment =
            GetDemoMentorComment(
                totalScore,
                evaluation.Result);
    }

    await context.SaveChangesAsync();

    // =====================================================
    // PUBLICATION SNAPSHOT
    // =====================================================

    if (evaluationStatus == "PUBLISHED" &&
        evaluation.TotalScore.HasValue &&
        reviewer != null)
    {
        var publicationExists =
            await context.EvaluationPublications
                .AnyAsync(p =>
                    p.EvaluationId == evaluation.Id &&
                    p.Version == evaluation.Version);

        if (!publicationExists)
        {
            var criteriaSnapshot =
                orderedItems.Select((item, index) => new
                {
                    SourceItemId = item.Id,
                    Name = item.Name,
                    Weight = item.DefaultWeight,
                    Score = scores![index],
                    IsMandatory = item.IsMandatory,
                    MinPassScore = item.MinPassScore,
                    Comment =
                        GetDemoCriterionComment(scores[index]),
                    DisplayOrder = item.DisplayOrder
                })
                .ToList();

            var snapshot = new
            {
                EvaluationId = evaluation.Id,
                ApplicationId = application.Id,
                StudentId = student.Id,
                StudentName = student.FullName,
                CompanyId = company.Id,
                CompanyName = company.Name,
                TemplateId = template.Id,
                TemplateName = template.Name,
                MentorId = mentor.Id,
                MentorName = mentor.FullName,
                ReviewerId = reviewer.Id,
                ReviewerName = reviewer.FullName,
                Status = "PUBLISHED",
                WeightTotal = evaluation.WeightTotal,
                TotalScore = evaluation.TotalScore,
                Classification = evaluation.Classification,
                Result = evaluation.Result,
                MentorComment = evaluation.MentorComment,
                Version = evaluation.Version,
                PublishedAt = now,
                Criteria = criteriaSnapshot
            };

            context.EvaluationPublications.Add(
                new EvaluationPublication
                {
                    Id = Guid.NewGuid(),
                    EvaluationId = evaluation.Id,
                    Version = evaluation.Version,
                    SnapshotJson =
                        System.Text.Json.JsonSerializer.Serialize(
                            snapshot),
                    TotalScore =
                        evaluation.TotalScore.Value,
                    Classification =
                        evaluation.Classification!,
                    Result =
                        evaluation.Result!,
                    PublishedBy = reviewer.Id,
                    PublishedAt = now
                });

            await context.SaveChangesAsync();
        }
    }
}

private static decimal CalculateTotalScore(
    List<CriteriaTemplateItem> items,
    decimal[] scores)
{
    decimal total = 0m;

    for (var i = 0; i < items.Count; i++)
    {
        total +=
            items[i].DefaultWeight *
            scores[i];
    }

    return Math.Round(
        total / 100m,
        2,
        MidpointRounding.AwayFromZero);
}

private static string GetClassification(
    decimal totalScore)
{
    if (totalScore >= 9m)
        return "EXCELLENT";

    if (totalScore >= 8m)
        return "VERY_GOOD";

    if (totalScore >= 7m)
        return "GOOD";

    if (totalScore >= 5.5m)
        return "AVERAGE";

    if (totalScore >= 5m)
        return "WEAK_AVERAGE";

    return "FAIL";
}

private static string GetDemoCriterionComment(
    decimal score)
{
    if (score >= 9m)
        return "Hoàn thành xuất sắc yêu cầu của tiêu chí.";

    if (score >= 8m)
        return "Hoàn thành tốt yêu cầu của tiêu chí.";

    if (score >= 7m)
        return "Đáp ứng khá tốt yêu cầu của tiêu chí.";

    if (score >= 5m)
        return "Đáp ứng yêu cầu cơ bản của tiêu chí.";

    return "Cần cải thiện thêm ở tiêu chí này.";
}

private static string GetDemoMentorComment(
    decimal totalScore,
    string result)
{
    if (result == "FAILED")
        return "Sinh viên cần cải thiện thêm để đáp ứng yêu cầu của đợt thực tập.";

    if (totalScore >= 9m)
        return "Sinh viên hoàn thành xuất sắc nhiệm vụ, có tinh thần chủ động và trách nhiệm cao.";

    if (totalScore >= 8m)
        return "Sinh viên hoàn thành tốt nhiệm vụ, có thái độ nghiêm túc và phối hợp tốt.";

    if (totalScore >= 7m)
        return "Sinh viên hoàn thành khá tốt các nhiệm vụ được giao trong thời gian thực tập.";

    return "Sinh viên hoàn thành các yêu cầu cơ bản của đợt thực tập.";
}
} 