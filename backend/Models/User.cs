namespace InternshipManagement.Api.Models;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    // Tạm giữ để JWT Role Authorization hiện tại vẫn hoạt động

    public string FullName { get; set; } = string.Empty;

    public Guid? CompanyId { get; set; }

    public bool IsActive { get; set; } = true;

    public int FailedLoginCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Company? Company { get; set; }

    public StudentProfile? StudentProfile { get; set; }

    public ICollection<UserRole> UserRoles { get; set; }
        = new List<UserRole>();
}