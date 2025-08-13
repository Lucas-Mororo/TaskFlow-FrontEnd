export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
          user_id: string
          tags: string[]
          is_public: boolean
          public_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          user_id: string
          tags?: string[]
          is_public?: boolean
          public_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          user_id?: string
          tags?: string[]
          is_public?: boolean
          public_id?: string | null
        }
      }
      task_shares: {
        Row: {
          id: string
          task_id: string
          shared_with_email: string
          permission: 'read' | 'write'
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          task_id: string
          shared_with_email: string
          permission?: 'read' | 'write'
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          task_id?: string
          shared_with_email?: string
          permission?: 'read' | 'write'
          created_at?: string
          created_by?: string
        }
      }
    }
  }
}

export type Task = Database['public']['Tables']['tasks']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TaskShare = Database['public']['Tables']['task_shares']['Row'];

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SharePermission = 'read' | 'write';