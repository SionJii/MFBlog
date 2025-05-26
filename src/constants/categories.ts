export const CATEGORIES = ['일상', '게임', '취미', '프로젝트'] as const;

export type Category = typeof CATEGORIES[number]; 