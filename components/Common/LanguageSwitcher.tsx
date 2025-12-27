import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  code: 'vi' | 'en' | 'zh' | 'ko' | 'th';
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      {languages.map((language, index) => {
        const isActive = currentLanguage === language.code;
        const isLast = index === languages.length - 1;
        
        return (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              isActive && styles.languageButtonActive,
              !isLast && styles.languageButtonBorder,
            ]}
            onPress={() => changeLanguage(language.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <View style={styles.leftContent}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.textContainer}>
                  <Text style={[styles.nativeName, isActive && styles.nativeNameActive]}>
                    {language.nativeName}
                  </Text>
                  <Text style={styles.englishName}>{language.name}</Text>
                </View>
              </View>
              {isActive && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  languageButtonActive: {
    backgroundColor: '#F0F4FF',
  },
  languageButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  nativeNameActive: {
    color: '#667eea',
  },
  englishName: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
