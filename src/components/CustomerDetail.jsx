import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Building, Calendar, DollarSign, Edit, Trash2, Plus, MoreVertical, FileText, Clock, TrendingUp } from 'lucide-react';

const CustomerDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample customer data
  const customer = {
    id: 1,
    name: 'Sarah Smith',
    email: 'sarah.smith@techco.com',
    phone: '+1 234-567-8902',
    company: 'TechCo',
    position: 'VP of Sales',
    address: '123 Business Ave, San Francisco, CA 94105',
    status: 'active',
    value: '$82,500',
    joinDate: '2023-06-15',
    lastContact: '2024-12-04',
    tags: ['Enterprise', 'High Priority', 'Tech'],
  };

  const deals = [
    { id: 1, title: 'Enterprise License Renewal', value: '$45,000', stage: 'Negotiation', probability: '80%', closeDate: '2024-12-20' },
    { id: 2, title: 'Additional Seats Purchase', value: '$15,000', stage: 'Proposal', probability: '60%', closeDate: '2024-12-28' },
    { id: 3, title: 'Premium Support Package', value: '$22,500', stage: 'Qualification', probability: '40%', closeDate: '2025-01-15' },
  ];

  const activities = [
    { id: 1, type: 'call', title: 'Discovery Call', description: 'Discussed Q1 requirements and budget', date: '2024-12-04', time: '2:30 PM', user: 'John Davis' },
    { id: 2, type: 'email', title: 'Sent Proposal', description: 'Enterprise package proposal with custom pricing', date: '2024-12-03', time: '10:15 AM', user: 'John Davis' },
    { id: 3, type: 'meeting', title: 'Product Demo', description: 'Demonstrated new features to stakeholders', date: '2024-12-01', time: '3:00 PM', user: 'Sarah Johnson' },
    { id: 4, type: 'note', title: 'Follow-up Required', description: 'Need to send case studies by Friday', date: '2024-11-30', time: '4:45 PM', user: 'John Davis' },
  ];

  const notes = [
    { id: 1, content: 'Customer is very interested in API integration capabilities. Follow up with technical documentation.', author: 'John Davis', date: '2024-12-04', time: '3:15 PM' },
    { id: 2, content: 'Budget approved for Q1. Decision makers are Sarah and the CTO. Need to schedule call with both.', author: 'John Davis', date: '2024-12-02', time: '11:30 AM' },
    { id: 3, content: 'Competitor pricing is lower but customer values our support quality. Emphasize this in next meeting.', author: 'Sarah Johnson', date: '2024-11-28', time: '9:00 AM' },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'note': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Proposal': return 'bg-blue-100 text-blue-800';
      case 'Qualification': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deals', label: 'Deals' },
    { id: 'activities', label: 'Activities' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-gray-600 mt-1">{customer.position} at {customer.company}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    {customer.status}
                  </span>
                  {customer.tags.map((tag, index) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
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
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{customer.value}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Deals</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{deals.length}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Last Contact</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{customer.lastContact}</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {activities.slice(0, 3).map(activity => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {activity.date} at {activity.time} • {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'deals' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Deal
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {deals.map(deal => (
                    <div key={deal.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">{deal.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-2xl font-bold text-gray-900">{deal.value}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                              {deal.stage}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                            <span>Probability: {deal.probability}</span>
                            <span>Expected Close: {deal.closeDate}</span>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">All Activities</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Log Activity
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {activities.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3 pb-6 border-b border-gray-100 last:border-0">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {activity.date} at {activity.time} • {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {notes.map(note => (
                      <div key={note.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-900">{note.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-gray-600">{note.author}</p>
                          <p className="text-xs text-gray-500">{note.date} at {note.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm text-gray-900">{customer.company}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Customer Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Customer Since</p>
                  <p className="text-sm text-gray-900">{customer.joinDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="text-sm text-gray-900">{customer.lastContact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-sm text-gray-900">{customer.value}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;