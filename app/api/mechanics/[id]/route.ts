import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Mechanic from '@/models/Mechanic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const mechanic = await Mechanic.findById(id);
        if (!mechanic) {
            return NextResponse.json({ error: 'Mechanic not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, mechanic });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const mechanic = await Mechanic.findByIdAndUpdate(id, body, { new: true });
        if (!mechanic) {
            return NextResponse.json({ error: 'Mechanic not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, mechanic });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
