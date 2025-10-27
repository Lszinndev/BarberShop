using System.ComponentModel.DataAnnotations.Schema;

namespace BarberShop.Api.Models;

[Table("schedule")]
public class Schedule
{
    [Column("id")]
    public int Id { get; set; }

    [Column("id_cliente")]
    public int Id_Cliente { get; set; }

    [Column("id_funcionario")]
    public int Id_Funcionario { get; set; }

    [Column("servico")]
    public string Servico { get; set; } = string.Empty;

    [Column("data_agendamento")]
    public DateTime Data_Agendamento { get; set; }
}