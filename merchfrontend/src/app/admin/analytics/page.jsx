"use client";
import React, { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Eye, Activity, ShoppingCart, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsDashboard() {
  const [trafficData, setTrafficData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trafficRes, productsRes, activityRes] = await Promise.all([
          fetch('http://localhost:5000/api/analytics/admin/traffic'),
          fetch('http://localhost:5000/api/analytics/admin/top-products'),
          fetch('http://localhost:5000/api/analytics/admin/activity')
        ]);

        const traffic = await trafficRes.json();
        const products = await productsRes.json();
        const activity = await activityRes.json();

        setTrafficData(Array.isArray(traffic) ? traffic : []);
        setTopProducts(Array.isArray(products) ? products : []);
        setRecentActivity(Array.isArray(activity) ? activity : []);

      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Helper for Activity Styles ---
  const getEventStyle = (type) => {
    switch (type) {
      case 'PURCHASE':
        return { 
          bg: 'bg-green-100', text: 'text-green-700', label: 'Purchased', 
          icon: <CreditCard size={14} className="mr-1 inline" /> 
        };
      case 'ADD_TO_CART':
        return { 
          bg: 'bg-amber-100', text: 'text-amber-700', label: 'Added to Cart', 
          icon: <ShoppingCart size={14} className="mr-1 inline" /> 
        };
      default: // VIEW
        return { 
          bg: 'bg-blue-50', text: 'text-blue-600', label: 'Viewed', 
          icon: <Eye size={14} className="mr-1 inline" /> 
        };
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Activity className="text-blue-600" /> Analytics Dashboard
      </h1>

      {/* 1. TRAFFIC CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" /> Traffic Overview (Last 7 Days)
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {weekday:'short'})}
                axisLine={false}
                tickLine={false}
                tick={{fontSize: 12, fill: '#6b7280'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#6b7280'}} 
              />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Eye size={20} className="text-purple-500" /> Most Viewed Products
          </h2>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
                <p className="text-gray-400 text-sm">No data available.</p>
            ) : (
                topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                            {i + 1}
                        </span>
                        <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {p.views} views
                    </span>
                </div>
                ))
            )}
          </div>
        </div>

        {/* 3. RECENT ACTIVITY LOG (UPDATED) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-orange-500" /> Recent User Activity
          </h2>
          <div className="overflow-hidden">
             <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {recentActivity.map((log) => {
                        const style = getEventStyle(log.event_type);
                        return (
                          <tr key={log.analytics_id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                  {log.user ? log.user.first_name : 'Guest'}
                              </td>
                              <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                                      {style.icon}
                                      {style.label}
                                  </span>
                                  {log.product && (
                                    <span className="ml-2 text-gray-400 text-xs">
                                      on {log.product.product_name}
                                    </span>
                                  )}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-400">
                                  {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </td>
                          </tr>
                        );
                    })}
                </tbody>
             </table>
             {recentActivity.length === 0 && <p className="p-4 text-center text-gray-400">No recent activity.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}