import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";



export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: 'John doe', required: true },
                password: { label: "Password", type: "password", placeholder: "Password", required: true },
            },
            async authorize(credentials: any) {
                const hashpassword = await bcrypt.hash(credentials?.password, 10);
                const existinguser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });
                if (existinguser) {
                    const validatepassword = await bcrypt.compare(hashpassword, existinguser.password);
                    if (validatepassword) {
                        return {
                            id: existinguser.id.toString(),
                            name: existinguser.name,
                            email: existinguser.email
                        }
                    }
                    return null;
                }
                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashpassword,
                        }
                    });
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number,
                    }
                } catch (e) {
                    console.error(e)
                }
                return null;
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            console.log(session)
            return session
        }
    }

}

