import { connect } from 'mongoose';
import { config } from 'dotenv'

export const openConnection = async () => {
    try {
        config();
        await connect(process.env.MONGO_DB_URI || '', {
            dbName: process.env.DB_NAME,
            directConnection: process.env.MONGO_DB_URI!.includes('localhost'),
            connectTimeoutMS: 3000
        });
        console.log('MongoDB Connection Is Working');
    } catch (error) {
        console.warn(`Error in connection with MongoDB: ${error}`);
    }
}
