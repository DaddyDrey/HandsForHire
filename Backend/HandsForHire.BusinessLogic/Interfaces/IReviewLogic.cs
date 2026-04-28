using HandsForHire.Domain.Models.Reviews;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IReviewLogic
{
    Task<IEnumerable<ReviewDto>> GetAllAsync();
    Task<IEnumerable<ReviewDto>> GetForProAsync(int proId);
    Task<ReviewDto?> GetByIdAsync(int id);
    Task<ReviewDto> CreateAsync(CreateReviewDto dto);
    Task<bool> UpdateAsync(int id, UpdateReviewDto dto);
    Task<bool> DeleteAsync(int id);
}