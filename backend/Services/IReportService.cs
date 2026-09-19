using InternshipManagement.Api.DTOs.Reports;

namespace InternshipManagement.Api.Services;

public interface IReportService
{
    Task<List<EvaluationResultReportResponse>>
        GetEvaluationResultsAsync();
}