using BarberShop.Api.Data;
using BarberShop.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =========================================
// ===== CONFIGURAÇÃO DO BANCO DE DADOS ====
// =========================================
var cs = builder.Configuration.GetConnectionString("Default")!;
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseMySql(cs, new MySqlServerVersion(new Version(8, 0, 36))));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// =========================================
// ===== TESTE DE CONEXÃO ==================
// =========================================
app.MapGet("/", () => Results.Json(new { ok = true }));

// =========================================
// ===== CRUD: CLIENTS =====================
// =========================================

// LISTAR CLIENTES
app.MapGet("/api/clients", async (AppDbContext db) =>
    Results.Ok(await db.Clients.ToListAsync()));

// DETALHAR CLIENTE POR ID
app.MapGet("/api/clients/{id}", async (int id, AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    return client is null ? Results.NotFound() : Results.Ok(client);
});

// CRIAR CLIENTE
app.MapPost("/api/clients", async (Client c, AppDbContext db) =>
{
    db.Clients.Add(c);
    await db.SaveChangesAsync();
    return Results.Created($"/api/clients/{c.Id}", c);
});

// ATUALIZAR CLIENTE
app.MapPut("/api/clients/{id}", async (int id, Client input, AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client is null) return Results.NotFound();

    client.Nome_Cliente = input.Nome_Cliente;
    client.Numero_Telefone = input.Numero_Telefone;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETAR CLIENTE
app.MapDelete("/api/clients/{id}", async (int id, AppDbContext db) =>
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
app.MapGet("/api/employers", async (AppDbContext db) =>
    Results.Ok(await db.Employers.ToListAsync()));

// DETALHAR FUNCIONÁRIO POR ID
app.MapGet("/api/employers/{id}", async (int id, AppDbContext db) =>
{
    var emp = await db.Employers.FindAsync(id);
    return emp is null ? Results.NotFound() : Results.Ok(emp);
});

// CRIAR FUNCIONÁRIO
app.MapPost("/api/employers", async (Employer e, AppDbContext db) =>
{
    db.Employers.Add(e);
    await db.SaveChangesAsync();
    return Results.Created($"/api/employers/{e.Id}", e);
});

// ATUALIZAR FUNCIONÁRIO
app.MapPut("/api/employers/{id}", async (int id, Employer input, AppDbContext db) =>
{
    var emp = await db.Employers.FindAsync(id);
    if (emp is null) return Results.NotFound();

    emp.Nome_Funcionario = input.Nome_Funcionario;
    emp.Cargo_Funcionario = input.Cargo_Funcionario;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETAR FUNCIONÁRIO
app.MapDelete("/api/employers/{id}", async (int id, AppDbContext db) =>
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

// LISTAR AGENDAMENTOS
app.MapGet("/api/schedules", async (AppDbContext db) =>
    Results.Ok(await db.Schedules.ToListAsync()));

// CRIAR AGENDAMENTO
app.MapPost("/api/schedules", async (Schedule s, AppDbContext db) =>
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
app.MapDelete("/api/schedules/{id}", async (int id, AppDbContext db) =>
{
    var sched = await db.Schedules.FindAsync(id);
    if (sched is null) return Results.NotFound();

    db.Remove(sched);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();