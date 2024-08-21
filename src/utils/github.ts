import { OpenAI } from "openai";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;

interface Repo {
  name: string;
  full_name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

interface SimplifiedRepo {
  full_name: string;
  description: string;
}

// 修改getStarredRepos函数以同时返回简化版和完整版的repo数据
export async function getStarredRepos(githubId: string): Promise<[SimplifiedRepo[], Repo[]]> {
  let page = 1;
  let allSimplifiedRepos: SimplifiedRepo[] = [];
  let allFullRepos: Repo[] = [];
  while (true) {
    const response = await fetch(
      `${GITHUB_API_URL}/users/${githubId}/starred?page=${page}&per_page=100`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch starred repositories: ${response.statusText}`
      );
    }
    const repos: any[] = await response.json();
    if (repos.length === 0) break;
    allSimplifiedRepos = allSimplifiedRepos.concat(
      repos.map((repo) => ({
        full_name: repo.full_name,
        description: repo.description || "",
      }))
    );
    allFullRepos = allFullRepos.concat(repos.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || "",
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language || "Unknown",
    })));
    page++;
  }
  return [allSimplifiedRepos, allFullRepos];
}

// 调整searchStarredRepos函数，以便它使用完整的repo数据
export async function searchStarredRepos(githubId: string, description: string) {
  console.log("searchStarredRepos: 开始搜索", { githubId, description });
  
  if (!GITHUB_TOKEN) {
    console.error("searchStarredRepos: 缺少 GITHUB_TOKEN");
    throw new Error("缺少必要的环境变量: GITHUB_TOKEN");
  }

  try {
    console.log("searchStarredRepos: 调用 getStarredRepos");
    const [simplifiedRepos, fullRepos] = await getStarredRepos(githubId);
    console.log("searchStarredRepos: 获取到的仓库数量", simplifiedRepos.length);

    console.log("searchStarredRepos: 调用 analyzeWithGPT");
    const matchedRepoNames = await analyzeWithGPT(simplifiedRepos, description, (content) => {
      console.log("正在分析仓库...", content);
    });
    console.log("searchStarredRepos: 匹配的仓库名称", matchedRepoNames);

    console.log("searchStarredRepos: 调用 getFullRepoInfo");
    return getFullRepoInfo(matchedRepoNames, fullRepos);
  } catch (error) {
    console.error("searchStarredRepos 错误:", error);
    throw error;
  }
}

export async function analyzeWithGPT(simplifiedRepos: SimplifiedRepo[], description: string, streamCallback: (content: string) => void) {
  if (!OPENAI_API_KEY || !OPENAI_BASE_URL) {
    throw new Error("缺少必要的环境变量: OPENAI_API_KEY 或 OPENAI_BASE_URL");
  }
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });

  const prompt = `Given the following list of GitHub repositories and a user's project description, 
  identify the most relevant repositories that match the description. Return only the full_name of the matched repositories.

  Repositories:
  ${JSON.stringify(simplifiedRepos)}

  User's project description:
  ${description}`;

  try {
    console.log("开始调用 OpenAI API");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes GitHub repositories."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "repo_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matched_repos: {
                type: "array",
                items: {
                  type: "string"
                }
              },
              analysis: {
                type: "string"
              }
            },
            required: ["matched_repos", "analysis"],
            additionalProperties: false
          }
        }
      },
      stream: true,
    });

    let fullContent = '';
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      streamCallback(content);
    }

    console.log("OpenAI API 返回的完整内容:", fullContent);

    const parsedContent = JSON.parse(fullContent);
    console.log("解析后的内容:", parsedContent);

    // 流式输出分析结果
    streamCallback(`\n分析结果：${parsedContent.analysis}\n`);

    return parsedContent.matched_repos;
  } catch (error) {
    console.error("调用 OpenAI API 时发生错误:", error);
    throw new Error("无法分析仓库");
  }
}

// 修改getFullRepoInfo函数，使其能够利用完整版本的repo数据而不是重新从GitHub API获取
function* getFullRepoInfo(matchedRepoNames: string[], fullRepos: Repo[]): Generator<Repo, void, unknown> {
  for (const repoName of matchedRepoNames) {
    const repo = fullRepos.find(r => r.full_name === repoName);
    if (repo) {
      yield repo;
    }
  }
}