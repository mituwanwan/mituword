import { prisma } from "@/lib/prisma";

export async function getProfile() {
  return prisma.profile.findFirst({
    select: {
      id: true,
      userId: true,
      fullName: true,
      title: true,
      bio: true,
      avatar: true,
      location: true,
      website: true,
      createdAt: true,
      updatedAt: true,
      education: { orderBy: { order: "asc" } },
      experience: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  });
}

export async function createProfile(data: {
  userId: string;
  fullName: string;
  title: string;
  bio: string;
  avatar?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
}) {
  return prisma.profile.create({ data });
}

export async function updateProfile(
  id: string,
  data: Partial<{
    fullName: string;
    title: string;
    bio: string;
    avatar: string;
    location: string;
    phone: string;
    email: string;
    website: string;
  }>
) {
  return prisma.profile.update({
    where: { id },
    data,
  });
}

export async function addEducation(data: {
  profileId: string;
  school: string;
  major: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  order?: number;
}) {
  return prisma.education.create({ data });
}

export async function addExperience(data: {
  profileId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  order?: number;
}) {
  return prisma.workExperience.create({ data });
}

export async function addSkill(data: {
  profileId: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order?: number;
}) {
  return prisma.skill.create({ data });
}
