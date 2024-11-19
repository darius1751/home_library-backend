import { connect } from 'mongoose';
import { config } from 'dotenv'

export const openConnection = async () => {
    try {
        config();
        await connect(process.env.MONGO_DB_URI || '', {
            directConnection: true,
            connectTimeoutMS: 3000 
        });
        console.log('MongoDB Connection Is Working');
    } catch (error) {
        console.warn(`Error in connection with MongoDB: ${error}`);
    }
}
