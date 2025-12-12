"use client";
import React, { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import Link from 'next/link';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

    // Fetch Notifications
    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`http://localhost:5000/api/user_notification/${userId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
        } catch (e) { console.error("Notification fetch error", e); }
    };

    // Initial Fetch & Polling (Refresh every 60s)
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    // Mark as Read Handler
    const markAsRead = async (id, link) => {
        try {
            await fetch(`http://localhost:5000/api/user_notification/${id}/read`, { method: 'PATCH' });
            // Update UI locally
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Notifications</h3>
                            <span className="text-xs text-gray-500">{unreadCount} unread</span>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map((note) => (
                                    <div 
                                        key={note.notification_id} 
                                        className={`p-4 border-b hover:bg-gray-50 transition-colors ${!note.is_read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm ${!note.is_read ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                                                {note.title}
                                            </h4>
                                            {!note.is_read && (
                                                <button 
                                                    onClick={() => markAsRead(note.notification_id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{note.message}</p>
                                        
                                        {note.link_url && (
                                            <Link 
                                                href={note.link_url} 
                                                onClick={() => {
                                                    markAsRead(note.notification_id);
                                                    setIsOpen(false);
                                                }}
                                                className="text-xs text-blue-600 font-semibold hover:underline block mt-1"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-2 text-right">
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;