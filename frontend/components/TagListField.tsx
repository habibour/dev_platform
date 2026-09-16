"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useController } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { inputClass, secondaryButtonClass } from "@/lib/form-styles";

export type ItemError = { message?: string } | undefined;

type TagListFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  // Per-entry errors (e.g. a bad URL at a specific index). The array field's own
  // fieldState.error is not populated when the failure is on one entry — RHF nests
  // it at errors.<name>[index].message instead, so the caller passes it explicitly.
  itemErrors?: ItemError[];
};

export function TagListField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  itemErrors,
}: TagListFieldProps<TFieldValues>) {
  const { field } = useController({ control, name });
  const value = (field.value ?? []) as string[];
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function addEntry() {
    const parsed = draft.trim();
    if (!parsed) return;
    if (value.includes(parsed)) {
      setLocalError("Already added");
      return;
    }
    field.onChange([...value, parsed]);
    setDraft("");
    setLocalError(null);
  }

  function removeEntry(index: number) {
    field.onChange(value.filter((_, i) => i !== index));
  }

  const firstItemErrorMessage = itemErrors?.find((entry) => entry?.message)?.message;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-chrome-600">{label}</span>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setLocalError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addEntry();
            }
          }}
          placeholder={placeholder}
          className={`flex-1 ${inputClass}`}
        />
        <button type="button" onClick={addEntry} className={secondaryButtonClass}>
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((entry, index) => {
            const entryError = itemErrors?.[index]?.message;
            return (
              <span
                key={`${entry}-${index}`}
                className={`flex items-center gap-1.5 rounded-full py-1 pl-3 pr-2 text-xs font-medium ${
                  entryError ? "bg-like/10 text-like" : "bg-brand-50 text-brand-700"
                }`}
                title={entryError}
              >
                {entry}
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  aria-label={`Remove ${entry}`}
                  className="cursor-pointer hover:opacity-70"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      {(localError || firstItemErrorMessage) && (
        <span className="text-xs text-like">{localError ?? firstItemErrorMessage}</span>
      )}
    </div>
  );
}
