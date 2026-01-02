import { Schema } from "mongoose";

const VerificationSchema = new Schema({
  useremail: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Prevents duplicate emails
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  userrole: {
    type: String,
    required: true,
    enum: ["user", "admin", "editor"], // Restricts roles to these specific values
    default: "user",
  },
}, { 
  timestamps: true 
});

// Export the schema instead of the model
export default VerificationSchema;