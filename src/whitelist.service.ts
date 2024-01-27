import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistEntity } from './whitelist.entity'; // 假设你已经创建了一个 WhitelistEntity 的 Entity 定义
import { WhitelistQueryDto } from './whitelist-query.dto';
import { WhitelistListDto } from './whitelist-query.dto';
import { ResponseService } from './common/response.service';
import { Connection } from 'typeorm';
import { MerkleTree, PartialMerkleTree } from 'fixed-merkle-tree'
import { Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { IHttpResponse } from './common/http-response.interface';



@Injectable()
export class WhitelistService {
  private readonly logger = new Logger(WhitelistService.name);
  private readonly layer = 10; // Merkle Tree的Layer大小

  constructor(
    @InjectRepository(WhitelistEntity)
    private readonly whitelistRepository: Repository<WhitelistEntity>,
    private readonly responseService: ResponseService,
    private readonly connection: Connection,
  ) {}

  async getWhitelist(query: WhitelistListDto) {
    const { page = 1, limit = 20, addr } = query;
    const whereClause = { status: 1 }; // 默认状态为1

    if (addr) {
      whereClause['addr'] = addr;
    }

    const [result, total] = await this.whitelistRepository.findAndCount({
      where: whereClause,
      order: {
        id: 'ASC', // 通常，你可能想要根据创建时间等进行排序
      },
      take: limit,
      skip: limit * (page - 1),
    });
    const data = {
      data: result,
      page,
      limit,
      totalCount: total,
    };
    return this.responseService.success(data);
  }

  async importWhitelist(addrs: string[]): Promise<any> {
    return await this.connection.transaction(async manager => {
      // 排序 addr 列表
      const sortedAddrs = addrs.sort((a, b) => a.localeCompare(b));
      // 使用fixed-merkle-tree库生成Merkle Tree root
      const merkleTree = new MerkleTree(this.layer, sortedAddrs);
      const root = merkleTree.root as string;
      await manager.update(WhitelistEntity, {}, { status: 0 });

        const [result, total] = await this.whitelistRepository.findAndCount({
          where: {root: root},
          take: 1
        });
        if (total > 0) {
          await manager.update(WhitelistEntity, {root:root}, { status: 1 });
          this.logger.log(`root: ${root} already exist, update status to 1`);
          return this.responseService.success({root:root});
        }

      // 请确保你的orm实例可以直接插入addr数组，具体实现可能依赖于你使用的ORM。
      const whitelist = addrs.map(addr => {
        return manager.create(WhitelistEntity, {
          addr,
          root,
          status: 1,
        });
      });

      await manager.save(whitelist);
      return this.responseService.success({root:root});
    });
  }

  async qeuryWhitelist(root: string, addrToCheck: string) {
    // 使用root参数查询数据库
    const records = await this.whitelistRepository.find({
      where: { root: root },
    });

    if (!records.length) {
      return this.responseService.error(-31, `Records with root: ${root} not found.`);
    }

    // 检查是否存在特定的addr
    const addrExists = records.some(record => record.addr === addrToCheck);
    if (!addrExists) {
      return this.responseService.error(-32, `Records with addr: ${addrToCheck} not found.`);
    }

    // 提取所有的addr
    const addrs = records.map(record => record.addr);
    const sortedAddrs = addrs.sort((a, b) => a.localeCompare(b));
    const merkleTree = new MerkleTree(this.layer, sortedAddrs); // 32是Layer的大小
    const path = merkleTree.proof(addrToCheck);
    return this.responseService.success(path);
  }
}
