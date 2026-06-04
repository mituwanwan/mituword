import { GitHubRepos } from "@/components/sections/GitHubRepos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub 仓库",
  description: "查看我的 GitHub 开源项目和仓库，探索代码和项目",
  keywords: ["GitHub", "开源", "代码", "仓库", "项目"],
  openGraph: {
    title: "GitHub 仓库 - 个人网站",
    description: "查看我的 GitHub 开源项目和仓库，探索代码和项目",
    type: "website",
  },
};

export default function GitHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <GitHubRepos />
      </div>
    </div>
  );
}
