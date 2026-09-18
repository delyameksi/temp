import { DatabasePersistence } from '../types';
import mysqlPersistence from './mysql';

const db: DatabasePersistence = mysqlPersistence;

export default db;
