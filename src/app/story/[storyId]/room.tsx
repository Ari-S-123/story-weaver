"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";
import { User } from "@/lib/types/user";
import { getUsers } from "./actions";
import { toast } from "sonner";
import axios from "axios";

export default function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        toast.error(error as string);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/story/liveblocks-auth";
        const room = params.storyId as string;
        const response = await axios.post(endpoint, { room });
        return response.data;
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => users.find((user) => user.id === userId) ?? undefined);
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
        }
        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.storyId as string}>
        <ClientSideSuspense fallback={<Loading variant="embedded" text="Loading collab room..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
