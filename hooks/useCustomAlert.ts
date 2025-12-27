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
    setAlertConfig(config);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setAlertConfig(null);
    }, 300);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, onPress?: () => void) => {
    showAlert({
      type: 'success',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, onPress?: () => void) => {
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
