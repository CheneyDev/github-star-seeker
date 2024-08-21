import { NextRequest, NextResponse } from 'next/server';
import { searchStarredRepos } from '@/utils/github';

export async function POST(req: NextRequest) {
  try {
    console.log("API route: 开始处理请求");
    const { githubId, description } = await req.json();
    console.log("API route: 收到的参数", { githubId, description });
    
    const results = await searchStarredRepos(githubId, description);
    console.log("API route: 搜索结果", results);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('API route 错误:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: '处理请求时发生错误', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '处理请求时发生未知错误' }, { status: 500 });
    }
  }
}