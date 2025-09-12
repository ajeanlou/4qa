// Authorized users who can access data input functionality
// Add/remove email addresses as needed for your team
const AUTHORIZED_USERS = [
  'amanijeanlouis@gmail.com', // App owner - Amani Jean-Louis
  'bobbyf@hhs1.com',         // Authorized user - Bobby
  'admin@4qa.com',           // Primary admin
  'stats@4qa.com',           // Statistics manager
  // Add more authorized emails here
];

// Check if a user is authorized to input data
export const isAuthorizedUser = (userEmail) => {
  if (!userEmail) return false;
  return AUTHORIZED_USERS.includes(userEmail.toLowerCase());
};

// Get list of authorized users (for display purposes)
export const getAuthorizedUsers = () => {
  return [...AUTHORIZED_USERS];
};

// Check if current user can access data input
export const canAccessDataInput = (currentUser) => {
  if (!currentUser || !currentUser.email) return false;
  return isAuthorizedUser(currentUser.email);
};
