"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/AppShell";

function formatDate(value?: string) {
  if (!value) return "Present";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch
      .get<{ user: Profile }>(`profile/${id}`)
      .then((data) => setProfile(data.user))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile"));
  }, [id]);

  const isOwnProfile = currentUser?.id === id;

  return (
    <AppShell>
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl">
          {error && (
            <p className="rounded-md bg-like/10 px-3 py-2 text-sm text-like">{error}</p>
          )}

          {!profile && !error && (
            <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5 text-sm text-chrome-500">
              Loading profile…
            </div>
          )}

          {profile && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between rounded-md border border-chrome-200 bg-chrome-0 p-5">
                <div>
                  <h1 className="text-lg font-semibold text-chrome-900">{profile.name}</h1>
                  <p className="text-sm text-chrome-600">{profile.email}</p>
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

              <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5">
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

              <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5">
                <h2 className="text-sm font-semibold text-chrome-900">Experience</h2>
                {profile.experiences.length === 0 ? (
                  <p className="mt-2 text-sm text-chrome-500">No experience added yet.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-4">
                    {profile.experiences.map((exp) => (
                      <li key={exp.id} className="border-l-2 border-brand-100 pl-3">
                        <p className="text-sm font-medium text-chrome-900">{exp.title}</p>
                        <p className="text-sm text-chrome-600">{exp.company}</p>
                        <p className="text-xs text-chrome-500">
                          {formatDate(exp.from)} – {formatDate(exp.to)}
                        </p>
                        {exp.description && (
                          <p className="mt-1 text-sm text-chrome-700">{exp.description}</p>
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
