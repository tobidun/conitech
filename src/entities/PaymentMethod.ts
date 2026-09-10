import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { User } from "./User";

@Entity("PaymentMethod")
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne("User", (user: any) => user.paymentMethods, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column()
  cardNumber!: string;

  @Column()
  expMonth!: string;

  @Column()
  expYear!: string;

  @Column()
  cvv!: string;

  @Column({ nullable: true })
  pin?: string;

  @Column({ nullable: true })
  cardLast4?: string;

  @Column({ nullable: true })
  cardBrand?: string;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
