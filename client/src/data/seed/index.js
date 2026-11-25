import { storage } from '../../utils/storage';
import { generateTasksSeed } from './tasks.seed';
import { generateApplicationsSeed } from './applications.seed';
import { generateLearningSeed } from './learning.seed';
import { generateProjectsSeed } from './projects.seed';
import { generateNotesSeed } from './notes.seed';
import { generateSettingsSeed } from './settings.seed';

export function initializeSeedData(force = false) {
  const existingTasks = storage.get('tasks');
  if (existingTasks && existingTasks.length > 0 && !force) {
    return; // Already initialized
  }

  storage.set('tasks', generateTasksSeed());
  storage.set('applications', generateApplicationsSeed());
  storage.set('learning', generateLearningSeed());
  storage.set('projects', generateProjectsSeed());
  storage.set('notes', generateNotesSeed());
  storage.set('settings', [generateSettingsSeed()]);
  storage.set('events', []);
}

export function resetSeedData() {
  if (!storage.clearAllEntities()) {
    throw new Error('Could not clear the saved LifePilot data.');
  }
  initializeSeedData(true);
  const requiredEntities = ['tasks', 'applications', 'learning', 'projects', 'notes', 'settings', 'events'];
  const missingEntity = requiredEntities.find((entity) => storage.get(entity) === null);
  if (missingEntity) {
    throw new Error(`Could not restore the default ${missingEntity} data.`);
  }
  console.info('LifePilot seed data has been reset to defaults.');
  return { success: true, message: 'LifePilot demo data reset complete.' };
}

// Guard window.resetLifePilotSeed() behind import.meta.env.DEV
if (typeof window !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  window.resetLifePilotSeed = resetSeedData;
}
