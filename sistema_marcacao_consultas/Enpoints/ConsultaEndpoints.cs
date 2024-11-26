using sistema_marcacao_consultas.Data;
using sistema_marcacao_consultas.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace sistema_marcacao_consultas.Endpoints
{
    public static class ConsultaEndpoints
    {
        public static void MapConsultaEndpoints(this WebApplication app)
        {

            app.MapPost("/api/consultas", [Authorize(Roles = "Admin")] async (AppDbContext db, Consulta consulta) =>
            {
                var usuario = await db.Usuarios.FindAsync(consulta.UsuarioId);
                if (usuario == null) return Results.BadRequest("Usuário não encontrado.");

                db.Consultas.Add(consulta);
                await db.SaveChangesAsync();
                return Results.Created($"/api/consultas/{consulta.Id}", consulta);
            
            });


            app.MapGet("/api/consultas", [Authorize(Roles = "Admin")] async (AppDbContext db) =>
            {

                var consultas = await db.Consultas.Include(c => c.Usuario).ToListAsync();
                return Results.Ok(consultas);
            });


            app.MapGet("/api/consultas/minhas", [Authorize] async (AppDbContext db, ClaimsPrincipal user) =>
            {

                var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");


                var consultas = await db.Consultas
                                        .Where(c => c.UsuarioId == userId)
                                        .ToListAsync();
                return Results.Ok(consultas);
            });


            app.MapGet("/api/consultas/{id:int}", [Authorize(Roles = "Admin")] async (AppDbContext db, int id) =>
            {

                var consulta = await db.Consultas.Include(c => c.Usuario).FirstOrDefaultAsync(c => c.Id == id);
                return consulta != null ? Results.Ok(consulta) : Results.NotFound();
            });


            app.MapPut("/api/consultas/{id:int}", [Authorize(Roles = "Admin")] async (AppDbContext db, int id, Consulta consultaAtualizada) =>
            {

                var consulta = await db.Consultas.FindAsync(id);
                if (consulta == null) return Results.NotFound();


                consulta.Descricao = consultaAtualizada.Descricao;
                consulta.DataHora = consultaAtualizada.DataHora;
                consulta.UsuarioId = consultaAtualizada.UsuarioId;


                await db.SaveChangesAsync();
                return Results.Ok(consulta);
            });


            app.MapDelete("/api/consultas/{id:int}", [Authorize(Roles = "Admin")] async (AppDbContext db, int id) =>
            {

                var consulta = await db.Consultas.FindAsync(id);
                if (consulta == null) return Results.NotFound();


                db.Consultas.Remove(consulta);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}

