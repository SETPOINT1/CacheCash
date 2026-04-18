import { ProjectStatus } from "./common";

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status: ProjectStatus;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  organizationId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status?: ProjectStatus;
  memberCount?: number;
}
