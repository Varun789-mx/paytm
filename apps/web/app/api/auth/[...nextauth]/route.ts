import NextAuth from "next-auth"
import { authOptions } from "../../../lib/author"
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }