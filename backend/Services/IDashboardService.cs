using InternshipManagement.Api.DTOs.Dashboard;

namespace InternshipManagement.Api.Services;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync();
}