"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const config_1 = require("../config");
class Connection {
    constructor() {
        // console.log('DB Connection constructor');
        Connection.init();
        // Connection.connection!.on('connection', function (connection) {
        //     console.log('DB Connection established');
        //     connection.on('error', function (err) {
        //         console.error(new Date(), 'MySQL error', err.code);
        //     });
        //     connection.on('close', function (err) {
        //         console.error(new Date(), 'MySQL close', err);
        //     });
        // });
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the pool was already created, return it instead of creating a new one.
            if (Connection.connection === undefined) {
                // console.log('Connecting  init to db', typeof Connection.connection);
                try {
                    Connection.connection = (0, promise_1.createPool)({
                        host: config_1.DB_HOST,
                        user: config_1.DB_USER,
                        password: config_1.DB_PASSWORD,
                        database: config_1.DB_NAME,
                        port: 3306,
                        waitForConnections: true,
                        connectionLimit: 10,
                        queueLimit: 0,
                    });
                    console.log('Connecting  established to db');
                    // Attempt to catch disconnects
                    // return Connection.connection;
                }
                catch (error) {
                    console.log('Error connecting to db: ', error);
                }
            }
            else {
                // console.log('Return connection to db: ');
                // return Connection.connection;
            }
        });
    }
}
exports.default = Connection;
Connection.connection = undefined;
