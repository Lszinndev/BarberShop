using System.ComponentModel.DataAnnotations.Schema;

namespace BarberShop.Api.Models;

[Table("clients")]
public class Client
{
    [Column("id")]
    public int Id { get; set; }

    [Column("nome_Cliente")]
    public string Nome_Cliente { get; set; } = string.Empty;

    [Column("numero_Telefone")]
    public string Numero_Telefone { get; set; } = string.Empty;
}