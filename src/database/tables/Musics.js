const Fs = require("../../backend/Fs");
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
                    'musics.id_file_image',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_image.subdirectory||files_image.file_name as url_image`),
                    'files_image.version as image_version',
                    'musics.id_file_music',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_music.subdirectory||files_music.file_name as url_music`),
                    'files_music.version as music_version',
                    'musics.id_file_instrumental_music',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_instrumental_music.subdirectory||files_instrumental_music.file_name as url_instrumental_music`),
                    'files_instrumental_music.version as instrumental_music_version',
                    'musics.id_language',
                    'musics.created_at',
                    'musics.updated_at',
                ])
                .where(`${table}.id_language`, lang)
                .leftJoin('files as files_image', 'musics.id_file_image', 'files_image.id_file')
                .leftJoin('files as files_music', 'musics.id_file_music', 'files_music.id_file')
                .leftJoin('files as files_instrumental_music', 'musics.id_file_instrumental_music', 'files_instrumental_music.id_file')

                .leftJoin('albums_musics', (join) => {
                    Data.ifJoin(join, request["id_album"], 'albums_musics.id_music', 'musics.id_music');
                })
                .where((p) => {
                    p = Data.filter(p, request, fillable, table);

                    if (request["id_album"]) {
                        p.where('albums_musics.id_album', request["id_album"]);
                    }
                })
                .orderBy(Data.order(request['sort_by'], table, ['order']))
                .paginate({ perPage: limit, currentPage: page })

            if (request["with_albums"]) {
                data = await Data.withPivot(data, 'musics', 'albums_musics', 'albums', 'id_music', 'id_album');
            }

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
                    'musics.id_music',
                    'musics.name',
                    'musics.id_file_image',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_image.subdirectory||files_image.file_name as url_image`),
                    'files_image.version as image_version',
                    'musics.id_file_music',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_music.subdirectory||files_music.file_name as url_music`),
                    'files_music.version as music_version',
                    'musics.id_file_instrumental_music',
                    knex.raw(`replace("${Fs.getAppFilesLangPath('#')}","#",${table}.id_language)||files_instrumental_music.subdirectory||files_instrumental_music.file_name as url_instrumental_music`),
                    'files_instrumental_music.version as instrumental_music_version',
                    'musics.id_language',
                    'musics.created_at',
                    'musics.updated_at',
                ])
                .leftJoin('files as files_image', 'musics.id_file_image', 'files_image.id_file')
                .leftJoin('files as files_music', 'musics.id_file_music', 'files_music.id_file')
                .leftJoin('files as files_instrumental_music', 'musics.id_file_instrumental_music', 'files_instrumental_music.id_file')
                .where('musics.id_music', id)
                .first();

            if (data) {
                data.lyric = await knex('lyrics')
                    .where('lyrics.id_music', data.id_music)
                    .leftJoin('files as files_image', 'lyrics.id_file_image', 'files_image.id_file')
                    .select([
                        'lyrics.id_lyric',
                        'lyrics.id_music',
                        'lyrics.lyric',
                        knex.raw(`ifnull(lyrics.id_file_image,0${data.id_file_image}) id_file_image`),
                        knex.raw(`ifnull(replace("${Fs.getAppFilesLangPath('#')}","#",lyrics.id_language)||files_image.subdirectory||files_image.file_name,"${data.url_image}") as url_image`),
                        knex.raw(`ifnull(files_image.version,0${data.image_version}) as image_version`),
                        'lyrics.time',
                        'lyrics.instrumental_time',
                        'lyrics.show_slide',
                        'lyrics.order',
                        'lyrics.id_language',
                        'lyrics.created_at',
                        'lyrics.updated_at',
                    ])
                    .orderBy('lyrics.order')
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