import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAnalyticsDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE EVENT
  async create(createAnalyticsDto: CreateAnalyticsDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAnalyticsDto.email },
    });

    if (!user) {
        return null; 
    }

    const now = new Date();
    return await this.prisma.analytics.create({
      data: {
        user_id: user.user_id,
        product_id: createAnalyticsDto.product_id,
        event_type: createAnalyticsDto.event_type,
        event_data: createAnalyticsDto.event_data || '',
        ip_address: createAnalyticsDto.ip_address,
        page_url: createAnalyticsDto.page_url,
        created_at: now,
      },
    });
  }

  // 2. ADMIN: GET DAILY TRAFFIC (Last 7 Days)
  async getDailyTraffic() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const data = await this.prisma.analytics.groupBy({
        by: ['created_at'],
        where: {
          created_at: { gte: sevenDaysAgo },
          event_type: 'VIEW'
        },
        _count: {
          analytics_id: true
        }
      });

      const formattedMap = new Map<string, number>();
      
      data.forEach(item => {
        const dateStr = item.created_at.toISOString().split('T')[0];
        const current = formattedMap.get(dateStr) || 0;
        formattedMap.set(dateStr, current + item._count.analytics_id);
      });

      // --- FIX: Explicitly type the array ---
      const result: { date: string; views: number }[] = [];
      
      const today = new Date();
      
      for(let i=6; i>=0; i--) {
         const d = new Date();
         d.setDate(today.getDate() - i);
         const dateKey = d.toISOString().split('T')[0];
         result.push({
            date: dateKey,
            views: formattedMap.get(dateKey) || 0
         });
      }
      return result;

    } catch (e) {
      throw new InternalServerErrorException("Error fetching traffic data");
    }
  }

  // 3. ADMIN: GET TOP PRODUCTS
  async getTopProducts() {
    try {
      const grouped = await this.prisma.analytics.groupBy({
        by: ['product_id'],
        where: { event_type: 'VIEW' },
        _count: { product_id: true },
        orderBy: { _count: { product_id: 'desc' } },
        take: 5
      });

      const productIds = grouped.map(g => g.product_id);
      const products = await this.prisma.product.findMany({
        where: { product_id: { in: productIds } },
        select: { product_id: true, product_name: true }
      });

      return grouped.map(item => {
        const prod = products.find(p => p.product_id === item.product_id);
        return {
            name: prod ? prod.product_name : `Product #${item.product_id}`,
            views: item._count.product_id
        };
      });

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException("Error fetching top products");
    }
  }

  // 4. ADMIN: RECENT ACTIVITY LOG
  async getRecentActivity() {
    return await this.prisma.analytics.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
            user: { select: { first_name: true, email: true } },
            product: { select: { product_name: true } }
        }
    });
  }
}