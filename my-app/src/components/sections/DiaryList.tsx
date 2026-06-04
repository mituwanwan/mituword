"use client";

import { useEffect, useState } from "react";
import { DiaryCard } from "./DiaryCard";

interface DiaryCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface DiaryTag {
  id: string;
  name: string;
  color?: string;
}

interface DiaryTagRelation {
  id: string;
  tag: DiaryTag;
}

interface Diary {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  coverImage?: string;
  views: number;
  likes: number;
  isPinned: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: DiaryCategory;
  tags: DiaryTagRelation[];
  _count: {
    comments: number;
    likesList: number;
  };
}

export function DiaryList() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<DiaryCategory[]>([]);

  useEffect(() => {
    async function fetchDiaries() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory) params.set("category", selectedCategory);

        const response = await fetch(`/api/diaries?${params.toString()}`);
        const data = await response.json();
        setDiaries(data);

        const uniqueCategories = Array.from(
          new Map(
            data
              .filter((d: Diary) => d.category)
              .map((d: Diary) => [d.category!.id, d.category])
          ).values()
        ) as DiaryCategory[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch diaries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiaries();
  }, [search, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索日记..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">所有分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Diaries Grid */}
      {diaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">暂无日记</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      )}
    </div>
  );
}
