// src/app.module.ts
import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ProductDiscountModule } from './product_discount/product_discount.module';
import { TagModule } from './tag/tag.module';
import { ProductVariantModule } from './product_variant/product_variant.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserNotificationModule } from './user_notification/user_notification.module';
import { ComplaintModule } from './complaint/complaint.module';
import { CouponModule } from './coupon/coupon.module';
import { CouponUsageModule } from './coupon_usage/coupon_usage.module';
import { InventoryLogModule } from './inventory_log/inventory_log.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order_item/order_item.module';
import { PaymentModule } from './payment/payment.module';
import { ProductImageModule } from './product_image/product_image.module';
import { ReturnModule } from './return/return.module';
import { ReturnItemModule } from './return_item/return_item.module';
import { ReturnRequestModule } from './return_request/return_request.module';
import { ReviewModule } from './review/review.module';
import { ReviewImageModule } from './review_image/review_image.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { OrderStatusHistoryModule } from './order_status_history/order_status_history.module';
import { CustomizationModule } from './customization/customization.module';
import { RazorpayModule } from './razorpay/razorpay.module';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    AnalyticsModule,
    AuthModule,
    CartModule,
    ChatModule,
    CategoryModule,
    ComplaintModule,
    CouponModule,
    CouponUsageModule,
    CustomizationModule,
    InventoryLogModule,
    OrderModule,
    OrderItemModule,
    OrderStatusHistoryModule,
    PaymentModule,
    ProductModule,
    ProductDiscountModule,
    ProductImageModule,
    ProductVariantModule,
    ReturnModule,
    ReturnItemModule,
    ReturnRequestModule,
    ReviewModule,
    ReviewImageModule,
    TagModule,
    UserModule,
    UserNotificationModule,
    WishlistModule,
    RazorpayModule,
  ],
})
export class AppModule {}
