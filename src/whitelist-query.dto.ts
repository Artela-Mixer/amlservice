import { ApiProperty } from '@nestjs/swagger';

export class WhitelistListDto {
  // 分页参数
  @ApiProperty()
  page?: number;    // 第几页，默认值可以设置为1
  @ApiProperty()
  limit?: number;   // 每页多少条，默认值可以根据需要设置
  // 白名单地址查询参数
  @ApiProperty()
  addr?: string;
}

export class WhitelistQueryDto {
  // 白名单地址查询参数
  @ApiProperty()
  addr: string;
  @ApiProperty()
  root: string;
}
