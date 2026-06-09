import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";

import { Squad } from "../models/Squad.model.js";
import { SquadRequest } from "../models/SquadRequest.model.js";

const createSquad = asyncHandler( async(req,res) => {
    const {name,isPrivate} =req.body;

    if(!name?.trim()) {
        throw new ApiError(
            400,
            "Squad name is required"
        )
    }

    const existedSquad = await Squad.findOne({
        name,
    });

    if(existedSquad) {
        throw new ApiError(
            409,
            "Squad already exists",
        )
    }

    const joinCode = Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();

    const squad = await Squad.create({
        name,

        createdBy:req.user._id,
        admins: [req.user._id],
        members: [
            {
                user:req.user._id,
            }
        ],

        joinCode,

        isPrivate:
            isPrivate === undefined? true :isPrivate,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            squad,
            "Squad created successfully"
        )
    )
});

const getMySquads = asyncHandler( async(req,res) => {
    
    const squads = await Squad.find({
        "members.user":req.user._id,
    }).populate("createdBy","username")
    .populate("admins","username")

    return res.status(200).json(
        new ApiResponse(
            200,
            squads,
            "Squads fetched successfully"
        )
    )
} )

const requestToJoinSquad = asyncHandler(
    async(req,res) => {

        const {squadId} =req.body;

        const squad = await Squad.findById(
            squadId
        );

        if(!squad) {
            throw new ApiError(
                404,
                "Squad not found"
            )
        }

        const alreadyMember = squad.members.some(
            member => member.user.toString() === req.user._id.toString()
        );

        if(alreadyMember) {
            throw new ApiError(404,"Already a squad member")
        }

        const existingRequest = await SquadRequest.findOne({
            squad:squadId,
            user:req.user._id,
            status:"pending",
        })

        if(existingRequest) {
            throw new ApiError(
                400,
                "Request already pending"
            )
        }

        const request = await SquadRequest.create({
            squad:squadId,
            user:req.user._id,
        })

        return res.status(201).json(
            new ApiResponse(
                201,
                request,
                "Request sent successfully"
            )
        )

    }
)

const getPendingRequests = asyncHandler( async(req,res) => {

    const squad = await Squad.findById(
        req.params.squadId
    );

    if(!squad) {
        throw new ApiError(
            404,
            "Squad not found"
        )
    }

    const isAdmin = squad.createdBy.toString() === req.user._id.toString() || squad.admins.some(
        admin=> admin.toString() === req.user._id.toString()
    )

    if(!isAdmin) {
        throw new ApiError(
            403,
            "Not Authorized"
        )
    }

    const requests = await SquadRequest.find({
        squad:squad._id,
        status:"pending"
    })
    .populate(
        "user",
        "username email"
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            requests,
            "Pending requests fetched successfully"
        )
    )

})

const acceptRequest = asyncHandler(async(req,res)=>{
    const {requestId}=req.params

    const request= await SquadRequest.findById(requestId)

    if(!request) {
        throw new ApiError(404,"Request not Found");
    }

    const squad = await Squad.findById(request.squad);

    if(!squad) {
        throw new ApiError(404,"Squad not found")
    }

    const isAdmin = squad.createdBy.toString() === req.user._id.toString() || squad.admins.some(
        admin => admin.toString() === req.user._id.toString()
    )

    if(!isAdmin) {
        throw new ApiError(
            403,
            "Not authorized"
        )
    }

    const alreadyMember = squad.members.some(
        member => member.user.toString() === request.user.toString()
    )

    if(alreadyMember) {
        throw new ApiError(400,
            "User already a member"
        )
    }

    squad.members.push({
        user:request.user,
    })

    await squad.save();

    request.status="accepted"

    await request.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Request accepted successfully"
        )
    )

})

const rejectRequest = asyncHandler(async(req,res)=> {
    const {requestId}=req.params

    const request = await SquadRequest.findById(
        requestId
    )

    if(!request) {
        throw new ApiError(404,"Request not found!")
    }

    const squad = await Squad.findById(
        request.squad
    )

    if(!squad) {
        throw new ApiError(404, "Squad not found!");
    }

    const isAdmin = squad.createdBy.toString() === req.user._id || squad.admins.some(
        admin => admin.toString() === req.user._id.toString()
    )

    if(!isAdmin) {
        throw new ApiError(
            403,
            "Not authorized"
        )
    }

    request.status="rejected"

    await request.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Request rejected successfully"
        )
    );




})

