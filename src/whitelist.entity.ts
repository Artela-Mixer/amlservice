import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_whitelist')
export class WhitelistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  addr: string;

  @Column({ length: 64 })
  root: string;

  @Column()
  status: number;

  @Column({ type: 'datetime' })
  create_time: Date;

  @Column({ type: 'datetime' })
  modify_time: Date;
}
