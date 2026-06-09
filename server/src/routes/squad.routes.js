import {Router} from "express"

import {verifyJWT} from "../middlewares/auth.middleware.js"

import { acceptRequest, createSquad, demoteAdmin, getMySquads, getPendingRequests, getSquadDetails, leaveSquad, promoteToAdmin, rejectRequest, removeMember, requestToJoinSquad } from "../controllers/squad.controller.js"

const router = Router()

router.post(
    "/create",
    verifyJWT,
    createSquad
)

router.get(
    "/my-squads",
    verifyJWT,
    getMySquads
)

router.post(
    "/join-request",
    verifyJWT,
    requestToJoinSquad
)

router.get(
    "/:squadId/requests",
    verifyJWT,
    getPendingRequests
)

router.patch(
    "/requests/:requestId/accept",
    verifyJWT,
    acceptRequest
)

router.patch(
    "/requests/:requestId/reject",
    verifyJWT,
    rejectRequest
)

router.get(
    "/:squadId",
    verifyJWT,
    getSquadDetails
)

router.delete(
    "/:squadId/members/:memberId",
    verifyJWT,
    removeMember
)

router.delete(
    "/:squadId/leave",
    verifyJWT,
    leaveSquad
)

router.patch(
    "/:squadId/promote/:memberId",
    verifyJWT,
    promoteToAdmin
)

router.patch(
    "/:squadId/demote/:memberId",
    verifyJWT,
    demoteAdmin
)



export default router;
