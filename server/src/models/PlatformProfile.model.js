import mongoose , {Schema} from "mongoose";

const platformProfileSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        leetcodeUsername: {
            type:String,
            trim:true
        },
        codeforcesHandle: {
            type:String,
            trim:true
        },
        codechefHandle: {
            type:String,
            trim:true
        }
    },
    {
    timestamps:true
    }
)

export const PlatformProfile = mongoose.model(
    "PlatformProfile",
    platformProfileSchema
)