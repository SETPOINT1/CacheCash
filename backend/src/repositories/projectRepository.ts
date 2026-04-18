import { AppError } from "../errors/AppError";
import { getSupabaseClient } from "../integrations/supabaseClient";
import { CreateProjectInput, Project } from "../models/project";
import { ProjectRow } from "../types/supabaseTables";

function mapProjectRow(row: ProjectRow): Project {
  return {
    createdAt: row.created_at,
    id: row.id,
    memberCount: row.member_count,
    name: row.name,
    organizationId: row.organization_id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

export async function listProjects(): Promise<Project[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("projects").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch projects: ${error.message}`, 500, error);
  }

  return ((data as ProjectRow[] | null) ?? []).map(mapProjectRow);
}

export async function findProjectById(projectId: string): Promise<Project | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("projects").select("*").eq("id", projectId).maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch project: ${error.message}`, 500, error);
  }

  if (!data) {
    return null;
  }

  return mapProjectRow(data as ProjectRow);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("projects")
    .insert({
      member_count: input.memberCount ?? 1,
      name: input.name,
      organization_id: input.organizationId,
      owner_id: input.ownerId,
      owner_name: input.ownerName,
      status: input.status ?? "DRAFT",
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(`Failed to create project: ${error.message}`, 500, error);
  }

  return mapProjectRow(data as ProjectRow);
}
