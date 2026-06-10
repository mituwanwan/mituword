"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  releaseDate?: Date | null;
  genre?: string | null;
  playUrl?: string | null;
  coverUrl?: string | null;
  duration?: number | null;
  copyright?: string | null;
  order: number;
  createdAt: Date;
}

interface MusicPlaylist {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  tracks: {
    id: string;
    order: number;
    track: MusicTrack;
  }[];
}

interface MusicPlayerProps {
  tracks: MusicTrack[];
  playlists?: MusicPlaylist[];
}

export function MusicPlayer({ tracks, playlists = [] }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicTrack[]>(tracks);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = currentPlaylist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.playUrl) return;
    audioRef.current.src = currentTrack.playUrl;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack?.playUrl, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const togglePlay = useCallback(() => {
    if (!currentTrack?.playUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) =>
      prev === currentPlaylist.length - 1 ? 0 : prev + 1
    );
  }, [currentPlaylist.length]);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? currentPlaylist.length - 1 : prev - 1
    );
  }, [currentPlaylist.length]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectPlaylist = (playlist: MusicPlaylist) => {
    const playlistTracks = playlist.tracks.map((t) => t.track);
    setCurrentPlaylist(playlistTracks);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  const showAllTracks = () => {
    setCurrentPlaylist(tracks);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8">
      {/* Current Track & Player */}
      <div className="dark:glass glass-realm rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Album Cover */}
            <div className="relative w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack?.coverUrl ? (
                <Image
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-realm-ocean to-realm-grass dark:from-void-earth dark:to-void-purple flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold dark:text-void-star text-realm-foreground">
                {currentTrack?.title || "选择一首歌曲"}
              </h2>
              <p className="text-lg dark:text-void-dust text-realm-mist mt-1">
                {currentTrack?.artist || "艺术家"}
              </p>
              {currentTrack?.album && (
                <p className="text-sm dark:text-void-dust/70 text-realm-mist/70 mt-1">
                  {currentTrack.album}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm dark:text-void-dust/70 text-realm-mist/70 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 dark:bg-void-deeper bg-realm-sky/20 rounded-lg appearance-none cursor-pointer accent-realm-ocean dark:accent-void-cyan"
                />
              </div>
              <span className="text-sm dark:text-void-dust/70 text-realm-mist/70 w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playPrev}
                disabled={!currentTrack}
                className="p-3 rounded-full dark:hover:bg-void-purple/10 hover:bg-realm-sky/10 disabled:opacity-50 transition-colors"
              >
                <svg className="w-6 h-6 dark:text-void-dust text-realm-mist" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                disabled={!currentTrack?.playUrl}
                className="theme-btn-primary p-4 rounded-full disabled:opacity-50"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={playNext}
                disabled={!currentTrack}
                className="p-3 rounded-full dark:hover:bg-void-purple/10 hover:bg-realm-sky/10 disabled:opacity-50 transition-colors"
              >
                <svg className="w-6 h-6 dark:text-void-dust text-realm-mist" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="dark:text-void-dust/70 text-realm-mist/70 dark:hover:text-void-star hover:text-realm-foreground transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24 h-2 dark:bg-void-deeper bg-realm-sky/20 rounded-lg appearance-none cursor-pointer accent-realm-ocean dark:accent-void-cyan"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold dark:text-void-star text-realm-foreground mb-4">
            播放列表
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <button
              onClick={showAllTracks}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                currentPlaylist === tracks
                  ? "dark:border-void-cyan border-realm-ocean dark:bg-void-purple/10 bg-realm-sky/10"
                  : "dark:border-void-purple/20 border-realm-sun/20 dark:hover:border-void-purple/40 hover:border-realm-sun/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-realm-ocean to-realm-grass dark:from-void-earth dark:to-void-purple flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium dark:text-void-star text-realm-foreground">所有歌曲</p>
                  <p className="text-sm dark:text-void-dust/70 text-realm-mist/70">{tracks.length} 首</p>
                </div>
              </div>
            </button>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => selectPlaylist(playlist)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  currentPlaylist.every((t, i) => t.id === playlist.tracks[i]?.track.id)
                    ? "dark:border-void-cyan border-realm-ocean dark:bg-void-purple/10 bg-realm-sky/10"
                    : "dark:border-void-purple/20 border-realm-sun/20 dark:hover:border-void-purple/40 hover:border-realm-sun/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    {playlist.coverUrl ? (
                      <Image
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-realm-grass to-realm-ocean dark:from-void-cyan dark:to-void-earth flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15 6H3v12h12v-1.66l2.82 1.88c.52.35 1.18-.03 1.18-.64V6.42c0-.61-.66-.99-1.18-.64L15 7.66V6z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium dark:text-void-star text-realm-foreground">{playlist.name}</p>
                    <p className="text-sm dark:text-void-dust/70 text-realm-mist/70">{playlist.tracks.length} 首</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Track List */}
      <div>
        <h3 className="text-lg font-semibold dark:text-void-star text-realm-foreground mb-4">
          歌曲列表
        </h3>
        <div className="dark:glass glass-realm rounded-lg overflow-hidden">
          {currentPlaylist.length === 0 ? (
            <div className="p-12 text-center dark:text-void-dust/70 text-realm-mist/70">
              暂无歌曲
            </div>
          ) : (
            <div className="divide-y dark:divide-void-purple/20 divide-realm-sun/20">
              {currentPlaylist.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(index)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                    index === currentTrackIndex
                      ? "dark:bg-void-purple/10 bg-realm-sky/10"
                      : "dark:hover:bg-void-purple/5 hover:bg-realm-sky/5"
                  }`}
                >
                  <div className="w-10 text-center">
                    {index === currentTrackIndex && isPlaying ? (
                      <div className="flex items-center justify-center gap-0.5 h-6">
                        <span className="w-1 h-4 bg-realm-ocean dark:bg-void-cyan rounded-full animate-pulse"></span>
                        <span className="w-1 h-6 bg-realm-ocean dark:bg-void-cyan rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></span>
                        <span className="w-1 h-3 bg-realm-ocean dark:bg-void-cyan rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                      </div>
                    ) : (
                      <span className="dark:text-void-dust/50 text-realm-mist/50">{index + 1}</span>
                    )}
                  </div>
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    {track.coverUrl ? (
                      <Image
                        src={track.coverUrl}
                        alt={track.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-void-deeper dark:to-void-blue flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      index === currentTrackIndex
                        ? "dark:text-void-cyan text-realm-ocean"
                        : "dark:text-void-star text-realm-foreground"
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-sm dark:text-void-dust/70 text-realm-mist/70 truncate">
                      {track.artist}
                    </p>
                  </div>
                  {track.album && (
                    <div className="hidden sm:block text-sm dark:text-void-dust/70 text-realm-mist/70 flex-1 min-w-0 truncate">
                      {track.album}
                    </div>
                  )}
                  {track.duration && (
                    <div className="text-sm dark:text-void-dust/70 text-realm-mist/70 flex-shrink-0">
                      {formatTime(track.duration)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
