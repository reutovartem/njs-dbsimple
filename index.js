const mysql = require('mysql2/promise');

module.exports = class DBSimple {
    constructor(config) {
        this.connection = mysql.createPool(config);
    }

    async query(query, params) {
        await this.connection.query(query, params);
    }

    async select(query, params) {
        const rows = await this.connection.query(query, params);

        return rows[0];
    };

    async selectOne(query, params) {
        const rows = await this.connection.query(query, params);

        return rows[0] && rows[0].length > 0 ? rows[0][0] : null;
    };

    async insert(table, values) {
        let fields = [];
        let fieldValues = [];
        let insert = [];

        for (let prop in values) {
            fields.push('`' + prop + '`');
            fieldValues.push(values[prop]);
            insert.push('?');
        }

        const sql = "INSERT INTO `"+ table +"`("+ fields.join(',') +") VALUES ("+ insert.join(',') +")";

        const result = await this.connection.query(sql, fieldValues);

        if (Array.isArray(result) && result[0]) {
            return result[0].insertId;
        }

        return null;
    }
};