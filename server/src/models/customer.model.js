import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    phone:{
        type:String,
        required:true
    },

    company:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Customer",customerSchema);