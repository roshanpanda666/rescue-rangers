import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Request from '@/models/Request';

export async function GET() {
    try {
        await dbConnect();
        const requests = await Request.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, requests });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { userId, userName, userPhone, userEmail, carModel, isElectric, location, peopleCount, photoUrl, description } = body;

        if (!userId || !userName || !userPhone || !carModel || !location) {
            return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
        }

        const request = await Request.create({
            userId,
            userName,
            userPhone,
            userEmail: userEmail || '',
            carModel,
            isElectric: isElectric || false,
            location,
            peopleCount: peopleCount || 1,
            photoUrl: photoUrl || '',
            description: description || '',
            status: 'pending',
        });

        return NextResponse.json({ success: true, request });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
