import { ApprovalStatus, ExpenseStatus, ProjectStatus, SignalStatus } from "../models/common";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      approval_steps: {
        Insert: {
          approver_id?: string | null;
          approver_name: string;
          comment?: string | null;
          created_at?: string;
          decided_at?: string | null;
          expense_note_id: string;
          id?: string;
          level: number;
          status?: ApprovalStatus;
          updated_at?: string;
        };
        Row: {
          approver_id: string | null;
          approver_name: string;
          comment: string | null;
          created_at: string;
          decided_at: string | null;
          expense_note_id: string;
          id: string;
          level: number;
          status: ApprovalStatus;
          updated_at: string;
        };
        Update: {
          approver_id?: string | null;
          approver_name?: string;
          comment?: string | null;
          created_at?: string;
          decided_at?: string | null;
          expense_note_id?: string;
          id?: string;
          level?: number;
          status?: ApprovalStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["expense_note_id"];
            foreignKeyName: "approval_steps_expense_note_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "expense_notes";
          }
        ];
      };
      budgets: {
        Insert: {
          alerts?: Json;
          allocated_amount: number;
          committed_amount?: number;
          created_at?: string;
          currency: string;
          id?: string;
          project_id: string;
          total_amount: number;
          updated_at?: string;
        };
        Row: {
          alerts: Json;
          allocated_amount: number;
          committed_amount: number;
          created_at: string;
          currency: string;
          id: string;
          project_id: string;
          total_amount: number;
          updated_at: string;
        };
        Update: {
          alerts?: Json;
          allocated_amount?: number;
          committed_amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          project_id?: string;
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["project_id"];
            foreignKeyName: "budgets_project_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "projects";
          }
        ];
      };
      expense_notes: {
        Insert: {
          amount: number;
          category: string;
          created_at?: string;
          currency: string;
          description: string;
          id?: string;
          policy_signal?: SignalStatus;
          price_signal?: SignalStatus;
          project_id: string;
          requester_id?: string | null;
          requester_name: string;
          status?: ExpenseStatus;
          updated_at?: string;
          vendor_name?: string | null;
        };
        Row: {
          amount: number;
          category: string;
          created_at: string;
          currency: string;
          description: string;
          id: string;
          policy_signal: SignalStatus;
          price_signal: SignalStatus;
          project_id: string;
          requester_id: string | null;
          requester_name: string;
          status: ExpenseStatus;
          updated_at: string;
          vendor_name: string | null;
        };
        Update: {
          amount?: number;
          category?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          id?: string;
          policy_signal?: SignalStatus;
          price_signal?: SignalStatus;
          project_id?: string;
          requester_id?: string | null;
          requester_name?: string;
          status?: ExpenseStatus;
          updated_at?: string;
          vendor_name?: string | null;
        };
        Relationships: [
          {
            columns: ["project_id"];
            foreignKeyName: "expense_notes_project_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "projects";
          }
        ];
      };
      projects: {
        Insert: {
          created_at?: string;
          id?: string;
          member_count?: number;
          name: string;
          organization_id: string;
          owner_id: string;
          owner_name: string;
          status?: ProjectStatus;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          id: string;
          member_count: number;
          name: string;
          organization_id: string;
          owner_id: string;
          owner_name: string;
          status: ProjectStatus;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          member_count?: number;
          name?: string;
          organization_id?: string;
          owner_id?: string;
          owner_name?: string;
          status?: ProjectStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
}
