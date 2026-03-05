"use client";

import { Calendar, Download, Pin } from "lucide-react";
import { Card } from "./card";
import { formatDateStr } from "@/lib/utils/formatDate";
import clsx from "clsx";

export const NoticeCard = ({ notice }: { notice: Record<string, any> }) => {
  const isPinned = notice?.isPinned;

  if (!notice) return;
  return (
    <Card
      className={clsx(
        "!max-w-full p-6 !border-l-3",
        isPinned && "!border-l-blue-400",
      )}
    >
      <div>
        <div className="flex items-start gap-3">
          <h3 className="text-xl font-semibold text-gray-700">
            {notice?.title}
          </h3>
          {isPinned && <Pin className="text-blue-500" size={20} />}
        </div>

        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
          <Calendar size={15} /> {formatDateStr(notice.createdAt)?.dateStr}
        </p>
        <pre className="mt-3 text-[0.9em] text-gray-700 line-clamp-10 whitespace-pre-wrap font-sans">
          {notice?.description}
        </pre>
        {notice?.pdfUrl && (
          <a
            href={notice.pdfUrl}
            target="_blank"
            className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium rounded-xl p-2 border border-blue-500"
          >
            <span>
              <Download size={15} />
            </span>
            {notice?.pdfTitle || "Download notice"}
          </a>
        )}
      </div>
    </Card>
  );
};
