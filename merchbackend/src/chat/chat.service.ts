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

      // --- 1. FETCH GLOBAL DATA ---
      const [allProducts, allCategories] = await Promise.all([
        this.prisma.product.findMany({
          where: { is_active: true },
          include: { 
            ProductVariant: true,
            categories: true 
          }
        }),
        this.prisma.category.findMany()
      ]);

      // --- 2. FETCH PERSONAL DATA (User Context) ---
      let userContextString = "The user is currently a GUEST (not logged in).";
      
      if (dto.userId) {
        const user = await this.prisma.user.findUnique({
            where: { user_id: dto.userId },
            select: { first_name: true }
        });

        const orders = await this.prisma.order.findMany({
            where: { user_id: dto.userId },
            orderBy: { created_at: 'desc' },
            take: 3,
            include: { OrderItem: { include: { product: true } } }
        });

        const cart = await this.prisma.cart.findMany({
            where: { user_id: dto.userId },
            include: { product: true }
        });

        const orderSummary = orders.map(o => 
            `- Order #${o.order_number} (${o.order_status}): ${o.OrderItem.map(i => i.product.product_name).join(", ")}`
        ).join("\n");

        const cartSummary = cart.map(c => c.product.product_name).join(", ");

        userContextString = `
        User Name: ${user?.first_name || 'Customer'}
        **Recent Orders:**\n${orderSummary || "No recent orders."}
        **Current Cart:**\n${cartSummary || "Cart is empty."}
        `;
      }

      // --- 3. FILTER RELEVANT PRODUCTS ---
      const categoryList = allCategories.map(c => c.category_name).join(', ');
      
      const staticInfo = `
        You are the intelligent support assistant for "TeeCustoms".
        **Store Overview:** We sell ${categoryList}.
        **Policies:** Returns within 30 days. Free shipping over $50.
        **Support:** support@teecustoms.com
      `;

      // FIX: Updated filter logic for multiple categories
      let relevantProducts = allProducts.filter(p => {
        const q = userQuery;
        // Check if ANY of the product's categories match the query
        const categoryMatch = p.categories.some(c => c.category_name.toLowerCase().includes(q));

        return (
          p.product_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          categoryMatch ||
          p.ProductVariant.some(v => v.color.toLowerCase().includes(q))
        );
      });

      if (relevantProducts.length === 0 && (userQuery.includes('have') || userQuery.includes('show'))) {
        relevantProducts = allProducts.slice(0, 5);
      } else {
        relevantProducts = relevantProducts.slice(0, 5);
      }

      // FIX: Updated context format for multiple categories
      const productContext = relevantProducts.map(p => {
        const stockSummary = p.ProductVariant.map(v => 
          `${v.color} [${v.size}]: ${v.stock_quantity > 0 ? v.stock_quantity + ' left' : 'OUT'}`
        ).join(', ');
        
        const catNames = p.categories.map(c => c.category_name).join(", ");

        return `ID: ${p.product_id} | ${p.product_name} ($${p.base_price}) | Cats: ${catNames} | Stock: ${stockSummary}`;
      }).join('\n');

      // --- 4. CONSTRUCT PROMPT ---
      const prompt = `
        You are the AI Assistant for "TeeCustoms". Be friendly and concise.

        **USER CONTEXT:**
        ${userContextString}

        **STORE INVENTORY (Relevant Matches):**
        ${productContext || "No specific products found for this query."}

        **STORE POLICIES:**
        ${staticInfo}

        **USER QUESTION:** "${dto.message}"

        **INSTRUCTIONS:**
        1. If asking "Where is my order?", check Recent Orders.
        2. If asking "What's in my cart?", check Current Cart.
        3. If asking about products, use the Inventory Data.
        4. Mention specific Colors/Sizes if relevant.
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