import { useEffect, useRef, useState } from "react";
import RideStatusPoller from "@/services/rideStatusPoller";
import { pushNotificationService } from "@/services/pushNotificationService";

interface UseRideStatusSyncOptions {
  rideId: number;
  enabled: boolean;
  pollingInterval?: number; // default: 3000ms
  onStatusChange?: (data: RideStatusSyncData) => void;
}

export const useRideStatusSync = ({
  rideId,
  enabled,
  pollingInterval = 3000,
  onStatusChange,
}: UseRideStatusSyncOptions) => {
  const pollerRef = useRef<RideStatusPoller | null>(null);
  const [lastUpdate, setLastUpdate] = useState<RideStatusSyncData | null>(
    null
  );
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!enabled || !rideId) {
      // Stop polling if disabled or no ride ID
      if (pollerRef.current) {
        pollerRef.current.stop();
        setIsPolling(false);
      }
      return;
    }

    console.log(`🔄 Setting up ride status sync for ride ${rideId}`);

    // Start polling
    pollerRef.current = new RideStatusPoller({
      rideId,
      interval: pollingInterval,
      onUpdate: (data) => {
        console.log("📥 Ride status update received:", data);
        setLastUpdate(data);
        onStatusChange?.(data);
      },
      onError: (error) => {
        console.error("❌ Polling error:", error);
      },
    });

    pollerRef.current.start();
    setIsPolling(true);

    // Setup push notification listener
    const notificationListener =
      pushNotificationService.addNotificationListener((notification) => {
        console.log("📬 Received notification:", notification);
        
        // Check if notification is related to this ride
        const notificationData = notification.request.content.data;
        if (notificationData?.ride_id === rideId) {
          console.log("🔔 Notification for current ride, triggering poll");
          // Trigger immediate poll when notification received
          if (pollerRef.current) {
            // Force a poll by calling the private method via type assertion
            (pollerRef.current as any).poll?.();
          }
        }
      });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up ride status sync");
      pollerRef.current?.stop();
      setIsPolling(false);
      notificationListener.remove();
    };
  }, [rideId, enabled, pollingInterval]);

  return {
    lastUpdate,
    isPolling,
  };
};
