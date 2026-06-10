"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface GitHubRepo {
  id: string;
  repoId: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  watchers: number;
  language?: string;
  topics?: string;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
  syncAt: string;
}

interface SyncStatus {
  id: string;
  syncTime: string;
  status: string;
  reposCount: number;
  errorMsg?: string;
}

export function GitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncStatus | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [language, setLanguage] = useState("");

  const fetchRepos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (language) params.set("language", language);

      const response = await fetch(`/api/github?${params.toString()}`);
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, language]);

  const fetchSyncStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/github?action=sync-status");
      const data = await response.json();
      setLastSync(data.lastSync);
    } catch (error) {
      console.error("Failed to fetch sync status:", error);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
    fetchSyncStatus();
  }, [fetchRepos, fetchSyncStatus]);

  async function handleSync() {
    try {
      setSyncing(true);
      const response = await fetch("/api/github?action=sync", {
        method: "POST",
      });
      const data = await response.json();
      if (data.syncedCount !== undefined) {
        await fetchRepos();
        await fetchSyncStatus();
      }
    } catch (error) {
      console.error("Failed to sync repos:", error);
    } finally {
      setSyncing(false);
    }
  }

  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean)));

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="dark:text-void-dust/70 text-realm-mist/70">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-void-star text-realm-foreground">
            GitHub 仓库
          </h2>
          {lastSync && (
            <p className="text-sm dark:text-void-dust/70 text-realm-mist/70 mt-1">
              上次同步: {formatDate(lastSync.syncTime)}
              {lastSync.status === "SUCCESS" && ` (${lastSync.reposCount} 个仓库)`}
            </p>
          )}
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="theme-btn-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              同步中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              同步 GitHub
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索仓库..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border dark:border-void-purple/20 border-realm-sun/20 rounded-md dark:bg-void-deeper/50 bg-white/70 dark:text-void-star text-realm-foreground focus:ring-2 focus:ring-realm-ocean dark:focus:ring-void-cyan focus:border-realm-ocean dark:focus:border-void-cyan outline-none transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border dark:border-void-purple/20 border-realm-sun/20 rounded-md dark:bg-void-deeper/50 bg-white/70 dark:text-void-star text-realm-foreground focus:ring-2 focus:ring-realm-ocean dark:focus:ring-void-cyan focus:border-realm-ocean dark:focus:border-void-cyan outline-none transition-all"
        >
          <option value="updated">按更新时间</option>
          <option value="stars">按 Stars</option>
          <option value="name">按名称</option>
        </select>
        {languages.length > 0 && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 border dark:border-void-purple/20 border-realm-sun/20 rounded-md dark:bg-void-deeper/50 bg-white/70 dark:text-void-star text-realm-foreground focus:ring-2 focus:ring-realm-ocean dark:focus:ring-void-cyan focus:border-realm-ocean dark:focus:border-void-cyan outline-none transition-all"
          >
            <option value="">所有语言</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-12">
          <div className="dark:text-void-dust/70 text-realm-mist/70 mb-4">
            还没有同步任何仓库
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="theme-btn-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50"
          >
            开始同步
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="dark:glass glass-realm rounded-lg p-6 dark:hover:shadow-glow hover:shadow-sunny transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold dark:text-void-cyan text-realm-ocean hover:underline"
                  >
                    {repo.name}
                  </Link>
                  {repo.description && (
                    <p className="dark:text-void-dust/80 text-realm-mist/80 mt-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm dark:text-void-dust/70 text-realm-mist/70">
                    {repo.language && (
                      <span className="inline-flex items-center">
                        <span className="w-3 h-3 rounded-full bg-realm-ocean dark:bg-void-cyan mr-1"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {repo.stars}
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {repo.forks}
                    </span>
                    <span>更新于 {formatDate(repo.updatedAt)}</span>
                  </div>
                  {repo.topics && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {JSON.parse(repo.topics).map((topic: string) => (
                        <span
                          key={topic}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium dark:bg-void-purple/10 dark:text-void-star bg-realm-sky/10 text-realm-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
