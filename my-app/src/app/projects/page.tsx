import { getProjects } from "@/lib/db/project";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目展示 - 我的作品集",
  description: "查看我开发的各类项目，包括Web应用、工具库和创意实验",
  keywords: ["项目", "作品集", "开源项目", "Web开发"],
  openGraph: {
    title: "项目展示 - 我的作品集",
    description: "查看我开发的各类项目，包括Web应用、工具库和创意实验",
    type: "website",
  },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const options = {
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    tag: typeof searchParams.tag === "string" ? searchParams.tag : undefined,
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    featured: searchParams.featured === "true" ? true : undefined,
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
  };

  const projects = await getProjects(options);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">项目展示</h1>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              {project.thumbnail && (
                <div className="w-full h-48 relative">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      project.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : project.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status === "COMPLETED"
                      ? "已完成"
                      : project.status === "IN_PROGRESS"
                        ? "进行中"
                        : "计划中"}
                  </span>
                  {project.featured && (
                    <span className="text-yellow-500">⭐</span>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>👁 {project.views}</span>
                  {project.category && (
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {project.category.name}
                    </span>
                  )}
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tagRelation: any) => (
                      <span
                        key={tagRelation.id}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {tagRelation.tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无项目</p>
        </div>
      )}
    </div>
  );
}
