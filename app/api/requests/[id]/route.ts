import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Request from '@/models/Request';
import Mechanic from '@/models/Mechanic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { status, assignedMechanicId, assignedMechanicName, paymentStatus } = body;

        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (assignedMechanicId) updateData.assignedMechanicId = assignedMechanicId;
        if (assignedMechanicName) updateData.assignedMechanicName = assignedMechanicName;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const request = await Request.findByIdAndUpdate(id, updateData, { new: true });
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // If assigning a mechanic, update their status to BUSY
        if (assignedMechanicId && status === 'assigned') {
            await Mechanic.findByIdAndUpdate(assignedMechanicId, { status: 'BUSY' });
        }

        // If completing, free the mechanic
        if (status === 'completed' && request.assignedMechanicId) {
            await Mechanic.findByIdAndUpdate(request.assignedMechanicId, { status: 'FREE' });
        }

        return NextResponse.json({ success: true, request });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const request = await Request.findById(id);
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, request });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
