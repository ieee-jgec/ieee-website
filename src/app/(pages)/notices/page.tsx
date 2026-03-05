"use client";

import { NoticeCard } from "@/components/ui/NoticeCard";
import { SlideUpAnimation } from "@/components/ui/sectionAnimation";
import { useStore } from "@/context/storeContext";
import axios from "axios";
import { Pin, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";

export default function NoticePage() {
  const [noticeData, setNoticeData] = useState<Record<string, any> | null>(
    null,
  );

  const { noticeStore, setNoticeStore } = useStore();
  // load data from store first
  useEffect(() => {
    if (noticeStore) {
      setNoticeData(noticeStore);
    }
  }, [noticeStore]);

  useEffect(() => {
    (async () => {
      try {
        await axios.get("/api/notice/get-list?filter=pinned").then((res) => {
          const data = res.data.data;
          if (data) {
            setTimeout(() => {
              setNoticeStore((p: any) => ({
                ...(p || {}),
                pinnedNotices: data,
              }));
            }, 1000);
          }
        });
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await axios.get("/api/notice/get-list?filter=unpinned").then((res) => {
          const data = res.data.data;
          if (data) {
            setTimeout(() => {
              setNoticeStore((p: any) => ({
                ...(p || {}),
                unPinnedNotices: data,
              }));
            }, 1000);
          }
        });
      } catch (error) {}
    })();
  }, []);

  return (
    <div>
      <div className="page-title-box mb-8 !py-17">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          Latest Notices
        </h1>
        <p className="text-gray-300 text-lg text-center max-sm:text-sm">
          Stay updated with important announcements, events, and news from IEEE.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-12 px-4">
        {noticeData?.pinnedNotices?.length ? (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6 text-gray-700">
              <Pin className="text-blue-500" />
              <h2 className="text-2xl">Pinned Notices</h2>
            </div>
            <div className="space-y-3">
              {noticeData.pinnedNotices?.map((notice: any, index: number) => (
                <SlideUpAnimation
                  delay={(index * 1.5) / 10}
                  key={index}
                  className="w-full"
                >
                  <NoticeCard notice={notice} />
                </SlideUpAnimation>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        {noticeData?.unPinnedNotices?.length ? (
          <div>
            <div className="flex items-center gap-4 mb-6 text-gray-700">
              <ScrollText className="text-green-600" />
              <h2 className="text-2xl">Other Notices</h2>
            </div>
            <div className="space-y-3">
              {noticeData.unPinnedNotices?.map((notice: any, index: number) => (
                <SlideUpAnimation
                  delay={(index * 1.5) / 10}
                  key={index}
                  className="w-full"
                >
                  <NoticeCard notice={notice} />
                </SlideUpAnimation>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
