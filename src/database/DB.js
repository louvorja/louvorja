const knex = require("./knex");

module.exports = {
    async index(req, res, next) {
        try {
            let lang = req.params.lang;
            let table = req.params.table;

            data = await knex(table).first();

            console.log(req.params)

            return res.json({
                status: "success",
                data: data
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
        //
    },
    async tables(req, res, next) {
        try {
            tables = await knex.raw(`
                select
                    m.name as 'table', 
                    p.name as column,
                    p.type as type
                from sqlite_master m
                left outer join pragma_table_info(m.name) p
                on m.name <> p.name
                order by m.name, p.name
            `);

            data = {};
            if (tables) {
                this.tables.map(table => {
                    if (!data[table.table]) {
                        data[table.table] = {};
                    }
                    if (!data[table.table]['columns']) {
                        data[table.table]['columns'] = {};
                    }
                    data[table.table]['columns'][table.column] = {
                        type: table.type
                    };
                });
            }

            return res.json({
                status: "success",
                data: data
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