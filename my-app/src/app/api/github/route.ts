import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  getGitHubRepos,
  syncGitHubRepo,
  createGitHubSyncLog,
  getLastGitHubSyncLog,
} from "@/lib/db/github";

const GITHUB_API = "https://api.github.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "sync-status") {
      const lastSync = await getLastGitHubSyncLog();
      return NextResponse.json({ lastSync });
    }

    const options = {
      language: searchParams.get("language") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
    };

    const repos = await getGitHubRepos(options);
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Get GitHub repos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "sync") {
      const username = process.env.GITHUB_USERNAME;
      const token = process.env.GITHUB_TOKEN;

      if (!username) {
        return NextResponse.json(
          { error: "GitHub username not configured" },
          { status: 500 }
        );
      }

      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
      };

      if (token) {
        headers.Authorization = `token ${token}`;
      }

      let allRepos: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100&page=${page}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();
        if (repos.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...repos];
          page++;
        }
      }

      // Sync repos to database
      for (const repo of allRepos) {
        await syncGitHubRepo({
          repoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          language: repo.language,
          topics: repo.topics ? JSON.stringify(repo.topics) : undefined,
          createdAt: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at),
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : undefined,
        });
      }

      await createGitHubSyncLog({
        status: "SUCCESS",
        reposCount: allRepos.length,
      });

      return NextResponse.json({
        syncedCount: allRepos.length,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Sync GitHub repos error:", error);

    await createGitHubSyncLog({
      status: "FAIL",
      errorMsg: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
