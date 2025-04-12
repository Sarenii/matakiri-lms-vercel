// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/analytics.css'; // Create and style as needed
import { useAuth } from '../Context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getStudentAnalytics } from '../services/analytics';

const Analytics = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getStudentAnalytics(user.id);
      setCourseProgress(data.courseProgress);
      setCategoryDistribution(data.categoryDistribution);
    };

    fetchAnalytics();
  }, [user.id]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="analytics-page">
      <h2>Analytics Dashboard</h2>
      <div className="charts-container">
        {/* Course Progress Line Chart */}
        <div className="chart">
          <h3>Course Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#3fa74a" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Category Distribution Pie Chart */}
        <div className="chart">
          <h3>Course Categories Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#3fa74a"
                label
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
