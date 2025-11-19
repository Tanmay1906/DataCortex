// Quick test to verify timezone functions are working correctly
import { formatDate, formatRelativeTime, formatDateTime } from './src/utils/helpers.js';

console.log('Testing timezone functions...\n');

// Test current time
const now = new Date();
console.log('Current UTC time:', now.toISOString());
console.log('Current IST time:', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

// Test dates from a few hours ago
const hoursAgo2 = new Date(Date.now() - 2 * 60 * 60 * 1000);
const hoursAgo6 = new Date(Date.now() - 6 * 60 * 60 * 1000);
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

console.log('\nTesting formatDate function:');
console.log('Current time formatted:', formatDate(now.toISOString()));
console.log('2 hours ago formatted:', formatDate(hoursAgo2.toISOString()));
console.log('6 hours ago formatted:', formatDate(hoursAgo6.toISOString()));

console.log('\nTesting formatRelativeTime function:');
console.log('Current time relative:', formatRelativeTime(now.toISOString()));
console.log('2 hours ago relative:', formatRelativeTime(hoursAgo2.toISOString()));
console.log('6 hours ago relative:', formatRelativeTime(hoursAgo6.toISOString()));
console.log('Yesterday relative:', formatRelativeTime(yesterday.toISOString()));

console.log('\nTesting formatDateTime function:');
console.log('Current time with time:', formatDateTime(now.toISOString(), true));
console.log('Current time without time:', formatDateTime(now.toISOString(), false));