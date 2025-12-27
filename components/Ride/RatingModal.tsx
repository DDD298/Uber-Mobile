import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StarRating } from '../Common/StarRating';
import { useUser } from '@clerk/clerk-expo';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  ride: {
    ride_id: number;
    driver_id: number;
    driver: {
      first_name: string;
      last_name: string;
      profile_image_url?: string;
    };
  };
  onRatingSubmitted?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  ride,
  onRatingSubmitted,
}) => {
  const { user } = useUser();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đánh giá');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/rating/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ride_id: ride.ride_id,
          user_id: user.id,
          driver_id: ride.driver_id,
          stars,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá!', [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onRatingSubmitted?.();
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStars(5);
      setComment('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Đánh giá chuyến đi</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Driver Info */}
          <View style={styles.driverSection}>
            <Image
              source={{
                uri: ride.driver.profile_image_url || 'https://via.placeholder.com/80',
              }}
              style={styles.driverImage}
            />
            <Text style={styles.driverName}>
              {ride.driver.first_name} {ride.driver.last_name}
            </Text>
            <Text style={styles.subtitle}>Chuyến đi của bạn thế nào?</Text>
          </View>

          {/* Star Rating */}
          <View style={styles.ratingSection}>
            <StarRating
              rating={stars}
              onRatingChange={setStars}
              size={48}
              color="#FFD700"
            />
          </View>

          {/* Comment Input */}
          <View style={styles.commentSection}>
            <Text style={styles.label}>Nhận xét (tùy chọn)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              maxLength={500}
              editable={!loading}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B7280',
    fontWeight: '300',
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
  driverName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  commentSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
