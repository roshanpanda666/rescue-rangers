import { NextRequest, NextResponse } from 'next/server';

const MECHANIC_EMAIL = 'mechanique@gmail.com';
const MECHANIC_PASSWORD = 'steady-gear-mechanique';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (email !== MECHANIC_EMAIL || password !== MECHANIC_PASSWORD) {
            return NextResponse.json({ error: 'Invalid mechanic credentials' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            role: 'mechanic',
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
