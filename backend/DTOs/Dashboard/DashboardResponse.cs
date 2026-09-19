namespace InternshipManagement.Api.DTOs.Dashboard;

public class DashboardResponse
{
    public int TotalStudents { get; set; }
    public int TotalCompanies { get; set; }
    public int TotalApplications { get; set; }
    public int TotalAssignments { get; set; }

    public ApplicationStatistics Applications { get; set; } = new();
    public EvaluationStatistics Evaluations { get; set; } = new();
}

public class ApplicationStatistics
{
    public int Pending { get; set; }
    public int Approved { get; set; }
    public int Rejected { get; set; }
}

public class EvaluationStatistics
{
    public int Total { get; set; }

    public int Draft { get; set; }
    public int Submitted { get; set; }
    public int Returned { get; set; }
    public int Published { get; set; }

    public int Passed { get; set; }
    public int Failed { get; set; }

    public decimal? AverageScore { get; set; }
}