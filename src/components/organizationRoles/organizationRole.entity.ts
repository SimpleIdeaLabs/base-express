import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base-entity';
import { Account } from '../account/account.entity';
import { ORGANIZATION_ROLES } from './organizationRole.constants';

@Entity()
export class OrganizationRole extends BaseEntity {

  @Column()
  name: ORGANIZATION_ROLES;

  @Column({ nullable: true })
  createdById: number;

  @ManyToOne(() => Account, {
    nullable: true
  })
  @JoinColumn()
  createdBy: Account;

  @Column({ nullable: true })
  updatedById: number;

  @ManyToOne(() => Account, {
    nullable: true
  })
  @JoinColumn()
  updatedBy: Account;

}