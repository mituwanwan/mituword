'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function NewDiaryPage() {
  const { isVoid } = useTheme();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    isPinned: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) return;

    setSaving(true);
    try {
      const res = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        router.push('/admin/diaries');
      }
    } catch (err) {
      console.error('Create diary error:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    theme-glass-light
    ${isVoid ? 'dark:text-void-star text-realm-foreground placeholder:text-void-dust/40' : 'text-realm-foreground placeholder:text-realm-mist/40'}
    focus:outline-none focus:ring-2 focus:ring-void-purple/30
  `;

  const labelClass = `block text-sm font-medium mb-2 ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}`;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/diaries"
          className={`text-sm ${isVoid ? 'text-void-dust/60' : 'text-realm-mist/60'} hover:opacity-80`}
        >
          ← 返回列表
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r dark:from-void-sun dark:to-void-purple from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
        新建日记
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <label className={labelClass}>标题 *</label>
          <input
            type="text"
            required
            placeholder="日记标题"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text"
            required
            placeholder="diary-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>摘要</label>
          <textarea
            rows={2}
            placeholder="简短摘要（可选）..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>内容 * (Markdown)</label>
          <textarea
            rows={12}
            required
            placeholder="# 标题\n\n正文内容..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className={`${inputClass} font-mono`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>状态</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">发布</option>
              <option value="ARCHIVED">归档</option>
            </select>
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className={`text-sm ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}`}>置顶</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-void px-6 py-3 theme-btn-primary rounded-xl font-medium disabled:opacity-50"
          >
            {saving ? '保存中...' : '创建日记'}
          </button>
          <Link
            href="/admin/diaries"
            className="px-6 py-3 theme-glass-light rounded-xl font-medium dark:text-void-star text-realm-foreground hover:bg-white/5 transition-colors"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
