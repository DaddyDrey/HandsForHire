using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Reviews;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewLogic _ReviewLogic;

    public ReviewsController(IReviewLogic ReviewLogic)
    {
        _ReviewLogic = ReviewLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _ReviewLogic.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var review = await _ReviewLogic.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        return Ok(review);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var createdReview = await _ReviewLogic.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdReview.Id }, createdReview);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateReviewDto dto)
    {
        var updated = await _ReviewLogic.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ReviewLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
