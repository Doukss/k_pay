import type { AgencyNotification } from '@/stores/agencyStore';

export type NotificationType = AgencyNotification['type'];
export type NotificationPriority = AgencyNotification['priority'];
export type { AgencyNotification };

export type NotificationFilterTab = 'all' | 'unread' | 'paiement' | 'relance' | 'retard' | 'locataire' | 'system';
