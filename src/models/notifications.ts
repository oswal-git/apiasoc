import Mysql from '../config/bd/mysql';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class Notifications extends Mysql {
    className = 'Notifications';

    id_asociation_notifications = 0;
    id_article_notifications = 0;
    state_notifications = '';
    date_updated_notifications = '';
    date_created_notifications = '';
    date_expired_notifications = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public getNotificationById = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public getNotificationsByAsociation = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public getAllNotificationsForUser = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public createNotification = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public updateNotification = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public deleteNotification = async () => {
        return { status: 200, message: 'success', num_records: 0, records: null };
    };

    public fillAsoc = async (record: any) => {
        Object.assign(this, record);
    };
}
