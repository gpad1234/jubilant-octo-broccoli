const API_URL = 'http://localhost:5000/api';

// Sample customers
const customers = [
  {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-0101',
    company: 'Acme Corp',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    industry: 'Technology',
    status: 'active',
    notes: 'Key account for Q1'
  },
  {
    name: 'Global Industries',
    email: 'info@globalind.com',
    phone: '555-0102',
    company: 'Global Industries',
    address: '456 Enterprise Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    industry: 'Manufacturing',
    status: 'active',
    notes: 'Interested in partnership'
  },
  {
    name: 'Tech Ventures LLC',
    email: 'sales@techventures.io',
    phone: '555-0103',
    company: 'Tech Ventures',
    address: '789 Innovation Drive',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    industry: 'Software',
    status: 'prospect',
    notes: 'First contact last week'
  }
];

// Sample deals
const deals = [
  {
    title: 'Enterprise License Deal',
    value: 50000,
    contact: 'Acme Corporation',
    stage: 'committed',
    customerId: 1,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title: 'Supply Contract',
    value: 25000,
    contact: 'Global Industries',
    stage: 'negotiation',
    customerId: 2,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title: 'Initial Consultation',
    value: 5000,
    contact: 'Tech Ventures LLC',
    stage: 'prospect',
    customerId: 3,
    date: new Date().toISOString().split('T')[0]
  }
];

// Sample tasks
const tasks = [
  {
    task: 'Follow up with Acme on contract terms',
    priority: 'high',
    time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    customerId: 1
  },
  {
    task: 'Prepare proposal for Global Industries',
    priority: 'medium',
    time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    customerId: 2
  },
  {
    task: 'Schedule demo with Tech Ventures',
    priority: 'high',
    time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerId: 3
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding database...\n');

    // Add customers
    console.log('Adding customers...');
    for (const customer of customers) {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (response.ok) {
        console.log(`✓ Added: ${customer.name}`);
      } else {
        console.error(`✗ Failed to add ${customer.name}`);
      }
    }

    // Add deals
    console.log('\nAdding deals...');
    for (const deal of deals) {
      const response = await fetch(`${API_URL}/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal)
      });
      if (response.ok) {
        console.log(`✓ Added: ${deal.title}`);
      } else {
        console.error(`✗ Failed to add ${deal.title}`);
      }
    }

    // Add tasks
    console.log('\nAdding tasks...');
    for (const task of tasks) {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) {
        console.log(`✓ Added: ${task.task}`);
      } else {
        console.error(`✗ Failed to add ${task.task}`);
      }
    }

    console.log('\n✓ Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
