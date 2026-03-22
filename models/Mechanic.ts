import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMechanic extends Document {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
    specialization: string;
    status: 'FREE' | 'BUSY';
    createdAt: Date;
}

const MechanicSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    skills: { type: [String], default: [] },
    experience: { type: String, default: '' },
    specialization: { type: String, default: '' },
    status: { type: String, enum: ['FREE', 'BUSY'], default: 'FREE' },
    createdAt: { type: Date, default: Date.now },
});

const Mechanic: Model<IMechanic> = mongoose.models.Mechanic || mongoose.model<IMechanic>('Mechanic', MechanicSchema);

export default Mechanic;
