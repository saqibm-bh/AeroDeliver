import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { FleetModule } from './fleet/fleet.module';
import { RidersModule } from './riders/riders.module';
import { DronesModule } from './drones/drones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    ProductsModule,
    StoresModule,
    OrdersModule,
    DeliveryModule,
    CartModule,
    PaymentModule,
    NotificationsModule,
    AnalyticsModule,
    FleetModule,
    RidersModule,
    DronesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
