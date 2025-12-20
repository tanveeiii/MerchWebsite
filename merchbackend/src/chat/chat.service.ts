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
    // Using the auto-updating alias for best free model access
    this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  }

  async generateResponse(dto: ChatMessageDto) {
    try {
      const userQuery = dto.message.toLowerCase();

      // --- STEP 1: FETCH DATA (Products & Categories) ---
      const [allProducts, categories] = await Promise.all([
        this.prisma.product.findMany({
          where: { is_active: true },
          include: { 
            ProductVariant: true,
            category: true // Include Category Name
          }
        }),
        this.prisma.category.findMany()
      ]);

      // --- STEP 2: BUILD "BROAD" KNOWLEDGE (Store Overview) ---
      const categoryList = categories.map(c => c.category_name).join(', ');
      
      const staticInfo = `
        You are the intelligent support assistant for "TeeCustoms".
        
        **Store Overview:**
        - We sell: ${categoryList}.
        - Policies: Returns within 30 days. Free shipping over $50.
        - Support: support@teecustoms.com
      `;

      // --- STEP 3: FIND RELEVANT PRODUCTS (Smart Search) ---
      // We explicitly look for matches in Name, Description, Category, OR Color
      let relevantProducts = allProducts.filter(p => {
        const q = userQuery;
        return (
          p.product_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.category_name.toLowerCase().includes(q) ||
          p.ProductVariant.some(v => v.color.toLowerCase().includes(q)) // Search by color too
        );
      });

      // Fallback: If query is very generic (e.g., "what do you have?", "show me items"), show top 5 items
      if (relevantProducts.length === 0 && (userQuery.includes('have') || userQuery.includes('sell') || userQuery.includes('product') || userQuery.includes('show'))) {
        relevantProducts = allProducts.slice(0, 5);
      } else {
        relevantProducts = relevantProducts.slice(0, 5); // Limit to top 5 specific matches
      }

      // --- STEP 4: FORMAT PRODUCT DETAILS (The "Accuracy" Part) ---
      const productContext = relevantProducts.map(p => {
        // Group variants to be readable: "Red (S, M), Blue (L)"
        const stockSummary = p.ProductVariant.map(v => 
          `${v.color} [${v.size}]: ${v.stock_quantity > 0 ? v.stock_quantity + ' left' : 'OUT OF STOCK'}`
        ).join(', ');

        return `
        ---
        ID: ${p.product_id}
        Name: ${p.product_name}
        Category: ${p.category?.category_name}
        Price: $${p.base_price}
        Description: ${p.description}
        Inventory Details: ${stockSummary}
        ---`;
      }).join('\n');

      // --- STEP 5: CONSTRUCT PROMPT ---
      const prompt = `
        System Instructions: ${staticInfo}

        Here is the detailed inventory data based on the user's search:
        ${productContext || "No specific products found match this query."}

        User Question: "${dto.message}"

        Response Guidelines:
        1. Be precise. If the user asks for "Red Hoodie", look at the Inventory Details for that item.
        2. If a specific size/color is marked "OUT OF STOCK", explicitly tell the user.
        3. If the user asks generally ("What hoodies do you have?"), list the names and prices of the matching items found above.
        4. Keep it friendly and concise.
      `;

      // --- STEP 6: CALL AI ---
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { 
        response: response.text(),
        timestamp: new Date()
      };

    } catch (e) {
      console.error("Chat Error:", e);
      return { 
        response: "I'm checking the inventory but hit a snag. Please ask again in a moment!",
        error: true 
      };
    }
  }
}