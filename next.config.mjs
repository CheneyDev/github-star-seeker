/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
      },
};

export default nextConfig;
