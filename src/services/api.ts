import axios from 'axios';

// Get settings from localStorage
const getStoredSettings = () => {
  const settings = localStorage.getItem('amrs_qa_settings');
  return settings ? JSON.parse(settings) : null;
};

// Create axios instance with authentication
const createApiClient = () => {
  const settings = getStoredSettings();
  
  if (!settings) {
    throw new Error('API settings not configured');
  }
  
  const { apiBaseUrl, apiUsername, apiPassword } = settings;
  
  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    // Add withCredentials to handle CORS with credentials
    withCredentials: true,
  });
};

// Create a proxy function to handle CORS issues
const proxyRequest = async (method: any, url: any, data = null) => {
  const settings = getStoredSettings();
  
  if (!settings) {
    throw new Error('API settings not configured');
  }
  
  // Use a CORS proxy if in development mode
  const isDevMode = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  if (isDevMode) {
    // Setup a proxy server URL - this would be your own proxy server
    // For development, you can use services like cors-anywhere or set up your own proxy
    const proxyUrl = '/api';
    
    const api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Add the authorization header instead of using the auth property
    const authHeader = 'Basic ' + btoa(`${settings.apiUsername}:${settings.apiPassword}`);
    
    try {
      const response = await api({
        method,
        url: `${proxyUrl}${url}`,
        data,
        headers: {
          'Authorization': authHeader,
          'X-Target-URL': settings.apiBaseUrl,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Proxy request error:', error);
      throw error;
    }
  } else {
    // Use direct request with credentials for production
    const api = createApiClient();
    
    try {
      const response = await api({
        method,
        url,
        data,
      });
      
      return response.data;
    } catch (error) {
      console.error('Direct request error:', error);
      throw error;
    }
  }
};

// Update RTC date for a patient encounter
export const updateRTCDate = async (encounterUuid: string, rtcDate: string) => {
  try {
    const settings = getStoredSettings();
    
    if (!settings) {
      throw new Error('API settings not configured');
    }
    
    const { rtcConceptUuid } = settings;
    
    // Format the date as required by the API
    const formattedDate = new Date(rtcDate).toISOString().replace('Z', '+0300');
    
    const payload: any = {
      obs: [
        {
          concept: rtcConceptUuid,
          value: formattedDate,
        },
      ],
    };
    
    // Use the proxy function instead of direct API call
    return await proxyRequest('post', `/encounter/${encounterUuid}`, payload);
  } catch (error) {
    console.error('Error updating RTC date:', error);
    throw error;
  }
};

// Rebuild patient record (placeholder for future implementation)
export const rebuildPatient = async (patientId: string) => {
  // This is a placeholder for the actual implementation
  
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve({ success: true, message: `Patient ${patientId} rebuilt successfully` });
      } else {
        reject(new Error(`Failed to rebuild patient ${patientId}`));
      }
    }, 1500);
  });
};

// Get application settings
export const getSettings = async () => {
  const settings = localStorage.getItem('amrs_qa_settings');
  
  if (!settings) {
    // Return default settings if none are stored
    return {
      apiBaseUrl: 'https://ngx.ampath.or.ke/amrs/ws/rest/v1',
      apiUsername: '',
      apiPassword: '',
      rtcConceptUuid: 'a8a666ba-1350-11df-a1f1-0026b9348838',
    };
  }
  
  return JSON.parse(settings);
};

// Update application settings
export const updateSettings = async (settings: any) => {
  localStorage.setItem('amrs_qa_settings', JSON.stringify(settings));
  return { success: true };
};

// Test connection to the API
export const testConnection = async () => {
  try {
    // Use the proxy function to test the connection
    await proxyRequest('get', '/session');
    return { success: true };
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};