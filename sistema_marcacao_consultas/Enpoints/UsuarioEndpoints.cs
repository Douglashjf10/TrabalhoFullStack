using sistema_marcacao_consultas.Data;
using sistema_marcacao_consultas.Models;
using sistema_marcacao_consultas.Services;
using Microsoft.EntityFrameworkCore;

namespace sistema_marcacao_consultas.Endpoints
{
    public static class UsuarioEndpoints
    {
        public static void MapUsuarioEndpoints(this WebApplication app)
        {
            app.MapPost("/api/usuarios", async (AppDbContext db, Usuario usuario) =>
            {
                if (string.IsNullOrWhiteSpace(usuario.Role))
                {
                    usuario.Role = "User";
                }

                usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
                db.Usuarios.Add(usuario);
                await db.SaveChangesAsync();

                return Results.Created($"/api/usuarios/{usuario.Id}", usuario);
            });


            app.MapPost("/api/auth/login", async (AppDbContext db, JwtTokenService jwtTokenService, LoginRequest loginRequest) =>
          {
              
              var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

              
              if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Senha, usuario.Senha))
              {
                  return Results.Unauthorized();
              }

              
              if (string.IsNullOrWhiteSpace(usuario.Role))
              {
                  return Results.BadRequest("Role do usuário está inválido. Contate o administrador.");
              }

              
              var token = jwtTokenService.GenerateToken(usuario.Id, usuario.Role);

              return Results.Ok(new { Token = token });
          });



            app.MapGet("/api/usuarios", async (AppDbContext db) =>
            {
                var usuarios = await db.Usuarios.ToListAsync();
                return Results.Ok(usuarios);
            });


            app.MapGet("/api/usuarios/{id:int}", async (AppDbContext db, int id) =>
            {
                var usuario = await db.Usuarios.FindAsync(id);
                return usuario != null ? Results.Ok(usuario) : Results.NotFound();
            });


            app.MapPut("/api/usuarios/{id:int}", async (AppDbContext db, int id, Usuario usuarioAtualizado) =>
            {
                var usuario = await db.Usuarios.FindAsync(id);
                if (usuario == null) return Results.NotFound();

                usuario.Nome = usuarioAtualizado.Nome;
                usuario.Email = usuarioAtualizado.Email;

                if (!string.IsNullOrWhiteSpace(usuarioAtualizado.Senha))
                {
                    usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuarioAtualizado.Senha);
                }

                usuario.Role = usuarioAtualizado.Role;

                await db.SaveChangesAsync();
                return Results.Ok(usuario);
            });


            app.MapDelete("/api/usuarios/{id:int}", async (AppDbContext db, int id) =>
            {
                var usuario = await db.Usuarios.FindAsync(id);
                if (usuario == null) return Results.NotFound();

                db.Usuarios.Remove(usuario);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
