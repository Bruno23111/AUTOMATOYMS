const API_URL = ''; // Mesma origem

async function enviarEvento(eventoId) {
    try {
        const response = await fetch(`${API_URL}/processar-evento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ evento: eventoId })
        });

        const data = await response.json();

        if (response.ok) {
            atualizarUI(data);
            adicionarLog(`Evento ${eventoId} processado: ${data.estado} ${data.subEstado !== 0 ? '(' + obterSubEstadoNome(data.subEstado) + ')' : ''}`, false);
            mostrarStatus(data.mensagem, 'success');
        } else {
            adicionarLog(`ERRO: ${data.mensagem}`, true);
            mostrarStatus(data.mensagem, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar evento:', error);
        adicionarLog('Erro de conexão com o servidor.', true);
    }
}

async function resetar() {
    const response = await fetch(`${API_URL}/reset`, { method: 'POST' });
    const data = await response.json();
    atualizarUI(data);
    adicionarLog('Simulador resetado.', false);
    document.getElementById('log').innerHTML = '<div class="log-entry">Sistema inicializado. Aguardando eventos...</div>';
}

function atualizarUI(data) {
    // Limpar classes ativas
    document.querySelectorAll('.state-card').forEach(card => {
        card.classList.remove('active', 'finalized');
    });
    document.querySelectorAll('.sub-state').forEach(div => div.innerText = '');

    const estadoNome = obterEstadoNome(data.estado);
    const card = document.getElementById(`state-${estadoNome}`);
    
    if (card) {
        card.classList.add('active');
        if (estadoNome === 'Finalizado') card.classList.add('finalized');
        
        if (data.subEstado !== 0) {
            const subDiv = document.getElementById(`sub-${estadoNome}`);
            if (subDiv) subDiv.innerText = `[${obterSubEstadoNome(data.subEstado)}]`;
        }
    }
}

function adicionarLog(msg, isError) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = isError ? 'log-entry log-error' : 'log-entry';
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.prepend(entry);
}

function mostrarStatus(msg, type) {
    const statusDiv = document.getElementById('status-msg');
    statusDiv.innerText = msg;
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    statusDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

function obterEstadoNome(id) {
    const estados = ['Portaria', 'Pesagem_Entrada', 'Doca', 'Pesagem_Saida', 'Finalizado', 'Erro'];
    return estados[id];
}

function obterSubEstadoNome(id) {
    const subs = ['Nenhum', 'Aguardando', 'Estabilizando', 'Capturado'];
    return subs[id];
}

// Inicializar estado ao carregar
window.onload = async () => {
    const response = await fetch(`${API_URL}/estado`);
    const data = await response.json();
    atualizarUI(data);
};
