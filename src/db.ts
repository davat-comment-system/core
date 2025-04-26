import mongoose from 'mongoose';
import {UserModel} from "./models/User.model";


async function initializeData() {
    const count = await UserModel.countDocuments();
    if (count === 0) {
        // Add initial data
        const initialData = [
            {
                "fullName": "Ali Mohammadi"
            },
            {
                "fullName": "Sara Jafari"
            },
            {
                "fullName": "Hossein Rahimi"
            },
            {
                "fullName": "Zahra Karimi"
            },
            {
                "fullName": "Reza Alizadeh"
            },
            {
                "fullName": "Maryam Soleimani"
            },
            {
                "fullName": "Amirhossein Taheri"
            },
            {
                "fullName": "Elham Ghasemi"
            },
            {
                "fullName": "Mohammad Rezaei"
            },
            {
                "fullName": "Neda Esmaili"
            }
        ]
        await UserModel.insertMany(initialData);
        console.log('Initial data added successfully');
    }
}


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI!);
        console.log('✅ MongoDB connected');
        initializeData()
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
