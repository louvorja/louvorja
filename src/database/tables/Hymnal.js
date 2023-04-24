const knex = require("../knex");
const Data = require("../../helpers/DB");

const table = 'musics';

module.exports = {
    async index(req, res, next) {
        try {
            let request = req.query;
            let lang = req.params.lang;

            let limit = Data.limit(request.limit);
            let page = Data.page(request.page);
            let fillable = await Data.columns(table);

            let data = await knex(table)
                .select([
                    'musics.id_music',
                    'musics.name',
                    'albums_musics.track',
                    'musics.id_file_image',
                    knex.raw('files_image.subdirectory||files_image.file_name as url_image'),
                    'files_image.version as image_version',
                    'musics.id_file_music',
                    knex.raw('files_music.subdirectory||files_music.file_name as url_music'),
                    'files_music.version as music_version',
                    'musics.id_file_instrumental_music',
                    knex.raw('files_instrumental_music.subdirectory||files_instrumental_music.file_name as url_instrumental_music'),
                    'files_instrumental_music.version as instrumental_music_version',
                    'musics.id_language',
                    'musics.created_at',
                    'musics.updated_at',
                ])
                .where(`${table}.id_language`, lang)
                .where('categories.slug', 'hymnal')
                .join('albums_musics', 'albums_musics.id_music', 'musics.id_music')
                .join('categories_albums', 'categories_albums.id_album', 'albums_musics.id_album')
                .join('categories', 'categories.id_category', 'categories_albums.id_category')
                .leftJoin('files as files_image', 'musics.id_file_image', 'files_image.id_file')
                .leftJoin('files as files_music', 'musics.id_file_music', 'files_music.id_file')
                .leftJoin('files as files_instrumental_music', 'musics.id_file_instrumental_music', 'files_instrumental_music.id_file')
                .where((p) => {
                    p = Data.filter(p, request, fillable, table);
                })
                .orderBy(Data.order(request['sort_by'], table, ['order']))
                .paginate({ perPage: limit, currentPage: page })

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