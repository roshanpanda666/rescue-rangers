import { NextRequest, NextResponse } from 'next/server';

const MANAGER_EMAIL = 'steady-gear-manager@mail.com';
const MANAGER_PASSWORD = 'steady-gear-admin-manager';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (email !== MANAGER_EMAIL || password !== MANAGER_PASSWORD) {
            return NextResponse.json({ error: 'Invalid manager credentials' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            role: 'manager',
            user: { name: 'Manager', email: MANAGER_EMAIL },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
