import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Helper to calculate days in stage
const getDaysInStage = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
};

// Get customer insights and recommendations
router.get('/customer-insights/:id', async (req, res) => {
  try {
    const db = getDb();
    const customerId = req.params.id;

    // Get customer
    const customer = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE id = ?', [customerId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get customer's deals
    const deals = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM deals WHERE customerId = ?', [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Get customer's activities
    const activities = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM activities WHERE customerId = ?', [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Generate insights
    const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const closedDeals = deals.filter(d => d.stage === 'closed');
    const activeDeals = deals.filter(d => d.stage !== 'closed');

    const insights = {
      customer: {
        id: customer.id,
        name: customer.name,
        company: customer.company,
        status: customer.status,
      },
      metrics: {
        totalDealValue,
        dealCount: deals.length,
        closedDeals: closedDeals.length,
        activeDeals: activeDeals.length,
        activityCount: activities.length,
        lifetimeValue: closedDeals.reduce((sum, d) => sum + d.value, 0),
      },
      recommendations: generateRecommendations(customer, deals, activities),
      riskLevel: assessRiskLevel(customer, deals, activities),
    };

    res.json(insights);
  } catch (error) {
    console.error('Error getting customer insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Get deal recommendations
router.get('/deal-recommendations', async (req, res) => {
  try {
    const db = getDb();

    const deals = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM deals', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    const recommendations = [];

    // Analyze each deal
    deals.forEach(deal => {
      const daysInStage = getDaysInStage(deal.createdAt);
      
      if (deal.stage === 'prospect' && daysInStage > 14) {
        recommendations.push({
          dealId: deal.id,
          title: deal.title,
          priority: 'high',
          action: 'Follow up with prospect',
          reason: `Deal has been in prospect stage for ${daysInStage} days`,
        });
      }
      
      if (deal.stage === 'proposal' && daysInStage > 7) {
        recommendations.push({
          dealId: deal.id,
          title: deal.title,
          priority: 'medium',
          action: 'Check on proposal status',
          reason: `Waiting for response for ${daysInStage} days`,
        });
      }

      if (deal.stage === 'negotiation' && daysInStage > 21) {
        recommendations.push({
          dealId: deal.id,
          title: deal.title,
          priority: 'high',
          action: 'Close negotiations or re-qualify',
          reason: `Extended negotiation period: ${daysInStage} days`,
        });
      }
    });

    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting deal recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get pipeline analysis
router.get('/pipeline-analysis', async (req, res) => {
  try {
    const db = getDb();

    const deals = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM deals', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    const byStage = {};
    const stages = ['prospect', 'qualified', 'proposal', 'negotiation', 'closed'];
    
    stages.forEach(stage => {
      byStage[stage] = deals.filter(d => d.stage === stage);
    });

    const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const closedValue = byStage.closed.reduce((sum, d) => sum + d.value, 0);
    const forecastedValue = deals
      .filter(d => d.stage !== 'closed')
      .reduce((sum, d) => sum + (d.value * getCloseProbability(d)), 0);

    res.json({
      byStage: Object.fromEntries(
        stages.map(stage => [stage, byStage[stage].length])
      ),
      totalValue,
      closedValue,
      forecastedValue: Math.round(forecastedValue),
      avgDealValue: deals.length > 0 ? Math.round(totalValue / deals.length) : 0,
      winRate: deals.length > 0 ? ((byStage.closed.length / deals.length) * 100).toFixed(1) : 0,
      dealCount: deals.length,
    });
  } catch (error) {
    console.error('Error analyzing pipeline:', error);
    res.status(500).json({ error: 'Failed to analyze pipeline' });
  }
});

// Get next steps for a customer
router.get('/next-steps/:id', async (req, res) => {
  try {
    const db = getDb();
    const customerId = req.params.id;

    const customer = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE id = ?', [customerId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const deals = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM deals WHERE customerId = ?', [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    const nextSteps = generateNextSteps(customer, deals);

    res.json({ customerId, nextSteps });
  } catch (error) {
    console.error('Error getting next steps:', error);
    res.status(500).json({ error: 'Failed to generate next steps' });
  }
});

// Helper functions
function generateRecommendations(customer, deals, activities) {
  const recommendations = [];

  if (deals.length === 0) {
    recommendations.push('No active deals - schedule discovery call');
  }

  if (activities.length === 0) {
    recommendations.push('No recent activities - time for check-in');
  }

  const activeDeals = deals.filter(d => d.stage !== 'closed');
  if (activeDeals.length > 3) {
    recommendations.push('Multiple deals in progress - coordinate follow-ups');
  }

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  if (totalValue > 50000) {
    recommendations.push('High-value account - assign dedicated manager');
  }

  return recommendations;
}

function assessRiskLevel(customer, deals, activities) {
  if (activities.length === 0 && deals.length === 0) return 'critical';
  if (activities.length === 0) return 'high';
  if (deals.length === 0) return 'medium';
  return 'low';
}

function getCloseProbability(deal) {
  const probabilities = {
    'prospect': 0.1,
    'qualified': 0.3,
    'proposal': 0.6,
    'negotiation': 0.75,
    'closed': 1.0,
  };
  return probabilities[deal.stage] || 0.5;
}

function generateNextSteps(customer, deals) {
  const steps = [];

  if (!deals || deals.length === 0) {
    steps.push('Schedule initial discovery call');
    steps.push('Qualify opportunity');
  } else {
    deals.forEach(deal => {
      switch (deal.stage) {
        case 'prospect':
          steps.push(`Schedule meeting for ${deal.title}`);
          break;
        case 'qualified':
          steps.push(`Prepare proposal for ${deal.title}`);
          break;
        case 'proposal':
          steps.push(`Follow up on proposal for ${deal.title}`);
          break;
        case 'negotiation':
          steps.push(`Finalize terms for ${deal.title}`);
          break;
      }
    });
  }

  return steps;
}

export default router;
