import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth0Id:{

    type: String,

    },
    name: { 
    type: String,
    
    },

  email: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  }

});
export default mongoose.model("User", userSchema);