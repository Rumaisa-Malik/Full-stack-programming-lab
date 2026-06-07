import axiosInstance from './axios';

export interface Notification {
  _id: string;
  user: string;
  type: 'appointment' | 'medication' | 'followup';
  channel: 'email' | 'sms-sim' | 'in-app';
  message: string;
  read: boolean;
  emailPreviewUrl?: string;
  relatedAppointment?: string;
  relatedPrescription?: string;
  relatedTreatment?: string;
  createdAt: string;
}

export async function getUserNotifications(userId: string) {
  try {
    const response = await axiosInstance.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const response = await axiosInstance.get(`/notifications/user/${userId}/unread`);
    return response.data.unreadCount;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    throw error;
  }
}
