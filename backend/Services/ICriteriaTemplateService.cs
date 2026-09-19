using InternshipManagement.Api.DTOs.CriteriaTemplates;

namespace InternshipManagement.Api.Services;

public interface ICriteriaTemplateService
{
    Task<List<CriteriaTemplateResponse>> GetAllAsync();

    Task<CriteriaTemplateResponse?> GetByIdAsync(Guid id);

    Task<CriteriaTemplateResponse> CreateAsync(
        CreateCriteriaTemplateRequest request);

    Task<CriteriaTemplateResponse?> AddItemAsync(
        Guid templateId,
        AddCriteriaTemplateItemRequest request);

    Task<CriteriaTemplateResponse?> IssueAsync(
        Guid templateId,
        Guid issuedBy);

    Task<bool> DeleteItemAsync(
        Guid templateId,
        Guid itemId);
}