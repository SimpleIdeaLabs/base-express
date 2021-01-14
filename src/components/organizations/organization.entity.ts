import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/base-entity';
import { Account } from '../account/account.entity';
import { OrganizationRole }  from '../organizationRoles/organizationRole.entity';

@Entity()
export default class Organization extends BaseEntity {

  @Column()
  name: string;

  @Column()
  logo: string;

  @ManyToMany(() => OrganizationRole)
  @JoinTable()
  roles: OrganizationRole[];

  @ManyToMany(() => Account, {
    cascade: ['insert', 'update', 'soft-remove']
  })
  @JoinTable()
  administrators: Account[];

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

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Organization, org => org.children, { nullable: true })
  parent: Organization;

  @OneToMany(() => Organization, children => children.parent)
  children: Organization[];

  @Column({ nullable: true })
  groupId: number;

  @ManyToOne(() => Organization, org => org.members, { nullable: true })
  group: Organization;

  @OneToMany(() => Organization, members => members.group)
  members: Organization[];

}