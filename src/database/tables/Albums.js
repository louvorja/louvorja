const Fs = require("../../backend/Fs");
const knex = require("../knex");
const Data = require("../../helpers/DB");

const table = 'albums';

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
                    'albums.id_album',
                    'albums.name',
                    'albums.id_file_image',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files.subdirectory||files.file_name as url_image`),
                    'files.version as image_version',
                    'albums.id_language',
                    'albums.color',
                    knex.raw((request["categories_slug"] ? 'categories_albums.name' : '""') + ' as subtitle'),
                    knex.raw((request["categories_slug"] ? 'categories_albums.`order`' : '""') + ' as `order`'),
                    'albums.created_at',
                    'albums.updated_at'
                ])
                .where(`${table}.id_language`, lang)
                .leftJoin('files', 'albums.id_file_image', 'files.id_file')
                .distinct()

                .leftJoin('categories_albums', (join) => {
                    Data.ifJoin(join, request["categories_slug"], 'categories_albums.id_album', 'albums.id_album');
                })
                .leftJoin('categories', (join) => {
                    Data.ifJoin(join, request["categories_slug"], 'categories.id_category', 'categories_albums.id_category');
                })
                .where((p) => {
                    p = Data.filter(p, request, fillable, table);

                    if (request["categories_slug"]) {
                        let categories = request["categories_slug"].split(",");
                        p.whereIn('categories.slug', categories);
                    }
                })
                .orderBy(Data.order(request['sort_by'], table, ['order']))
                .paginate({ perPage: limit, currentPage: page })

            data = await Data.withPivot(data, 'albums', 'categories_albums', 'categories', 'id_album', 'id_category');

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

    async show(req, res, next) {
        try {
            let id = req.params.id;

            let data = await knex(table)
                .select([
                    'albums.id_album',
                    'albums.name',
                    'albums.id_file_image',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files.subdirectory||files.file_name as url_image`),
                    'files.version as image_version',
                    'albums.id_language',
                    'albums.color',
                    'albums.created_at',
                    'albums.updated_at'
                ])
                .leftJoin('files', 'albums.id_file_image', 'files.id_file')
                .where('albums.id_album', id)
                .first();

            if (data) {
                data.musics = await knex('musics')
                    .where('albums_musics.id_album', data.id_album)
                    .leftJoin('albums_musics', 'albums_musics.id_music', 'musics.id_music')
                    .leftJoin('files as files_image', 'musics.id_file_image', 'files_image.id_file')
                    .leftJoin('files as files_music', 'musics.id_file_music', 'files_music.id_file')
                    .leftJoin('files as files_instrumental_music', 'musics.id_file_instrumental_music', 'files_instrumental_music.id_file')
                    .select([
                        'musics.id_music',
                        'albums_musics.track',
                        'musics.name',
                        'musics.id_file_image',
                        knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",musics.id_language)||files_image.subdirectory||files_image.file_name as url_image`),
                        'files_image.version as image_version',
                        'musics.id_file_music',
                        knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",musics.id_language)||files_music.subdirectory||files_music.file_name as url_music`),
                        'files_music.version as music_version',
                        'musics.id_file_instrumental_music',
                        knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",musics.id_language)||files_instrumental_music.subdirectory||files_instrumental_music.file_name as url_instrumental_music`),
                        'files_instrumental_music.version as instrumental_music_version',
                        'musics.id_language',
                        'musics.created_at',
                        'musics.updated_at',
                    ])
                    .orderBy('albums_musics.track')
            }

            return res.json({
                status: "success",
                data
            });
        }
        catch (e) {
            return res.status(500).json({
                status: "error",
                data: e.message
            });
        }
    }
}