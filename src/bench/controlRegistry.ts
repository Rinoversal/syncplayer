export interface ControlGroupSpec {
  prefix: string;
  count: number;
  stage: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CONTROL_GROUPS: ControlGroupSpec[] = [
  { prefix: 'top', count: 9, stage: 1 },
  { prefix: 'lib', count: 40, stage: 2 },
  { prefix: 'tag', count: 13, stage: 2 },
  { prefix: 'card', count: 3, stage: 2 },
  { prefix: 'row', count: 3, stage: 2 },
  { prefix: 'hist', count: 3, stage: 2 },
  { prefix: 'queue', count: 10, stage: 3 },
  { prefix: 'pl', count: 22, stage: 3 },
  { prefix: 'pick', count: 12, stage: 3 },
  { prefix: 'libwin', count: 4, stage: 6 },
  { prefix: 'play', count: 30, stage: 3 },
  { prefix: 'popwin', count: 1, stage: 6 },
  { prefix: 'dev', count: 87, stage: 4 },
  { prefix: 'deckwin', count: 2, stage: 6 },
  { prefix: 'keys', count: 8, stage: 5 },
  { prefix: 'rem', count: 27, stage: 5 },
  { prefix: 'mix', count: 9, stage: 3 },
  { prefix: 'info', count: 45, stage: 3 },
  { prefix: 'link', count: 6, stage: 6 },
  { prefix: 'ds', count: 4, stage: 6 },
  { prefix: 'ai', count: 69, stage: 6 },
  { prefix: 'aiwin', count: 28, stage: 6 },
  { prefix: 'chat', count: 11, stage: 6 },
  { prefix: 'con', count: 7, stage: 6 },
  { prefix: 'edge', count: 17, stage: 6 },
  { prefix: 'err', count: 1, stage: 6 },
];

export function getAllAppendixBKeys(): string[] {
  const keys: string[] = [];
  for (const g of CONTROL_GROUPS) {
    for (let i = 1; i <= g.count; i++) {
      keys.push(`${g.prefix}-${String(i).padStart(2, '0')}`);
    }
  }
  return keys;
}
