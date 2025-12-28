// Currency formatting and conversion utilities

export interface CurrencyConfig {
  code: string; // Currency code (VND, USD, CNY, KRW, THB)
  symbol: string; // Currency symbol (₫, $, ¥, ₩, ฿)
  locale: string; // Locale for formatting (vi-VN, en-US, zh-CN, ko-KR, th-TH)
  exchangeRate: number; // Exchange rate from USD base
}

// Currency configurations for supported languages
export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  vi: {
    code: 'VND',
    symbol: '₫',
    locale: 'vi-VN',
    exchangeRate: 24000, // 1 USD = 24,000 VND
  },
  en: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    exchangeRate: 1, // Base currency
  },
  zh: {
    code: 'CNY',
    symbol: '¥',
    locale: 'zh-CN',
    exchangeRate: 7.2, // 1 USD = 7.2 CNY
  },
  ko: {
    code: 'KRW',
    symbol: '₩',
    locale: 'ko-KR',
    exchangeRate: 1300, // 1 USD = 1,300 KRW
  },
  th: {
    code: 'THB',
    symbol: '฿',
    locale: 'th-TH',
    exchangeRate: 35, // 1 USD = 35 THB
  },
};

/**
 * Convert amount from VND (base currency in DB) to target currency
 * @param vndAmount - Amount in VND
 * @param targetLanguage - Target language code (vi, en, zh, ko, th)
 * @returns Converted amount in target currency
 */
export function convertFromVND(
  vndAmount: string | number,
  targetLanguage: string
): number {
  const numericAmount = typeof vndAmount === 'string' ? parseFloat(vndAmount) : vndAmount;
  
  // Get currency config for target language
  const config = CURRENCY_CONFIGS[targetLanguage] || CURRENCY_CONFIGS.en;
  const vndConfig = CURRENCY_CONFIGS.vi;
  
  // Convert VND to USD first, then to target currency
  const usdAmount = numericAmount / vndConfig.exchangeRate;
  const targetAmount = usdAmount * config.exchangeRate;
  
  return targetAmount;
}

/**
 * Convert amount from any currency to VND (for saving to DB)
 * @param amount - Amount in source currency
 * @param sourceLanguage - Source language code (vi, en, zh, ko, th)
 * @returns Amount in VND
 */
export function convertToVND(
  amount: string | number,
  sourceLanguage: string
): number {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Get currency config for source language
  const config = CURRENCY_CONFIGS[sourceLanguage] || CURRENCY_CONFIGS.en;
  const vndConfig = CURRENCY_CONFIGS.vi;
  
  // Convert to USD first, then to VND
  const usdAmount = numericAmount / config.exchangeRate;
  const vndAmount = usdAmount * vndConfig.exchangeRate;
  
  return Math.round(vndAmount);
}

/**
 * Format currency amount based on language
 * @param amount - Amount in VND (from database)
 * @param language - Current language code (vi, en, zh, ko, th)
 * @param options - Additional formatting options
 * @returns Formatted currency string
 */
export function formatCurrencyByLanguage(
  amount: string | number,
  language: string,
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    showSymbol = true,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options || {};

  // Convert from VND to target currency
  const convertedAmount = convertFromVND(amount, language);
  
  // Get currency config
  const config = CURRENCY_CONFIGS[language] || CURRENCY_CONFIGS.en;
  
  // Determine decimal places based on currency
  let minDecimals = minimumFractionDigits;
  let maxDecimals = maximumFractionDigits;
  
  if (minDecimals === undefined || maxDecimals === undefined) {
    // VND, KRW, JPY don't use decimals
    if (['VND', 'KRW', 'JPY'].includes(config.code)) {
      minDecimals = 0;
      maxDecimals = 0;
    } else {
      // USD, CNY, THB use 2 decimals
      minDecimals = 2;
      maxDecimals = 2;
    }
  }
  
  // Format using Intl.NumberFormat
  const formatter = new Intl.NumberFormat(config.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: showSymbol ? config.code : undefined,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
  
  return formatter.format(convertedAmount);
}

/**
 * Get currency symbol for current language
 * @param language - Language code
 * @returns Currency symbol
 */
export function getCurrencySymbol(language: string): string {
  const config = CURRENCY_CONFIGS[language] || CURRENCY_CONFIGS.en;
  return config.symbol;
}

/**
 * Get currency code for current language
 * @param language - Language code
 * @returns Currency code (VND, USD, etc.)
 */
export function getCurrencyCode(language: string): string {
  const config = CURRENCY_CONFIGS[language] || CURRENCY_CONFIGS.en;
  return config.code;
}
