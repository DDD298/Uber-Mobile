import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInterface from "@/components/Chat/ChatInterface";
import CustomAlert from "@/components/Common/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { icons } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import { IMessage, User } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const AI_USER: User = {
  _id: "ai-assistant",
  name: "AI Assistant",
  avatar: icons.aichat,
};

const USER: User = {
  _id: "user",
  name: "user",
  avatar: icons.userchat,
};

export default function ChatScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const {
    alertConfig,
    visible: alertVisible,
    hideAlert,
    showInfo,
  } = useCustomAlert();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      addWelcomeMessage();
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chat_history");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {}
  };

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem("chat_history", JSON.stringify(messages));
    } catch (error) {}
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: IMessage = {
      _id: "welcome",
      text: t("chat.welcomeMessage"),
      createdAt: new Date(),
      user: AI_USER,
    };
    setMessages([welcomeMessage]);
  };

  const handleBackPress = () => {
    showInfo(t("chat.notification"), t("chat.featureComingSoon"));
  };

  const handleClearHistory = async () => {
    await AsyncStorage.removeItem("chat_history");
    setMessages([]);
    addWelcomeMessage();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <ChatHeader
        onBackPress={handleBackPress}
        onClearHistory={handleClearHistory}
      />

      {/* Chat Interface */}
      <ChatInterface messages={messages} setMessages={setMessages} />

      <FlashMessage position="top" />

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          visible={alertVisible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={hideAlert}
        />
      )}
    </SafeAreaView>
  );
}
