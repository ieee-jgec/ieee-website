import { withDbAndCors } from "@/lib/utils/withDbAndCors";
import { NextRequest } from "next/server";
import { runMiddlewares } from "@/lib/utils/middlewareControll";
import { verifyAuth } from "@/lib/middlewares/auth.middleware";
import { verifyRole } from "@/lib/middlewares/verifyRole.middleware";
import { fileHandle } from "@/lib/middlewares/fileHandle.middleware";
import { getNoticeById } from "@/lib/controllers/notice.controller";

export const GET = withDbAndCors(async (req: NextRequest) => {
  const context = await runMiddlewares(req, [
    verifyAuth,
    (r, c) => verifyRole(r, c, ["admin", "member"]),
    fileHandle,
  ]);
  return await getNoticeById(req, context);
});
