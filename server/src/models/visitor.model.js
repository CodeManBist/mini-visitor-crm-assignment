import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, "Visitor name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    personToMeet: {
      type: String,
      required: [true, "Person to meet is required"],
      trim: true,
    },

    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
    },

    checkInTime: {
      type: Date,
      default: Date.now,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    isCheckedOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Visitor", visitorSchema);