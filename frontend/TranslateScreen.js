import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');
const baseWidth = 430;
const widthScale = width / baseWidth;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' }
];

export default function TranslateScreen({ navigation }) {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState(['es']);
  const [inputText, setInputText] = useState('');
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text, fromLang, toLang) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      );
      const data = await response.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      return `Translation error for ${toLang}`;
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    const newTranslations = {};

    try {
      for (const targetLang of targetLanguages) {
        const translation = await translateText(inputText, sourceLanguage, targetLang);
        newTranslations[targetLang] = translation;
      }
      setTranslations(newTranslations);
    } catch (error) {
      Alert.alert('Error', 'Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  };

  const addTargetLanguage = (langCode) => {
    if (!targetLanguages.includes(langCode) && langCode !== sourceLanguage) {
      setTargetLanguages([...targetLanguages, langCode]);
    }
  };

  const removeTargetLanguage = (langCode) => {
    setTargetLanguages(targetLanguages.filter(lang => lang !== langCode));
  };

  const getLanguageName = (code) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const speak = (text) => {
    Speech.speak(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2842CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Translate</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Source Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From Language</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sourceLanguage}
              onValueChange={setSourceLanguage}
              style={styles.picker}
            >
              {languages.map(lang => (
                <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Text</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type something to translate..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={styles.micButton}
              onPress={() => Alert.alert('Not Supported', 'Voice input is not available in Expo Go')}
            >
              <MaterialIcons name="mic-off" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Target Languages Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translate To</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue=""
              onValueChange={addTargetLanguage}
              style={styles.picker}
            >
              <Picker.Item label="Select language to add..." value="" />
              {languages
                .filter(lang => lang.code !== sourceLanguage && !targetLanguages.includes(lang.code))
                .map(lang => (
                  <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
                ))}
            </Picker>
          </View>

          {/* Selected Target Languages */}
          <View style={styles.selectedLanguages}>
            {targetLanguages.map(langCode => (
              <View key={langCode} style={styles.languageTag}>
                <Text style={styles.languageTagText}>{getLanguageName(langCode)}</Text>
                <TouchableOpacity onPress={() => removeTargetLanguage(langCode)}>
                  <Ionicons name="close-circle" size={20} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={styles.translateButton}
          onPress={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.translateButtonText}>Translate</Text>
          )}
        </TouchableOpacity>

        {/* Translation Results */}
        {Object.keys(translations).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Translations</Text>
            {Object.entries(translations).map(([langCode, translation]) => (
              <View key={langCode} style={styles.translationCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.translationLanguage}>{getLanguageName(langCode)}</Text>
                  <TouchableOpacity onPress={() => speak(translation)}>
                    <Ionicons name="volume-high-outline" size={20} color="#2842CC" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.translationText}>{translation}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2842CC',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    height: 50,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 80,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  micButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    marginLeft: 10,
  },
  selectedLanguages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  languageTagText: {
    fontSize: 14,
    color: '#2842CC',
    marginRight: 5,
  },
  translateButton: {
    backgroundColor: '#2842CC',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  translationCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  translationLanguage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2842CC',
    marginBottom: 5,
  },
  translationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
