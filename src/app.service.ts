import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
      constructor(private configService: ConfigService) {}

  getHello(): string {
      const dbOptions = {
          type: 'mysql',
          host: this.configService.get('DB_HOST'),
          port: this.configService.get('DB_PORT'),
          username: this.configService.get('DB_USERNAME'),
          password: this.configService.get('DB_PASSWORD'),
          database: this.configService.get('DB_DATABASE'),
      // ...其他配置
    };

    // 打印配置信息
    console.log('Database connection options:', dbOptions);
    return 'Hello World!';
  }
}
