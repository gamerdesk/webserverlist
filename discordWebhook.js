const fetch = require('node-fetch');

async function sendToDiscord(webhookUrl, serverData) {
    if (!webhookUrl) {
        console.log('Webhook não fornecido, não enviando mensagem.');
        return;
    }

    // Criando a embed para enviar no Discord
    const embed = {
        username: 'Servidor Atualizado',
        embeds: [
            {
                title: serverData.name || 'Servidor Desconhecido',
                color: serverData.online ? 3066993 : 15158332, // Verde se online, vermelho se offline
                fields: [
                    {
                        name: 'IP',
                        value: `${serverData.ip}:${serverData.port}`,
                        inline: true
                    },
                    {
                        name: 'Tipo',
                        value: serverData.type,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: serverData.online ? '🟢 Online' : '🔴 Offline',
                        inline: true
                    },
                    {
                        name: 'Jogadores',
                        value: `${serverData.players} / ${serverData.maxPlayers}`,
                        inline: true
                    },
                    {
                        name: 'Jogadores Online',
                        value: serverData.playerNames || 'Nenhum jogador online',
                        inline: true
                    },
                    {
                        name: 'Ping',
                        value: serverData.ping ? `${serverData.ping} ms` : 'N/A',
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(embed)
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar mensagem para o Discord: ${response.statusText}`);
        }

        console.log('Mensagem enviada para o Discord com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar para o Discord:', error);
    }
}

module.exports = { sendToDiscord };
