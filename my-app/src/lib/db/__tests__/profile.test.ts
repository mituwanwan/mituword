import { prisma } from "@/lib/prisma";
import {
  getProfile,
  createProfile,
  updateProfile,
  addEducation,
  addExperience,
  addSkill,
} from "../profile";

const describeIfDb = (globalThis as any).DB_AVAILABLE ? describe : describe.skip;

describeIfDb("Profile Database Operations", () => {
  beforeEach(async () => {
    await prisma.education.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create a profile", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await createProfile({
      userId: user.id,
      fullName: "John Doe",
      title: "Software Engineer",
      bio: "A passionate developer",
    });

    expect(profile.fullName).toBe("John Doe");
    expect(profile.title).toBe("Software Engineer");
    expect(profile.bio).toBe("A passionate developer");
  });

  it("should get profile with related data", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: "John Doe",
        title: "Software Engineer",
        bio: "A passionate developer",
      },
    });

    const result = await getProfile();
    expect(result).not.toBeNull();
    expect(result?.fullName).toBe("John Doe");
  });

  it("should update a profile", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: "John Doe",
        title: "Software Engineer",
        bio: "A passionate developer",
      },
    });

    const updated = await updateProfile(profile.id, {
      fullName: "Jane Doe",
      title: "Senior Engineer",
    });

    expect(updated.fullName).toBe("Jane Doe");
    expect(updated.title).toBe("Senior Engineer");
  });

  it("should add education to profile", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: "John Doe",
        title: "Software Engineer",
        bio: "A passionate developer",
      },
    });

    const education = await addEducation({
      profileId: profile.id,
      school: "MIT",
      major: "Computer Science",
      degree: "BACHELOR",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2022-06-01"),
    });

    expect(education.school).toBe("MIT");
    expect(education.major).toBe("Computer Science");
  });

  it("should add work experience to profile", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: "John Doe",
        title: "Software Engineer",
        bio: "A passionate developer",
      },
    });

    const experience = await addExperience({
      profileId: profile.id,
      company: "Google",
      position: "Software Engineer",
      startDate: new Date("2022-07-01"),
      isCurrent: true,
    });

    expect(experience.company).toBe("Google");
    expect(experience.isCurrent).toBe(true);
  });

  it("should add skill to profile", async () => {
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: "John Doe",
        title: "Software Engineer",
        bio: "A passionate developer",
      },
    });

    const skill = await addSkill({
      profileId: profile.id,
      name: "TypeScript",
      category: "TECHNICAL",
      proficiency: 90,
    });

    expect(skill.name).toBe("TypeScript");
    expect(skill.proficiency).toBe(90);
  });
});
