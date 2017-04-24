const backEnd = {};


backEnd.marcarRevisado = function (sha, committerRevisor, tipoRevisao) {
    return new Promise((resolve, reject) => {
        window.$.ajax({
            type: 'POST',
            dataType: 'json',
            url: `${window.env.BACK_END_NODE}/rpc/comentar-revisado`,
            data: {
                sha: sha,
                usernameRevisor: committerRevisor.username,
                tipoRevisao: tipoRevisao
            },
            success: () => {
                console.log('Sucesso ao comentar-revisado no backend!');
                resolve();
            },
            error: (err) => {
                console.error('Erro ao post!', err);
                alert('Erro ao comentar-revisado no backend! Verifique o console!');
                reject(err);
            }
        });
    })
};


export default backEnd
