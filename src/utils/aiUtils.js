// Client-side AI insights and suggestions
export const aiUtils = {
  // Analyze customer lifecycle and generate insights
  analyzeCustomer: (customer, deals = [], activities = []) => {
    const insights = {
      status: customer.status,
      value: deals.reduce((sum, d) => sum + (d.customerId === customer.id ? d.value : 0), 0),
      dealCount: deals.filter(d => d.customerId === customer.id).length,
      activityCount: activities.filter(a => a.customerId === customer.id).length,
      recommendations: [],
      riskLevel: 'low',
    };

    // Generate recommendations
    if (insights.dealCount === 0) {
      insights.recommendations.push('No active deals - consider scheduling an initial meeting');
      insights.riskLevel = 'high';
    }
    
    if (insights.activityCount === 0) {
      insights.recommendations.push('No recent activity - time for a check-in call');
      insights.riskLevel = 'high';
    }

    if (insights.value > 50000) {
      insights.recommendations.push('High-value account - ensure dedicated account management');
    }

    if (insights.dealCount > 3) {
      insights.recommendations.push('Multiple active deals - ensure coordinated follow-up');
    }

    return insights;
  },

  // Suggest next best action
  suggestNextAction: (customer, deals = []) => {
    const actions = [];
    
    if (!customer.lastContact) {
      actions.push('Schedule initial discovery call');
    }
    
    const activeDeals = deals.filter(d => d.customerId === customer.id && d.stage !== 'closed');
    if (activeDeals.length === 0) {
      actions.push('Identify new opportunity or cross-sell');
    }
    
    activeDeals.forEach(deal => {
      if (deal.stage === 'prospect') {
        actions.push(`Move "${deal.title}" to negotiation stage`);
      }
    });

    return actions;
  },

  // Calculate deal health score (0-100)
  calculateDealHealth: (deal, daysInStage = 0) => {
    let score = 50;
    
    // Stage scoring
    const stageScores = {
      'prospect': 20,
      'qualified': 40,
      'proposal': 60,
      'negotiation': 75,
      'closed': 100,
    };
    score = stageScores[deal.stage] || 50;
    
    // Time penalty - deals stuck in stage
    if (daysInStage > 30) score -= 10;
    if (daysInStage > 60) score -= 20;
    
    // Value boost
    if (deal.value > 100000) score += 5;
    if (deal.value < 10000) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  },

  // Pipeline insights
  getPipelineInsights: (deals = []) => {
    const byStage = {};
    const stages = ['prospect', 'qualified', 'proposal', 'negotiation', 'closed'];
    
    stages.forEach(stage => {
      byStage[stage] = deals.filter(d => d.stage === stage);
    });

    const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const avgDealValue = deals.length > 0 ? totalValue / deals.length : 0;
    
    return {
      byStage,
      totalValue,
      avgDealValue,
      dealCount: deals.length,
      closedDeals: byStage.closed.length,
      winRate: deals.length > 0 ? ((byStage.closed.length / deals.length) * 100).toFixed(1) : 0,
    };
  },

  // Predictive insight: likelihood to close
  predictCloseProbability: (deal, daysInStage = 0) => {
    const stageProbability = {
      'prospect': 10,
      'qualified': 30,
      'proposal': 60,
      'negotiation': 75,
      'closed': 100,
    };
    
    let probability = stageProbability[deal.stage] || 50;
    
    // Adjust for time in stage
    if (daysInStage > 90) probability -= 15;
    if (daysInStage < 7) probability += 10;
    
    return Math.max(0, Math.min(100, probability));
  },

  // Generate summary for customer
  generateCustomerSummary: (customer, deals = []) => {
    const activeDeals = deals.filter(d => d.customerId === customer.id && d.stage !== 'closed');
    const closedDeals = deals.filter(d => d.customerId === customer.id && d.stage === 'closed');
    
    const summary = {
      name: customer.name,
      company: customer.company,
      industry: customer.industry,
      status: customer.status,
      activeDeals: activeDeals.length,
      closedDeals: closedDeals.length,
      totalRevenue: closedDeals.reduce((sum, d) => sum + d.value, 0),
      potentialRevenue: activeDeals.reduce((sum, d) => sum + d.value, 0),
    };

    return summary;
  },
};
