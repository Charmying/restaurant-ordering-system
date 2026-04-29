import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;
export const EVENTS_WS_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
