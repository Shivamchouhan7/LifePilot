import { getTasksPart1 } from './tasks.part1.js';
import { getTasksPart2 } from './tasks.part2.js';

export function generateTasksSeed() {
  return [...getTasksPart1(), ...getTasksPart2()];
}
