import { getApplicationsPart1 } from './applications.part1.js';
import { getApplicationsPart2 } from './applications.part2.js';

export function generateApplicationsSeed() {
  return [...getApplicationsPart1(), ...getApplicationsPart2()];
}
