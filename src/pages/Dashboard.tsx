import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for dashboard stats
  const stats = [
    { name: 'RTC Updates', value: '24', change: '+12%', icon: Calendar, color: 'bg-blue-500' },
    { name: 'Patient Rebuilds', value: '18', change: '+8%', icon: RefreshCw, color: 'bg-green-500' },
    { name: 'Pending Issues', value: '7', change: '-3%', icon: AlertCircle, color: 'bg-yellow-500' },
    { name: 'Resolved Issues', value: '42', change: '+15%', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  // Mock recent activity
  const recentActivity = [
    { id: 1, action: 'RTC Update', patientId: '15204-27400', date: '2025-04-14', status: 'success', timestamp: '2 hours ago' },
    { id: 2, action: 'Patient Rebuild', patientId: '15204-27401', date: '', status: 'success', timestamp: '3 hours ago' },
    { id: 3, action: 'RTC Update', patientId: '15204-27402', date: '2025-04-10', status: 'failed', timestamp: '5 hours ago' },
    { id: 4, action: 'Patient Rebuild', patientId: '15204-27403', date: '', status: 'success', timestamp: '1 day ago' },
    { id: 5, action: 'RTC Update', patientId: '15204-27404', date: '2025-04-12', status: 'success', timestamp: '1 day ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to the Ampath QA Tool. Monitor and manage patient record updates.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      {/* <div className="text-2xl font-semibold text-gray-900">{stat.value}</div> */}
                      {/* <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div> */}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Link to="/update-rtc" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Update RTC Date</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update Return to Clinic dates for patients
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/rebuild-patient" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Rebuild Patient Records</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Rebuild patient records to fix data inconsistencies
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">{activity.action}</p>
                      <p className="ml-2 flex-shrink-0 text-sm text-gray-500">
                        Patient ID: {activity.patientId}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'success' ? 'Success' : 'Failed'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      {activity.date && (
                        <p className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          RTC Date: {activity.date}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;