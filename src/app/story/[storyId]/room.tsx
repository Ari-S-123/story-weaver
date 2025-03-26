"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";

export default function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  return (
    <LiveblocksProvider publicApiKey={"pk_dev_dFMZ8gS9ym3-VaVvvqZrAY6qtN2sO24pZo5sUvwJJB67ZRhk0er43-M8-hOJ-MnS"}>
      <RoomProvider id={params.storyId as string}>
        <ClientSideSuspense fallback={<Loading variant="embedded" text="Loading story..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
