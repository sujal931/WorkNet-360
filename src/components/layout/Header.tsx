
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Leave request approved",
    description: "Your leave request for May 15-16 has been approved",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    time: "10 minutes ago",
    isRead: false
  },
  {
    id: 2,
    title: "Meeting reminder",
    description: "Team standup starts in 15 minutes",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    time: "15 minutes ago",
    isRead: false
  },
  {
    id: 3,
    title: "New task assigned",
    description: "Sam assigned you a new task: 'Update employee records'",
    icon: <FileText className="h-4 w-4 text-primary" />,
    time: "1 hour ago",
    isRead: true
  },
  {
    id: 4,
    title: "System maintenance",
    description: "The system will be down for maintenance on Sunday from 2-4 AM",
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    time: "2 hours ago",
    isRead: true
  },
  {
    id: 5,
    title: "New job posting",
    description: "A new internal position for 'Senior Developer' is available",
    icon: <Briefcase className="h-4 w-4 text-blue-500" />,
    time: "1 day ago",
    isRead: true
  }
];

const Header = ({ title }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center bg-primary">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <DropdownMenuLabel className="py-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    markAllAsRead();
                  }}
                  className="text-xs h-7 px-2"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start py-2 px-4 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="mt-0.5">
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${!notification.isRead ? 'text-primary' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 rounded-full" size="sm">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <p>{user?.name}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
