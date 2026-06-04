import { render, screen } from "@testing-library/react";
import ProjectDetailPage from "../page";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
}));

describe("ProjectDetailPage", () => {
  const mockProject = {
    id: "1",
    title: "测试项目",
    slug: "test-project",
    description: "这是一个测试项目描述",
    status: "COMPLETED",
    featured: true,
    views: 100,
    thumbnail: "https://example.com/image.jpg",
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com/test",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-01"),
    categoryId: "cat1",
    category: {
      id: "cat1",
      name: "Web开发",
      slug: "web-dev",
    },
    tags: [
      {
        id: "tag1",
        tag: {
          id: "t1",
          name: "React",
          color: "#61DAFB",
        },
      },
    ],
    images: [
      {
        id: "img1",
        url: "https://example.com/image1.jpg",
        alt: "项目截图1",
        order: 0,
      },
    ],
  };

  const mockRelatedProjects = [
    {
      id: "2",
      title: "相关项目1",
      slug: "related-1",
      description: "相关项目描述",
      thumbnail: "https://example.com/related1.jpg",
      category: { id: "cat1", name: "Web开发", slug: "web-dev" },
      tags: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders project details correctly", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockRelatedProjects);
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, views: 101 });

    const params = Promise.resolve({ slug: "test-project" });
    const { container } = render(await ProjectDetailPage({ params }));

    expect(screen.getByRole("heading", { name: "测试项目" })).toBeInTheDocument();
    expect(screen.getByText("这是一个测试项目描述")).toBeInTheDocument();
    expect(screen.getByText("已完成")).toBeInTheDocument();
    expect(screen.getByText("精选项目")).toBeInTheDocument();
    expect(screen.getByText("Web开发")).toBeInTheDocument();
    expect(screen.getByText("100 次浏览")).toBeInTheDocument();
  });

  it("renders project links correctly", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockRelatedProjects);
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, views: 101 });

    const params = Promise.resolve({ slug: "test-project" });
    render(await ProjectDetailPage({ params }));

    const demoLink = screen.getByText("查看演示").closest("a");
    const repoLink = screen.getByText("源代码").closest("a");

    expect(demoLink).toHaveAttribute("href", "https://demo.example.com");
    expect(repoLink).toHaveAttribute("href", "https://github.com/test");
  });

  it("renders tags correctly", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockRelatedProjects);
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, views: 101 });

    const params = Promise.resolve({ slug: "test-project" });
    render(await ProjectDetailPage({ params }));

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders related projects", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockRelatedProjects);
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, views: 101 });

    const params = Promise.resolve({ slug: "test-project" });
    render(await ProjectDetailPage({ params }));

    expect(screen.getByText("相关项目")).toBeInTheDocument();
    expect(screen.getByText("相关项目1")).toBeInTheDocument();
  });

  it("increments view count on load", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockRelatedProjects);
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, views: 101 });

    const params = Promise.resolve({ slug: "test-project" });
    await ProjectDetailPage({ params });

    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { views: { increment: 1 } },
    });
  });

  it("handles project not found", async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    const { notFound } = require("next/navigation");
    const params = Promise.resolve({ slug: "non-existent" });
    
    await ProjectDetailPage({ params });

    expect(notFound).toHaveBeenCalled();
  });
});
