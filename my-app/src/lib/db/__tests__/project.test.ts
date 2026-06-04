import { prisma } from "@/lib/prisma";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  incrementProjectViews,
} from "../project";

describe("Project Database Operations", () => {
  beforeEach(async () => {
    await prisma.projectTagRelation.deleteMany();
    await prisma.projectImage.deleteMany();
    await prisma.projectTag.deleteMany();
    await prisma.project.deleteMany();
    await prisma.projectCategory.deleteMany();
  });

  it("should create a project", async () => {
    const project = await createProject({
      title: "My Project",
      slug: "my-project",
      description: "A test project",
      status: "COMPLETED",
    });

    expect(project.title).toBe("My Project");
    expect(project.slug).toBe("my-project");
  });

  it("should get project by slug", async () => {
    await createProject({
      title: "My Project",
      slug: "my-project",
      description: "A test project",
    });

    const project = await getProjectBySlug("my-project");
    expect(project).not.toBeNull();
    expect(project?.title).toBe("My Project");
  });

  it("should get projects with filters", async () => {
    await createProject({
      title: "Project 1",
      slug: "project-1",
      description: "First project",
      status: "COMPLETED",
      featured: true,
    });

    await createProject({
      title: "Project 2",
      slug: "project-2",
      description: "Second project",
      status: "IN_PROGRESS",
      featured: false,
    });

    const featured = await getProjects({ featured: true });
    expect(featured).toHaveLength(1);
    expect(featured[0].title).toBe("Project 1");

    const inProgress = await getProjects({ status: "IN_PROGRESS" });
    expect(inProgress).toHaveLength(1);
    expect(inProgress[0].title).toBe("Project 2");
  });

  it("should search projects", async () => {
    await createProject({
      title: "React App",
      slug: "react-app",
      description: "A React application",
    });

    await createProject({
      title: "Vue App",
      slug: "vue-app",
      description: "A Vue application",
    });

    const results = await getProjects({ search: "React" });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("React App");
  });

  it("should update a project", async () => {
    const project = await createProject({
      title: "My Project",
      slug: "my-project",
      description: "A test project",
    });

    const updated = await updateProject(project.id, {
      title: "Updated Project",
      description: "Updated description",
    });

    expect(updated.title).toBe("Updated Project");
    expect(updated.description).toBe("Updated description");
  });

  it("should delete a project", async () => {
    const project = await createProject({
      title: "My Project",
      slug: "my-project",
      description: "A test project",
    });

    await deleteProject(project.id);
    const deleted = await getProjectBySlug("my-project");
    expect(deleted).toBeNull();
  });

  it("should increment project views", async () => {
    const project = await createProject({
      title: "My Project",
      slug: "my-project",
      description: "A test project",
    });

    expect(project.views).toBe(0);

    const updated = await incrementProjectViews(project.id);
    expect(updated.views).toBe(1);
  });
});
