export class WhitelistListDto {
  // 分页参数
  page?: number;    // 第几页，默认值可以设置为1
  limit?: number;   // 每页多少条，默认值可以根据需要设置
  // 白名单地址查询参数
  addr?: string;
}

export class WhitelistQueryDto {
  // 白名单地址查询参数
  addr: string;
  root: string;
}
