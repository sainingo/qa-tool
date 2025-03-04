import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings, testConnection } from '../services/api';

interface SettingsState {
  apiBaseUrl: string;
  apiUsername: string;
  apiPassword: string;
  rtcConceptUuid: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    apiBaseUrl: 'https://ngx.ampath.or.ke/amrs/ws/rest/v1',
    apiUsername: '',
    apiPassword: '',
    rtcConceptUuid: 'a8a666ba-1350-11df-a1f1-0026b9348838'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const savedSettings = await getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await testConnection();
      toast.success('Connection successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection failed. Please check your settings.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure the application settings and API connections
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            API Configuration
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configure the connection to the AMRS API
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center">
              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="apiBaseUrl" className="block text-sm font-medium text-gray-700">
                    API Base URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apiBaseUrl"
                      id="apiBaseUrl"
                      value={settings.apiBaseUrl}
                      onChange={handleChange}
                      className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The base URL for the AMRS REST API
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="apiUsername" className="block text-sm font-medium text-gray-700">
                    API Username
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apiUsername"
                      id="apiUsername"
                      value={settings.apiUsername}
                      onChange={handleChange}
                      className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="apiPassword" className="block text-sm font-medium text-gray-700">
                    API Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="apiPassword"
                      id="apiPassword"
                      value={settings.apiPassword}
                      onChange={handleChange}
                      className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="rtcConceptUuid" className="block text-sm font-medium text-gray-700">
                    RTC Concept UUID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="rtcConceptUuid"
                      id="rtcConceptUuid"
                      value={settings.rtcConceptUuid}
                      onChange={handleChange}
                      className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The UUID for the Return to Clinic (RTC) concept in AMRS
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;