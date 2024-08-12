import { NextRequest, NextResponse } from 'next/server';
import { searchStarredRepos } from '@/utils/github';

export async function POST(req: NextRequest) {
  try {
    const { githubId, description } = await req.json();
    const results = await searchStarredRepos(githubId, description);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}