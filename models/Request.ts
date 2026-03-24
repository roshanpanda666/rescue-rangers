import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRequest extends Document {
    userId: string;
    userName: string;
    userPhone: string;
    userEmail: string;
    carModel: string;
    isElectric: boolean;
    location: string;
    peopleCount: number;
    photoUrl: string;
    description: string;
    status: 'pending' | 'accepted' | 'assigned' | 'completed';
    assignedMechanicId: string;
    assignedMechanicName: string;
    paymentMethod: 'cash' | 'card' | 'upi' | '';
    paymentStatus: 'pending' | 'paid' | 'accepted';
    paymentAmount: number;
    createdAt: Date;
}

const RequestSchema: Schema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, default: '' },
    carModel: { type: String, required: true },
    isElectric: { type: Boolean, default: false },
    location: { type: String, required: true },
    peopleCount: { type: Number, default: 1 },
    photoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'assigned', 'completed'], default: 'pending' },
    assignedMechanicId: { type: String, default: '' },
    assignedMechanicName: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', ''], default: '' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'accepted'], default: 'pending' },
    paymentAmount: { type: Number, default: 500 },
    createdAt: { type: Date, default: Date.now },
});

const Request: Model<IRequest> = mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);

export default Request;
