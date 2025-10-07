import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['image', 'video'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be image or video' },
        { status: 400 }
      );
    }

    // Validate file extensions
    const allowedExtensions = {
      image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      video: ['.mp4', '.webm', '.ogg', '.mov']
    };

    const fileExtension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions[type as keyof typeof allowedExtensions].includes(fileExtension)) {
      return NextResponse.json(
        { error: `Invalid file extension for ${type}` },
        { status: 400 }
      );
    }

    // Create upload directories if they don't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type + 's');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${type}s/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Set the maximum file size (10MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};