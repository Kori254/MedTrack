export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      facilities: {
        Row: { id: string; name: string; location: string | null; created_at: string }
        Insert: { id?: string; name: string; location?: string | null; created_at?: string }
        Update: { id?: string; name?: string; location?: string | null; created_at?: string }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string; first_name: string; last_name: string; dob: string | null
          phone: string | null; address: string | null; facility_id: string | null
          emergency_contact: string | null; emergency_phone: string | null
          language: string; notify_preference: string; created_at: string; updated_at: string
        }
        Insert: {
          id: string; first_name: string; last_name: string; dob?: string | null
          phone?: string | null; address?: string | null; facility_id?: string | null
          emergency_contact?: string | null; emergency_phone?: string | null
          language?: string; notify_preference?: string
        }
        Update: {
          first_name?: string; last_name?: string; dob?: string | null
          phone?: string | null; address?: string | null; facility_id?: string | null
          emergency_contact?: string | null; emergency_phone?: string | null
          language?: string; notify_preference?: string
        }
        Relationships: [{ foreignKeyName: 'profiles_facility_id_fkey'; columns: ['facility_id']; referencedRelation: 'facilities'; referencedColumns: ['id'] }]
      }
      medications: {
        Row: {
          id: string; patient_id: string; name: string; strength: string; form: string
          purpose: string | null; schedule_time: string; schedule_label: string
          total_days: number; days_remaining: number; facility_id: string | null
          clinician: string | null; last_pickup: string | null
          refill_state: string | null; active: boolean; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; patient_id: string; name: string; strength: string; form?: string
          purpose?: string | null; schedule_time: string; schedule_label: string
          total_days?: number; days_remaining: number; facility_id?: string | null
          clinician?: string | null; last_pickup?: string | null
          refill_state?: string | null; active?: boolean
        }
        Update: {
          name?: string; strength?: string; form?: string; purpose?: string | null
          schedule_time?: string; schedule_label?: string; total_days?: number
          days_remaining?: number; facility_id?: string | null; clinician?: string | null
          last_pickup?: string | null; refill_state?: string | null; active?: boolean
        }
        Relationships: [
          { foreignKeyName: 'medications_patient_id_fkey'; columns: ['patient_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'medications_facility_id_fkey'; columns: ['facility_id']; referencedRelation: 'facilities'; referencedColumns: ['id'] }
        ]
      }
      dose_logs: {
        Row: {
          id: string; medication_id: string; patient_id: string; scheduled_date: string
          status: string; taken_at: string | null; skip_reason: string | null; created_at: string
        }
        Insert: {
          id?: string; medication_id: string; patient_id: string; scheduled_date: string
          status?: string; taken_at?: string | null; skip_reason?: string | null
        }
        Update: {
          status?: string; taken_at?: string | null; skip_reason?: string | null
        }
        Relationships: [
          { foreignKeyName: 'dose_logs_medication_id_fkey'; columns: ['medication_id']; referencedRelation: 'medications'; referencedColumns: ['id'] },
          { foreignKeyName: 'dose_logs_patient_id_fkey'; columns: ['patient_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }
        ]
      }
      deliveries: {
        Row: {
          id: string; patient_id: string; medication_id: string | null
          status: string; step: number; eta: string | null; delivery_window: string | null
          agent_name: string | null; quantity: string | null; ref_number: string | null
          dispatched_on: string | null; delivered_at: string | null; fail_reason: string | null
          created_at: string; updated_at: string
        }
        Insert: {
          id?: string; patient_id: string; medication_id?: string | null
          status?: string; step?: number; eta?: string | null; delivery_window?: string | null
          agent_name?: string | null; quantity?: string | null; ref_number?: string | null
          dispatched_on?: string | null
        }
        Update: {
          status?: string; step?: number; eta?: string | null; delivered_at?: string | null; fail_reason?: string | null
        }
        Relationships: [
          { foreignKeyName: 'deliveries_patient_id_fkey'; columns: ['patient_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'deliveries_medication_id_fkey'; columns: ['medication_id']; referencedRelation: 'medications'; referencedColumns: ['id'] }
        ]
      }
      notifications: {
        Row: {
          id: string; patient_id: string; type: string; title: string; body: string
          unread: boolean; related_id: string | null; created_at: string
        }
        Insert: {
          id?: string; patient_id: string; type: string; title: string; body: string
          unread?: boolean; related_id?: string | null
        }
        Update: { unread?: boolean }
        Relationships: [{ foreignKeyName: 'notifications_patient_id_fkey'; columns: ['patient_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
  }
}
