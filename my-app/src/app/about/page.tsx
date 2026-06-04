import { getProfile } from "@/lib/db/profile";
import Image from "next/image";
import type { Metadata } from "next";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "关于我 - 个人简介",
  description: "了解我的个人简介、教育背景、工作经历和技能",
  keywords: ["关于我", "简历", "个人简介", "工作经历"],
  openGraph: {
    title: "关于我 - 个人简介",
    description: "了解我的个人简介、教育背景、工作经历和技能",
    type: "profile",
  },
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cosmic-sun via-cosmic-earth to-cosmic-purple bg-clip-text text-transparent glow-text mb-4">
          关于我
        </h1>
        <p className="text-cosmic-dust/70 text-lg">探索我的数字宇宙轨迹</p>
      </div>

      {profile ? (
        <div className="space-y-12">
          {/* 个人简介 - 地球主题卡片 */}
          <section className="glass rounded-2xl p-8 cosmic-card relative overflow-hidden">
            {/* 装饰元素 */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="absolute inset-0 bg-earth-gradient rounded-full blur-xl" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-cosmic-earth to-cosmic-cyan bg-clip-text text-transparent">
              个人简介
            </h2>
            <div className="flex flex-col md:flex-row items-start gap-8">
              {profile.avatar && (
                <div className="relative">
                  <div className="absolute inset-0 bg-nebula-gradient rounded-full blur-lg opacity-50" />
                  <div className="relative w-40 h-40">
                    <Image
                      src={profile.avatar}
                      alt={profile.fullName}
                      fill
                      className="rounded-full object-cover border-4 border-cosmic-purple/30"
                      sizes="(max-width: 768px) 160px, 160px"
                      priority
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-cosmic-star">{profile.fullName}</h3>
                <p className="text-cosmic-cyan mt-1 text-lg">{profile.title}</p>
                <p className="mt-4 text-cosmic-dust/80 leading-relaxed">
                  {profile.bio}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-cosmic-dust/70">
                  {profile.location && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {profile.email}
                    </span>
                  )}
                  {profile.website && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cosmic-sun transition-colors">
                        {profile.website}
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 工作经历 - 时间线设计 */}
          {profile.experience && profile.experience.length > 0 && (
            <section className="glass rounded-2xl p-8 cosmic-card">
              <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-cosmic-sun to-cosmic-sunRed bg-clip-text text-transparent">
                工作经历
              </h2>
              <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmic-sun via-cosmic-earth to-cosmic-purple" />
                
                <div className="space-y-8">
                  {profile.experience.map((exp: any) => (
                    <div key={exp.id} className="relative pl-12">
                      {/* 时间线节点 */}
                      <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-sun-gradient border-4 border-cosmic-dark" />
                      
                      <div className="glass-light rounded-xl p-6">
                        <h3 className="text-xl font-medium text-cosmic-star">{exp.position}</h3>
                        <p className="text-cosmic-cyan mt-1">{exp.company}</p>
                        <p className="text-sm text-cosmic-dust/60 mt-2">
                          {new Date(exp.startDate).getFullYear()} -
                          {exp.isCurrent
                            ? " 至今"
                            : exp.endDate
                              ? ` ${new Date(exp.endDate).getFullYear()}`
                              : ""}
                        </p>
                        {exp.description && (
                          <p className="mt-3 text-cosmic-dust/80">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 教育背景 */}
          {profile.education && profile.education.length > 0 && (
            <section className="glass rounded-2xl p-8 cosmic-card">
              <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
                教育背景
              </h2>
              <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmic-purple via-cosmic-pink to-cosmic-earth" />
                
                <div className="space-y-8">
                  {profile.education.map((edu: any) => (
                    <div key={edu.id} className="relative pl-12">
                      {/* 时间线节点 */}
                      <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-nebula-gradient border-4 border-cosmic-dark" />
                      
                      <div className="glass-light rounded-xl p-6">
                        <h3 className="text-xl font-medium text-cosmic-star">{edu.school}</h3>
                        <p className="text-cosmic-pink mt-1">{edu.major} · {edu.degree}</p>
                        <p className="text-sm text-cosmic-dust/60 mt-2">
                          {new Date(edu.startDate).getFullYear()} -
                          {edu.endDate
                            ? ` ${new Date(edu.endDate).getFullYear()}`
                            : " 至今"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 技能专长 - 进度条设计 */}
          {profile.skills && profile.skills.length > 0 && (
            <section className="glass rounded-2xl p-8 cosmic-card">
              <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-cosmic-cyan to-cosmic-earth bg-clip-text text-transparent">
                技能专长
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.skills.map((skill: any) => (
                  <div key={skill.id} className="glass-light rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-cosmic-star">{skill.name}</span>
                      <span className="text-sm text-cosmic-dust/70">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-cosmic-deeper rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-earth transition-all duration-500"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 社交媒体 */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <section className="glass rounded-2xl p-8 cosmic-card">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-cosmic-star to-cosmic-dust bg-clip-text text-transparent">
                社交媒体
              </h2>
              <div className="flex flex-wrap gap-4">
                {profile.socialLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cosmic flex items-center gap-2 glass-light px-5 py-3 rounded-xl text-cosmic-star hover:text-cosmic-sun hover:bg-cosmic-purple/20 transition-all duration-300"
                  >
                    {link.platform === "GitHub" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.951.796.853-.237 1.773-.356 2.692-.36.914.004 1.834.122 2.692.36 1.943-1.118 2.951-.796 2.951-.796.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                    {link.platform === "Twitter" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    )}
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-cosmic-dust/50 text-lg">暂无个人资料</p>
        </div>
      )}
    </div>
  );
}
