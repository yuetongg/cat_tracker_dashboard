import { Timestamp } from "firebase/firestore";

export type CatLog = {
  id: string;
  feedingStatus?: string;
  foodRemarks?: string;
  foodType?: string;
  isInjured?: boolean;
  location?: string;
  logId?: string;
  loggedAt?: Timestamp;
  loggedBy?: string;
  notes?: string;
  qtyDryAmount?: number;
  qtyWetCans?: number;
  qtyWetStrips?: number;
};

export type Cat = {
  id: string;
  name?: string;
  lastSpotted?: Timestamp;
  lastSpottedLocation?: string;
  archive?: boolean;
  feedingStatus?: string;
  isInjured?: boolean;
  logs?: CatLog[];
};