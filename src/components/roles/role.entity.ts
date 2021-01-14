import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base-entity';
import { Account } from '../account/account.entity';
import { SUPPORTED_ROLES } from './role.constants';

@Entity()
export class Role extends BaseEntity {

    @Column()
    name: SUPPORTED_ROLES;

    @ManyToOne(() => Account, {
        nullable: true
    })
    @JoinColumn()
    createdBy: Account;

    @ManyToOne(() => Account, {
        nullable: true
    })
    @JoinColumn()
    updatedBy: Account;

}
