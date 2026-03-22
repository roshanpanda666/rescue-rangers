import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Mechanic from '@/models/Mechanic';

export async function GET() {
    try {
        await dbConnect();
        const mechanics = await Mechanic.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, mechanics });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, phone, skills, experience, specialization } = body;

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
        }

        // Check if mechanic with this email already exists
        const existing = await Mechanic.findOne({ email });
        if (existing) {
            return NextResponse.json({
                success: true,
                mechanic: existing,
                message: 'Welcome back!'
            });
        }

        const mechanic = await Mechanic.create({
            name,
            email,
            phone,
            skills: skills || [],
            experience: experience || '',
            specialization: specialization || '',
            status: 'FREE',
        });

        return NextResponse.json({ success: true, mechanic });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
