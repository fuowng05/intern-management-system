using Microsoft.AspNetCore.Authorization;

namespace InternshipManagement.Api.Authorization;

public class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission)
    {
        Policy = permission;
    }
}