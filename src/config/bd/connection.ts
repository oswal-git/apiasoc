import { createPool, Pool } from 'mysql2/promise';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } from '../config';

export default class Connection {
    static connection: Pool | undefined = undefined;

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

    static async init() {
        // If the pool was already created, return it instead of creating a new one.
        if (Connection.connection === undefined) {
            // console.log('Connecting  init to db', typeof Connection.connection);
            try {
                Connection.connection = createPool({
                    host: DB_HOST,
                    user: DB_USER,
                    password: DB_PASSWORD,
                    database: DB_NAME,
                    port: 3306,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0,
                });
                console.log('Connecting  established to db');
                // Attempt to catch disconnects

                // return Connection.connection;
            } catch (error) {
                console.log('Error connecting to db: ', error);
            }
        } else {
            // console.log('Return connection to db: ');
            // return Connection.connection;
        }
    }
}
