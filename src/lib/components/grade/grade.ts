export enum ViewMode {
    TABLE = "table",
    GRID = "grid"
}

export function displayName(mode: ViewMode) {
    return mode.charAt(0).toUpperCase() + mode.substring(1)
}

export const ALL_VIEW_MODES: ViewMode[] = [ViewMode.TABLE, ViewMode.GRID];

export function parseViewMode(str: string): ViewMode | undefined {
    return ViewMode[str as keyof typeof ViewMode] ?? ViewMode[str.toUpperCase() as keyof typeof ViewMode];
}
