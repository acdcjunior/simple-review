const backEnd = {};


backEnd.marcarRevisado = function (sha, emailRevisor, feitoEmPar) {
    return new Promise((resolve, reject) => {
        window.$.ajax({
            type: 'POST',
            dataType: 'json',
            url: `${window.env.BACK_END_NODE}/rpc/marcar-revisado`,
            data: {
                sha: sha,
                revisor: emailRevisor,
                feitoEmPar: feitoEmPar
            },
            success: () => {
                console.log('Sucesso ao postar!');
                resolve();
            },
            error: (err) => {
                console.error('Erro ao post!', err);
                alert('Erro ao gerar comentario de marcar como revisado! Verifique o console!');
                reject(err);
            }
        });
    })
};


export default backEnd
