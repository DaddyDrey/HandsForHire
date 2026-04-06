using HandsForHire.BusinessLayer.Interfaces;
using HandsForHire.DataAccess.Context;
using HandsForHire.Domain.DTOs.Reviews;
using HandsForHire.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLayer.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllAsync()
    {
        return await _context.Reviews
            .Select(review => new ReviewDto
            {
                Id = review.Id,
                ProId = review.ProId,
                ReviewerName = review.ReviewerName,
                Rating = review.Rating,
                Comment = review.Comment
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
            Rating = review.Rating,
            Comment = review.Comment
        };
    }

    public async Task<ReviewDto> CreateAsync(CreateReviewDto dto)
    {
        var review = new Review
        {
            ProId = dto.ProId,
            ReviewerName = dto.ReviewerName,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return new ReviewDto
        {
            Id = review.Id,
            ProId = review.ProId,
            ReviewerName = review.ReviewerName,
            Rating = review.Rating,
            Comment = review.Comment
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