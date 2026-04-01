"use client";

import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from "@/app/admin/features/event/eventApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textArea";
import { objectToFormData } from "@/lib/utils/formdata-converter";
import { ImagePlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EventAddPage() {
  const router = useRouter();
  // handle tabs
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const eventId = searchParams.get("id");

  // handle inputs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    eventType: "",
    location: "",
    thumbnail: "",
    navLink: "",
    fee: "",
    deadline: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [createEvent, { isLoading: isCreatingEvent }] =
    useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  // Handle form changes
  const handleChange = (e: string, field: string) => {
    setFormData({
      ...formData,
      [field]: e,
    });
  };

  const { isFetching, data } = useGetEventByIdQuery(eventId, {
    refetchOnMountOrArgChange: false,
  });
  const eventData = data?.data;

  useEffect(() => {
    if (!eventId || tab != "edit") return;
    if (eventData) setFormData(eventData);
    setPreviewUrl(eventData?.thumbnail);
  }, [eventId, tab, eventData]);

  // handle preview image
  useEffect(() => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [file]);

  // create new event
  const handleCreateNewEvent = async () => {
    try {
      const data = {
        ...formData,
        thumbnail: file || formData.thumbnail,
      };
      const payLoads = objectToFormData(data);

      await createEvent(payLoads)
        .unwrap()
        .then(() => {
          toast.success("Event created successfully");
          router.push("/admin/events");
        });
    } catch (error: any) {
      console.log("RTK Error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // edit event
  const handleEditEvent = async () => {
    try {
      const data = {
        eventId,
        ...formData,
        thumbnail: file || formData.thumbnail,
      };
      const payLoads = objectToFormData(data);

      await updateEvent(payLoads)
        .unwrap()
        .then(() => {
          toast.success("Event updated successfully");
        });
    } catch (error: any) {
      console.log("RTK Error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // handle button click
  const handleButtonClick = async () => {
    if (tab === "create") await handleCreateNewEvent();
    else if (tab === "edit" && eventId) await handleEditEvent();
  };

  // delete event
  const handleDeleteEvent = async () => {
    try {
      if (!eventId) return;
      await deleteEvent(eventId)
        .unwrap()
        .then(() => {
          toast.success("Event removed successfully");
          router.push(`/admin/events`);
        });
    } catch (error: any) {
      console.log("RTK Error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Suspense fallback={null}>
      <div>
        <div className="mb-10">
          <h5 className="text-2xl font-bold">
            {tab === "create" ? "Add new Event" : "Edit Event"}
          </h5>
        </div>
        <div className="mb-10">
          <h5 className="mb-6">Event details</h5>
          <div className="space-y-2">
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="event-title">Event title</label>
              </div>
              <Input
                placeholder="Title"
                id="event-title"
                value={formData.title}
                onChange={(e) => handleChange(e, "title")}
                disabled={isCreatingEvent}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="event-description">Event description</label>
              </div>
              <TextArea
                placeholder="Description"
                id="event-description"
                value={formData.description}
                onChange={(e) => handleChange(e, "description")}
                disabled={isCreatingEvent}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="event-date">Date</label>
                </div>
                <Input
                  type="date"
                  id="event-date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => handleChange(e, "date")}
                  disabled={isCreatingEvent}
                />
              </div>
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="event-time">Time</label>
                </div>
                <Input
                  type="time"
                  id="event-time"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) => handleChange(e, "time")}
                  disabled={isCreatingEvent}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="location">Location</label>
              </div>
              <Input
                placeholder="Location"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange(e, "location")}
                disabled={isCreatingEvent}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="event-type">Event type</label>
              </div>
              <Input
                placeholder="Event type"
                id="event-type"
                value={formData.eventType}
                onChange={(e) => handleChange(e, "eventType")}
                disabled={isCreatingEvent}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="reg-link">Registration link</label>
              </div>
              <Input
                placeholder="Enter registration link"
                id="reg-link"
                value={formData.navLink}
                onChange={(e) => handleChange(e, "navLink")}
                disabled={isCreatingEvent}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="event-fee">Fee</label>
                </div>
                <Input
                  type="number"
                  id="event-fee"
                  className="form-control"
                  value={formData.fee}
                  onChange={(e) => handleChange(e, "fee")}
                  disabled={isCreatingEvent}
                  placeholder="Enter event fee"
                />
              </div>
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="event-deadline">Registration deadline</label>
                </div>
                <Input
                  type="date"
                  id="event-deadline"
                  className="form-control"
                  value={formData.deadline}
                  onChange={(e) => handleChange(e, "deadline")}
                  disabled={isCreatingEvent}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="event-image" className="cursor-pointer">
                <div className="mb-2 text-sm">Add Event image</div>
                <ImagePlus size={50} />
              </label>
              <input
                type="file"
                id="event-image"
                className="hidden"
                onChange={(e) => setFile(e.target.files![0])}
                disabled={isCreatingEvent}
              />
            </div>
            {previewUrl && (
              <div>
                <img src={previewUrl} alt="" className="w-[50%]" />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          {tab !== "create" && (
            <Button
              className="bg-red-400"
              disabled={isCreatingEvent}
              onClick={handleDeleteEvent}
            >
              Remove event
            </Button>
          )}
          <Button
            variant="success"
            onClick={handleButtonClick}
            disabled={isCreatingEvent}
          >
            {tab === "create"
              ? isCreatingEvent
                ? "Creating..."
                : "Create Event"
              : isCreatingEvent
                ? "Saving..."
                : "Save Event"}
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
