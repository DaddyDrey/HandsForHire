using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Models.Reviews;
using HandsForHire.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class ReviewLogic : IReviewLogic
{
    private readonly AppDbContext _context;

    public ReviewLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllAsync()
    {
        return await _context.Reviews
            .OrderByDescending(r => r.CreatedAt)
            .Select(review => new ReviewDto
            {
                Id = review.Id,
                ProId = review.ProId,
                ReviewerName = review.ReviewerName,
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ReviewDto>> GetForProAsync(int proId)
    {
        return await _context.Reviews
            .Where(r => r.ProId == proId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(review => new ReviewDto
            {
                Id = review.Id,
                ProId = review.ProId,
                ReviewerName = review.ReviewerName,
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ReviewDto?> GetByIdAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return null;

        return new ReviewDto
        {
            Id = review.Id,
            ProId = review.ProId,
            ReviewerName = review.ReviewerName,
            ReviewerEmail = review.ReviewerEmail,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<ReviewDto> CreateAsync(CreateReviewDto dto)
    {
        var review = new Review
        {
            ProId = dto.ProId,
            ReviewerName = dto.ReviewerName,
            ReviewerEmail = dto.ReviewerEmail,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return new ReviewDto
        {
            Id = review.Id,
            ProId = review.ProId,
            ReviewerName = review.ReviewerName,
            ReviewerEmail = review.ReviewerEmail,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateReviewDto dto)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return false;

        review.ProId = dto.ProId;
        review.ReviewerName = dto.ReviewerName;
        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return false;

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }
}