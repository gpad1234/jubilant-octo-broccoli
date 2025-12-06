import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Mail, Phone, Calendar, Target } from 'lucide-react';
import AddEditCustomerForm from './AddEditCustomerForm';
import DealsPipeline from './DealsPipeline';
import AnalyticsDashboard from './AnalyticsDashboard';
import ContactForm from './ContactForm';
import CustomersList from './CustomersList';
import { customersAPI, activitiesAPI, tasksAPI } from '../api/api';

const CRMHome = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Total Customers', value: '0', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Revenue', value: '$0', change: '+8%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Deals', value: '0', change: '+23%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: '0%', change: '+5%', icon: Target, color: 'bg-orange-500' },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'customers', label: 'Customers' },
    { id: 'deals', label: 'Deals' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'contact', label: 'Contact' },
  ];

  // Fetch data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch customers for stats
      const customers = await customersAPI.getAll();
      
      // Fetch activities
      const activities = await activitiesAPI.getAll();
      
      // Fetch tasks
      const tasks = await tasksAPI.getAll();

      // Update stats
      setStats(prevStats => [
        { ...prevStats[0], value: customers.length.toString() },
        { ...prevStats[1], value: '$' + (customers.length * 1500).toLocaleString() },
        { ...prevStats[2], value: (Math.random() * 100).toFixed(0) },
        { ...prevStats[3], value: '68%' },
      ]);

      setRecentActivities(activities.slice(0, 4));
      setUpcomingTasks(tasks.slice(0, 4));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Make sure backend server is running on localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'deal': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      await customersAPI.create(customerData);
      setShowCustomerForm(false);
      loadDashboardData();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer: ' + err.message);
    }
  };

  const handleContactFormSubmit = async (formData) => {
    try {
      await activitiesAPI.create({
        type: formData.type,
        customer: formData.name,
        action: formData.message,
      });
      console.log('Contact form submitted successfully');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      throw err;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            {activeTab === 'customers' && (
              <button 
                onClick={() => setShowCustomerForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + New Customer
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {loading && activeTab === 'dashboard' ? (
          <div className="p-6 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading dashboard...</p>
            </div>
          </div>
        ) : activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                </div>
                <div className="p-6">
                  {recentActivities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No activities yet</p>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="bg-gray-100 p-2 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.customer}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                </div>
                <div className="p-6">
                  {upcomingTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks yet</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingTasks.map(task => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">{task.task}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{new Date(task.time).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <CustomersList />
        )}

        {activeTab === 'deals' && <DealsPipeline />}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'contact' && (
          <div className="p-6">
            <ContactForm onSubmit={handleContactFormSubmit} />
          </div>
        )}
      </main>

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <AddEditCustomerForm
          onClose={() => setShowCustomerForm(false)}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default CRMHome;