import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({

    visitorName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    personToMeet:{
        type:String,
        required:true
    },

    purpose:{
        type:String,
        required:true
    },

    checkInTime:{
        type:Date,
        default:Date.now
    },

    checkOutTime:{
        type:Date
    },

    isCheckedOut:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

export default mongoose.model("Visitor",visitorSchema);