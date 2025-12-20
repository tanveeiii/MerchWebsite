import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChatMessageDto } from './chat.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  }

  async generateResponse(dto: ChatMessageDto) {
    try {
      const userQuery = dto.message.toLowerCase();

      // --- 1. FETCH GLOBAL DATA (Products) ---
      const allProducts = await this.prisma.product.findMany({
        where: { is_active: true },
        include: { ProductVariant: true, category: true }
      });

      // --- 2. FETCH PERSONAL DATA (If User is Logged In) ---
      let userContextString = "The user is currently a GUEST (not logged in).";
      
      if (dto.userId) {
        // A. Get Basic Info
        const user = await this.prisma.user.findUnique({
            where: { user_id: dto.userId },
            select: { first_name: true }
        });

        // B. Get Recent Orders (Last 3)
        const orders = await this.prisma.order.findMany({
            where: { user_id: dto.userId },
            orderBy: { created_at: 'desc' },
            take: 3,
            include: { OrderItem: { include: { product: true } } }
        });

        // C. Get Cart
        const cart = await this.prisma.cart.findMany({
            where: { user_id: dto.userId },
            include: { product: true }
        });

        // Format Order History
        const orderSummary = orders.map(o => 
            `- Order #${o.order_number} (${o.order_status}): ${o.OrderItem.map(i => i.product.product_name).join(", ")}`
        ).join("\n");

        // Format Cart
        const cartSummary = cart.map(c => c.product.product_name).join(", ");

        userContextString = `
        User Name: ${user?.first_name || 'Customer'}
        
        **Recent Orders:**
        ${orderSummary || "No recent orders."}
        
        **Current Cart Items:**
        ${cartSummary || "Cart is empty."}
        `;
      }

      // --- 3. FILTER RELEVANT PRODUCTS (Same as before) ---
      let relevantProducts = allProducts.filter(p => {
        const q = userQuery;
        return (
          p.product_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.category_name.toLowerCase().includes(q) ||
          p.ProductVariant.some(v => v.color.toLowerCase().includes(q))
        );
      });

      if (relevantProducts.length === 0 && (userQuery.includes('have') || userQuery.includes('show'))) {
        relevantProducts = allProducts.slice(0, 5);
      } else {
        relevantProducts = relevantProducts.slice(0, 5);
      }

      const productContext = relevantProducts.map(p => {
        const stockSummary = p.ProductVariant.map(v => 
          `${v.color} [${v.size}]: ${v.stock_quantity > 0 ? v.stock_quantity + ' left' : 'OUT'}`
        ).join(', ');
        return `ID: ${p.product_id} | ${p.product_name} ($${p.base_price}) | Stock: ${stockSummary}`;
      }).join('\n');

      // --- 4. CONSTRUCT THE SUPER PROMPT ---
      const prompt = `
        You are the AI Assistant for "TeeCustoms". Be friendly and concise.

        **USER CONTEXT (Very Important):**
        ${userContextString}

        **STORE INVENTORY (Relevant Matches):**
        ${productContext || "No specific products found for this query."}

        **STORE POLICIES:**
        - Returns: 30 days.
        - Shipping: Free over $50.

        **USER QUESTION:** "${dto.message}"

        **INSTRUCTIONS:**
        1. If the user asks "Where is my order?", look at the **Recent Orders** section above.
        2. If the user asks "What's in my cart?", look at **Current Cart Items**.
        3. If the user says "Hi", greet them by their Name if available.
        4. If asking about products, use the Inventory Data.
      `;

      // --- 5. CALL AI ---
      const result = await this.model.generateContent(prompt);
      return { 
        response: result.response.text(),
        timestamp: new Date()
      };

    } catch (e) {
      console.error("Chat Error:", e);
      return { response: "I'm having a little trouble thinking right now. Try again!", error: true };
    }
  }
}