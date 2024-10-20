import { SalesData } from '../types';

// Simulating analytics data
export const getSalesData = async (): Promise<SalesData[]> => {
  // In a real application, this would fetch data from a backend API
  return [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];
};