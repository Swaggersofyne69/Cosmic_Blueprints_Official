import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Report, User } from '@shared/schema';
import { AlertCircle, FileText, Download, Shield, UserCog } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('reports');
  const [generatingReport, setGeneratingReport] = useState(false);

  // Check if user is admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
      return;
    }
    
    if (!user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);
  
  // Fetch reports
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });
  
  // Generate free report
  const handleGenerateReport = async (reportId: number) => {
    try {
      setGeneratingReport(true);
      
      const response = await apiRequest('POST', '/api/admin/generate-report', { reportId });
      const data = await response.json();
      
      toast({
        title: "Report Generated",
        description: "The report has been successfully generated",
      });
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the report",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };
  
  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be an administrator to access this page
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Cosmic Blueprints store</p>
        </div>
        
        <div className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-accent" />
          <span className="text-sm font-medium">Admin Access: {user.username}</span>
        </div>
      </div>
      
      <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="reports">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserCog className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Astrological Reports</CardTitle>
              <CardDescription>
                Generate reports without payment for testing or special customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-60 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-9 w-28 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {reports?.map(report => (
                    <div key={report.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 border rounded-lg">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-gray-600">${report.price.toFixed(2)} | Category: {report.category}</p>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Free
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Generate Report</DialogTitle>
                            <DialogDescription>
                              Generate a free copy of "{report.title}" without payment
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4">
                            <p className="text-sm text-gray-600 mb-4">
                              This action will create a free report for admin testing or special customer purposes.
                              The report will be available in your account.
                            </p>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => {}} 
                              disabled={generatingReport}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleGenerateReport(report.id)}
                              disabled={generatingReport}
                            >
                              {generatingReport ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                                  Generating...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Download className="mr-2 h-4 w-4" />
                                  Generate Report
                                </span>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserCog className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="font-heading text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Advanced user management features are currently in development.
                  Check back soon for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
