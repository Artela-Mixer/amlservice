import { ApiProperty } from '@nestjs/swagger';
export class WhitelistImportDto {
  @ApiProperty()
  addr: string[];
}
