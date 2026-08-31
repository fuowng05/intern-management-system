namespace InternshipManagement.Api.Models;

public class Company
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Field { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<User> Users { get; set; }
        = new List<User>();

    public ICollection<Application> Applications { get; set; }
        = new List<Application>();
}