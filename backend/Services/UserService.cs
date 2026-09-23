using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MentorResponse>> GetMentorsAsync(
        Guid? companyId = null)
    {
        var query =
            from user in _context.Users.AsNoTracking()

            join userRole in _context.UserRoles.AsNoTracking()
                on user.Id equals userRole.UserId

            join role in _context.Roles.AsNoTracking()
                on userRole.RoleId equals role.Id

            where
                user.IsActive &&
                role.Code == "MENTOR"

            select user;

        if (companyId.HasValue)
        {
            query = query.Where(
                user => user.CompanyId == companyId.Value);
        }

        return await query
            .Distinct()
            .OrderBy(user => user.FullName)
            .Select(user => new MentorResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,

                CompanyId = user.CompanyId,

                CompanyName =
                    user.Company != null
                        ? user.Company.Name
                        : null
            })
            .ToListAsync();
    }
}