namespace InternshipManagement.Api.DTOs;

public class CreateEvaluationRequest
{
    public Guid ApplicationId { get; set; }

    public List<CreateEvaluationCriterionRequest> Criteria { get; set; }
        = new();
}

public class CreateEvaluationCriterionRequest
{
    public string Name { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal? Score { get; set; }
}
