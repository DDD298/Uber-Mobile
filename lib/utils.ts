import { Ride } from "@/types/type";

export const sortRides = (rides: Ride[]): Ride[] => {
  const result = rides.sort((a, b) => {
    const dateA = new Date(`${a.created_at}T${a.ride_time}`);
    const dateB = new Date(`${b.created_at}T${b.ride_time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return result.reverse();
};

export function formatTime(minutes: number): string {
  const formattedMinutes = Math.round(minutes) || 0;

  if (formattedMinutes < 60) {
    return `${formattedMinutes} phút`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}

export function formatDateVN(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatTimeVN(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

export function formatCurrency(amount: string | number): string {
  const exchangeRate = 24000;
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const vndAmount = Math.round(numericAmount * exchangeRate);
  return vndAmount.toLocaleString('vi-VN');
}

export function convertVNDToUSD(vndAmount: string | number): number {
  const exchangeRate = 24000;
  const numericAmount = typeof vndAmount === 'string' ? parseFloat(vndAmount) : vndAmount;
  return numericAmount / exchangeRate;
}

export function getVietnamTime(): string {
  const now = new Date();
  const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return vietnamTime.toISOString();
}

export function getVietnamTimeFormatted(): string {
  const now = new Date();
  // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
  const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  const year = vietnamTime.getUTCFullYear();
  const month = (vietnamTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = vietnamTime.getUTCDate().toString().padStart(2, '0');
  const hours = vietnamTime.getUTCHours().toString().padStart(2, '0');
  const minutes = vietnamTime.getUTCMinutes().toString().padStart(2, '0');
  const seconds = vietnamTime.getUTCSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (GMT+7)`;
}

export function getVietnamTimeAsUTC(): string {
  const now = new Date();
  // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
  const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return vietnamTime.toISOString();
}