import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
    {
        
        
            fullName:{
                  type:String,
            required:true,
            

            },
            password:{
                  type:String,
            required:true,
            minlength:6,
            },
            username: {
  type: String,
  required: true,
  unique: true,
  trim: true,
}
,
            profilePic:{
                type:String,
                default:""

            },
            location: {
      type: String,
      required: true, // or false if optional
      lowercase: true,
    },
    UniqueCode: {
      type: String,
      unique: true,
    },
    interests: {
      type: [String],
      default: [],


    },

},
    {timestamps:true}
);
const User=mongoose.model("User",userSchema);
export default User;