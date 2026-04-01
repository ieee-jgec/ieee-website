"use client";

import { Button } from "@/components/ui/button";
import { formatDateStr } from "@/lib/utils/formatDate";
import axios from "axios";
import clsx from "clsx";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useGetMessagesQuery } from "../../features/message/messageApi";

const notificationOptions = [
  {
    label: "All",
    key: "all",
  },
  {
    label: "Not viewed",
    key: "not-viewed",
  },
  {
    label: "Viewed",
    key: "viewed",
  },
  {
    label: "Replied",
    key: "replied",
  },
];

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState("all");
  // get messages based on filter
  const { isFetching, data } = useGetMessagesQuery(filter, {
    refetchOnMountOrArgChange: false,
  });
  const messageList = data?.data ?? [];

  return (
    <div>
      <div className="mb-10">
        <h5 className="text-2xl font-bold">Manage Messages</h5>
        <p className="text-sm text-gray-600">
          Checkout all messages and queries
        </p>
      </div>
      <div>
        <ul className="flex items-center gap-2 mb-5">
          {notificationOptions.map((item) => (
            <li
              key={item.key}
              className={clsx(
                "py-1 px-2 bg-gray-400/30 rounded-lg cursor-pointer",
                filter === item.key && "!bg-blue-400/70",
              )}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className="space-y-3">
          {isFetching && <p>Loading messages...</p>}
          {!isFetching && messageList?.length === 0 && (
            <p>No messages found!</p>
          )}
          {!isFetching &&
            messageList?.map((message: any, index: number) => (
              <MessageComponent key={index} message={message} />
            ))}
        </div>
      </div>
    </div>
  );
}

const MessageComponent = ({ message }: { message: Record<string, any> }) => {
  const [mark, setMark] = useState({
    isViewed: message?.isViewed,
    isReplied: message?.isReplied,
  });

  const handleMark = async (newMark: typeof mark) => {
    try {
      await axios
        .patch("/api/message/mark", { messageId: message?._id, ...newMark })
        .then(() => {
          setMark(newMark);
          toast.success("Message marked");
        });
    } catch (error) {}
  };
  return (
    <div
      className={clsx(
        "bg-blue-200 p-3 rounded-xl",
        mark.isViewed && "bg-gray-300",
      )}
    >
      <div className="p-2 bg-blue-300/40 rounded-xl mb-4">
        <h5 className="mb-4">Sender details</h5>
        <div>
          <div>
            <strong>Name: </strong>
            <span>
              {message?.firstName} {message?.lastName}
            </span>
          </div>
          <div>
            <strong>Email: </strong>
            <span>{message?.email}</span>
          </div>
          <div>
            <strong>Date: </strong>
            <span>
              {formatDateStr(message?.createdAt).dateStr} at{" "}
              {formatDateStr(message?.createdAt).timeStr}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg mb-4">
          <strong>Subject: </strong>
          <span>{message?.subject}</span>
        </h3>
        <pre className="whitespace-pre-wrap font-normal">
          {message?.message}
        </pre>
      </div>
      {mark.isReplied && (
        <div className="mt-3">
          <p className="text-green-600">Replied</p>
        </div>
      )}
      <div className="flex items-center gap-2 mt-6">
        {!mark.isViewed && (
          <Button
            variant="outline"
            className="border-1 bg-white"
            onClick={() => handleMark({ ...mark, isViewed: true })}
          >
            Mark as viewed
          </Button>
        )}
        {!mark.isReplied && (
          <Button
            variant="outline"
            className="border-1 bg-white"
            onClick={() => handleMark({ ...mark, isReplied: true })}
          >
            Mark as Replied
          </Button>
        )}
      </div>
    </div>
  );
};
