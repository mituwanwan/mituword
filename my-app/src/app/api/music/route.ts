import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { musicTrackSchema, musicPlaylistSchema, addToPlaylistSchema } from "@/lib/validations/music";
import {
  getMusicTracks,
  getMusicPlaylists,
  createMusicTrack,
  updateMusicTrack,
  deleteMusicTrack,
  createMusicPlaylist,
  updateMusicPlaylist,
  deleteMusicPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/lib/db/music";

export async function GET(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 60 });
  if (limitResponse) return limitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "tracks";

    if (type === "tracks") {
      const tracks = await getMusicTracks();
      return NextResponse.json(tracks);
    }

    if (type === "playlists") {
      const playlists = await getMusicPlaylists();
      return NextResponse.json(playlists);
    }

    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const data = await request.json();

    if (action === "create-track") {
      const result = musicTrackSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const trackData = {
        ...result.data,
        releaseDate: result.data.releaseDate ? new Date(result.data.releaseDate) : undefined,
      };
      const track = await createMusicTrack(trackData);
      return NextResponse.json(track, { status: 201 });
    }

    if (action === "create-playlist") {
      const result = musicPlaylistSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const playlist = await createMusicPlaylist(result.data);
      return NextResponse.json(playlist, { status: 201 });
    }

    if (action === "add-to-playlist") {
      const result = addToPlaylistSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const { playlistId, trackId, order } = result.data;
      const playlistTrack = await addTrackToPlaylist(playlistId, trackId, order);
      return NextResponse.json(playlistTrack, { status: 201 });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Create music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const data = await request.json();

    if (action === "update-track") {
      const { id, ...updateData } = data;
      const result = musicTrackSchema.partial().safeParse(updateData);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const trackData: any = { ...result.data };
      if (result.data.releaseDate) {
        trackData.releaseDate = new Date(result.data.releaseDate);
      }
      const track = await updateMusicTrack(id, trackData);
      return NextResponse.json(track);
    }

    if (action === "update-playlist") {
      const { id, ...updateData } = data;
      const result = musicPlaylistSchema.partial().safeParse(updateData);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const playlist = await updateMusicPlaylist(id, result.data);
      return NextResponse.json(playlist);
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "delete-track") {
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Track ID is required" },
          { status: 400 }
        );
      }
      await deleteMusicTrack(id);
      return NextResponse.json({ message: "Track deleted successfully" });
    }

    if (action === "delete-playlist") {
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Playlist ID is required" },
          { status: 400 }
        );
      }
      await deleteMusicPlaylist(id);
      return NextResponse.json({ message: "Playlist deleted successfully" });
    }

    if (action === "remove-from-playlist") {
      const playlistId = searchParams.get("playlistId");
      const trackId = searchParams.get("trackId");
      if (!playlistId || !trackId) {
        return NextResponse.json(
          { error: "Playlist ID and Track ID are required" },
          { status: 400 }
        );
      }
      await removeTrackFromPlaylist(playlistId, trackId);
      return NextResponse.json({ message: "Track removed from playlist successfully" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
