export interface EmailTrackingBody {
  email: string;
  timestamp: number;
  'smtp-id': string;
  event: string;
  category: string[];
  sg_event_id: string;
  sg_message_id: string;
  response?: string;
  useragent?: string;
  ip?: string;
  url?: string;
}
