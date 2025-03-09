import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  birthDate: timestamp("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  birthDate: true,
  birthTime: true,
  birthLocation: true
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(),
  previewUrl: text("preview_url"),
  iconName: text("icon_name"),
  rating: doublePrecision("rating").default(5),
  reviewCount: integer("review_count").default(0),
  isBestseller: boolean("is_bestseller").default(false),
  gradientFrom: text("gradient_from").default("#1a3a5f"),
  gradientTo: text("gradient_to").default("#3a7ca5")
});

export const insertReportSchema = createInsertSchema(reports).pick({
  title: true,
  description: true,
  price: true,
  category: true,
  previewUrl: true,
  iconName: true,
  rating: true,
  reviewCount: true,
  isBestseller: true,
  gradientFrom: true,
  gradientTo: true
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  total: doublePrecision("total").notNull(),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  paymentIntentId: true
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  reportId: integer("report_id").notNull(),
  price: doublePrecision("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  reportId: true,
  price: true
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reportId: integer("report_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  reportId: true
});

// Educational content table
export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  iconName: text("icon_name"),
  gradientFrom: text("gradient_from").default("#1a3a5f"),
  gradientTo: text("gradient_to").default("#3a7ca5"),
  content: text("content").notNull()
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).pick({
  title: true,
  description: true,
  category: true,
  iconName: true,
  gradientFrom: true,
  gradientTo: true,
  content: true
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  testimonial: text("testimonial").notNull(),
  reportName: text("report_name").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarColor: text("avatar_color").default("#d4af37")
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  testimonial: true,
  reportName: true,
  rating: true,
  avatarColor: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
