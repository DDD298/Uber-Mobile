/**
 * Translation Key Consistency Checker
 * 
 * This script checks if all translation keys are present in all language files.
 * Run this before committing to ensure translation consistency.
 * 
 * Usage: node lib/i18n/check-translations.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const LANGUAGES = ['en', 'vi', 'zh', 'ko', 'th'];

// Read all translation files
function readTranslationFile(lang) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

// Get all keys from a nested object
function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Main check function
function checkTranslations() {
  console.log('🔍 Checking translation consistency...\n');
  
  // Read all translation files
  const translations = {};
  const allKeys = {};
  
  LANGUAGES.forEach(lang => {
    try {
      translations[lang] = readTranslationFile(lang);
      allKeys[lang] = getAllKeys(translations[lang]);
      console.log(`✅ Loaded ${lang}.json - ${allKeys[lang].length} keys`);
    } catch (error) {
      console.error(`❌ Error loading ${lang}.json:`, error.message);
      process.exit(1);
    }
  });
  
  console.log('\n');
  
  // Get union of all keys
  const allKeysSet = new Set();
  Object.values(allKeys).forEach(keys => {
    keys.forEach(key => allKeysSet.add(key));
  });
  
  console.log(`📊 Total unique keys across all languages: ${allKeysSet.size}\n`);
  
  // Check for missing keys
  let hasErrors = false;
  const missingKeys = {};
  
  LANGUAGES.forEach(lang => {
    missingKeys[lang] = [];
    
    allKeysSet.forEach(key => {
      if (!allKeys[lang].includes(key)) {
        missingKeys[lang].push(key);
        hasErrors = true;
      }
    });
  });
  
  // Report missing keys
  if (hasErrors) {
    console.log('❌ MISSING KEYS FOUND:\n');
    
    LANGUAGES.forEach(lang => {
      if (missingKeys[lang].length > 0) {
        console.log(`\n${lang.toUpperCase()} (${missingKeys[lang].length} missing):`);
        missingKeys[lang].forEach(key => {
          console.log(`  - ${key}`);
        });
      }
    });
    
    console.log('\n❌ Translation check FAILED. Please add missing keys.\n');
    process.exit(1);
  } else {
    console.log('✅ All translation keys are consistent across all languages!\n');
    
    // Show key counts by section
    console.log('📋 Keys by section:');
    const sections = {};
    
    Array.from(allKeysSet).forEach(key => {
      const section = key.split('.')[0];
      if (!sections[section]) {
        sections[section] = 0;
      }
      sections[section]++;
    });
    
    Object.entries(sections).sort((a, b) => b[1] - a[1]).forEach(([section, count]) => {
      console.log(`  ${section}: ${count} keys`);
    });
    
    console.log('\n✅ Translation check PASSED!\n');
  }
}

// Run the check
try {
  checkTranslations();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
