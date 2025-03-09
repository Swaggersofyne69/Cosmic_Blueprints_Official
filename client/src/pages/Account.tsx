import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, FileText, AlertCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ConstellationBackground from '@/components/ConstellationBackground';

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
    }
  }, [user, navigate]);
  
  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your account
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
      {/* Account Header */}
      <ConstellationBackground className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="font-heading text-3xl font-bold text-white">
                Welcome, {user.username}
              </h1>
              <p className="text-white opacity-80">
                Manage your cosmic journey
              </p>
            </div>
            
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </ConstellationBackground>
      
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="profile">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" />
              My Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>View and update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1">{user.username}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1">{user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Birth Date</h3>
                      <p className="mt-1">
                        {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Birth Time</h3>
                      <p className="mt-1">{user.birthTime || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Birth Location</h3>
                      <p className="mt-1">{user.birthLocation || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <Button className="mt-6">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cosmic Insights</CardTitle>
                  <CardDescription>Your astrological profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-user-circle text-4xl text-primary"></i>
                    </div>
                    <h3 className="font-heading text-xl font-bold">{user.username}</h3>
                    {user.birthDate && (
                      <p className="text-sm text-gray-600">
                        Born: {new Date(user.birthDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  {!user.birthDate ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Complete your birth details to see your astrological profile
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <h4 className="font-medium mb-1">Current Transit</h4>
                        <p className="text-sm">Mercury retrograde affects your communication</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <h4 className="font-medium mb-1">Moon Phase</h4>
                        <p className="text-sm">Waxing crescent - time for new beginnings</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>Access your purchased astrological reports</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 w-60 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-9 w-28 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()} | ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Assuming orderItems would be fetched or included */}
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span>Birth Chart Analysis</span>
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="font-heading text-xl font-bold mb-2">No Reports Yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      You haven't purchased any astrological reports yet. Discover your cosmic blueprint by exploring our reports.
                    </p>
                    <Button asChild>
                      <a href="/reports">Browse Reports</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Account;
