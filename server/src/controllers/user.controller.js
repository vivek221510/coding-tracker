import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js"


const generateAccessAndRefreshTokens = async(userId) => {
    const user= await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken=refreshToken

    await user.save({
        validateBeforeSave:false
    })

    return {
        accessToken,
        refreshToken
    };
}

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

const loginUser = asyncHandler( async(req,res) => {
    const {email,username,password} = req.body;

    if(!(email || username)) {
        throw new ApiError(
            400,
            "Username or email is required"
        )
    }

    const user= await User.findOne({
        $or: [{username},{email}]
    });

    if(!user) {
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordValid= await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401,"Invalid credentials");
    }

    const { accessToken,refreshToken }= await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in succesfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getCurrentUser = asyncHandler(
    async(req,res)=> {
        return res.status(200).json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
    }
);

export { 
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};