import { fetchAPI } from '@/lib/fetch';

/**
 * Auto Status Updater Service
 * Tự động cập nhật ride status theo thời gian
 */

interface RideStatusUpdate {
  ride_id: number;
  current_status: string;
  new_status: string;
  elapsed_time: number;
}

class RideStatusUpdater {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private updateInterval = 30000; // Check every 30 seconds

  /**
   * Bắt đầu auto-update service
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Status updater is already running');
      return;
    }

    console.log('🚀 Starting ride status auto-updater...');
    this.isRunning = true;

    // Run immediately
    this.checkAndUpdateStatuses();

    // Then run periodically
    this.intervalId = setInterval(() => {
      this.checkAndUpdateStatuses();
    }, this.updateInterval);
  }

  /**
   * Dừng auto-update service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('🛑 Stopped ride status auto-updater');
    }
  }

  /**
   * Kiểm tra và cập nhật statuses
   */
  private async checkAndUpdateStatuses() {
    try {
      // Gọi API để lấy danh sách rides cần update
      const response = await fetchAPI('/(api)/ride/update-status', {
        method: 'GET',
      });

      if (!response.success) {
        console.error('❌ Failed to fetch rides for status update');
        return;
      }

      const { rides } = response.data;

      // Update confirmed -> driver_arrived
      for (const ride of rides.toDriverArrived || []) {
        await this.updateRideStatus(ride.ride_id, 'driver_arrived');
      }

      // Update driver_arrived -> in_progress
      for (const ride of rides.toInProgress || []) {
        await this.updateRideStatus(ride.ride_id, 'in_progress');
      }

      // Update in_progress -> completed
      for (const ride of rides.toCompleted || []) {
        await this.updateRideStatus(ride.ride_id, 'completed');
      }

      const totalUpdates =
        (rides.toDriverArrived?.length || 0) +
        (rides.toInProgress?.length || 0) +
        (rides.toCompleted?.length || 0);

      if (totalUpdates > 0) {
        console.log(`✅ Updated ${totalUpdates} ride statuses`);
      }
    } catch (error) {
      console.error('❌ Error in status updater:', error);
    }
  }

  /**
   * Update một ride status
   */
  private async updateRideStatus(ride_id: number, new_status: string) {
    try {
      await fetchAPI('/(api)/ride/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ride_id,
          new_status,
        }),
      });

      console.log(`📝 Updated ride ${ride_id} to ${new_status}`);
    } catch (error) {
      console.error(`❌ Failed to update ride ${ride_id}:`, error);
    }
  }

  /**
   * Check if service is running
   */
  isActive() {
    return this.isRunning;
  }
}

// Export singleton instance
export const rideStatusUpdater = new RideStatusUpdater();
