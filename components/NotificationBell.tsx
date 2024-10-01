"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/app/actions/notifications";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="text-lvct-purple" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-lvct-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 p-2 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 ${notification.read ? "opacity-50" : ""}`}
              >
                <p>{notification.message}</p>
                {!notification.read && (
                  <Button
                    onClick={() => handleMarkAsRead(notification.id)}
                    size="sm"
                    className="mt-2 bg-lvct-purple hover:bg-purple-700 text-white"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
}
