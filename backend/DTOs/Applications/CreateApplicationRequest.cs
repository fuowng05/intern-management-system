namespace InternshipManagement.Api.DTOs.Applications;

public class CreateApplicationRequest
{
    public Guid PeriodId { get; set; }

    public Guid CompanyId { get; set; }
}