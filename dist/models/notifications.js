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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("../config/bd/mysql"));
class Notifications extends mysql_1.default {
    constructor() {
        super();
        this.className = 'Notifications';
        this.id_asociation_notifications = 0;
        this.id_article_notifications = 0;
        this.state_notifications = '';
        this.date_updated_notifications = '';
        this.date_created_notifications = '';
        this.date_expired_notifications = '';
        this.getNotificationById = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.getNotificationsByAsociation = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.getAllNotificationsForUser = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.createNotification = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.updateNotification = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.deleteNotification = () => __awaiter(this, void 0, void 0, function* () {
            return { status: 200, message: 'success', num_records: 0, records: null };
        });
        this.fillAsoc = (record) => __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, record);
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
}
exports.default = Notifications;
