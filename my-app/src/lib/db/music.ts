import { prisma } from "@/lib/prisma";

export async function getMusicTracks() {
  return prisma.musicTrack.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getMusicTrackById(id: string) {
  return prisma.musicTrack.findUnique({
    where: { id },
  });
}

export async function getMusicPlaylists() {
  return prisma.musicPlaylist.findMany({
    include: {
      tracks: {
        include: { track: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });
}

export async function getMusicPlaylistById(id: string) {
  return prisma.musicPlaylist.findUnique({
    where: { id },
    include: {
      tracks: {
        include: { track: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createMusicTrack(data: {
  title: string;
  artist: string;
  album?: string;
  releaseDate?: Date;
  genre?: string;
  playUrl?: string;
  coverUrl?: string;
  duration?: number;
  copyright?: string;
  order?: number;
}) {
  return prisma.musicTrack.create({ data });
}

export async function updateMusicTrack(
  id: string,
  data: Partial<{
    title: string;
    artist: string;
    album: string;
    releaseDate: Date;
    genre: string;
    playUrl: string;
    coverUrl: string;
    duration: number;
    copyright: string;
    order: number;
  }>
) {
  return prisma.musicTrack.update({
    where: { id },
    data,
  });
}

export async function deleteMusicTrack(id: string) {
  return prisma.musicTrack.delete({ where: { id } });
}

export async function createMusicPlaylist(data: {
  name: string;
  description?: string;
  coverUrl?: string;
  order?: number;
}) {
  return prisma.musicPlaylist.create({ data });
}

export async function updateMusicPlaylist(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    coverUrl: string;
    order: number;
  }>
) {
  return prisma.musicPlaylist.update({
    where: { id },
    data,
  });
}

export async function deleteMusicPlaylist(id: string) {
  return prisma.musicPlaylist.delete({ where: { id } });
}

export async function addTrackToPlaylist(
  playlistId: string,
  trackId: string,
  order?: number
) {
  return prisma.playlistTrack.create({
    data: {
      playlistId,
      trackId,
      order: order || 0,
    },
  });
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  return prisma.playlistTrack.delete({
    where: {
      playlistId_trackId: {
        playlistId,
        trackId,
      },
    },
  });
}
