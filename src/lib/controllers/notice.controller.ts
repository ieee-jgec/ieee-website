import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "../utils/asynchandler";
import { MiddlewareContext } from "../../../types/middleware";
import { ApiError } from "../utils/error-handler";
import { ApiResponse } from "../utils/response-handler";
import { Notice } from "../models/notice.model";
import { formDataToJson } from "../utils/formdata-converter";
import { uploadToCloudinary } from "../utils/coludinary-upload";

export const createNotice = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { files } = context!;
    const formData = await req.formData();

    const { title, description, isPinned, pdfTitle } = formDataToJson(formData);

    if (!title) {
      throw new ApiError(400, "Title is required");
    }

    let pdfPath = "";
    const noticePdf = files?.noticePdf;
    if (noticePdf && noticePdf instanceof File) {
      const buffer = Buffer.from(await noticePdf.arrayBuffer());
      pdfPath = (await uploadToCloudinary(buffer, noticePdf.name)).url;
    }

    const notice = await Notice.create({
      title,
      description,
      isPinned,
      pdfUrl: pdfPath,
      pdfTitle,
    });

    return NextResponse.json(
      new ApiResponse(200, notice, "Notice created successfully"),
    );
  },
);

export const updateNotice = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { files } = context!;
    const formData = await req.formData();

    const { title, description, isPinned, pdfTitle } = formDataToJson(formData);

    if (!id) {
      throw new ApiError(400, "Notice ID is required");
    }

    let pdfPath = "";
    const noticePdf = files?.noticePdf;
    if (noticePdf && noticePdf instanceof File) {
      const buffer = Buffer.from(await noticePdf.arrayBuffer());
      pdfPath = (await uploadToCloudinary(buffer, noticePdf.name)).url;
    }

    const notice = await Notice.findByIdAndUpdate(
      id,
      { title, description, isPinned, pdfTitle },
      { new: true },
    );

    if (!notice) {
      throw new ApiError(404, "Notice not found");
    }

    if (pdfPath && pdfPath !== "") {
      notice.pdfUrl = pdfPath;
      await notice.save();
    }

    return NextResponse.json(
      new ApiResponse(200, notice, "Notice updated successfully"),
    );
  },
);

export const deleteNotice = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new ApiError(400, "Notice ID is required");
    }

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      throw new ApiError(404, "Notice not found");
    }

    return NextResponse.json(
      new ApiResponse(200, {}, "Notice deleted successfully"),
    );
  },
);

export const getNotices = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // 'pinned', 'unpinned', or null for all

    let query: Record<string, boolean> = {};

    if (filter === "pinned") {
      query.isPinned = true;
    } else if (filter === "unpinned") {
      query.isPinned = false;
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      new ApiResponse(200, notices, "Notices fetched successfully"),
    );
  },
);

export const getNoticeById = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new ApiError(400, "Notice ID is required");
    }

    const notice = await Notice.findById(id);

    if (!notice) {
      throw new ApiError(404, "Notice not found");
    }

    return NextResponse.json(
      new ApiResponse(200, notice, "Notice fetched successfully"),
    );
  },
);
