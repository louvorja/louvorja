const knex = require("../knex");
const Data = require("../../helpers/DB");

const table = 'languages';

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