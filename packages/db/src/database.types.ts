export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
	public: {
		Tables: {
			audit_events: {
				Row: {
					created_at: string
					event_data: Json
					event_type: string
					handoff_id: string | null
					id: string
					ip_address: unknown
					member_id: string | null
					organisation_id: string | null
					review_id: string | null
					user_agent: string | null
				}
				Insert: {
					created_at?: string
					event_data?: Json
					event_type: string
					handoff_id?: string | null
					id: string
					ip_address?: unknown
					member_id?: string | null
					organisation_id?: string | null
					review_id?: string | null
					user_agent?: string | null
				}
				Update: {
					created_at?: string
					event_data?: Json
					event_type?: string
					handoff_id?: string | null
					id?: string
					ip_address?: unknown
					member_id?: string | null
					organisation_id?: string | null
					review_id?: string | null
					user_agent?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'audit_events_handoff_id_fkey'
						columns: ['handoff_id']
						isOneToOne: false
						referencedRelation: 'certificate_handoffs'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'audit_events_member_id_fkey'
						columns: ['member_id']
						isOneToOne: false
						referencedRelation: 'organisation_members'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'audit_events_organisation_id_fkey'
						columns: ['organisation_id']
						isOneToOne: false
						referencedRelation: 'organisations'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'audit_events_review_id_fkey'
						columns: ['review_id']
						isOneToOne: false
						referencedRelation: 'certificate_handoff_reviews'
						referencedColumns: ['id']
					}
				]
			}
			certificate_handoff_reviews: {
				Row: {
					created_at: string
					draft_snapshot: Json
					handoff_id: string
					id: string
					issued_at: string | null
					organisation_id: string
					ready_to_issue_at: string | null
					reviewed_data: Json
					reviewer_member_id: string
					status: string
					updated_at: string
					verification: Json | null
				}
				Insert: {
					created_at?: string
					draft_snapshot: Json
					handoff_id: string
					id: string
					issued_at?: string | null
					organisation_id: string
					ready_to_issue_at?: string | null
					reviewed_data: Json
					reviewer_member_id: string
					status?: string
					updated_at?: string
					verification?: Json | null
				}
				Update: {
					created_at?: string
					draft_snapshot?: Json
					handoff_id?: string
					id?: string
					issued_at?: string | null
					organisation_id?: string
					ready_to_issue_at?: string | null
					reviewed_data?: Json
					reviewer_member_id?: string
					status?: string
					updated_at?: string
					verification?: Json | null
				}
				Relationships: [
					{
						foreignKeyName: 'certificate_handoff_reviews_handoff_id_fkey'
						columns: ['handoff_id']
						isOneToOne: false
						referencedRelation: 'certificate_handoffs'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'certificate_handoff_reviews_organisation_id_fkey'
						columns: ['organisation_id']
						isOneToOne: false
						referencedRelation: 'organisations'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'certificate_handoff_reviews_reviewer_member_id_fkey'
						columns: ['reviewer_member_id']
						isOneToOne: false
						referencedRelation: 'organisation_members'
						referencedColumns: ['id']
					}
				]
			}
			certificate_handoffs: {
				Row: {
					consent: Json
					created_at: string
					created_from_session_id: string | null
					draft: Json
					expires_at: string
					id: string
					issued_certificate_id: string | null
					opened_at: string | null
					reference_code: string
					revoked_at: string | null
					status: string
					token_hash: string
				}
				Insert: {
					consent: Json
					created_at?: string
					created_from_session_id?: string | null
					draft: Json
					expires_at: string
					id: string
					issued_certificate_id?: string | null
					opened_at?: string | null
					reference_code: string
					revoked_at?: string | null
					status?: string
					token_hash: string
				}
				Update: {
					consent?: Json
					created_at?: string
					created_from_session_id?: string | null
					draft?: Json
					expires_at?: string
					id?: string
					issued_certificate_id?: string | null
					opened_at?: string | null
					reference_code?: string
					revoked_at?: string | null
					status?: string
					token_hash?: string
				}
				Relationships: []
			}
			issued_certificates: {
				Row: {
					content_type: string
					created_at: string
					filename: string
					handoff_id: string
					id: string
					issue_request: Json
					organisation_id: string
					pdf_bytes: string
					review_id: string
					signer_member_id: string
				}
				Insert: {
					content_type: string
					created_at?: string
					filename: string
					handoff_id: string
					id: string
					issue_request: Json
					organisation_id: string
					pdf_bytes: string
					review_id: string
					signer_member_id: string
				}
				Update: {
					content_type?: string
					created_at?: string
					filename?: string
					handoff_id?: string
					id?: string
					issue_request?: Json
					organisation_id?: string
					pdf_bytes?: string
					review_id?: string
					signer_member_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'issued_certificates_handoff_id_fkey'
						columns: ['handoff_id']
						isOneToOne: false
						referencedRelation: 'certificate_handoffs'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'issued_certificates_organisation_id_fkey'
						columns: ['organisation_id']
						isOneToOne: false
						referencedRelation: 'organisations'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'issued_certificates_review_id_fkey'
						columns: ['review_id']
						isOneToOne: true
						referencedRelation: 'certificate_handoff_reviews'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'issued_certificates_signer_member_id_fkey'
						columns: ['signer_member_id']
						isOneToOne: false
						referencedRelation: 'organisation_members'
						referencedColumns: ['id']
					}
				]
			}
			organisation_auth_rate_limits: {
				Row: {
					action: string
					attempt_count: number
					blocked_until: string | null
					id: string
					identifier: string
					identifier_type: string
					last_attempt_at: string
					window_started_at: string
				}
				Insert: {
					action: string
					attempt_count?: number
					blocked_until?: string | null
					id: string
					identifier: string
					identifier_type: string
					last_attempt_at: string
					window_started_at: string
				}
				Update: {
					action?: string
					attempt_count?: number
					blocked_until?: string | null
					id?: string
					identifier?: string
					identifier_type?: string
					last_attempt_at?: string
					window_started_at?: string
				}
				Relationships: []
			}
			organisation_members: {
				Row: {
					created_at: string
					disabled_at: string | null
					disabled_by_member_id: string | null
					email: string
					id: string
					name: string
					organisation_id: string
					role: string
					status: string
					updated_at: string
				}
				Insert: {
					created_at?: string
					disabled_at?: string | null
					disabled_by_member_id?: string | null
					email: string
					id: string
					name: string
					organisation_id: string
					role: string
					status?: string
					updated_at?: string
				}
				Update: {
					created_at?: string
					disabled_at?: string | null
					disabled_by_member_id?: string | null
					email?: string
					id?: string
					name?: string
					organisation_id?: string
					role?: string
					status?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'organisation_members_disabled_by_member_id_fkey'
						columns: ['disabled_by_member_id']
						isOneToOne: false
						referencedRelation: 'organisation_members'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'organisation_members_organisation_id_fkey'
						columns: ['organisation_id']
						isOneToOne: false
						referencedRelation: 'organisations'
						referencedColumns: ['id']
					}
				]
			}
			organisation_sessions: {
				Row: {
					created_at: string
					expires_at: string
					id: string
					last_seen_at: string | null
					member_id: string
					revoked_at: string | null
					session_hash: string
				}
				Insert: {
					created_at?: string
					expires_at: string
					id: string
					last_seen_at?: string | null
					member_id: string
					revoked_at?: string | null
					session_hash: string
				}
				Update: {
					created_at?: string
					expires_at?: string
					id?: string
					last_seen_at?: string | null
					member_id?: string
					revoked_at?: string | null
					session_hash?: string
				}
				Relationships: [
					{
						foreignKeyName: 'organisation_sessions_member_id_fkey'
						columns: ['member_id']
						isOneToOne: false
						referencedRelation: 'organisation_members'
						referencedColumns: ['id']
					}
				]
			}
			organisations: {
				Row: {
					address: string | null
					created_at: string
					email: string | null
					entity_type: string
					id: string
					name: string
					nif_cif: string | null
					phone: string | null
					registration_number: string | null
					updated_at: string
				}
				Insert: {
					address?: string | null
					created_at?: string
					email?: string | null
					entity_type?: string
					id: string
					name: string
					nif_cif?: string | null
					phone?: string | null
					registration_number?: string | null
					updated_at?: string
				}
				Update: {
					address?: string | null
					created_at?: string
					email?: string | null
					entity_type?: string
					id?: string
					name?: string
					nif_cif?: string | null
					phone?: string | null
					registration_number?: string | null
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {}
	}
} as const
