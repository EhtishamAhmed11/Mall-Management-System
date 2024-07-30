import mongoose from "mongoose";
import AutoIncrement from './autoIncrement.js';  

const ShopSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  floor: { 
    type: String, 
    required: true 
  },
  number: { 
    type: String, 
    required: true ,
    unique: true
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  shop_id: {
    type: Number,
    unique: true,
    sparse: true
  }
});

ShopSchema.plugin(AutoIncrement, { inc_field: 'shop_id' });

const Shop = mongoose.model('Shop', ShopSchema);

export default Shop;
