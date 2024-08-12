import { OpenAI } from "openai";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;

interface Repo {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

async function getStarredRepos(githubId: string): Promise<Repo[]> {
  let page = 1;
  let allRepos: Repo[] = [];
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
    allRepos = allRepos.concat(
      repos.map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || "Unknown",
      }))
    );
    page++;
  }
  return allRepos;
}

export async function searchStarredRepos(
  githubId: string,
  description: string
) {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing required environment variables");
  }

  try {
    const starredRepos = await getStarredRepos(githubId);
    return await analyzeWithGPT(starredRepos, description);
  } catch (error) {
    console.error("Error in searchStarredRepos:", error);
    throw error;
  }
}

async function analyzeWithGPT(starredRepos: Repo[], description: string) {
  if (!OPENAI_API_KEY || !OPENAI_BASE_URL) {
    throw new Error("Missing required environment variables");
  }
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });
  const prompt = `Given the following list of GitHub repositories and a user's project description, 
  identify the top 5 most relevant repositories that match the description. 
  Provide explanations for why each repository was chosen.

  Repositories:
  ${JSON.stringify(starredRepos)}

  User's project description:
  ${description}

  Please format your response as a JSON array of objects, where each object contains 
  'name', 'url', 'description', and 'reason' fields.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to analyze with GPT");
  }
}
