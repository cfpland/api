export interface MoonclerkCustomer {
  checkout?: {
    date?: string;
    subtotal?: number;
    fee?: number;
    upfront_amount?: number;
    total?: number;
    coupon_code?: string;
    coupon_amount?: number;
    amount_due?: number;
    trial_period_days?: number;
  };
  custom_id?: string;
  email?: string;
  id: number;
  management_url?: string;
  name?: string;
  subscription?: {
    status: 'active' | 'trialing' | 'pending' | 'past_due' | 'canceled' | 'unpaid';
  };
}
