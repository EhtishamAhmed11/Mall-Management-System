import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import validator from "validator";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  phone_number: { type: String, required: true },
  user_id: { type: Number, unique: true, sparse: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.pre('save',async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt)
})



UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword,this.password)
  return isMatch
}
// userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

const User = mongoose.model("User", UserSchema);

export default User;
