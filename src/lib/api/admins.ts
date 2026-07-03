import { authedRequest } from "../http"
import type {
  AdminProfile,
  CreateAdminInput,
  CreateAdminResponse,
} from "../types/admins"

export const adminsApi = {
  // GET /admins → array of admins
  list: async (): Promise<AdminProfile[]> => {
    return authedRequest<AdminProfile[]>("/v1/admins")
  },

  // POST /admins → 201 { id, email, full_name }
  create: async (data: CreateAdminInput): Promise<CreateAdminResponse> => {
    return authedRequest<CreateAdminResponse>("/v1/admins", {
      method: "POST",
      body: data,
    })
  },

  // DELETE /admins/:id → 204. Cannot revoke yourself → 400.
  revoke: async (id: string): Promise<void> => {
    await authedRequest(`/v1/admins/${id}`, { method: "DELETE" })
  },
}
