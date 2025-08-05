import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { RidersModule } from './riders/riders.module';
import { DronesModule } from './drones/drones.module';
import { LocationTrackingModule } from './location-tracking/location-tracking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    SupabaseModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    OrdersModule,
    ProductsModule,
    RidersModule,
    DronesModule,
    LocationTrackingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
