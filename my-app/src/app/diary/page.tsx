import { DiaryList } from "@/components/sections/DiaryList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日记分享",
  description: "记录生活点滴，分享心情故事和思考",
  keywords: ["日记", "博客", "生活记录", "思考", "分享"],
  openGraph: {
    title: "日记分享 - 个人网站",
    description: "记录生活点滴，分享心情故事和思考",
    type: "website",
  },
};

export default function DiaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            日记
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            记录生活点滴，分享心情故事
          </p>
        </div>
        <DiaryList />
      </div>
    </div>
  );
}
