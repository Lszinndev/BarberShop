using System.ComponentModel.DataAnnotations.Schema;

namespace BarberShop.Api.Models;

[Table("clients")]
public class Client
{
    [Column("id")]
    public int Id { get; set; }

    [Column("nome_Cliente")]
    public string Nome_Cliente { get; set; } = string.Empty;

    [Column("telefone_Celular")]
    public string Telefone_Celular { get; set; } = string.Empty;
}