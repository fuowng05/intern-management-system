namespace InternshipManagement.Api.DTOs.CriteriaTemplates;

public class CriteriaTemplateResponse
{
    public Guid Id { get; set; }

    public Guid PeriodId { get; set; }

    public string PeriodCode { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int Version { get; set; }

    public string Status { get; set; } = string.Empty;

    public int MinItems { get; set; }

    public int MaxItems { get; set; }

    public bool AllowWeightEdit { get; set; }

    public decimal WeightTotal { get; set; }

    public Guid? IssuedBy { get; set; }

    public DateTime? IssuedAt { get; set; }

    public List<CriteriaTemplateItemResponse> Items { get; set; } = new();
}