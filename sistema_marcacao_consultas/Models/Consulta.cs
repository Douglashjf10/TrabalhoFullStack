namespace sistema_marcacao_consultas.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public DateTime DataHora { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}
