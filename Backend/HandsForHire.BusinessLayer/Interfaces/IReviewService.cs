using HandsForHire.Domain.DTOs.Reviews;

namespace HandsForHire.BusinessLayer.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetAllAsync();
    Task<ReviewDto?> GetByIdAsync(int id);
    Task<ReviewDto> CreateAsync(CreateReviewDto dto);
    Task<bool> UpdateAsync(int id, UpdateReviewDto dto);
    Task<bool> DeleteAsync(int id);
}