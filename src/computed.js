export default {
    baixar: function () {
        return {
            albuns: this.data.downloads.albuns.filter((o) => this.data.downloads.baixados.albuns.indexOf(o) === -1),
            musicas: this.data.downloads.musicas.filter((o) => this.data.downloads.baixados.musicas.indexOf(o) === -1)
        };
    },
}