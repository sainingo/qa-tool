import React, { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateRTCDate } from '../services/api';

const UpdateRTC: React.FC = () => {
  const [encounterUuid, setEncounterUuid] = useState('');
  const [rtcDate, setRtcDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEncounters, setBulkEncounters] = useState('');
  const [bulkResults, setBulkResults] = useState<Array<{ uuid: string; success: boolean; message: string }>>([]);

  const handleSingleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!encounterUuid.trim()) {
      toast.error('Encounter UUID is required');
      return;
    }
    
    if (!rtcDate) {
      toast.error('RTC Date is required');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await updateRTCDate(encounterUuid, rtcDate);
      setResult({ success: true, message: 'RTC date updated successfully' });
      toast.success('RTC date updated successfully');
    } catch (error) {
      console.error('Error updating RTC date:', error);
      setResult({ success: false, message: 'Failed to update RTC date. Please try again.' });
      toast.error('Failed to update RTC date');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkEncounters.trim()) {
      toast.error('Encounter UUIDs are required');
      return;
    }
    
    if (!rtcDate) {
      toast.error('RTC Date is required');
      return;
    }
    
    setIsLoading(true);
    setBulkResults([]);
    
    const uuids = bulkEncounters
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const results = [];
    
    for (const uuid of uuids) {
      try {
        await updateRTCDate(uuid, rtcDate);
        results.push({ uuid, success: true, message: 'Updated successfully' });
      } catch (error) {
        console.error(`Error updating RTC date for ${uuid}:`, error);
        results.push({ uuid, success: false, message: 'Failed to update' });
      }
    }
    
    setBulkResults(results);
    
    const successCount = results.filter(r => r.success).length;
    toast.success(`Updated ${successCount} of ${results.length} encounters`);
    
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Update RTC Date</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update Return to Clinic (RTC) dates for patient encounters
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              RTC Date Update Tool
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update the Return to Clinic date for a specific encounter
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-500">Bulk Mode</span>
            <button
              type="button"
              onClick={() => setBulkMode(!bulkMode)}
              className={`${
                bulkMode ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  bulkMode ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
          </div>
        </div>

        {!bulkMode ? (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSingleUpdate}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="encounterUuid" className="block text-sm font-medium text-gray-700">
                    Encounter UUID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="encounterUuid"
                      id="encounterUuid"
                      value={encounterUuid}
                      onChange={(e) => setEncounterUuid(e.target.value)}
                      placeholder="e.g. f58c8fdf-91d5-4d0b-ba9e-b4447658d108"
                      className="shadow-sm  border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="rtcDate" className="block text-sm font-medium text-gray-700">
                    New RTC Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="rtcDate"
                      id="rtcDate"
                      value={rtcDate}
                      onChange={(e) => setRtcDate(e.target.value)}
                      className="shadow-sm  border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Calendar className="-ml-1 mr-2 h-4 w-4" />
                      Update RTC Date
                    </>
                  )}
                </button>
              </div>
            </form>

            {result && (
              <div className={`mt-6 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'} p-4`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.success ? 'Success' : 'Error'}
                    </h3>
                    <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      <p>{result.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleBulkUpdate}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="bulkEncounters" className="block text-sm font-medium text-gray-700">
                    Encounter UUIDs (one per line)
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="bulkEncounters"
                      id="bulkEncounters"
                      rows={5}
                      value={bulkEncounters}
                      onChange={(e) => setBulkEncounters(e.target.value)}
                      placeholder="f58c8fdf-91d5-4d0b-ba9e-b4447658d108&#10;a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p&#10;..."
                      className="shadow-sm  border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="rtcDate" className="block text-sm font-medium text-gray-700">
                    New RTC Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="rtcDate"
                      id="rtcDate"
                      value={rtcDate}
                      onChange={(e) => setRtcDate(e.target.value)}
                      className="shadow-sm  border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Calendar className="-ml-1 mr-2 h-4 w-4" />
                      Update All RTC Dates
                    </>
                  )}
                </button>
              </div>
            </form>

            {bulkResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Encounter UUID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bulkResults.map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.uuid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.success ? 'Success' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateRTC;