"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import type { Experience, Profile } from "@/lib/api";
import { AppShell } from "@/components/AppShell";

const inputClass =
  "rounded-md border border-chrome-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
const primaryButtonClass =
  "cursor-pointer rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50";
const secondaryButtonClass =
  "cursor-pointer rounded-full border border-chrome-200 px-3 py-2 text-sm font-medium text-chrome-700 hover:bg-chrome-100";

const emptyExperienceForm = { title: "", company: "", from: "", to: "", description: "" };

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [savingSkill, setSavingSkill] = useState(false);

  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [savingExperience, setSavingExperience] = useState(false);

  useEffect(() => {
    apiFetch
      .get<{ user: Profile }>("profile/me")
      .then((data) => {
        setProfile(data.user);
        setName(data.user.name);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile"));
  }, []);

  function reportError(err: unknown) {
    setError(err instanceof ApiError ? err.message : "Request failed");
  }

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSavingName(true);
    setError(null);
    try {
      const data = await apiFetch.patch<{ user: Profile }>(`profile/${profile.id}`, { name });
      setProfile(data.user);
    } catch (err) {
      reportError(err);
    } finally {
      setSavingName(false);
    }
  }

  async function handleAddSkill(e: FormEvent) {
    e.preventDefault();
    if (!profile || !skillInput.trim()) return;
    setSavingSkill(true);
    setError(null);
    try {
      const data = await apiFetch.post<{ user: Profile }>(`profile/${profile.id}/skills`, {
        skill: skillInput.trim(),
      });
      setProfile(data.user);
      setSkillInput("");
    } catch (err) {
      reportError(err);
    } finally {
      setSavingSkill(false);
    }
  }

  async function handleRemoveSkill(skill: string) {
    if (!profile) return;
    setError(null);
    try {
      const data = await apiFetch.delete<{ user: Profile }>(
        `profile/${profile.id}/skills/${encodeURIComponent(skill)}`,
      );
      setProfile(data.user);
    } catch (err) {
      reportError(err);
    }
  }

  function startEditExperience(exp: Experience) {
    setEditingExperienceId(exp.id);
    setExperienceForm({
      title: exp.title,
      company: exp.company,
      from: exp.from.slice(0, 10),
      to: exp.to ? exp.to.slice(0, 10) : "",
      description: exp.description ?? "",
    });
  }

  function cancelEditExperience() {
    setEditingExperienceId(null);
    setExperienceForm(emptyExperienceForm);
  }

  async function handleSubmitExperience(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSavingExperience(true);
    setError(null);
    const payload = {
      title: experienceForm.title,
      company: experienceForm.company,
      from: experienceForm.from,
      to: experienceForm.to || undefined,
      description: experienceForm.description || undefined,
    };
    try {
      const data = editingExperienceId
        ? await apiFetch.patch<{ user: Profile }>(
            `profile/${profile.id}/experiences/${editingExperienceId}`,
            payload,
          )
        : await apiFetch.post<{ user: Profile }>(`profile/${profile.id}/experiences`, payload);
      setProfile(data.user);
      cancelEditExperience();
    } catch (err) {
      reportError(err);
    } finally {
      setSavingExperience(false);
    }
  }

  async function handleRemoveExperience(experienceId: string) {
    if (!profile) return;
    setError(null);
    try {
      const data = await apiFetch.delete<{ user: Profile }>(
        `profile/${profile.id}/experiences/${experienceId}`,
      );
      setProfile(data.user);
      if (editingExperienceId === experienceId) cancelEditExperience();
    } catch (err) {
      reportError(err);
    }
  }

  return (
    <AppShell>
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl">
          <h1 className="mb-4 text-lg font-semibold text-chrome-900">Edit profile</h1>

          {error && (
            <p className="mb-4 rounded-md bg-like/10 px-3 py-2 text-sm text-like">{error}</p>
          )}

          {!profile && !error && (
            <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5 text-sm text-chrome-500">
              Loading profile…
            </div>
          )}

          {profile && (
            <div className="flex flex-col gap-4">
              <form
                onSubmit={handleSaveName}
                className="flex flex-col gap-3 rounded-md border border-chrome-200 bg-chrome-0 p-5"
              >
                <h2 className="text-sm font-semibold text-chrome-900">Name</h2>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`flex-1 ${inputClass}`}
                  />
                  <button type="submit" disabled={savingName} className={primaryButtonClass}>
                    {savingName ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>

              <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5">
                <h2 className="text-sm font-semibold text-chrome-900">Skills</h2>
                <form onSubmit={handleAddSkill} className="mt-3 flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. TypeScript"
                    className={`flex-1 ${inputClass}`}
                  />
                  <button type="submit" disabled={savingSkill} className={primaryButtonClass}>
                    Add
                  </button>
                </form>
                {profile.skills.length === 0 ? (
                  <p className="mt-3 text-sm text-chrome-500">No skills added yet.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-2 text-xs font-medium text-brand-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="cursor-pointer text-brand-500 hover:text-brand-700"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5">
                <h2 className="text-sm font-semibold text-chrome-900">Experience</h2>

                {profile.experiences.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-3">
                    {profile.experiences.map((exp) => (
                      <li
                        key={exp.id}
                        className="flex items-start justify-between rounded-md border border-chrome-100 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-chrome-900">{exp.title}</p>
                          <p className="text-sm text-chrome-600">{exp.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditExperience(exp)}
                            className="text-xs font-medium text-brand-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-xs font-medium text-like hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  onSubmit={handleSubmitExperience}
                  className="mt-4 flex flex-col gap-3 border-t border-chrome-100 pt-4"
                >
                  <p className="text-xs font-medium text-chrome-600">
                    {editingExperienceId ? "Edit experience" : "Add experience"}
                  </p>
                  <input
                    value={experienceForm.title}
                    onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                    placeholder="Title"
                    required
                    className={inputClass}
                  />
                  <input
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, company: e.target.value })
                    }
                    placeholder="Company"
                    required
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <label className="flex flex-1 flex-col gap-1 text-xs text-chrome-600">
                      From
                      <input
                        type="date"
                        value={experienceForm.from}
                        onChange={(e) =>
                          setExperienceForm({ ...experienceForm, from: e.target.value })
                        }
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-1 text-xs text-chrome-600">
                      To (optional)
                      <input
                        type="date"
                        value={experienceForm.to}
                        onChange={(e) =>
                          setExperienceForm({ ...experienceForm, to: e.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, description: e.target.value })
                    }
                    placeholder="Description (optional)"
                    rows={2}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={savingExperience} className={primaryButtonClass}>
                      {savingExperience ? "Saving…" : editingExperienceId ? "Save changes" : "Add"}
                    </button>
                    {editingExperienceId && (
                      <button
                        type="button"
                        onClick={cancelEditExperience}
                        className={secondaryButtonClass}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
