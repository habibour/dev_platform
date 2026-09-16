"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { AppShell } from "@/components/AppShell";
import { TagListField } from "@/components/TagListField";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile } from "@/lib/api";
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/form-styles";
import { profileFormSchema } from "@/lib/schemas/profile";
import type { ProfileFormValues, ProjectFormValues } from "@/lib/schemas/profile";
import { ProjectFieldRow } from "./ProjectFieldRow";

const PROFILE_QUERY_KEY = ["profile", "me"] as const;

function toProjectPayload(project: ProjectFormValues) {
  return {
    title: project.title,
    description: project.description,
    urls: project.urls,
    technologies: project.technologies,
    startDate: project.startDate,
    endDate: project.isCurrent ? undefined : project.endDate,
    isCurrent: project.isCurrent,
  };
}

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const originalProjectIdsRef = useRef<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => apiFetch.get<{ user: Profile }>("profile/me"),
  });

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { headline: "", bio: "", skills: [], portfolioProjects: [] },
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "portfolioProjects" });

  useEffect(() => {
    if (!data) return;
    const user = data.user;
    originalProjectIdsRef.current = user.portfolioProjects.map((p) => p.id);
    reset({
      headline: user.headline ?? "",
      bio: user.bio ?? "",
      skills: user.skills,
      portfolioProjects: user.portfolioProjects.map((p) => ({
        serverId: p.id,
        title: p.title,
        description: p.description ?? "",
        urls: p.urls,
        technologies: p.technologies,
        startDate: p.startDate.slice(0, 10),
        endDate: p.endDate ? p.endDate.slice(0, 10) : "",
        isCurrent: p.isCurrent,
      })),
    });
  }, [data, reset]);

  function handleAddProject() {
    append({
      title: "",
      description: "",
      urls: [],
      technologies: [],
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
  }

  function handleRemoveProject(fieldId: string) {
    const currentIndex = fields.findIndex((f) => f.id === fieldId);
    if (currentIndex !== -1) remove(currentIndex);
  }

  const saveMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      await apiFetch.patch<{ user: Profile }>("profile/me", {
        headline: values.headline,
        bio: values.bio,
        skills: values.skills,
      });

      const submittedIds = new Set(
        values.portfolioProjects.map((p) => p.serverId).filter((id): id is string => !!id),
      );

      for (const project of values.portfolioProjects) {
        if (project.serverId) {
          await apiFetch.patch<{ user: Profile }>(
            `profile/me/portfolio-projects/${project.serverId}`,
            toProjectPayload(project),
          );
        }
      }

      for (const project of values.portfolioProjects) {
        if (!project.serverId) {
          await apiFetch.post<{ user: Profile }>(
            "profile/me/portfolio-projects",
            toProjectPayload(project),
          );
        }
      }

      const idsToDelete = originalProjectIdsRef.current.filter((id) => !submittedIds.has(id));
      for (const id of idsToDelete) {
        await apiFetch.delete<{ user: Profile }>(`profile/me/portfolio-projects/${id}`);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });

  const onSubmit = handleSubmit((values) => saveMutation.mutate(values));

  return (
    <AppShell>
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl">
          <h1 className="mb-4 text-lg font-semibold text-chrome-900">Edit profile</h1>

          {isError && (
            <p className="mb-4 rounded-md bg-like/10 px-3 py-2 text-sm text-like">
              {error instanceof ApiError ? error.message : "Failed to load profile"}
            </p>
          )}

          {isLoading && (
            <div className={`${cardClass} text-sm text-chrome-500`}>Loading profile…</div>
          )}

          {data && (
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className={cardClass}>
                  <h2 className="text-sm font-semibold text-chrome-900">Headline</h2>
                  <input {...register("headline")} className={`mt-3 w-full ${inputClass}`} />
                  {errors.headline && (
                    <span className="mt-1 block text-xs text-like">{errors.headline.message}</span>
                  )}
                </div>

                <div className={cardClass}>
                  <h2 className="text-sm font-semibold text-chrome-900">Bio</h2>
                  <textarea {...register("bio")} rows={3} className={`mt-3 w-full ${inputClass}`} />
                  {errors.bio && (
                    <span className="mt-1 block text-xs text-like">{errors.bio.message}</span>
                  )}
                </div>

                <div className={cardClass}>
                  <h2 className="mb-3 text-sm font-semibold text-chrome-900">Skills</h2>
                  <TagListField
                    control={control}
                    name="skills"
                    label=""
                    placeholder="e.g. TypeScript"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold text-chrome-900">Portfolio projects</h2>
                  {fields.map((field, index) => (
                    <ProjectFieldRow
                      key={field.id}
                      control={control}
                      index={index}
                      fieldId={field.id}
                      errors={errors}
                      onRemove={handleRemoveProject}
                    />
                  ))}
                  <button type="button" onClick={handleAddProject} className={secondaryButtonClass}>
                    Add project
                  </button>
                </div>

                {saveMutation.isError && (
                  <p className="rounded-md bg-like/10 px-3 py-2 text-sm text-like">
                    {saveMutation.error instanceof ApiError
                      ? saveMutation.error.message
                      : "Failed to save profile"}
                  </p>
                )}

                <button type="submit" disabled={saveMutation.isPending} className={primaryButtonClass}>
                  {saveMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </form>
            </FormProvider>
          )}
        </div>
      </main>
    </AppShell>
  );
}
