import 'dotenv/config';
import path from 'path';

// config();

// export const MAGIC_SEED = process.env.MAGIC_SEED || 'rPTEVbf9A¿274PzD$UnYVmu&95opK4HdnzhrcwÂ&KmU2AvXP6?';
export const MAGIC_SEED = process.env.MAGIC_SEED || '$2a$31$uH5jv4OkAaCd9MB6iy/0Nu';
export const MAGIC_KEY = process.env.MAGIC_KEY || 'Sxch!TUGW¿9XN9!jbQaeWt&dfm5ftBkiwsLvGAG%P¡49oyAD!K';
export const KEYPHRASE = process.env.KEYPHRASE || 'HcjOX0Yjn@eR(E!k?Y3vz6zLdWmTAPIC&€bq(¡=ZwjEwaKxh5Us+C!O2ttDi+s3&/s&wAdY6Q5oG';
export const KEYSPACE = process.env.KEYSPACE || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const KEYSPACE_NUMBER = process.env.KEYSPACE_NUMBER || '280935614';
export const KEYSPACE_LETTERS = process.env.KEYSPACE_LETTERS || 'GlapudczXkwRrAqZSgymvObDjMVHoiNFefEBLnKPhxUIWtJCsQTY';

export const BASE_DIR = path.resolve();
export const BASE_URL = process.env.BASE_URL || 'http://apiasoc.es';
export const DIR_FILES = 'files';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;

export const DB_NAME = process.env.DB_NAME || 'db_asoc';
export const DB_USER = process.env.DB_USER || 'asocadminuser';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'asl@#kjjsd%nhc$';
export const DB_CHARSET = process.env.DB_CHARSET || 'charset=utf8';
export const TABLE_PREFIX = process.env.TABLE_PREFIX || 'egl_';

export const PORT = process.env.PORT || 7251;

export const SPD = process.env.SPD || ',';
export const SPM = process.env.SPM || '.';
export const SCURRENCY = process.env.SCURRENCY || '€';

export const DIRECTORY_SEPARATOR = process.env.DIRECTORY_SEPARATOR || '\\';
export const URL_SEPARATOR = process.env.URL_SEPARATOR || '/';

// constantes calcualdas ¿?
export const URL_FILES = BASE_DIR + URL_SEPARATOR + DIR_FILES;
export const DIR_LOGS = BASE_DIR + URL_SEPARATOR + DIR_FILES + URL_SEPARATOR + 'logs';
export const TRACE_LOG = DIR_LOGS + URL_SEPARATOR + 'log';
export const LOG_FILE = DIR_LOGS + URL_SEPARATOR + 'debug';

export const PREFIX_AVATAR = 'avatars' + URL_SEPARATOR + 'user-';
export const PREFIX_LOGO = 'logos' + URL_SEPARATOR + 'asociation-';
export const PREFIX_ARTICLES = 'articles' + URL_SEPARATOR + 'images' + URL_SEPARATOR + 'asociation-';
