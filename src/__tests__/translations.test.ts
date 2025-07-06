import enTranslations from '../locales/en.json';
import nlTranslations from '../locales/nl.json';

/**
 * Helper function to check if an object has all keys from another object
 * @param obj The object to check
 * @param referenceObj The reference object with expected keys
 * @param path Current path in the object structure
 * @returns Array of missing keys with their paths
 */
function findMissingKeys(obj: any, referenceObj: any, path = ''): string[] {
  const missingKeys: string[] = [];

  // Check all keys in the reference object
  for (const key in referenceObj) {
    const newPath = path ? `${path}.${key}` : key;

    if (!(key in obj)) {
      // Key missing completely
      missingKeys.push(newPath);
    } else if (
      typeof referenceObj[key] === 'object' && 
      referenceObj[key] !== null && 
      !Array.isArray(referenceObj[key])
    ) {
      // Key exists, but we need to check nested objects recursively
      if (typeof obj[key] !== 'object' || obj[key] === null || Array.isArray(obj[key])) {
        // Types don't match, consider the entire subtree missing
        missingKeys.push(`${newPath} (type mismatch: expected object)`);
      } else {
        // Both are objects, check recursively
        const nestedMissingKeys = findMissingKeys(obj[key], referenceObj[key], newPath);
        missingKeys.push(...nestedMissingKeys);
      }
    }
  }

  return missingKeys;
}

describe('Translation files', () => {
  test('Dutch translations should contain all keys from English', () => {
    const missingKeys = findMissingKeys(nlTranslations, enTranslations);
    
    if (missingKeys.length > 0) {
      console.error('Missing Dutch translations:', missingKeys);
    }
    
    expect(missingKeys).toEqual([]);
  });

  test('English translations should contain all keys from Dutch', () => {
    const missingKeys = findMissingKeys(enTranslations, nlTranslations);
    
    if (missingKeys.length > 0) {
      console.error('Missing English translations:', missingKeys);
    }
    
    expect(missingKeys).toEqual([]);
  });
});
