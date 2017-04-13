const backEnd = {};


backEnd.marcarRevisado = function (sha, emailRevisor, feitoEmPar) {
    window.$.ajax({
        dataType: 'json',
        url: `${window.env.BACK_END_NODE}/rpc/marcar-revisado`,
        data: {
            sha: sha,
            revisor: emailRevisor,
            feitoEmPar: feitoEmPar
        },
        error: (err) => {
            console.error(err);
            alert('Erro ao gerar comentario de marcar como revisado! Verifique o console!');
        }
    });
};


export default backEnd
