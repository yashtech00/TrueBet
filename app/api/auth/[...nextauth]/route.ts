import { authOptions } from "@/app/lib/AuthOptions";
import { GET } from "../../events/route";
import NextAuth from "next-auth";


const handler = NextAuth(authOptions);


export {handler as GET, handler as POST}