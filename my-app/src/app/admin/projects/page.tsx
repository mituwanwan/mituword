'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  category: { name: string } | null;
}

export default function AdminProjectsPage() {
  const { isVoid } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    project: Project | null;
    isDeleting: boolean;
  }>({ isOpen: false, project: null, isDeleting: false });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/projects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteDialog.project) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(`/api/projects?id=${deleteDialog.project.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteDialog.project!.id));
      }
    } catch (err) {
      console.error('Delete project error:', err);
    } finally {
      setDeleteDialog({ isOpen: false, project: null, isDeleting: false });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: '已完成',
      IN_PROGRESS: '进行中',
      PLANNED: '计划中',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r dark:from-void-sun dark:to-void-purple from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
          项目管理
        </h1>
        <Link
          href="/admin/projects/new"
          className="btn-void px-5 py-2.5 theme-btn-primary rounded-xl text-sm font-medium"
        >
          + 新建项目
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="搜索项目..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`
            px-4 py-2 rounded-xl text-sm w-64
            theme-glass-light
            ${isVoid ? 'dark:text-void-star text-realm-foreground placeholder:text-void-dust/40' : 'text-realm-foreground placeholder:text-realm-mist/40'}
            focus:outline-none focus:ring-2 focus:ring-void-purple/30
          `}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`
            px-4 py-2 rounded-xl text-sm
            theme-glass-light
            ${isVoid ? 'dark:text-void-star text-realm-foreground' : 'text-realm-foreground'}
            focus:outline-none focus:ring-2 focus:ring-void-purple/30
          `}
        >
          <option value="">全部状态</option>
          <option value="COMPLETED">已完成</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="PLANNED">计划中</option>
        </select>
      </div>

      {/* Table */}
      <div className="theme-glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center dark:text-void-dust/50 text-realm-mist/50">加载中...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center dark:text-void-dust/50 text-realm-mist/50">
            暂无项目
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-void-purple/20 border-realm-sun/20">
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">标题</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">分类</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">浏览</th>
                <th className="text-left px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">精选</th>
                <th className="text-right px-6 py-4 text-sm font-medium dark:text-void-dust/60 text-realm-mist/60">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b dark:border-void-purple/10 border-realm-sun/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className={`font-medium ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {project.title}
                    </div>
                    <div className="text-xs dark:text-void-dust/40 text-realm-mist/40">{project.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {project.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-void-dust/80 text-realm-mist/80">
                    {project.views}
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? '⭐' : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="text-sm px-3 py-1.5 rounded-lg theme-glass-light dark:text-void-cyan text-realm-ocean hover:bg-void-purple/10 transition-colors"
                      >
                        查看
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-sm px-3 py-1.5 rounded-lg theme-glass-light dark:text-void-sun text-realm-sun hover:bg-void-purple/10 transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, project, isDeleting: false })}
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
        title="删除项目"
        message={`确定要删除项目 "${deleteDialog.project?.title}" 吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, project: null, isDeleting: false })}
        isDeleting={deleteDialog.isDeleting}
      />
    </div>
  );
}
