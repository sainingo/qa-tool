export interface Patient {
  id: string;
  name?: string;
  identifier?: string;
  gender?: string;
  age?: number;
  birthdate?: string;
}

export interface Encounter {
  uuid: string;
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  patient: {
    uuid: string;
    display: string;
  };
  location: {
    uuid: string;
    display: string;
  };
  form?: {
    uuid: string;
    display: string;
  };
  obs?: Array<{
    uuid: string;
    concept: {
      uuid: string;
      display: string;
    };
    value: any;
  }>;
}

export interface ApiSettings {
  apiBaseUrl: string;
  apiUsername: string;
  apiPassword: string;
  rtcConceptUuid: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}