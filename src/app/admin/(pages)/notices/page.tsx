"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Calendar, Pencil, Pin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNoticePage() {
  const router = useRouter();
  // get notice
  const [noticeList, setNoticeList] = useState<Record<string, any>[] | null>(
    null,
  );
  useEffect(() => {
    (async () => {
      try {
        await axios.get("/api/notice/get-list").then((res) => {
          const list = res.data.data;
          setNoticeList(list);
        });
      } catch (error) {}
    })();
  }, []);
  return (
    <div>
      <div className="mb-10">
        <h5 className="text-2xl font-bold">Manage Notices</h5>
        <p className="text-sm text-gray-600">Add, remove or edit notices</p>
      </div>
      <div className="space-y-6">
        <div>
          <Button
            variant="primary"
            onClick={() => router.push("/admin/notices/notice?tab=create")}
          >
            <Plus size={15} />
            Create new Notice
          </Button>
        </div>
        <div>
          <h5 className="text-xl mb-3">Events</h5>
          {noticeList?.length === 0 && <div>No notices found!</div>}
          {noticeList === null && <div>Loading...</div>}
          <div className="space-y-2">
            {noticeList?.map((notice, index) => (
              <div className="space-y-2" key={index}>
                <div className="p-2 bg-gray-200 rounded-xl flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl w-fit bg-blue-300">
                      <Calendar size={25} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xl">{notice?.title}</h5>
                      {notice?.isPinned && (
                        <Pin size={19} className="text-blue-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="success"
                      onClick={() =>
                        router.push(
                          `/admin/notices/notice?tab=edit&id=${notice?._id}`,
                        )
                      }
                    >
                      <Pencil size={15} />
                      Edit notice
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
