import { z } from "zod";

export const portfolioProjectSchema = z
  .object({
    // Backend-assigned id, if this project already exists on the server.
    // Named `serverId`, not `id` — RHF's useFieldArray auto-generates its own
    // `field.id` for the row key, which would collide with a property literally
    // named `id` on this object.
    serverId: z.string().optional(),
    title: z.string().min(1, "Title is required").max(120, "Title must be 120 characters or fewer"),
    description: z.string().max(2000, "Description must be 2000 characters or fewer").optional(),
    urls: z.array(z.string().min(1, "URL is required").url("Enter a valid URL")),
    technologies: z.array(z.string().min(1, "Technology cannot be empty")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
  })
  .refine((data) => data.isCurrent || !!data.endDate, {
    message: "End date is required unless this project is ongoing",
    path: ["endDate"],
  });

export const profileFormSchema = z.object({
  headline: z.string().max(120, "Headline must be 120 characters or fewer").optional(),
  bio: z.string().max(2000, "Bio must be 2000 characters or fewer").optional(),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  portfolioProjects: z.array(portfolioProjectSchema),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ProjectFormValues = ProfileFormValues["portfolioProjects"][number];
