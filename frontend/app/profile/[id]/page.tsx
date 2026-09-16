"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import type { PublicProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/AppShell";
import { cardClass } from "@/lib/form-styles";

function formatDateRange(startDate: string, endDate: string | undefined, isCurrent: boolean) {
  const start = new Date(startDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
  const end = isCurrent
    ? "Present"
    : endDate
      ? new Date(endDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })
      : "";
  return `${start} – ${end}`;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => apiFetch.get<{ user: PublicProfile }>(`profile/${id}`),
    enabled: !!id,
  });
  const profile = data?.user;

  return (
    <AppShell>
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl">
          {isError && (
            <p className="rounded-md bg-like/10 px-3 py-2 text-sm text-like">
              {error instanceof ApiError ? error.message : "Failed to load profile"}
            </p>
          )}

          {isLoading && (
            <div className={`${cardClass} text-sm text-chrome-500`}>Loading profile…</div>
          )}

          {profile && (
            <div className="flex flex-col gap-4">
              <div className={`${cardClass} flex items-start justify-between`}>
                <div>
                  <h1 className="text-lg font-semibold text-chrome-900">{profile.name}</h1>
                  {isOwnProfile && currentUser && (
                    <p className="text-sm text-chrome-600">{currentUser.email}</p>
                  )}
                  {profile.headline && <p className="text-sm text-chrome-600">{profile.headline}</p>}
                </div>
                {isOwnProfile && (
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-1.5 rounded-full border border-chrome-200 px-3 py-1.5 text-sm font-medium text-chrome-700 hover:bg-chrome-100"
                  >
                    <Pencil size={14} />
                    Edit profile
                  </Link>
                )}
              </div>

              {profile.bio && (
                <div className={cardClass}>
                  <h2 className="text-sm font-semibold text-chrome-900">About</h2>
                  <p className="mt-2 text-sm text-chrome-700">{profile.bio}</p>
                </div>
              )}

              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-chrome-900">Skills</h2>
                {profile.skills.length === 0 ? (
                  <p className="mt-2 text-sm text-chrome-500">No skills added yet.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-chrome-900">Portfolio projects</h2>
                {profile.portfolioProjects.length === 0 ? (
                  <p className="mt-2 text-sm text-chrome-500">No projects added yet.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-4">
                    {profile.portfolioProjects.map((project) => (
                      <li key={project.id} className="border-l-2 border-brand-100 pl-3">
                        <p className="text-sm font-medium text-chrome-900">{project.title}</p>
                        <p className="text-xs text-chrome-500">
                          {formatDateRange(project.startDate, project.endDate, project.isCurrent)}
                        </p>
                        {project.description && (
                          <p className="mt-1 text-sm text-chrome-700">{project.description}</p>
                        )}
                        {project.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.urls.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1">
                            {project.urls.map((url) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-brand-500 hover:underline"
                              >
                                {url}
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
