import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone });

        return NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
