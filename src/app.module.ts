import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { WhitelistController } from './whitelist.controller';
import { AppService } from './app.service';
import { WhitelistService } from './whitelist.service';
import { WhitelistEntity } from './whitelist.entity';
import { ResponseService } from './common/response.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 告诉 ConfigModule 需要加在环境变量
      isGlobal: true,
    }),
     TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: configService.get('DB_TYPE') as 'postgres' | 'mysql', // 确保类型是正确的
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [WhitelistEntity],
          synchronize: false,
          logging: true,
          // 其他可用的配置选项，如 logging，replication，ssl 等...
        };
        // 打印数据库配置
        //console.log('Database Configuration:', dbConfig);
        return dbConfig;
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
    TypeOrmModule.forFeature([WhitelistEntity]), // 注册 WhitelistEntity 用于依赖注入
  ],
  controllers: [WhitelistController],
  providers: [AppService, WhitelistService, ResponseService],
})
export class AppModule {}
