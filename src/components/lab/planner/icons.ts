/**
 * Registry marks the planner draws, rendered at build time by
 * `AndroidMigrationPlanner.astro` through `renderIcon()` and handed to the
 * island as strings, so the icon packs never ship to the browser.
 */
export interface PlannerIcons {
  readonly copy: string
  readonly download: string
  readonly arrow: string
  readonly upload: string
  readonly shield: string
}
