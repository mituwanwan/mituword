'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Diary {
  id: string;
  title: string;
  slug: string;
  status: string;
  isPinned: boolean;
  views: number;
  publishedAt: string;
  category: { name: string } | null;
  _count: { comments: number; likesList: number };
}

export default function AdminDiariesPage() {
  const { isVoid } = useTheme();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    diary: Diary | null;
    isDeleting: boolean;
  }>({ isOpen: false, diary: null, isDeleting: false });

  const fetchDiaries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', 'ALL');
      if (search) params.set('search', search);

      const res = await fetch(`/api/diaries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDiaries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch diaries error:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  const handleDelete = async () => {
    if (!deleteDialog.diary) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(`/api/diaries?id=${deleteDialog.diary.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDiaries((prev) => prev.filter((d) => d.id !== deleteDialog.diary!.id));
      }
    } catch (err) {
      console.error('Delete diary error:', err);
    } finally {
      setDeleteDialog({ isOpen: false, diary: null, isDeleting: false });
    }
  };

  const handleTogglePin = async (diary: Diary) => {
    try {
      const res = await fetch('/api/diaries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: diary.id, isPinned: !diary.isPinned }),
      });
      if (res.ok) {
        setDiaries((prev) =>
          prev.map((d) => (d.id === diary.id ? { ...d, isPinned: !d.isPinned } : d))
        );
      }
    } catch (err) {
      console.error('Toggle pin error:', err);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PUBLISHED: '已发布',
      DRAFT: '草稿',
      ARCHIVED: '已归档',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-500/20 text-green-400';
      case 'DRAFT':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r dark:from-void-sun dark:to-void-purple from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
          日记管理
        </h1>
        <Link
          href="/admin/diaries/new"
          className="btn-void px-5 py-2.5 theme-btn-primary rounded-xl text-sm font-medium"
        >
          + 新建日记
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="搜索日记..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`
            px-4 py-2 rounded-xl text-sm w-64
            theme-glass-light
            ${isVoid ? 'dark:text-void-star text-realm-foreground placeholder:text-void-dust/40' : 'text-realm-foreground placeholder:text-realm-mist/40'}
            focus:outline-none focus:ring-2 focus:ring-void-purple/30
          `}
        />
      </div>

      {/* Table */}
      <div className="theme-glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center dark:text-void-dust/50 text-realm-mist/50">加载中...</div>
        ) : diaries.length === 0 ? (
          <div className="p-8 text-center dark:text-void-dust/50 text-realm-mist/50">
            暂无日记
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-void-purple/20 border-realm-sun/20">
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">标题</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">分类</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">浏览</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">评论</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">点赞</th>
                <th className="text-right px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">操作</th>
              </tr>
            </thead>
            <tbody>
              {diaries.map((diary) => (
                <tr
                  key={diary.id}
                  className="border-b dark:border-void-purple/10 border-realm-sun/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className={`font-medium ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {diary.isPinned && <span className="mr-1">📌</span>}
                      {diary.title}
                    </div>
                    <div className="text-xs dark:text-void-dust/40 text-realm-mist/40">{diary.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(diary.status)}`}>
                      {getStatusLabel(diary.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {diary.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {diary.views}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {diary._count.comments}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {diary._count.likesList}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePin(diary)}
                        className={`text-sm px-3 py-1.5 rounded-lg theme-glass-light transition-colors ${
                          diary.isPinned ? 'text-yellow-400' : 'dark:text-void-dust/60 text-realm-mist/60'
                        } hover:bg-void-purple/10`}
                        title={diary.isPinned ? '取消置顶' : '置顶'}
                      >
                        📌
                      </button>
                      <Link
                        href={`/diary/${diary.slug}`}
                        target="_blank"
                        className="text-sm px-3 py-1.5 rounded-lg theme-glass-light dark:text-void-cyan text-realm-ocean hover:bg-void-purple/10 transition-colors"
                      >
                        查看
                      </Link>
                      <Link
                        href={`/admin/diaries/${diary.id}/edit`}
                        className="text-sm px-3 py-1.5 rounded-lg theme-glass-light dark:text-void-sun text-realm-sun hover:bg-void-purple/10 transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, diary, isDeleting: false })}
                        className="text-sm px-3 py-1.5 rounded-lg theme-glass-light text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="删除日记"
        message={`确定要删除日记 "${deleteDialog.diary?.title}" 吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, diary: null, isDeleting: false })}
        isDeleting={deleteDialog.isDeleting}
      />
    </div>
  );
}
