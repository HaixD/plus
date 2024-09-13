import { getProfile } from "@/actions/users"

export type Profile = Awaited<ReturnType<typeof getProfile>>
