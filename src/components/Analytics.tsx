import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSalesData } from '../services/analyticsService';

const Analytics: React.FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    const data = await getSalesData();
    setSalesData(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales Analytics</h1>
      <div className="bg-white p-4 rounded shadow">
        <BarChart width={600} height={300} data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Analytics;