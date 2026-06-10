import { DiaryList } from "@/components/sections/DiaryList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日记分享",
  description: "记录生活点滴，分享心情故事和思考",
  keywords: ["日记", "博客", "生活记录", "思考", "分享"],
  openGraph: {
    title: "日记分享 - 迷途世界",
    description: "记录生活点滴，分享心情故事和思考",
    type: "website",
  },
};

export default function DiaryPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-void-star text-realm-foreground">
            日记
          </h1>
          <p className="dark:text-void-dust text-realm-mist mt-2">
            记录生活点滴，分享心情故事
          </p>
        </div>
        <DiaryList />
      </div>
    </div>
  );
}
