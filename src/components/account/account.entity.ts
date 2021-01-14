import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../../common/configs/env.conf';
import { BaseEntity } from '../../core/base-entity';

@Entity()
export class Account extends BaseEntity {

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

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

  public async setPassword(value: string) {
    this.hashedPassword = await bcrypt.hashSync(value, 10);
  }

  public checkPassword(rawPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, this.hashedPassword);
  }

  public toJWT(): string {
    return jwt.sign({
      id: this.id,
      email: this.email,
      roles: this.roles
    }, JWT_SIGNATURE);
  }

}