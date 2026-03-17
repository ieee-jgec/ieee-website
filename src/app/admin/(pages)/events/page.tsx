"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Calendar, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetEventsQuery } from "../../features/event/eventApi";

export default function EventAdminPage() {
  const router = useRouter();
  // get events
  // const [eventList, setEventList] = useState<Record<string, any>[] | null>(
  //   null,
  // );
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await axios.get("/api/event/get-all").then((res) => {
  //         const list = res.data.data;
  //         setEventList(list);
  //       });
  //     } catch (error) {}
  //   })();
  // }, []);

  const { isFetching, data } = useGetEventsQuery()
  const eventList = data?.data ?? [];
  return (
    <div>
      <div className="mb-10">
        <h5 className="text-2xl font-bold">Manage Events</h5>
        <p className="text-sm text-gray-600">Add, remove or edit events</p>
      </div>
      <div className="space-y-6">
        <div>
          <Button
            variant="primary"
            onClick={() => router.push("/admin/events/event?tab=create")}
          >
            <Plus size={15} />
            Create new Event
          </Button>
        </div>
        <div>
          <h5 className="text-xl mb-3">Events</h5>
          {eventList?.length === 0 && <div>No events found!</div>}
          {eventList === null && <div>Loading...</div>}
          <div className="space-y-2">
            {eventList?.map((event: any, index: number) => (
              <div className="space-y-2" key={index}>
                <div className="p-2 bg-gray-200 rounded-xl flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl w-fit bg-blue-300">
                      <Calendar size={25} className="text-blue-500" />
                    </div>
                    <div>
                      <h5 className="text-xl">{event?.title}</h5>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="success"
                      onClick={() =>
                        router.push(
                          `/admin/events/event?tab=edit&id=${event?._id}`,
                        )
                      }
                    >
                      <Pencil size={15} />
                      Edit event
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
