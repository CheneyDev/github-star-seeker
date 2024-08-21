import { NextRequest } from 'next/server';
import { searchStarredRepos, getStarredRepos, analyzeWithGPT } from '@/utils/github';

interface Repo {
  full_name: string;
  // 可以根据需要添加其他属性
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    console.log("API route: 开始处理请求");
    const { githubId, description } = await req.json();
    console.log("API route: 收到的参数", { githubId, description });
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 流式输出原始数据
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'stream', content: '正在获取starred仓库...' }) + '\n'));
          const [simplifiedRepos, fullRepos] = await getStarredRepos(githubId);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'stream', content: `获取到 ${simplifiedRepos.length} 个starred仓库` }) + '\n'));

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'stream', content: '正在分析仓库...' }) + '\n'));
          const matchedRepoNames = await analyzeWithGPT(
            simplifiedRepos, 
            description,
            (content) => {
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'gpt_stream', content }) + '\n'));
            }
          );
          console.log("匹配到的仓库名称:", matchedRepoNames);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'stream', content: `分析完成，匹配到 ${matchedRepoNames.length} 个仓库` }) + '\n'));

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'stream', content: '正在取完整仓库信息...' }) + '\n'));
          const finalResults = [];
          for (const repoName of matchedRepoNames) {
            const repo = fullRepos.find((r: Repo) => r.full_name === repoName);
            if (repo) {
              finalResults.push(repo);
            }
          }

          // 发送最终结果
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'final', content: finalResults }) + '\n'));
        } catch (error) {
          console.error('搜索过程中发生错误:', error);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', content: '搜索过程中发生错误: ' + (error instanceof Error ? error.message : String(error)) }) + '\n'));
          // 不要在这里调用 controller.error(error)，而是继续处理
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('API route 错误:', error);
    return new Response(JSON.stringify({ error: '处理请求时发生错误', details: error instanceof Error ? error.message : '未知错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}