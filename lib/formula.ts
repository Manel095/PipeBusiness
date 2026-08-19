/* ─── Data Transform & Formula Helpers ─── */

export type TransformRule = {
  id: string
  type: "select" | "rename" | "add_timestamp" | "add_counter" | "static_value" | "exclude"
  sourceField?: string
  targetField?: string
  value?: string
}

/* ─── Transform Engine ─── */

let _counter = 0

export function applyTransforms(
  payload: Record<string, unknown>,
  rules: TransformRule[]
): Record<string, unknown> {
  let result = { ...payload }

  // Phase 1: exclusions
  const excludeFields = rules
    .filter((r) => r.type === "exclude" && r.sourceField)
    .map((r) => r.sourceField!)

  if (excludeFields.length > 0) {
    for (const key of excludeFields) {
      delete result[key]
    }
  }

  // Phase 2: selects (only keep listed fields) — if any select rule exists
  const selectFields = rules
    .filter((r) => r.type === "select" && r.sourceField)
    .map((r) => r.sourceField!)

  if (selectFields.length > 0) {
    const filtered: Record<string, unknown> = {}
    for (const key of selectFields) {
      if (key in result) filtered[key] = result[key]
    }
    result = filtered
  }

  // Phase 3: renames
  for (const rule of rules.filter((r) => r.type === "rename")) {
    if (rule.sourceField && rule.targetField && rule.sourceField in result) {
      result[rule.targetField] = result[rule.sourceField]
      delete result[rule.sourceField]
    }
  }

  // Phase 4: additions
  for (const rule of rules) {
    if (rule.type === "add_timestamp" && rule.targetField) {
      result[rule.targetField] = new Date().toISOString()
    }
    if (rule.type === "add_counter" && rule.targetField) {
      _counter++
      result[rule.targetField] = _counter
    }
    if (rule.type === "static_value" && rule.targetField && rule.value !== undefined) {
      result[rule.targetField] = rule.value
    }
  }

  return result
}

export function previewTransform(
  sampleJson: string,
  rules: TransformRule[]
): { before: Record<string, unknown> | null; after: Record<string, unknown> | null; error?: string } {
  try {
    const parsed = JSON.parse(sampleJson)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { before: null, after: null, error: "Payload must be a JSON object" }
    }
    const after = applyTransforms(parsed, rules)
    return { before: parsed, after }
  } catch {
    return { before: null, after: null, error: "Invalid JSON" }
  }
}

/* ─── Formula Evaluator for Calculated KPIs ─── */

/**
 * Extracts field names from a formula string.
 * Formula supports: field names (alphanumeric + underscore), operators (+, -, *, /), numbers, parentheses.
 * Example: "leads - deals_won" → ["leads", "deals_won"]
 */
export function extractFormulaFields(formula: string): string[] {
  const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g)
  return tokens ? [...new Set(tokens)] : []
}

/**
 * Evaluates a simple formula against a data row.
 * Supports: +, -, *, /, parentheses, and numeric literals.
 * Field names are replaced with their numeric values from the row.
 * Returns NaN if evaluation fails.
 */
export function evaluateFormula(formula: string, row: Record<string, string | number>): number {
  const fields = extractFormulaFields(formula)

  let expression = formula
  // Sort fields by length descending to avoid partial replacements
  const sortedFields = [...fields].sort((a, b) => b.length - a.length)

  for (const field of sortedFields) {
    const val = Number(row[field])
    if (isNaN(val)) return NaN
    // Replace all occurrences of the field name with its value
    expression = expression.replace(new RegExp(`\\b${field}\\b`, "g"), String(val))
  }

  // Validate: only allow numbers, operators, parens, spaces, dots
  if (!/^[\d\s+\-*/().]+$/.test(expression)) {
    return NaN
  }

  try {
    // Safe eval using Function constructor (no access to scope)
    const fn = new Function(`"use strict"; return (${expression})`)
    const result = fn()
    return typeof result === "number" ? result : NaN
  } catch {
    return NaN
  }
}

/**
 * Human-readable label for transform rule types
 */
export const TRANSFORM_LABELS: Record<TransformRule["type"], string> = {
  select: "Select field",
  exclude: "Exclude field",
  rename: "Rename field",
  add_timestamp: "Add timestamp",
  add_counter: "Add counter",
  static_value: "Add static value",
}
