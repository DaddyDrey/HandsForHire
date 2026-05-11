using HandsForHire.DataAccesLayer.Context;
using Microsoft.EntityFrameworkCore;
using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.BusinessLogic.Structure;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IUserLogic, UserLogic>();
builder.Services.AddScoped<IProLogic, ProLogic>();
builder.Services.AddScoped<IReviewLogic, ReviewLogic>();
builder.Services.AddScoped<IConversationLogic, ConversationLogic>();
builder.Services.AddScoped<IMessageLogic, MessageLogic>();
builder.Services.AddScoped<IAnnouncementLogic, AnnouncementLogic>();
builder.Services.AddScoped<IProfessionLogic, ProfessionLogic>();
builder.Services.AddScoped<IReportLogic, ReportLogic>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
