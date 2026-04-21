using HandsForHire.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.DataAccesLayer.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Pro> Pros => Set<Pro>();
    public DbSet<Review> Reviews => Set<Review>();
}