import { Controller, Post, Body } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';
import { WhitelistQueryDto } from './whitelist-query.dto';
import { WhitelistListDto } from './whitelist-query.dto';
import { WhitelistImportDto } from './whitelist-import.dto';
import { ResponseService } from './common/response.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';



@ApiTags('whitelist')
@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService,
              private readonly responseService: ResponseService,
             ) {}

  @Post('/querylist')
  @ApiOperation({ summary: 'query list' })
  getWhitelist(@Body() query: WhitelistListDto) {
      try {
        return this.whitelistService.getWhitelist(query);
      } catch (error) {
      // 使用responseService来返回错误响应
      return this.responseService.error(-10, 'Failed, ' + error.message);
    }
  }

  @Post('/import')
  @ApiOperation({ summary: 'addr list, full import' })
  async import(@Body() dto: WhitelistImportDto) {
    try {
      return this.whitelistService.importWhitelist(dto.addr);
      //return this.responseService.success(null, 'Whitelist imported successfully');
    } catch (error) {
      return this.responseService.error(-20, 'Failed, ' + error.message);
    }
  }

  @Post('/query')
  @ApiOperation({ summary: 'query whitelist' })
  async query(@Body() dto: WhitelistQueryDto) {
    try {
      return this.whitelistService.qeuryWhitelist(dto.root, dto.addr);
    } catch (error) {
      return this.responseService.error(-30, 'Failed, ' + error.message);
    }
  }
}
