import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    theme: string;
    accentColor: string;
    glassIntensity: number;
    heroTitle: string;
    heroSubtitle: string;
    announcement: string;
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
    theme: { type: String, default: 'orange' },
    accentColor: { type: String, default: '#FF6B00' },
    glassIntensity: { type: Number, default: 0.15 },
    heroTitle: { type: String, default: 'Rescue Rangers' },
    heroSubtitle: { type: String, default: 'Roadside assistance at your fingertips' },
    announcement: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
});

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
