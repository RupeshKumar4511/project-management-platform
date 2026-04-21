import { uuid, integer, pgTable, text, timestamp,index } from 'drizzle-orm/pg-core'
import { users } from './user.model.js'

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    amount: integer("amount").notNull(),
    razorpay_order_id: text("razorpay_order_id").notNull(),
    razorpay_payment_id: text("razorpay_payment_id"),
    razorpay_signaure: text("razorpay_signature"),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),

}, (orderModel) => [
    index('order_user_idx').on(orderModel.userId)
])