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
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<Profession> Professions => Set<Profession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Conversation>()
            .HasIndex(c => new { c.UserId, c.ProId })
            .IsUnique();

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Profession>()
            .HasIndex(p => p.Name)
            .IsUnique();

        modelBuilder.Entity<Profession>().HasData(
            new Profession { Id = 1, Name = "Electrician" },
            new Profession { Id = 2, Name = "Plumber" },
            new Profession { Id = 3, Name = "Carpenter" },
            new Profession { Id = 4, Name = "Painter" },
            new Profession { Id = 5, Name = "HVAC" },
            new Profession { Id = 6, Name = "Handyman" }
        );
    }
}
