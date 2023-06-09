const knex = require("../database/knex");

module.exports = {
    filter(p, request, fillable, table = null) {

        request = Object.assign({}, request);
        Object.keys(request).map(function (key) {
            key.split(',').forEach(function (val) {
                fillable.indexOf(val) < 0 ? delete request[key] : ""
            })
        });

        Object.keys(request).forEach(function (val) {
            let value = request[val];
            field = (table ? table + '.' : '') + val;

            let term = value.split(":");
            if (!term[1]) {
                p.where(field, value);
            } else {
                let type = term[0];
                term.shift();
                value = term.join(":");
                if (type == "like") {
                    value = value.replace(/\*/g, '%');
                    p.whereLike(field, value);
                }
            }
        });
        return p;
    },
    async columns(table) {
        let columns = await knex.raw(`SELECT name FROM pragma_table_info("${table}")`);
        return columns.map(column => column.name);
    },
    order(fields, table = null, exception_table = []) {
        if (fields) {
            let items = fields.split(',');
            let ret = [];
            items.map(item => {
                let f = item.split('.');
                ret.push({
                    column: (!exception_table.includes(f[0]) && table ? table + '.' : '') + f[0],
                    order: f[1] || 'asc'
                });
            });
            return ret;
        } else {
            return [];
        }
        /*
        [
            { column: 'albums.name', order: 'asc' }
        ]
        let columns = await knex.raw('SELECT name FROM pragma_table_info("albums")');
        return columns.map(column => column.name);*/
    },
    page(value) {
        return +value || 1;
    },
    limit(value) {
        return value
            ? value <= 0
                ? 9999
                : +value
            : 100
    },
    ifJoin(join, param, field_1, field_2) {
        if (param) {
            return join.on(field_1, '=', field_2);
        } else {
            return join.on(1, '=', 2);
        }
    },
    return(data) {
        data.current_page = data.pagination.currentPage;
        data.per_page = data.pagination.perPage;
        data.from = data.pagination.from;
        data.to = data.pagination.to;
        return data;
    },
    async withPivot(data, primary_table, pivot_table, secondary_table, primary_field, secondary_field) {
        let ids_primary_field = [...new Set(
            data.data.map(item => {
                return item[primary_field];
            })
        )];

        let pivot_data = await knex.table(pivot_table)
            .select()
            .whereIn(primary_field, ids_primary_field);

        let ids_secondary_field = [...new Set(
            pivot_data.map(item => {
                return item[secondary_field];
            })
        )];

        let secondary_data = await knex.table(secondary_table)
            .select()
            .whereIn(secondary_field, ids_secondary_field);

        data.data.map(item => {
            let pivot_filter = pivot_data.filter(item_pivot => {
                return item_pivot[primary_field] == item[primary_field];
            });
            let secondary_filter = pivot_filter.map(item_pivot => {
                let secondary_filter = secondary_data.filter(item => {
                    return item_pivot[secondary_field] == item[secondary_field];
                })[0];
                secondary_filter['pivot'] = item_pivot;
                return secondary_filter;
            });
            item[secondary_table] = secondary_filter;
        })

        return data;
    },
}