import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js"

const registerUser = asyncHandler( async(req, res) => {
    const {username,email,password} =req.body;

    if(!username && username?.trim()=="") {
        throw new ApiError(400,"username required!");
    }

    if(!email && email?.trim()=="") {
        throw new ApiError(400,"email required!");
    }
    if(!password && password?.trim()=="") {
        throw new ApiError(400,"password required!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, {email}]
    });

    if(existedUser) {
        throw new ApiError(
            409,
            "User with email or username already exists"
        );
    }

    const user = await User.create({
        username,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    )

})

export { registerUser };