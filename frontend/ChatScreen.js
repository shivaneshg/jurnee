// ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const baseWidth = 430;
const widthScale = width / baseWidth;

const GEMINI_API_KEY = 'AIzaSyBYMzJypwMBYIFF_bS9o8LSDl5eyrUVlsA'; // Your API key

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: '👋 Hello! I\'m Nexus, your AI travel assistant. I can help you with travel planning, local recommendations, language translation, emergency information, and much more. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLoading(true);
    setIsTyping(true);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    // Enhanced prompt for travel assistant
    const enhancedPrompt = `You are Nexus, a helpful AI travel assistant. Please provide helpful, accurate, and friendly responses about travel, tourism, local culture, safety tips, recommendations, and general assistance. Keep responses concise but informative.

User question: ${userMessage.text}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: enhancedPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }

      let reply = '❌ Sorry, I couldn\'t generate a response.';
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        reply = data.candidates[0].content.parts[0].text || reply;
      }

      // Add typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        setMessages([...newMessages, {
          role: 'model',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);

    } catch (error) {
      console.error('Chat Error:', error);
      setIsTyping(false);
      setMessages([...newMessages, {
        role: 'model',
        text: '❌ I\'m having trouble connecting right now. Please check your internet connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([{
              role: 'model',
              text: '👋 Chat cleared! How can I help you today?',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        {item.role === 'model' && (
          <View style={styles.botHeader}>
            <Ionicons name="sparkles" size={16 * widthScale} color="#2842CC" />
            <Text style={styles.botName}>Nexus</Text>
          </View>
        )}
        <Text style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.role === 'user' ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={[styles.messageContainer, styles.botMessageContainer]}>
        <View style={[styles.messageBubble, styles.botBubble]}>
          <View style={styles.botHeader}>
            <Ionicons name="sparkles" size={16 * widthScale} color="#2842CC" />
            <Text style={styles.botName}>Nexus</Text>
          </View>
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>Typing</Text>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 20}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={28 * widthScale} color="#2842CC" />
          <Text style={styles.headerText}>Nexus AI</Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <MaterialIcons name="clear-all" size={24 * widthScale} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about travel, places, safety tips..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            editable={!loading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline={true}
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="send" size={20 * widthScale} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20 * widthScale,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24 * widthScale,
    color: '#1a1a1a',
    fontWeight: '700',
    marginLeft: 8 * widthScale,
  },
  clearButton: {
    padding: 8 * widthScale,
    borderRadius: 20 * widthScale,
    backgroundColor: '#f0f0f0',
  },
  chatContainer: {
    padding: 16 * widthScale,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4 * widthScale,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12 * widthScale,
    borderRadius: 18 * widthScale,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#2842CC',
  },
  botBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4 * widthScale,
  },
  botName: {
    fontSize: 12 * widthScale,
    color: '#2842CC',
    fontWeight: '600',
    marginLeft: 4 * widthScale,
  },
  messageText: {
    fontSize: 16 * widthScale,
    lineHeight: 22 * widthScale,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 11 * widthScale,
    marginTop: 4 * widthScale,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#999',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14 * widthScale,
    color: '#666',
    marginRight: 8 * widthScale,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6 * widthScale,
    height: 6 * widthScale,
    borderRadius: 3 * widthScale,
    backgroundColor: '#2842CC',
    marginHorizontal: 1 * widthScale,
  },
  inputContainer: {
    padding: 16 * widthScale,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 25 * widthScale,
    paddingHorizontal: 16 * widthScale,
    paddingVertical: 8 * widthScale,
    maxHeight: 100 * widthScale,
  },
  textInput: {
    flex: 1,
    fontSize: 16 * widthScale,
    color: '#1a1a1a',
    paddingVertical: 8 * widthScale,
    paddingRight: 8 * widthScale,
    maxHeight: 80 * widthScale,
  },
  sendButton: {
    backgroundColor: '#2842CC',
    width: 36 * widthScale,
    height: 36 * widthScale,
    borderRadius: 18 * widthScale,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8 * widthScale,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});