import React, { createContext, useContext } from "react";
import { Call } from "@stream-io/video-react-sdk";

const CallContext = createContext<Call | null>(null);

export const CallProvider = ({
  call,
  children,
}: {
  call: Call;
  children: React.ReactNode;
}) => <CallContext.Provider value={call}>{children}</CallContext.Provider>;

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  return context;
};
