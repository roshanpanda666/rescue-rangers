import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(file.name) || '.jpg';
        const fileName = `${uuidv4()}${ext}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${fileName}`
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
