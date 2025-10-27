using System.ComponentModel.DataAnnotations.Schema;

namespace BarberShop.Api.Models;

[Table("employer")]
public class Employer
{
    [Column("id")]
    public int Id { get; set; }

    [Column("nome_Funcionario")]
    public string Nome_Funcionario { get; set; } = string.Empty;

    [Column("cargo_Funcionario")]
    public string Cargo_Funcionario { get; set; } = string.Empty;
}