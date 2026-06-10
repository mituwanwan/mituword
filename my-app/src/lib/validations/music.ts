import { z } from "zod";

export const musicTrackSchema = z.object({
  title: z.string().min(1, "歌曲名称不能为空").max(200, "歌曲名称最多200个字符"),
  artist: z.string().min(1, "艺术家不能为空").max(200, "艺术家最多200个字符"),
  album: z.string().max(200, "专辑名称最多200个字符").optional().or(z.literal("")),
  releaseDate: z.string().datetime().optional().or(z.literal("")),
  genre: z.string().max(100, "流派最多100个字符").optional().or(z.literal("")),
  playUrl: z.string().url("请输入有效的播放URL").optional().or(z.literal("")),
  coverUrl: z.string().url("请输入有效的封面URL").optional().or(z.literal("")),
  duration: z.number().int().min(0).optional(),
  copyright: z.string().max(500, "版权信息最多500个字符").optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export const musicPlaylistSchema = z.object({
  name: z.string().min(1, "歌单名称不能为空").max(200, "歌单名称最多200个字符"),
  description: z.string().max(1000, "描述最多1000个字符").optional().or(z.literal("")),
  coverUrl: z.string().url("请输入有效的封面URL").optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export const addToPlaylistSchema = z.object({
  playlistId: z.string().min(1, "歌单ID不能为空"),
  trackId: z.string().min(1, "歌曲ID不能为空"),
  order: z.number().int().min(0).optional(),
});

export type MusicTrackInput = z.infer<typeof musicTrackSchema>;
export type MusicPlaylistInput = z.infer<typeof musicPlaylistSchema>;
export type AddToPlaylistInput = z.infer<typeof addToPlaylistSchema>;
