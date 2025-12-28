/**
 * Currency Conversion Test Examples
 * 
 * This file contains test cases to verify currency conversion is working correctly.
 * You can use these examples to manually test the currency formatting in your app.
 */

import { 
  formatCurrencyByLanguage, 
  convertFromVND, 
  convertToVND,
  getCurrencySymbol,
  getCurrencyCode 
} from '@/lib/currency';

// Test data: A ride that costs 240,000 VND
const TEST_FARE_VND = 240000;

console.log('=== Currency Conversion Tests ===\n');

// Test 1: Format in different languages
console.log('Test 1: Format 240,000 VND in different languages');
console.log('Vietnamese:', formatCurrencyByLanguage(TEST_FARE_VND, 'vi'));
// Expected: "240.000 ₫"

console.log('English:', formatCurrencyByLanguage(TEST_FARE_VND, 'en'));
// Expected: "$10.00"

console.log('Chinese:', formatCurrencyByLanguage(TEST_FARE_VND, 'zh'));
// Expected: "¥72.00"

console.log('Korean:', formatCurrencyByLanguage(TEST_FARE_VND, 'ko'));
// Expected: "₩13,000"

console.log('Thai:', formatCurrencyByLanguage(TEST_FARE_VND, 'th'));
// Expected: "฿350.00"

console.log('\n');

// Test 2: Convert from VND to other currencies
console.log('Test 2: Convert 240,000 VND to other currencies (raw numbers)');
console.log('To USD:', convertFromVND(TEST_FARE_VND, 'en'));
// Expected: 10

console.log('To CNY:', convertFromVND(TEST_FARE_VND, 'zh'));
// Expected: 72

console.log('To KRW:', convertFromVND(TEST_FARE_VND, 'ko'));
// Expected: 13000

console.log('To THB:', convertFromVND(TEST_FARE_VND, 'th'));
// Expected: 350

console.log('\n');

// Test 3: Convert back to VND
console.log('Test 3: Convert back to VND');
console.log('$10 to VND:', convertToVND(10, 'en'));
// Expected: 240000

console.log('¥72 to VND:', convertToVND(72, 'zh'));
// Expected: 240000

console.log('₩13,000 to VND:', convertToVND(13000, 'ko'));
// Expected: 240000

console.log('฿350 to VND:', convertToVND(350, 'th'));
// Expected: 240000

console.log('\n');

// Test 4: Get currency symbols and codes
console.log('Test 4: Get currency symbols and codes');
const languages = ['vi', 'en', 'zh', 'ko', 'th'];
languages.forEach(lang => {
  console.log(`${lang}: ${getCurrencyCode(lang)} (${getCurrencySymbol(lang)})`);
});
// Expected:
// vi: VND (₫)
// en: USD ($)
// zh: CNY (¥)
// ko: KRW (₩)
// th: THB (฿)

console.log('\n');

// Test 5: Different fare amounts
console.log('Test 5: Different fare amounts in English');
const testAmounts = [50000, 120000, 240000, 500000, 1000000];
testAmounts.forEach(amount => {
  console.log(`${amount} VND = ${formatCurrencyByLanguage(amount, 'en')}`);
});
// Expected:
// 50000 VND = $2.08
// 120000 VND = $5.00
// 240000 VND = $10.00
// 500000 VND = $20.83
// 1000000 VND = $41.67

console.log('\n');

// Test 6: Format without symbol
console.log('Test 6: Format without currency symbol');
console.log('Vietnamese (no symbol):', formatCurrencyByLanguage(TEST_FARE_VND, 'vi', { showSymbol: false }));
// Expected: "240.000"

console.log('English (no symbol):', formatCurrencyByLanguage(TEST_FARE_VND, 'en', { showSymbol: false }));
// Expected: "10.00"

console.log('\n');

// Test 7: Edge cases
console.log('Test 7: Edge cases');
console.log('Zero amount:', formatCurrencyByLanguage(0, 'en'));
// Expected: "$0.00"

console.log('String input:', formatCurrencyByLanguage('240000', 'en'));
// Expected: "$10.00"

console.log('Decimal VND:', formatCurrencyByLanguage(240500, 'en'));
// Expected: "$10.02"

console.log('\n=== Tests Complete ===');

/**
 * Manual Testing Checklist:
 * 
 * 1. ✅ Open a completed ride in the app
 * 2. ✅ Verify fare is displayed in VND (if language is Vietnamese)
 * 3. ✅ Change language to English in settings
 * 4. ✅ Return to the ride - fare should now show in USD
 * 5. ✅ Change to Chinese - fare should show in CNY
 * 6. ✅ Change to Korean - fare should show in KRW
 * 7. ✅ Change to Thai - fare should show in THB
 * 8. ✅ Open rating modal - fare should display with correct currency
 * 9. ✅ Verify decimal places are correct (0 for VND/KRW, 2 for others)
 * 10. ✅ Verify currency symbols are correct
 * 
 * iOS Keyboard Testing Checklist:
 * 
 * 1. ✅ Open rating modal on iOS device
 * 2. ✅ Tap comment TextInput - keyboard should appear
 * 3. ✅ Type some text
 * 4. ✅ Tap "Done" on keyboard - keyboard should dismiss
 * 5. ✅ Tap TextInput again, type text
 * 6. ✅ Tap outside TextInput - keyboard should dismiss
 * 7. ✅ Tap TextInput again, type text
 * 8. ✅ Tap submit button - keyboard should dismiss and rating should submit
 * 9. ✅ Open modal again, tap TextInput
 * 10. ✅ Close modal - keyboard should dismiss
 */

export const currencyTestData = {
  TEST_FARE_VND,
  testAmounts,
  languages,
};
