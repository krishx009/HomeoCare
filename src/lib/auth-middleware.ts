import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
}

/**
 * Middleware to verify Firebase Auth token and extract user ID
 * Use this in API routes to protect endpoints
 */
export async function verifyAuth(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.substring(7);

    // Verify the token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Return the user ID
    return { userId: decodedToken.uid };
  } catch (error: any) {
    console.error('Auth verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired - Please sign in again' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }
}

/**
 * Helper to get user ID from request or return error response
 */
export async function getUserIdOrError(request: NextRequest): Promise<string | NextResponse> {
  const result = await verifyAuth(request);
  
  if (result instanceof NextResponse) {
    return result; // Return error response
  }
  
  return result.userId;
}
