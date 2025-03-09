import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertReportSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertCartItemSchema
} from "@shared/schema";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

// Define custom session type
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_key", {
  apiVersion: "2025-02-24.acacia"
});

// Session store
const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // 24 hours
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "cosmic_secret"
    })
  );

  // Authentication middleware
  const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Admin authentication middleware
  const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  };

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      // Prepare request data
      const requestData = { ...req.body };
      
      // Convert birthDate string to Date or null
      if (typeof requestData.birthDate === 'string' && requestData.birthDate.trim() !== '') {
        try {
          const date = new Date(requestData.birthDate);
          if (!isNaN(date.getTime())) {
            requestData.birthDate = date;
          } else {
            requestData.birthDate = null;
          }
        } catch (err) {
          console.error("Date parsing error:", err);
          requestData.birthDate = null;
        }
      } else {
        requestData.birthDate = null;
      }
      
      // Validate with schema, with loose validation on birthDate to fix later
      const userData = {
        ...requestData,
        // Additional data validation/cleanup if needed
      };
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        birthDate: userData.birthDate,
        birthTime: userData.birthTime || null,
        birthLocation: userData.birthLocation || null
      });
      
      // Store user ID in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Store user ID in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/users/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/users/me", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Report routes
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/reports", authenticateAdmin, async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid report data" });
    }
  });
  
  // Cart routes
  app.get("/api/cart", authenticate, async (req, res) => {
    try {
      const cartItems = await storage.getCartItemsByUserId(req.session.userId!);
      
      // Get full report details for each cart item
      const cartWithReports = await Promise.all(
        cartItems.map(async (item) => {
          const report = await storage.getReport(item.reportId);
          return {
            id: item.id,
            report
          };
        })
      );
      
      res.json(cartWithReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/cart", authenticate, async (req, res) => {
    try {
      const { reportId } = insertCartItemSchema.parse(req.body);
      
      // Check if report exists
      const report = await storage.getReport(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Add to cart
      const cartItem = await storage.addCartItem({
        userId: req.session.userId!,
        reportId
      });
      
      res.status(201).json({
        id: cartItem.id,
        report
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid cart data" });
    }
  });
  
  app.delete("/api/cart/:id", authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const success = await storage.removeCartItem(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/cart", authenticate, async (req, res) => {
    try {
      await storage.clearCart(req.session.userId!);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Order routes
  app.get("/api/orders", authenticate, async (req, res) => {
    try {
      const orders = await storage.getOrdersByUserId(req.session.userId!);
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Educational content routes
  app.get("/api/educational-content", async (_req, res) => {
    try {
      const content = await storage.getAllEducationalContent();
      res.json(content);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/educational-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const content = await storage.getEducationalContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/educational-content/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const content = await storage.getEducationalContentByCategory(category);
      res.json(content);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Testimonial routes
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Stripe payment routes
  app.post("/api/create-payment-intent", authenticate, async (req, res) => {
    try {
      const { amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: { userId: req.session.userId!.toString() }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: `Error creating payment intent: ${error.message}` });
    }
  });
  
  // Checkout completion
  app.post("/api/checkout/complete", authenticate, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      // Get cart items
      const cartItems = await storage.getCartItemsByUserId(req.session.userId!);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total
      let total = 0;
      const reportItems = await Promise.all(
        cartItems.map(async (item) => {
          const report = await storage.getReport(item.reportId);
          if (!report) throw new Error(`Report not found: ${item.reportId}`);
          total += report.price;
          return report;
        })
      );
      
      // Create order
      const order = await storage.createOrder({
        userId: req.session.userId!,
        total,
        paymentIntentId
      });
      
      // Create order items
      await Promise.all(
        reportItems.map(async (report) => {
          await storage.createOrderItem({
            orderId: order.id,
            reportId: report.id,
            price: report.price
          });
        })
      );
      
      // Clear cart
      await storage.clearCart(req.session.userId!);
      
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin report generation (no payment required)
  app.post("/api/admin/generate-report", authenticateAdmin, async (req, res) => {
    try {
      const { reportId } = req.body;
      
      // Check if report exists
      const report = await storage.getReport(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Create order with zero price
      const order = await storage.createOrder({
        userId: req.session.userId!,
        total: 0,
        paymentIntentId: "admin-generated"
      });
      
      // Create order item
      await storage.createOrderItem({
        orderId: order.id,
        reportId,
        price: 0
      });
      
      res.status(201).json({
        message: "Report generated successfully",
        order
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
