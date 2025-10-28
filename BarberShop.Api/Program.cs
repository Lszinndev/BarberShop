using BarberShop.Api.Data;
using BarberShop.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// =========================================
// ===== CONFIGURAÇÃO DO BANCO DE DADOS ====
// =========================================
var cs = builder.Configuration.GetConnectionString("Default")!;
builder.Services.AddDbContext<BarberShop.Api.Data.AppDbContext>(opt =>
    opt.UseMySql(cs, new MySqlServerVersion(new Version(8, 0, 36))));

builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();



app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(builder => builder
    .WithOrigins("http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseRouting();

// =========================================
// ===== TESTE DE CONEXÃO ==================
// =========================================
app.MapGet("/", () => Results.Json(new { ok = true }));

// =========================================
// ===== CRUD: CLIENTS =====================
// =========================================

// LISTAR CLIENTES
app.MapGet("/api/clients", async (BarberShop.Api.Data.AppDbContext db) =>
    Results.Ok(await db.Clients.ToListAsync()));

// DETALHAR CLIENTE POR ID
app.MapGet("/api/clients/{id}", async (int id, BarberShop.Api.Data.AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    return client is null ? Results.NotFound() : Results.Ok(client);
});

// CRIAR CLIENTE
app.MapPost("/api/clients", async (Client c, BarberShop.Api.Data.AppDbContext db) =>
{
    db.Clients.Add(c);
    await db.SaveChangesAsync();
    return Results.Created($"/api/clients/{c.Id}", c);
});

// ATUALIZAR CLIENTE
app.MapPut("/api/clients/{id}", async (int id, Client input, BarberShop.Api.Data.AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client is null) return Results.NotFound();

    client.Nome_Cliente = input.Nome_Cliente;
    client.Telefone_Celular = input.Telefone_Celular;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETAR CLIENTE
app.MapDelete("/api/clients/{id}", async (int id, BarberShop.Api.Data.AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client is null) return Results.NotFound();

    db.Remove(client);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// =========================================
// ===== CRUD: EMPLOYER ====================
// =========================================

// LISTAR FUNCIONÁRIOS
app.MapGet("/api/employers", async (BarberShop.Api.Data.AppDbContext db) =>
    Results.Ok(await db.Employers.ToListAsync()));

// DETALHAR FUNCIONÁRIO POR ID
app.MapGet("/api/employers/{id}", async (int id, BarberShop.Api.Data.AppDbContext db) =>
{
    var emp = await db.Employers.FindAsync(id);
    return emp is null ? Results.NotFound() : Results.Ok(emp);
});

// CRIAR FUNCIONÁRIO
app.MapPost("/api/employers", async (Employer e, BarberShop.Api.Data.AppDbContext db) =>
{
    db.Employers.Add(e);
    await db.SaveChangesAsync();
    return Results.Created($"/api/employers/{e.Id}", e);
});

// ATUALIZAR FUNCIONÁRIO
app.MapPut("/api/employers/{id}", async (int id, Employer input, BarberShop.Api.Data.AppDbContext db) =>
{
    var emp = await db.Employers.FindAsync(id);
    if (emp is null) return Results.NotFound();

    emp.Nome_Funcionario = input.Nome_Funcionario;
    emp.Cargo_Funcionario = input.Cargo_Funcionario;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETAR FUNCIONÁRIO
app.MapDelete("/api/employers/{id}", async (int id, BarberShop.Api.Data.AppDbContext db) =>
{
    var emp = await db.Employers.FindAsync(id);
    if (emp is null) return Results.NotFound();

    db.Remove(emp);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// =========================================
// ===== CRUD: SCHEDULE ====================
// =========================================

// LISTAR AGENDAMENTOS (com nomes do cliente e do funcionário)
app.MapGet("/api/schedules", async (BarberShop.Api.Data.AppDbContext db) =>
{
    var list = await (from s in db.Schedules
                      join c in db.Clients on s.Id_Cliente equals c.Id
                      join e in db.Employers on s.Id_Funcionario equals e.Id
                      select new {
                          id = s.Id,
                          id_Cliente = s.Id_Cliente,
                          id_Funcionario = s.Id_Funcionario,
                          servico = s.Servico,
                          // camelCase field for the date
                          dataAgendamento = s.Data_Agendamento,
                          // camelCase names for frontend consistency
                          clientName = c.Nome_Cliente,
                          employerName = e.Nome_Funcionario
                      }).ToListAsync();

    return Results.Ok(list);
});

// CRIAR AGENDAMENTO
app.MapPost("/api/schedules", async (Schedule s, BarberShop.Api.Data.AppDbContext db) =>
{
    // Validação: cliente e funcionário devem existir
    var clientExists = await db.Clients.AnyAsync(c => c.Id == s.Id_Cliente);
    var employerExists = await db.Employers.AnyAsync(e => e.Id == s.Id_Funcionario);

    if (!clientExists || !employerExists)
        return Results.BadRequest(new { error = "Cliente ou funcionário inválido." });

    db.Schedules.Add(s);
    await db.SaveChangesAsync();
    return Results.Created($"/api/schedules/{s.Id}", s);
});

// DELETAR AGENDAMENTO
app.MapDelete("/api/schedules/{id}", async (int id, BarberShop.Api.Data.AppDbContext db) =>
{
    var sched = await db.Schedules.FindAsync(id);
    if (sched is null) return Results.NotFound();

    db.Remove(sched);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Durante desenvolvimento, popular dados de exemplo se o banco estiver vazio.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<BarberShop.Api.Data.AppDbContext>();

    // Se não houver agendamentos, garanta pelo menos um (reutiliza client/employer existentes ou cria novos)
    if (!db.Schedules.Any())
    {
        // tenta reaproveitar um client e um employer já existentes
        var client = db.Clients.FirstOrDefault();
        var employer = db.Employers.FirstOrDefault();

        if (client is null)
        {
            client = new Client { Nome_Cliente = "Cliente Exemplo", Telefone_Celular = "99999-0000" };
            db.Clients.Add(client);
            db.SaveChanges();
        }

        if (employer is null)
        {
            employer = new Employer { Nome_Funcionario = "Barbeiro Exemplo", Cargo_Funcionario = "Barbeiro" };
            db.Employers.Add(employer);
            db.SaveChanges();
        }

        var schedule = new Schedule
        {
            Id_Cliente = client.Id,
            Id_Funcionario = employer.Id,
            Servico = "Corte de teste",
            Data_Agendamento = DateTime.Now.AddDays(1)
        };

        db.Schedules.Add(schedule);
        db.SaveChanges();
    }
}

app.Run();