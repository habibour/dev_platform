import type { ValidationError } from '@nestjs/common';

export interface FlatValidationError {
  field: string;
  constraints: Record<string, string>;
}

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): FlatValidationError[] {
  return errors.flatMap((error) => {
    const path = buildFieldPath(parentPath, error.property);
    const own: FlatValidationError[] = error.constraints
      ? [{ field: path, constraints: error.constraints }]
      : [];
    const nested = error.children?.length ? flattenValidationErrors(error.children, path) : [];
    return [...own, ...nested];
  });
}

function buildFieldPath(parentPath: string, property: string): string {
  if (!parentPath) return property;
  return /^\d+$/.test(property) ? `${parentPath}[${property}]` : `${parentPath}.${property}`;
}
