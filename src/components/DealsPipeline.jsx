import React, { useState, useEffect } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { dealsAPI } from '../api/api';

const DealsPipeline = () => {
  const [deals, setDeals] = useState({
    prospect: [],
    negotiation: [],
    committed: [],
    closed: [],
  });
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);

  const columns = [
    { key: 'prospect', title: 'Prospect', color: 'bg-blue-50', borderColor: 'border-blue-200' },
    { key: 'negotiation', title: 'Negotiation', color: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { key: 'committed', title: 'Committed', color: 'bg-green-50', borderColor: 'border-green-200' },
    { key: 'closed', title: 'Closed', color: 'bg-purple-50', borderColor: 'border-purple-200' },
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const allDeals = await dealsAPI.getAll();
      
      const groupedDeals = {
        prospect: [],
        negotiation: [],
        committed: [],
        closed: [],
      };

      allDeals.forEach(deal => {
        if (groupedDeals[deal.stage]) {
          groupedDeals[deal.stage].push(deal);
        }
      });

      setDeals(groupedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, deal, columnKey) => {
    setDraggedDeal(deal);
    setSourceColumn(columnKey);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumnKey) => {
    e.preventDefault();
    if (!draggedDeal || !sourceColumn) return;

    if (sourceColumn !== targetColumnKey) {
      try {
        // Update deal stage in database
        await dealsAPI.update(draggedDeal.id, {
          ...draggedDeal,
          stage: targetColumnKey,
        });

        // Update local state
        setDeals(prev => {
          const newDeals = { ...prev };
          newDeals[sourceColumn] = newDeals[sourceColumn].filter(d => d.id !== draggedDeal.id);
          newDeals[targetColumnKey] = [...newDeals[targetColumnKey], { ...draggedDeal, stage: targetColumnKey }];
          return newDeals;
        });
      } catch (error) {
        console.error('Error updating deal:', error);
      }
    }

    setDraggedDeal(null);
    setSourceColumn(null);
  };

  const handleDeleteDeal = async (columnKey, dealId) => {
    try {
      await dealsAPI.delete(dealId);
      setDeals(prev => ({
        ...prev,
        [columnKey]: prev[columnKey].filter(d => d.id !== dealId)
      }));
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const calculateTotal = (columnDeals) => {
    return columnDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const formatCurrency = (num) => {
    return '$' + num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-gray-600 mt-2">Drag deals across stages to update their status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {columns.map(col => (
          <div key={col.key} className={`${col.color} border-2 ${col.borderColor} rounded-lg p-4`}>
            <h3 className="font-semibold text-gray-900 mb-2">{col.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{deals[col.key].length}</p>
            <p className="text-sm text-gray-600 mt-1">
              Total: {formatCurrency(calculateTotal(deals[col.key]))}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map(col => (
          <div key={col.key} className={`${col.color} border-2 ${col.borderColor} rounded-lg overflow-hidden flex flex-col min-h-96`}>
            {/* Column Header */}
            <div className="p-4 border-b-2 border-opacity-20 border-gray-400 bg-white bg-opacity-50">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">{col.title}</h2>
                <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                  {deals[col.key].length}
                </span>
              </div>
            </div>

            {/* Droppable Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex-1 p-4 space-y-3 overflow-y-auto"
            >
              {deals[col.key].length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p className="text-sm">No deals yet</p>
                </div>
              ) : (
                deals[col.key].map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal, col.key)}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{deal.title}</h3>
                        <p className="text-xs text-gray-600 mt-2">{deal.contact}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(deal.date).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-gray-900 mt-2">${deal.value.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteDeal(col.key, deal.id)}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Deal Button */}
            <div className="p-4 border-t border-opacity-20 border-gray-400">
              <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white bg-white bg-opacity-50 rounded p-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsPipeline;
