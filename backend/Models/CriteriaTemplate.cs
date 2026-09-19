namespace InternshipManagement.Api.Models;

public class CriteriaTemplate
{
    public Guid Id { get; set; }

    public Guid PeriodId { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int Version { get; set; } = 1;

    public string Status { get; set; } = "DRAFT";

    public int MinItems { get; set; } = 3;

    public int MaxItems { get; set; } = 8;

    public bool AllowWeightEdit { get; set; } = true;

    public Guid? IssuedBy { get; set; }

    public DateTime? IssuedAt { get; set; }

    public InternshipPeriod Period { get; set; } = null!;

    public User? IssuedByUser { get; set; }

    public ICollection<CriteriaTemplateItem> Items { get; set; }
        = new List<CriteriaTemplateItem>();
}