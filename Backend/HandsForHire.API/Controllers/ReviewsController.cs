using HandsForHire.BusinessLayer.Interfaces;
using HandsForHire.Domain.DTOs.Reviews;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _reviewService.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var review = await _reviewService.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        return Ok(review);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var createdReview = await _reviewService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdReview.Id }, createdReview);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateReviewDto dto)
    {
        var updated = await _reviewService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _reviewService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}