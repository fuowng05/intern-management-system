using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse> GetDashboardAsync()
    {
        // Chỉ đếm user thực sự có role STUDENT trong RBAC
        var totalStudents =
            await _context.UserRoles
                .AsNoTracking()
                .Where(ur =>
                    ur.Role.Code == "STUDENT" &&
                    ur.User.IsActive)
                .Select(ur => ur.UserId)
                .Distinct()
                .CountAsync();

        var totalCompanies =
            await _context.Companies
                .AsNoTracking()
                .CountAsync();

        var totalApplications =
            await _context.Applications
                .AsNoTracking()
                .CountAsync();

        var totalAssignments =
            await _context.Assignments
                .AsNoTracking()
                .CountAsync();

        var pendingApplications =
            await _context.Applications
                .AsNoTracking()
                .CountAsync(a =>
                    a.Status == "PENDING");

        var approvedApplications =
            await _context.Applications
                .AsNoTracking()
                .CountAsync(a =>
                    a.Status == "APPROVED");

        var rejectedApplications =
            await _context.Applications
                .AsNoTracking()
                .CountAsync(a =>
                    a.Status == "REJECTED");

        var totalEvaluations =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync();

        var draftEvaluations =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "DRAFT");

        var submittedEvaluations =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "SUBMITTED");

        var returnedEvaluations =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "RETURNED");

        var publishedEvaluations =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "PUBLISHED");

        var passed =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "PUBLISHED" &&
                    e.Result == "PASSED");

        var failed =
            await _context.Evaluations
                .AsNoTracking()
                .CountAsync(e =>
                    e.Status == "PUBLISHED" &&
                    e.Result == "FAILED");

       var averageScore =
            await _context.Evaluations
                .AsNoTracking()
                .Where(e =>
                    e.Status == "PUBLISHED" &&
                    e.TotalScore.HasValue)
                .Select(e => e.TotalScore)
                .AverageAsync();

        return new DashboardResponse
        {
            TotalStudents = totalStudents,
            TotalCompanies = totalCompanies,
            TotalApplications = totalApplications,
            TotalAssignments = totalAssignments,

            Applications = new ApplicationStatistics
            {
                Pending = pendingApplications,
                Approved = approvedApplications,
                Rejected = rejectedApplications
            },

            Evaluations = new EvaluationStatistics
            {
                Total = totalEvaluations,
                Draft = draftEvaluations,
                Submitted = submittedEvaluations,
                Returned = returnedEvaluations,
                Published = publishedEvaluations,
                Passed = passed,
                Failed = failed,
                AverageScore = averageScore
            }
        };
    }
}