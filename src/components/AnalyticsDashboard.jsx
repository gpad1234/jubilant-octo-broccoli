import React, { useState } from 'react';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  // Sample chart data
  const revenueData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 61000 },
    { month: 'May', value: 55000 },
    { month: 'Jun', value: 67000 },
  ];

  const conversionData = [
    { stage: 'Prospect', count: 250, color: 'bg-blue-500' },
    { stage: 'Lead', count: 180, color: 'bg-yellow-500' },
    { stage: 'Customer', count: 120, color: 'bg-green-500' },
  ];

  const topCustomers = [
    { name: 'Tech Corp', revenue: '$45,000', growth: '+25%', status: 'Active' },
    { name: 'Global Solutions', revenue: '$38,500', growth: '+18%', status: 'Active' },
    { name: 'Finance Inc', revenue: '$32,000', growth: '+12%', status: 'Active' },
    { name: 'StartUp Inc', revenue: '$28,000', growth: '+8%', status: 'Active' },
    { name: 'Local Business', revenue: '$22,500', growth: '+5%', status: 'Inactive' },
  ];

  const metrics = [
    { label: 'Total Revenue', value: '$267,500', change: '+15%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Avg Deal Size', value: '$18,500', change: '+8%', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Conversion Rate', value: '32%', change: '+4%', icon: PieChartIcon, color: 'text-purple-600' },
    { label: 'Customer Retention', value: '94%', change: '+2%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const maxValue = Math.max(...revenueData.map(d => d.value));
  
  const getBarHeight = (value) => {
    return (value / maxValue) * 200;
  };

  const totalConversions = conversionData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-green-600 mt-2">{metric.change} from last period</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-end justify-center w-full h-32">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${getBarHeight(data.value)}px` }}
                    title={`${data.month}: ${data.value.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Total: <span className="font-bold text-gray-900">${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</span></p>
          </div>
        </div>

        {/* Customer Conversion Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Conversion</h2>
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-40 h-40">
              {/* Pie segments */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {conversionData.reduce((offset, item, index) => {
                  const percentage = (item.count / totalConversions) * 100;
                  const sliceSize = (percentage / 100) * 360;
                  const radius = 40;
                  
                  const colors = ['#3B82F6', '#EAB308', '#10B981'];
                  
                  const x1 = 50 + radius * Math.cos((offset * Math.PI) / 180);
                  const y1 = 50 + radius * Math.sin((offset * Math.PI) / 180);
                  const x2 = 50 + radius * Math.cos(((offset + sliceSize) * Math.PI) / 180);
                  const y2 = 50 + radius * Math.sin(((offset + sliceSize) * Math.PI) / 180);
                  
                  const largeArc = sliceSize > 180 ? 1 : 0;
                  
                  const path = `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  
                  return offset + sliceSize;
                }, 0)}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            {conversionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.stage}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count} ({Math.round((item.count / totalConversions) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Growth</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.revenue}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">{customer.growth}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
