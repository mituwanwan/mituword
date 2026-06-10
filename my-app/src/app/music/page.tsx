import { MusicPlayer } from "@/components/sections/MusicPlayer";
import { getMusicTracks, getMusicPlaylists } from "@/lib/db/music";
import type { Metadata } from "next";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "音乐收藏",
  description: "聆听我的音乐收藏，探索我喜欢的歌曲和播放列表",
  keywords: ["音乐", "播放列表", "歌曲", "音乐收藏"],
  openGraph: {
    title: "音乐收藏 - 迷途世界",
    description: "聆听我的音乐收藏，探索我喜欢的歌曲和播放列表",
    type: "website",
  },
};

export default async function MusicPage() {
  const tracks = await getMusicTracks();
  const playlists = await getMusicPlaylists();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-void-star text-realm-foreground">
            音乐
          </h1>
          <p className="dark:text-void-dust text-realm-mist mt-2">
            聆听我的音乐收藏
          </p>
        </div>
        <MusicPlayer tracks={tracks} playlists={playlists} />
      </div>
    </div>
  );
}
