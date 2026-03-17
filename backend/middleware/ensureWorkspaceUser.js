import { and, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { workspaceUsers } from "../models/workspace.model.js";

const ensureWorkspaceUser = async (req, res, next) => {
    
    try {
        const [workspaceUser] = await db.select({ id: workspaceUsers.id,role:workspaceUsers.role , workspaceId: workspaceUsers.workspaceId}).from(workspaceUsers).where(eq(workspaceUsers.userId, req.user.id));

        if (!workspaceUser) {
            return res.status(401).send({ success: false, message: `Unauthorized Request` })
        }

        req.user.role = workspaceUser.role;
        req.user.workspaceId = workspaceUser.workspaceId;
        req.user.memberId = workspaceUser.id

        console.log(req.user)
        
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:"Internal Server Error"})
    }
}

export default ensureWorkspaceUser;