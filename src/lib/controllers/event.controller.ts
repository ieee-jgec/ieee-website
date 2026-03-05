import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "../utils/asynchandler";
import { MiddlewareContext } from "../../../types/middleware";
import { ApiError } from "../utils/error-handler";
import { Event } from "../models/event.model";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/coludinary-upload";
import { ApiResponse } from "../utils/response-handler";
import { formDataToJson } from "../utils/formdata-converter";

// create event
export const createEvent = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId, files } = context!;
    const formData = await req.formData();
    const {
      title,
      description,
      date,
      time,
      location,
      eventType,
      navLink,
      fee,
      deadline,
    } = formDataToJson(formData);

    if (!title || !description)
      throw new ApiError(400, "Title and description is required");

    // thumbnail handle
    let thumbnailUrl = "";
    const thumbnail = files?.thumbnail;
    if (thumbnail && thumbnail instanceof File) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      thumbnailUrl = (await uploadToCloudinary(buffer, thumbnail.name)).url;
    }

    const event = await Event.create({
      title,
      description,
      thumbnail: thumbnailUrl || "",
      date,
      time,
      location,
      eventType,
      navLink,
      fee,
      deadline,
    });

    return NextResponse.json(
      new ApiResponse(200, { eventId: event?._id }, "Event created"),
    );
  },
);

// fetch the event
export const getEvent = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");

    if (!eventId) throw new ApiError(400, "Event id is required");

    const event = await Event.findById(eventId);

    return NextResponse.json(new ApiResponse(200, event, "Event fetched"));
  },
);

// update event
export const updateEvent = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId, files } = context!;
    const formData = await req.formData();
    const {
      eventId,
      title,
      description,
      date,
      time,
      location,
      eventType,
      navLink,
      fee,
      deadline,
    } = formDataToJson(formData);

    if (!title || !description || !eventId)
      throw new ApiError(400, "Title and description is required");

    // thumbnail handle
    let thumbnailUrl = "";
    const thumbnail = files?.thumbnail;
    if (thumbnail && thumbnail instanceof File) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      thumbnailUrl = (await uploadToCloudinary(buffer, thumbnail.name)).url;
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        date,
        time,
        location,
        eventType,
        navLink,
        fee,
        deadline,
      },
      { new: true },
    );

    // update thumbnail
    if (thumbnailUrl && thumbnailUrl !== "") {
      // delete the previous on if exist
      if (event.thumbnail) {
        deleteFromCloudinary(event.thumbnail);
      }
      event.thumbnail = thumbnailUrl;
      await event.save();
    }

    await event.save();

    return NextResponse.json(
      new ApiResponse(200, { eventId: event?._id }, "Event updated"),
    );
  },
);

// remove the event
export const deleteEvent = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");

    if (!eventId) throw new ApiError(400, "Event id is required");

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(new ApiResponse(200, {}, "Event removed"));
  },
);

// fetch all events
export const getAllEvents = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(new ApiResponse(200, events, "Events fetched"));
  },
);
