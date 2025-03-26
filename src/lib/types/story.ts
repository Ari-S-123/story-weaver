export type Story = {
  id: string;
  ownerId: string;
  title?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
  visibility: "public" | "private";
};
