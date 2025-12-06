import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { aiAPI } from '../api/api';

const AIInsights = ({ customerId, deals = [], isOpen = true }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customerId && isOpen) {
      loadInsights();
    }
  }, [customerId, isOpen]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiAPI.getCustomerInsights(customerId);
      setInsights(data);
    } catch (err) {
      console.error('Error loading insights:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold">
          <Brain className="w-5 h-5 animate-spin" />
          AI Insights Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <p className="text-red-600 text-sm">Failed to load insights</p>
      </div>
    );
  }

  if (!insights) return null;

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getRiskBgColor = (risk) => {
    switch (risk) {
      case 'critical':
        return 'text-red-700 bg-red-100';
      case 'high':
        return 'text-orange-700 bg-orange-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-green-700 bg-green-100';
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${getRiskColor(insights.riskLevel)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">AI Insights</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-semibold ${getRiskBgColor(insights.riskLevel)}`}>
          {insights.riskLevel.charAt(0).toUpperCase() + insights.riskLevel.slice(1)} Risk
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600">Total Deal Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ${(insights.metrics.totalDealValue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600">Active Deals</p>
          <p className="text-lg font-semibold text-gray-900">{insights.metrics.activeDeals}</p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600">Closed Deals</p>
          <p className="text-lg font-semibold text-gray-900">{insights.metrics.closedDeals}</p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600">Lifetime Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ${(insights.metrics.lifetimeValue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-gray-800">Recommendations</p>
          </div>
          <ul className="space-y-1">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex gap-2">
                <span className="text-amber-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
