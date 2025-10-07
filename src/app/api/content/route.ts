import { NextRequest, NextResponse } from 'next/server';
import { readContentData, updateLogoPath } from '@/lib/database';

export async function GET() {
  try {
    const data = readContentData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { logoPath } = await request.json();
    
    // Update the logo path in the database
    updateLogoPath(logoPath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating logo:', error);
    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}