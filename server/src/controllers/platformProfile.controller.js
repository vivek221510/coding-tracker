import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { PlatformProfile } from "../models/PlatformProfile.model.js";



const linkProfile = asyncHandler(async(req,res)=> {

    const {
        leetcodeUsername,
        codeforcesHandle,
        codechefHandle
    } = req.body

    const profile = await PlatformProfile.findOneAndUpdate(
        {
            user:req.user._id
        },
        {
            user:req.user._id,
            leetcodeUsername,
            codeforcesHandle,
            codechefHandle
        },
        {
            new:true,
            upsert:true
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile linked successfully"
        )
    )
})

export { linkProfile };
