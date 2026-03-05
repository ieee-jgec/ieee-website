"use client";

import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext<any | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [teamStore, setTeamStore] = useState<Record<string, any> | null>(null);
  const [alumniStore, setAlumniStore] = useState<Record<string, any> | null>(
    null,
  );
  const [eventStore, setEventStore] = useState<Record<string, any> | null>(
    null,
  );

  const [noticeStore, setNoticeStore] = useState<Record<string, any> | null>(
    null,
  );

  return (
    <StoreContext.Provider
      value={{
        teamStore,
        setTeamStore,
        alumniStore,
        setAlumniStore,
        eventStore,
        setEventStore,
        noticeStore,
        setNoticeStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const {
    teamStore,
    setTeamStore,
    alumniStore,
    setAlumniStore,
    eventStore,
    setEventStore,
    noticeStore,
    setNoticeStore,
  } = useContext(StoreContext);
  return {
    teamStore,
    setTeamStore,
    alumniStore,
    setAlumniStore,
    eventStore,
    setEventStore,
    noticeStore,
    setNoticeStore,
  };
};

export default StoreContext;
