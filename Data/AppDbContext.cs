cat > Data/AppDbContext.cs << 'EOF'
using Microsoft.EntityFrameworkCore;
using BarberShop.Api.Models;

namespace BarberShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Employer> Employers => Set<Employer>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
}
EOF