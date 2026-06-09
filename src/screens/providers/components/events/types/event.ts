export interface TimetableEvent {
  action: string;
  state: string;
  date: number;
  chouetteJobId?: string;
  referential?: string;
}

export interface TimetableJobEvent {
  chouetteJobId: string;
  providerId: number;
  firstEvent: number;
  lastEvent: number;
  durationMillis: number;
  fileName?: string;
  username?: string;
  endState: string;
  errorCode?: string;
  events: TimetableEvent[];
  provider?: { id: number };
}
