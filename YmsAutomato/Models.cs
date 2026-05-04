namespace YmsAutomato.Models
{
    public enum EstadoLogistico
    {
        Portaria,
        Pesagem_Entrada,
        Doca,
        Pesagem_Saida,
        Finalizado,
        Erro
    }

    public enum SubEstadoPesagem
    {
        Nenhum,
        Aguardando,
        Estabilizando,
        Capturado
    }

    public enum EventoLogistico
    {
        evento_rfid_portaria,
        evento_balanca_entrada,
        evento_estabilizacao,
        evento_captura,
        evento_liberacao_doca,
        evento_balanca_saida,
        ev_saida_finalizada
    }

    public record RequisicaoEvento(EventoLogistico Evento);
    public record RespostaEstado(EstadoLogistico Estado, SubEstadoPesagem SubEstado, string Mensagem);
}
