import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

export async function GET() {
    try {
        await dbConnect();
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = await Settings.create({});
        }
        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        let settings = await Settings.findOne({});
        if (!settings) {
            settings = await Settings.create(body);
        } else {
            Object.assign(settings, body);
            settings.updatedAt = new Date();
            await settings.save();
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
