import { withDbAndCors } from "@/lib/utils/withDbAndCors";
import { NextRequest } from "next/server";
import { getNotices } from "@/lib/controllers/notice.controller";

export const GET = withDbAndCors(async (req: NextRequest) => {
  return await getNotices(req);
});
