import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from 'wouter';
import ConstellationBackground from '@/components/ConstellationBackground';
import ZodiacWheel from '@/components/ZodiacWheel';

// Form schema
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthLocation: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      birthTime: '',
      birthLocation: '',
    },
  });
  
  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Prepare data for registration
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        // Skip birthDate if not provided
        ...(values.birthDate ? { birthDate: null } : {}),
        birthTime: values.birthTime || null,
        birthLocation: values.birthLocation || null,
      };
      
      // If birthDate exists, create a proper Date object
      if (values.birthDate) {
        try {
          userData.birthDate = new Date(values.birthDate);
        } catch (err) {
          console.error("Date parsing error:", err);
        }
      }
      
      await register(userData);
      
      toast({
        title: "Account Created",
        description: "Welcome to Cosmic Blueprints!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 relative">
        <ConstellationBackground className="absolute inset-0">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="font-heading text-4xl text-white font-bold mb-6">
                Begin Your <span className="text-accent">Cosmic Journey</span>
              </h2>
              <p className="text-white opacity-80 max-w-md mx-auto mb-8">
                Sign up to unlock personalized astrological insights and discover the wisdom of the stars.
              </p>
              <div className="w-64 h-64 mx-auto">
                <ZodiacWheel />
              </div>
            </div>
          </div>
        </ConstellationBackground>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Enter your details to create your Cosmic Blueprints account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-sm font-medium mt-6 mb-2">Birth Details (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Adding your birth details will enhance your astrological report accuracy
                  </p>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your date of birth
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your time of birth (if known)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the place where you were born
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
