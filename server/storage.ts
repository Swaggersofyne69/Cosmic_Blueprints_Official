import { 
  users, type User, type InsertUser,
  reports, type Report, type InsertReport,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  cartItems, type CartItem, type InsertCartItem,
  educationalContent, type EducationalContent, type InsertEducationalContent,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User Operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Report Operations
  getReport(id: number): Promise<Report | undefined>;
  getReports(): Promise<Report[]>;
  getReportsByCategory(category: string): Promise<Report[]>; 
  createReport(report: InsertReport): Promise<Report>;
  
  // Order Operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Item Operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  
  // Cart Operations
  getCartItemsByUserId(userId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Educational Content Operations
  getEducationalContent(id: number): Promise<EducationalContent | undefined>;
  getEducationalContentByCategory(category: string): Promise<EducationalContent[]>;
  getAllEducationalContent(): Promise<EducationalContent[]>;
  
  // Testimonial Operations
  getTestimonials(): Promise<Testimonial[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, Report>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private cartItems: Map<number, CartItem>;
  private educationalContent: Map<number, EducationalContent>;
  private testimonials: Map<number, Testimonial>;
  
  private userIdCounter: number;
  private reportIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private cartItemIdCounter: number;
  private educationalContentIdCounter: number;
  private testimonialIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.cartItems = new Map();
    this.educationalContent = new Map();
    this.testimonials = new Map();
    
    this.userIdCounter = 1;
    this.reportIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.educationalContentIdCounter = 1;
    this.testimonialIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const isAdmin = false; // Default value
    const user: User = { ...insertUser, id, isAdmin };
    this.users.set(id, user);
    return user;
  }
  
  // Report Operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }
  
  async getReportsByCategory(category: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.category === category
    );
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const report: Report = { ...insertReport, id };
    this.reports.set(id, report);
    return report;
  }
  
  // Order Operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const createdAt = new Date();
    const status = "pending";
    const order: Order = { ...insertOrder, id, status, createdAt };
    this.orders.set(id, order);
    return order;
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item Operations
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const createdAt = new Date();
    const orderItem: OrderItem = { ...insertOrderItem, id, createdAt };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  // Cart Operations
  async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const createdAt = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItemsByUserId(userId);
    for (const item of userCartItems) {
      this.cartItems.delete(item.id);
    }
    return true;
  }
  
  // Educational Content Operations
  async getEducationalContent(id: number): Promise<EducationalContent | undefined> {
    return this.educationalContent.get(id);
  }
  
  async getEducationalContentByCategory(category: string): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values()).filter(
      (content) => content.category === category
    );
  }
  
  async getAllEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values());
  }
  
  // Testimonial Operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  // Initialize sample data
  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.userIdCounter++,
      username: "admin",
      password: "password123", // In production, this should be hashed
      email: "admin@cosmicblueprints.com",
      isAdmin: true,
      birthDate: null,
      birthTime: null,
      birthLocation: null
    };
    this.users.set(adminUser.id, adminUser);
    
    // Sample reports
    const reports: InsertReport[] = [
      {
        title: "Birth Chart Analysis",
        description: "A comprehensive analysis of your natal chart, revealing your cosmic blueprint at the moment of birth.",
        price: 39.99,
        category: "Personal",
        iconName: "user-circle",
        previewUrl: "/previews/birth-chart.pdf",
        rating: 4.5,
        reviewCount: 128,
        isBestseller: true,
        gradientFrom: "#1a3a5f",
        gradientTo: "#3a7ca5"
      },
      {
        title: "Relationship Compatibility",
        description: "Discover the cosmic connections between you and your partner with our detailed synastry report.",
        price: 49.99,
        category: "Relationship",
        iconName: "heart",
        previewUrl: "/previews/relationship.pdf",
        rating: 5,
        reviewCount: 94,
        isBestseller: false,
        gradientFrom: "#3a7ca5",
        gradientTo: "#c03546"
      },
      {
        title: "Career & Purpose",
        description: "Align your professional path with the cosmic energies that support your unique skills and life purpose.",
        price: 44.99,
        category: "Career",
        iconName: "briefcase",
        previewUrl: "/previews/career.pdf",
        rating: 4,
        reviewCount: 76,
        isBestseller: false,
        gradientFrom: "#0a1f33",
        gradientTo: "#1a3a5f"
      },
      {
        title: "Solar Return",
        description: "Understand the themes and opportunities of your upcoming year based on your annual solar return.",
        price: 34.99,
        category: "Forecast",
        iconName: "sun",
        previewUrl: "/previews/solar-return.pdf",
        rating: 4.7,
        reviewCount: 52,
        isBestseller: false,
        gradientFrom: "#c03546",
        gradientTo: "#d4af37"
      },
      {
        title: "Transit Forecast",
        description: "Navigate upcoming planetary movements and their influence on your life over the next 12 months.",
        price: 54.99,
        category: "Forecast",
        iconName: "chart-line",
        previewUrl: "/previews/transit.pdf",
        rating: 4.8,
        reviewCount: 42,
        isBestseller: false,
        gradientFrom: "#3a7ca5",
        gradientTo: "#0a1f33"
      },
      {
        title: "Lunar Cycles",
        description: "Understanding how the moon's phases affect your emotions and energy throughout each month.",
        price: 29.99,
        category: "Lunar",
        iconName: "moon",
        previewUrl: "/previews/lunar.pdf",
        rating: 4.6,
        reviewCount: 38,
        isBestseller: false,
        gradientFrom: "#0a1f33",
        gradientTo: "#c03546"
      },
      {
        title: "Child's Potential",
        description: "Discover your child's innate talents, challenges and potential paths through their natal chart.",
        price: 44.99,
        category: "Family",
        iconName: "child",
        previewUrl: "/previews/child.pdf",
        rating: 4.9,
        reviewCount: 63,
        isBestseller: false,
        gradientFrom: "#d4af37",
        gradientTo: "#1a3a5f"
      },
      {
        title: "Relocation Astrology",
        description: "Learn how different locations on Earth can affect your planetary energies and life experiences.",
        price: 49.99,
        category: "Location",
        iconName: "map-marker-alt",
        previewUrl: "/previews/relocation.pdf",
        rating: 4.3,
        reviewCount: 28,
        isBestseller: false,
        gradientFrom: "#1a3a5f",
        gradientTo: "#d4af37"
      },
      {
        title: "Spiritual Path",
        description: "Uncover your soul's journey and spiritual purpose in this lifetime through advanced astrological techniques.",
        price: 59.99,
        category: "Spiritual",
        iconName: "om",
        previewUrl: "/previews/spiritual.pdf",
        rating: 4.7,
        reviewCount: 43,
        isBestseller: false,
        gradientFrom: "#c03546",
        gradientTo: "#3a7ca5"
      },
      {
        title: "Health & Wellness",
        description: "Understand your body's natural tendencies and potential health strengths and challenges.",
        price: 39.99,
        category: "Health",
        iconName: "heartbeat",
        previewUrl: "/previews/health.pdf",
        rating: 4.4,
        reviewCount: 31,
        isBestseller: false,
        gradientFrom: "#3a7ca5",
        gradientTo: "#d4af37"
      },
      {
        title: "Major Life Transits",
        description: "Navigate significant planetary returns and transits that mark major life transitions and growth opportunities.",
        price: 64.99,
        category: "Transition",
        iconName: "road",
        previewUrl: "/previews/life-transits.pdf",
        rating: 4.9,
        reviewCount: 27,
        isBestseller: false,
        gradientFrom: "#0a1f33",
        gradientTo: "#d4af37"
      },
      {
        title: "Annual Forecast",
        description: "A month-by-month breakdown of planetary influences for the coming year to help you plan effectively.",
        price: 69.99,
        category: "Forecast",
        iconName: "calendar-alt",
        previewUrl: "/previews/annual.pdf",
        rating: 4.8,
        reviewCount: 56,
        isBestseller: false,
        gradientFrom: "#d4af37",
        gradientTo: "#c03546"
      }
    ];
    
    // Add reports to storage
    reports.forEach(report => {
      const id = this.reportIdCounter++;
      this.reports.set(id, { ...report, id });
    });
    
    // Sample educational content
    const educationalContents: InsertEducationalContent[] = [
      {
        title: "Zodiac Signs",
        description: "Explore the traits, elements, and characteristics of each of the twelve zodiac signs.",
        category: "basics",
        iconName: "star-of-life",
        gradientFrom: "#3a7ca5",
        gradientTo: "#1a3a5f",
        content: "# Understanding Zodiac Signs\n\nThe zodiac is divided into 12 signs, each with its own characteristics, strengths, and weaknesses. These signs are: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces.\n\n## Elements\n\nThe 12 signs are divided into four elements:\n\n- **Fire Signs**: Aries, Leo, Sagittarius\n- **Earth Signs**: Taurus, Virgo, Capricorn\n- **Air Signs**: Gemini, Libra, Aquarius\n- **Water Signs**: Cancer, Scorpio, Pisces\n\nEach element represents different qualities and tendencies..."
      },
      {
        title: "Planets & Houses",
        description: "Understand the cosmic influences of planets and their significance in different houses.",
        category: "intermediate",
        iconName: "globe-americas",
        gradientFrom: "#d4af37",
        gradientTo: "#c03546",
        content: "# Planets and Houses in Astrology\n\n## The Planets\n\nIn astrology, each planet represents different aspects of our personality and life:\n\n- **Sun**: Core identity and purpose\n- **Moon**: Emotions and subconscious\n- **Mercury**: Communication and intellect\n- **Venus**: Love, beauty, and values\n- **Mars**: Action, desire, and energy\n- **Jupiter**: Growth, expansion, and wisdom\n- **Saturn**: Discipline, responsibility, and limitations\n- **Uranus**: Innovation, rebellion, and sudden change\n- **Neptune**: Dreams, intuition, and spirituality\n- **Pluto**: Transformation, power, and rebirth\n\n## The Houses\n\nThe 12 houses represent different areas of life..."
      },
      {
        title: "Aspects & Transits",
        description: "Learn how planetary relationships affect your chart and how current planetary movements impact you.",
        category: "advanced",
        iconName: "project-diagram",
        gradientFrom: "#1a3a5f",
        gradientTo: "#0a1f33",
        content: "# Aspects and Transits in Astrology\n\n## Planetary Aspects\n\nAspects are the angles planets make to each other in your birth chart. The major aspects are:\n\n- **Conjunction (0°)**: Planets are in the same place, blending their energies\n- **Sextile (60°)**: Harmonious opportunities\n- **Square (90°)**: Tension and challenges that promote growth\n- **Trine (120°)**: Natural flow of supportive energy\n- **Opposition (180°)**: Polarization and balance\n\n## Transits\n\nTransits occur when moving planets form aspects to the planets in your birth chart..."
      }
    ];
    
    // Add educational content to storage
    educationalContents.forEach(content => {
      const id = this.educationalContentIdCounter++;
      this.educationalContent.set(id, { ...content, id });
    });
    
    // Sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Sarah J.",
        testimonial: "The birth chart analysis was incredibly accurate and provided insights I'd never considered before. It's helped me understand my strengths and challenges in a whole new light.",
        reportName: "Birth Chart Analysis",
        rating: 5,
        avatarColor: "#d4af37"
      },
      {
        name: "Michael T.",
        testimonial: "My partner and I ordered the compatibility report and were amazed at how accurately it described our relationship dynamics. It's given us tools to better understand each other.",
        reportName: "Relationship Compatibility",
        rating: 4,
        avatarColor: "#3a7ca5"
      },
      {
        name: "Elena R.",
        testimonial: "The career report confirmed what I've been feeling about my professional path. The insights were profound and have given me confidence to pursue my true calling.",
        reportName: "Career & Purpose Report",
        rating: 5,
        avatarColor: "#c03546"
      }
    ];
    
    // Add testimonials to storage
    testimonials.forEach(testimonial => {
      const id = this.testimonialIdCounter++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }
}

export const storage = new MemStorage();
