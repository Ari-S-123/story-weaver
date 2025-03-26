"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";

export default function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/story/liveblocks-auth">
      <RoomProvider id={params.storyId as string}>
        <ClientSideSuspense fallback={<Loading variant="embedded" text="Loading story..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