const getSquadDetails = asyncHandler( async(req,res) => {
    const {squadId} = req.params

    const squad = await Squad.findById(squadId)
        .populate("createdBy","username")
        .populate("admins","username")
        .populate("members.user","username");

    if(!squad) {
        throw new ApiError(
            404,
            "Squad not found"
        )
    }

    const isMember = squad.members.some(

        member => member.user._id.toString() === req.user._id.toString()

    );

    if(!isMember) {
        throw new ApiError(
            403,
            "You are not a member of this squad"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            squad,
            "Squad details fetched successfully"
        )
    )

})

const removeMember = asyncHandler( async(req,res)=> {


    const {squadId,memberId} =req.params

    const targetId = memberId.toString();

    const squad = await Squad.findById(squadId);

    if(!squad) {
        throw new ApiError(
            404,
            "Squad not found"
        )
    }

    const isCreator = squad.createdBy.toString() === req.user._id.toString()

    const isAdmin = squad.admins.some(
        admin => admin.toString() === req.user._id.toString()
    )

    if(!isCreator && !isAdmin) {
        throw new ApiError(
            403,
            "Not authorized"
        )
    }

    
    const targetMember = squad.members.find(
        (member) => member.user.toString() === targetId,
    );
    
    if (!targetMember) {
        throw new ApiError(404, "Member not found in squad");
    }
    
    if(
        squad.createdBy.toString() === memberId
    ) {
        throw new ApiError(
            400,
            "creator cannot be removed"
        )
    }

    const targetIsAdmin = squad.admins.some(
        admin => admin.toString() === memberId
    )

    if(targetIsAdmin && !isCreator) {
        throw new ApiError(
            403,
            "Only creator can remove admins"
        )
    }

    if (targetId === req.user._id.toString()) {
        throw new ApiError(
            400,
            "Use leave squad instead"
        );
    }


    squad.admins = squad.admins.filter(
      (admin) => admin.toString() !== targetId,
    );

    squad.members = squad.members.filter(
        member => member.user.toString() !== memberId
    )

    await squad.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Member removed successfully"
        )
    );


}
)

const leaveSquad = asyncHandler(
    async(req,res)=> {
        const {squadId} =req.params

        const squad = await Squad.findById(
            squadId
        );

        if(!squadId) {
            throw new ApiError(
                404,
                "Squad not found"
            )
        }

        const userId = req.user._id.toString()

        if(squad.createdBy.toString() === userId) {
            throw new ApiError(
                400,
                "Creator cannot leave squad"
            )
        }

        const isMember = squad.members.some(
            member => member.user.toString() === userId
        )

        if(!isMember) {
            throw new ApiError(
                400,
                "You are not a member of this squad"
            )
        }

        squad.members=squad.members.filter(
            member => member.user.toString()!== userId
        )

        squad.admins=squad.admins.filter(
            admin => admin.user.toString()!== userId
        )

        await squad.save()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Left squad successfully"
            )
        );

    }
)

const promoteToAdmin = asyncHandler( async(req,res)=> {
    const {squadId,memberId} = req.params

    const squad = await Squad.findById(
        squadId
    )

    if(!squad) {
        throw new ApiError(
            404,
            "Squad not found"
        )
    }

    if(squad.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Only creator can promote admins"
        )
    }

    const isMember = squad.members.some(
        member=> member.user.toString() === memberId
    )

    if(!isMember) {
        throw new ApiError(
            404,
            "Member not found"
        )
    }

    const alreadyAdmin = squad.admins.some(
        admin => admin.toString() === memberId
    )

    if(alreadyAdmin) {
        throw new ApiError(
            400,
            "User is already an admin"
        )
    }

    squad.admins.push(memberId)

    await squad.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Admin promoted successfully"
        )
    )

})

const demoteAdmin = asyncHandler( async(req,res)=> {
    const {squadId,memberId} = req.params

    const squad = await Squad.findById(
        squadId
    )

    if(!squad) {
        throw new ApiError(
            404,
            "Squad not found"
        )
    }

    if(squad.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Only creator can demote admins"
        )
    }

    if (squad.createdBy.toString() === adminId) {
        throw new ApiError(
            400,
            "Creator cannot be demoted"
        );
    }

    const isMember = squad.members.some(
        member=> member.user.toString() === memberId
    )

    if(!isMember) {
        throw new ApiError(
            404,
            "Member not found"
        )
    }

    const isAdmin = squad.admins.some(
        admin => admin.toString() === memberId
    )

    if(!isAdmin) {
        throw new ApiError(
            404,
            "Admin not found"
        )
    }

    squad.admins = squad.admins.filter((admin) => admin.toString() !== adminId);


    await squad.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Admin promoted successfully"
        )
    )

})

export {
    createSquad,
    getMySquads,
    requestToJoinSquad,
    getPendingRequests,
    acceptRequest,
    rejectRequest,
    removeMember,
    getSquadDetails,
    leaveSquad,
    promoteToAdmin,
    demoteAdmin
}