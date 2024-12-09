const { GameDig } = require('gamedig');

// Adiciona um novo servidor
function addServer(ip, port, type, webhook) {
    return { ip, port: parseInt(port, 10), type, webhook }; // Inclui o webhook como parte do servidor
}

// Busca o status dos servidores com GameDig
async function getCachedServerStatuses(serverList) {
    const promises = serverList.map(server =>
        GameDig.query({
            type: server.type,
            host: server.ip,
            port: server.port
        })
        .then(state => {
            console.log('Dados do servidor:', state); // Adicionado para debug
            return {
                name: state.name || server.ip,
                ip: server.ip,
                port: server.port,
                type: server.type,
                map: state.map,
                players: state.players.length,
                maxPlayers: state.maxplayers,
                playerNames: state.players.map(p => p.name).join(', '),
                online: true,
                ping: state.ping
            };
        })
        .catch(() => ({
            name: server.ip,
            ip: server.ip,
            port: server.port,
            type: server.type,
            online: false,
            players: 0,
            maxPlayers: 0,
            playerNames: 'Nenhum jogador online',
            ping: 'N/A'
        }))
    );

    return Promise.all(promises);
}

module.exports = { addServer, getCachedServerStatuses };
