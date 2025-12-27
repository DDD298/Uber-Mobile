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
        
        return (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              isActive && styles.languageButtonActive,
            ]}
            onPress={() => changeLanguage(language.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <View style={styles.leftContent}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.nativeName, 
                    isActive && styles.nativeNameActive
                  ]}>
                    {language.nativeName}
                  </Text>
                  <Text style={[
                    styles.englishName,
                    isActive && styles.englishNameActive
                  ]}>
                    {language.name}
                  </Text>
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
    borderRadius: 16,
    gap: 8,
  },
  languageButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  languageButtonActive: {
    backgroundColor: '#D1FAE5',
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
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  nativeNameActive: {
    color: '#059669',
  },
  englishName: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  englishNameActive: {
    color: '#10B981',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
