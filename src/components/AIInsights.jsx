import React, { useState, useEffect } from 'react';
import { Brain, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { aiAPI } from '../api/api';

const AIInsights = ({ customerId, deals = [], isOpen = false }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && customerId) {
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

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Brain className="w-5 h-5 animate-spin" />
            <span>Analyzing customer data...</span>
          </div>
          <button disabled className="text-blue-400 cursor-not-allowed">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <p className="text-red-600 text-sm">Failed to load insights</p>
          <button
            onClick={loadInsights}
            className="text-red-600 hover:text-red-700 transition"
            title="Retry"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <button
          onClick={loadInsights}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition"
          title="Refresh insights"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Risk Level Badge */}
      <div className={`rounded-full inline-block px-4 py-2 font-semibold border ${getRiskColor(insights.riskLevel)}`}>
        Risk Level: {insights.riskLevel}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Deal Value</p>
          <p className="text-2xl font-bold text-gray-900">${insights.totalDealValue?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Active Deals</p>
          <p className="text-2xl font-bold text-gray-900">{insights.activeDeals}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Engagement Score</p>
          <p className="text-2xl font-bold text-gray-900">{insights.engagementScore}/100</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Interactions</p>
          <p className="text-2xl font-bold text-gray-900">{insights.interactions}</p>
        </div>
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-500 font-bold mt-1">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning Flags */}
      {insights.warningFlags && insights.warningFlags.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-900">Action Required</h4>
          </div>
          <ul className="space-y-2">
            {insights.warningFlags.map((flag, idx) => (
              <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                <span className="font-bold mt-1">⚠</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
