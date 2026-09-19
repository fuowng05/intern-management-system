using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Reports;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EvaluationResultReportResponse>>
        GetEvaluationResultsAsync()
    {
        var query =
            from publication in _context.EvaluationPublications.AsNoTracking()

            // Chỉ lấy publication có Version lớn nhất
            // của từng Evaluation
            where publication.Version ==
                _context.EvaluationPublications
                    .Where(p =>
                        p.EvaluationId ==
                        publication.EvaluationId)
                    .Max(p => p.Version)

            join evaluation in _context.Evaluations.AsNoTracking()
                on publication.EvaluationId equals evaluation.Id

            join application in _context.Applications.AsNoTracking()
                on evaluation.ApplicationId equals application.Id

            join student in _context.Users.AsNoTracking()
                on application.StudentId equals student.Id

            join profile in _context.StudentProfiles.AsNoTracking()
                on student.Id equals profile.UserId

            join company in _context.Companies.AsNoTracking()
                on application.CompanyId equals company.Id

            join period in _context.InternshipPeriods.AsNoTracking()
                on application.PeriodId equals period.Id

            join mentor in _context.Users.AsNoTracking()
                on evaluation.MentorId equals mentor.Id

            orderby publication.PublishedAt descending

            select new EvaluationResultReportResponse
            {
                EvaluationId = evaluation.Id,

                StudentCode = profile.StudentCode,
                StudentName = student.FullName,

                CompanyName = company.Name,

                PeriodCode = period.Code,
                PeriodName = period.Name,

                MentorName = mentor.FullName,

                // Kết quả chính thức luôn lấy từ Publication
                TotalScore = publication.TotalScore,
                Classification = publication.Classification,
                Result = publication.Result,
                PublishedAt = publication.PublishedAt
            };

        return await query.ToListAsync();
    }
}