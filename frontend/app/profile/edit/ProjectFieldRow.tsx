"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { TagListField } from "@/components/TagListField";
import type { ItemError } from "@/components/TagListField";
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/form-styles";
import type { ProfileFormValues } from "@/lib/schemas/profile";

type ProjectFieldRowProps = {
  control: Control<ProfileFormValues>;
  index: number;
  fieldId: string;
  errors: FieldErrors<ProfileFormValues>;
  onRemove: (fieldId: string) => void;
};

export function ProjectFieldRow({ control, index, fieldId, errors, onRemove }: ProjectFieldRowProps) {
  const { register } = useFormContext<ProfileFormValues>();
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const isCurrent = useWatch({ control, name: `portfolioProjects.${index}.isCurrent` });
  const projectErrors = errors.portfolioProjects?.[index];

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-chrome-900">Project {index + 1}</h3>
        {!isConfirmingRemove && (
          <button
            type="button"
            onClick={() => setIsConfirmingRemove(true)}
            className="text-xs font-medium text-like hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {isConfirmingRemove && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-md bg-like/10 px-3 py-2 text-sm text-like">
          <span>Remove this project? This takes effect when you save.</span>
          <div className="flex gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                onRemove(fieldId);
                setIsConfirmingRemove(false);
              }}
            >
              Confirm remove
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setIsConfirmingRemove(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <label className="mt-3 flex flex-col gap-1 text-xs text-chrome-600">
        Title
        <input {...register(`portfolioProjects.${index}.title`)} className={inputClass} />
        {projectErrors?.title && (
          <span className="text-xs text-like">{projectErrors.title.message}</span>
        )}
      </label>

      <label className="mt-3 flex flex-col gap-1 text-xs text-chrome-600">
        Description
        <textarea
          {...register(`portfolioProjects.${index}.description`)}
          rows={2}
          className={inputClass}
        />
      </label>

      <div className="mt-3 flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-chrome-600">
          Start date
          <input
            type="date"
            {...register(`portfolioProjects.${index}.startDate`)}
            className={inputClass}
          />
          {projectErrors?.startDate && (
            <span className="text-xs text-like">{projectErrors.startDate.message}</span>
          )}
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-chrome-600">
          End date
          <input
            type="date"
            disabled={!!isCurrent}
            {...register(`portfolioProjects.${index}.endDate`)}
            className={`${inputClass} disabled:opacity-50`}
          />
          {projectErrors?.endDate && (
            <span className="text-xs text-like">{projectErrors.endDate.message}</span>
          )}
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-chrome-600">
        <input type="checkbox" {...register(`portfolioProjects.${index}.isCurrent`)} />
        Currently working on this
      </label>

      <div className="mt-3">
        <TagListField
          control={control}
          name={`portfolioProjects.${index}.urls`}
          label="URLs"
          placeholder="https://…"
          itemErrors={projectErrors?.urls as ItemError[] | undefined}
        />
      </div>
      <div className="mt-3">
        <TagListField
          control={control}
          name={`portfolioProjects.${index}.technologies`}
          label="Technologies"
          placeholder="e.g. React"
        />
      </div>
    </div>
  );
}
