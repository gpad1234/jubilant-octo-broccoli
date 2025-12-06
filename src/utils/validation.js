// Form validation utilities
export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : 'Invalid email address';
  },

  phone: (phone) => {
    const regex = /^[\d\-\+\(\)\s]{10,}$/;
    return regex.test(phone) ? null : 'Invalid phone number';
  },

  required: (value, fieldName = 'This field') => {
    return value && value.trim() ? null : `${fieldName} is required`;
  },

  minLength: (value, min, fieldName = 'This field') => {
    return value && value.length >= min ? null : `${fieldName} must be at least ${min} characters`;
  },

  number: (value, fieldName = 'This field') => {
    return !isNaN(value) && value !== '' ? null : `${fieldName} must be a valid number`;
  },

  currency: (value) => {
    return !isNaN(value) && value > 0 ? null : 'Must be a valid amount';
  },
};

// Validate form data
export const validateForm = (formData, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const validators_list = schema[field];
    for (const validator of validators_list) {
      const error = validator(formData[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => Object.keys(errors).length > 0;
