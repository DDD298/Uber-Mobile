import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lang: 'en' | 'vi') => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language / Ngôn ngữ</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === 'vi' && styles.buttonActive,
          ]}
          onPress={() => changeLanguage('vi')}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>🇻🇳</Text>
          <Text
            style={[
              styles.buttonText,
              currentLanguage === 'vi' && styles.buttonTextActive,
            ]}
          >
            Tiếng Việt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === 'en' && styles.buttonActive,
          ]}
          onPress={() => changeLanguage('en')}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>🇬🇧</Text>
          <Text
            style={[
              styles.buttonText,
              currentLanguage === 'en' && styles.buttonTextActive,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  buttonActive: {
    borderColor: '#667eea',
    backgroundColor: '#EEF2FF',
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  buttonTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
});
