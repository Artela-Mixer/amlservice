import { Controller, Post, Body } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';
import { WhitelistQueryDto } from './whitelist-query.dto';
import { WhitelistListDto } from './whitelist-query.dto';
import { WhitelistImportDto } from './whitelist-import.dto';
import { ResponseService } from './common/response.service';


@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService,
              private readonly responseService: ResponseService,
             ) {}

  @Post('/querylist')
  getWhitelist(@Body() query: WhitelistListDto) {
      try {
        return this.whitelistService.getWhitelist(query);
      } catch (error) {
      // 使用responseService来返回错误响应
      return this.responseService.error('Failed, ' + error.message);
    }
  }

  @Post('/import')
  async import(@Body() dto: WhitelistImportDto) {
    try {
      await this.whitelistService.importWhitelist(dto.addr);
      return this.responseService.success(null, 'Whitelist imported successfully');
    } catch (error) {
      return this.responseService.error('Failed, ' + error.message);
    }
  }

  @Post('/query')
  async query(@Body() dto: WhitelistQueryDto) {
    try {
      return this.whitelistService.qeuryWhitelist(dto.root, dto.addr);
    } catch (error) {
      return this.responseService.error('Failed, ' + error.message);
    }
  }
}
