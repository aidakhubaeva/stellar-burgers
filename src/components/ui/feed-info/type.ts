export type FeedInfoUIProps = {
  feed: any;
  readyOrders: number[];
  pendingOrders: number[];
  onLoadMore?: () => void;
  // totalOrdersCount: number | null;
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
