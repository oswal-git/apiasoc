import { Auth } from './auth.interface';

export interface User extends Auth {
    id_user: number;
    id_asociation_user: number;
    user_name_user: string;
    recover_password_user: number;
    token_user: string;
    token_exp_user: string;
    profile_user: string;
    status_user: string;
    name_user: string;
    last_name_user: string;
    avatar_user: string;
    phone_user: string;
    date_deleted_user: string;
    date_created_user: string;
    date_updated_user: string;
}
