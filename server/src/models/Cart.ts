import mongoose from 'mongoose'
import {ICartItem, ICart} from '../../types/index.js'

const cartItemSchema = new mongoose.Schema<ICartItem>({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity : {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    size : {
        type: String
    },
    price: {
    type: Number,
    required: true,
    min: 0,
  },
})

const cartSchema = new mongoose.Schema<ICart>({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items : [cartItemSchema],
    totalAmount : {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})

cartSchema.methods.calculateTotal = function (this: ICart) {
  this.totalAmount = this.items.reduce(
    (total: number, item: ICartItem) => {
      return total + (item.price || 0) * item.quantity;
    },
    0
  );

  return this.totalAmount;
};

const Cart = mongoose.model<ICart>('Cart', cartSchema)

export default Cart;