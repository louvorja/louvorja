const knex = require("../knex");
const Data = require("../../helpers/DB");

const table = 'files';

module.exports = {
    async index(req, res, next) {
        try {
            let request = req.query;

            let limit = Data.limit(request.limit);
            let page = Data.page(request.page);
            let fillable = await Data.columns(table);

            let data = await knex(table)
                .where((p) => {
                    p = Data.filter(p, request, fillable, table);

                    if (request["id_album"]) {
                        p.whereRaw('id_file in (select id_file_image from albums where albums.id_album=' + request["id_album"] + ')')
                            .orWhereRaw('id_file in (select id_file_image from musics inner join albums_musics on albums_musics.id_music=musics.id_music where albums_musics.id_album=' + request["id_album"] + ')')
                            .orWhereRaw('id_file in (select id_file_music from musics inner join albums_musics on albums_musics.id_music=musics.id_music where albums_musics.id_album=' + request["id_album"] + ')')
                            .orWhereRaw('id_file in (select id_file_instrumental_music from musics inner join albums_musics on albums_musics.id_music=musics.id_music where albums_musics.id_album=' + request["id_album"] + ')')
                            .orWhereRaw('id_file in (select id_file_image from lyrics inner join albums_musics on albums_musics.id_music=lyrics.id_music where albums_musics.id_album=' + request["id_album"] + ')');
                    }
                })
                .orderBy(Data.order(request['sort_by'], table, ['order']))
                .paginate({ perPage: limit, currentPage: page });

            data = Data.return(data);

            return res.json({
                status: "success",
                ...data
            });
        }
        catch (e) {
            return res.status(500).json({
                status: "error",
                data: e.message
            });
        }
    },

}