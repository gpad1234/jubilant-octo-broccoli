import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { aiAPI } from '../api/api';

const DealRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiAPI.getDealRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="w-5 h-5 animate-spin" />
            Loading recommendations...
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
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center justify-between">
          <p className="text-red-600 text-sm">Failed to load recommendations</p>
          <button
            onClick={loadRecommendations}
            className="text-red-600 hover:text-red-700 transition"
            title="Retry"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-semibold">All deals on track!</p>
          </div>
          <button
            onClick={loadRecommendations}
            className="text-green-600 hover:text-green-700 transition"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Deal Insights</h3>
        <button
          onClick={loadRecommendations}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
          title="Refresh recommendations"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {highPriority.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">High Priority Actions</h3>
          </div>
          <div className="space-y-2">
            {highPriority.map((rec, idx) => (
              <div key={idx} className="bg-white rounded p-2 text-sm">
                <p className="font-semibold text-gray-800">{rec.title}</p>
                <p className="text-gray-600">{rec.action}</p>
                <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Medium Priority</h3>
          </div>
          <div className="space-y-2">
            {mediumPriority.map((rec, idx) => (
              <div key={idx} className="bg-white rounded p-2 text-sm">
                <p className="font-semibold text-gray-800">{rec.title}</p>
                <p className="text-gray-600">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center pt-2">
        Click refresh icon to update recommendations
      </div>
    </div>
  );
};

export default DealRecommendations;
