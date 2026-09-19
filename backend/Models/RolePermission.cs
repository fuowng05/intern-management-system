namespace InternshipManagement.Api.Models;

public class RolePermission
{
    public Guid RoleId { get; set; }

    public Guid PermissionId { get; set; }

    public string Scope { get; set; } = "SELF";

    public Guid? GrantedBy { get; set; }

    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

    public Role Role { get; set; } = null!;

    public Permission Permission { get; set; } = null!;

    public User? GrantedByUser { get; set; }
}