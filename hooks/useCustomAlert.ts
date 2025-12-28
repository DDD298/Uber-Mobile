import { useState, useCallback } from 'react';
import { AlertType } from '@/components/Common/CustomAlert';

interface AlertConfig {
  type?: AlertType;
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = useCallback((config: AlertConfig) => {
    console.log("🔔 [useCustomAlert] showAlert called");
    console.log("📋 [useCustomAlert] Config:", JSON.stringify(config, null, 2));
    const startTime = Date.now();
    
    setAlertConfig(config);
    console.log("✅ [useCustomAlert] Alert config set");
    
    setVisible(true);
    console.log("👁️  [useCustomAlert] Visible set to TRUE");
    
    const endTime = Date.now();
    console.log("⏱️  [useCustomAlert] showAlert execution time:", endTime - startTime, "ms");
  }, []);

  const hideAlert = useCallback(() => {
    console.log("🚫 [useCustomAlert] hideAlert called");
    const startTime = Date.now();
    
    setVisible(false);
    console.log("👁️  [useCustomAlert] Visible set to FALSE");
    
    setTimeout(() => {
      setAlertConfig(null);
      const endTime = Date.now();
      console.log("🗑️  [useCustomAlert] Alert config cleared after timeout");
      console.log("⏱️  [useCustomAlert] hideAlert total time:", endTime - startTime, "ms");
    }, 200); // Reduced from 300ms to match faster animation
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, onPress?: () => void) => {
    console.log("✅ [useCustomAlert] showSuccess called:", title);
    showAlert({
      type: 'success',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, onPress?: () => void) => {
    console.log("❌ [useCustomAlert] showError called:", title);
    showAlert({
      type: 'error',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, onPress?: () => void) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, onPress?: () => void) => {
    showAlert({
      type: 'info',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showAlert]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        { text: 'Hủy', style: 'cancel', onPress: onCancel },
        { text: 'Xác nhận', style: 'destructive', onPress: onConfirm },
      ],
    });
  }, [showAlert]);

  return {
    alertConfig,
    visible,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};
