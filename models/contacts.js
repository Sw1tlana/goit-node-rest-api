import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },  
  });

export default mongoose.model("Contact", contactsSchema);