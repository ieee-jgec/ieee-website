"use client";

import { useGetEventsQuery } from "./features/event/eventApi";
import { useGetMessagesQuery } from "./features/message/messageApi";
import { useGetTeamQuery } from "./features/team/teamApi";

export default function AdminClientWrapper() {
    useGetEventsQuery();
    useGetTeamQuery();
    useGetMessagesQuery('all');

    return null;
}