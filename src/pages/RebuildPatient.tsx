import React, { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { rebuildPatient } from '../services/api';

const RebuildPatient: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPatients, setBulkPatients] = useState('');
  const [bulkResults, setBulkResults] = useState<Array<{ id: string; success: boolean; message: string }>>([]);

  const handleSingleRebuild = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId.trim()) {
      toast.error('Patient ID is required');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // This is a placeholder for the actual API call
      const response = await rebuildPatient(patientId);
      setResult({ success: true, message: 'Patient record rebuilt successfully' });
      toast.success('Patient record rebuilt successfully');
    } catch (error) {
      console.error('Error rebuilding patient record:', error);
      setResult({ success: false, message: 'Failed to rebuild patient record. Please try again.' });
      toast.error('Failed to rebuild patient record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRebuild = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkPatients.trim()) {
      toast.error('Patient IDs are required');
      return;
    }
    
    setIsLoading(true);
    setBulkResults([]);
    
    const ids = bulkPatients
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const results = [];
    
    for (const id of ids) {
      try {
        // This is a placeholder for the actual API call
        await rebuildPatient(id);
        results.push({ id, success: true, message: 'Rebuilt successfully' });
      } catch (error) {
        console.error(`Error rebuilding patient ${id}:`, error);
        results.push({ id, success: false, message: 'Failed to rebuild' });
      }
    }
    
    setBulkResults(results);
    
    const successCount = results.filter(r => r.success).length;
    toast.success(`Rebuilt ${successCount} of ${results.length} patient records`);
    
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Rebuild Patient Records</h1>
        <p className="mt-2 text-sm text-gray-700">
          Rebuild patient records to fix data inconsistencies
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Patient Record Rebuild Tool
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Rebuild patient records to fix data inconsistencies and update summaries
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
            <form onSubmit={handleSingleRebuild}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    Patient ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="patientId"
                      id="patientId"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="e.g. 15204-27400"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      Rebuilding...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                      Rebuild Patient Record
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
            <form onSubmit={handleBulkRebuild}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="bulkPatients" className="block text-sm font-medium text-gray-700">
                    Patient IDs (one per line)
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="bulkPatients"
                      id="bulkPatients"
                      rows={5}
                      value={bulkPatients}
                      onChange={(e) => setBulkPatients(e.target.value)}
                      placeholder="15204-27400&#10;15204-27401&#10;15204-27402"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      Rebuilding...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                      Rebuild All Patient Records
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
                          Patient ID
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
                            {result.id}
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

export default RebuildPatient;