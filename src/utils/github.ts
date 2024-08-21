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
async function getStarredRepos(githubId: string): Promise<[SimplifiedRepo[], Repo[]]> {
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
    const matchedRepoNames = await analyzeWithGPT(simplifiedRepos, description);
    console.log("searchStarredRepos: 匹配的仓库名称", matchedRepoNames);

    console.log("searchStarredRepos: 调用 getFullRepoInfo");
    const result = getFullRepoInfo(matchedRepoNames, fullRepos);
    console.log("searchStarredRepos: 最终结果", result);

    return result;
  } catch (error) {
    console.error("searchStarredRepos 错误:", error);
    throw error;
  }
}

async function analyzeWithGPT(simplifiedRepos: SimplifiedRepo[], description: string) {
  if (!OPENAI_API_KEY || !OPENAI_BASE_URL) {
    throw new Error("Missing required environment variables");
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
    const completion = await openai.chat.completions.create({
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
          name: "github_repo_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matched_repos: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["matched_repos"],
            additionalProperties: false
          }
        }
      }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    return JSON.parse(content).matched_repos;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to analyze with GPT");
  }
}

// 修改getFullRepoInfo函数，使其能够利用完整版本的repo数据而不是重新从GitHub API获取
async function getFullRepoInfo(matchedRepoNames: string[], fullRepos: Repo[]): Promise<Repo[]> {
    return fullRepos.filter(repo => matchedRepoNames.includes(repo.full_name));
  }