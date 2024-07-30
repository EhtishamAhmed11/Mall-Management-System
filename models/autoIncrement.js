import mongoose from 'mongoose';

const AutoIncrement = (schema, options) => {
  schema.pre('save', async function (next) {
    try {
      const counter = await mongoose.model('Counter').findByIdAndUpdate(
        { _id: options.inc_field },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this[options.inc_field] = counter.seq;
      next();
    } catch (error) {
      next(error);
    }
  });
};

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

mongoose.model('Counter', CounterSchema);

export default AutoIncrement;
