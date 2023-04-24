const knex = require("./knex");

module.exports = {
    async store(req, res, next) {
        try {
            let table = req.params.table;

            let info = await knex.raw(`PRAGMA table_info(${table})`);
            let fields = [];
            info.map(item => {
                fields.push(item.name);
            });

            let data = req.body.map(item => {
                Object.keys(item).map(function (key) {
                    fields.indexOf(key) < 0 ? delete item[key] : ""
                });
                return item;
            });

            await knex.insert(data).table(table).onConflict().ignore();

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

    async create_table(req, res, next) {
        try {
            let table_name = req.params.table_name;
            await knex.schema.dropTableIfExists(table_name);
            await knex.schema.createTable(table_name, function (table) {
                Object.keys(req.body.columns).map(column_name => {
                    let column = req.body.columns[column_name];
                    if (column.type == 'integer') {
                        table.integer(column_name);
                    } else if (column.type == 'datetime') {
                        table.datetime(column_name);
                    } else {
                        table.string(column_name, column.length);
                    }
                })
                if (req.body.primary) {
                    table.primary(req.body.primary);
                }
            });
            //console.log(req.body.columns)

            return res.json({
                status: "success",
                data: table_name
            });
        }
        catch (e) {
            return res.status(500).json({
                status: "error",
                data: e.message
            });
        }
    },

    async drop_tables(req, res, next) {
        try {
            tables = await knex.raw(`
                                    select
                                        m.name as 'table'
                                    from sqlite_master m
                                    order by m.name
                                `);

            if (tables) {
                const promises = tables.map(async table => {
                    await knex.schema.dropTableIfExists(table.table);
                });
                await Promise.all(promises);
            }

            return res.json({
                status: "success"
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