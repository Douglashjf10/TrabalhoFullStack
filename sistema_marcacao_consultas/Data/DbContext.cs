using Microsoft.EntityFrameworkCore;
using sistema_marcacao_consultas.Models;

namespace sistema_marcacao_consultas.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Consulta> Consultas { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
