const PREFIX = 'lifepilot:v1:';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`${PREFIX}${key}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (err) {
      console.error(`Error reading ${PREFIX}${key} from localStorage:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing ${PREFIX}${key} to localStorage:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch (err) {
      console.error(`Error removing ${PREFIX}${key} from localStorage:`, err);
      return false;
    }
  },

  clearAllEntities() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith(PREFIX)) {
          localStorage.removeItem(k);
        }
      });
      return true;
    } catch (err) {
      console.error('Error clearing storage:', err);
      return false;
    }
  },
};
