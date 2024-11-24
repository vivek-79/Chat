


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import { dbConnect } from "@/lib/dbConnect"
import { User } from "@/models/user.model"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            async authorize(credentials) {

                if(!credentials.email || !credentials.password){
                    throw new Error('Please enter your email and password')
                }
                await dbConnect()
                try {
                    const user = await User.findOne({
                        email: credentials.email 
                    })

                    if (!user) {
                        throw new Error('No user found')
                    }
                    const isPassCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (!isPassCorrect) {
                        throw new Error('Password is Wrong')
                    }
                    else {
                        return user
                    }
                } catch (error) {
                    throw new Error(err)
                }
            }
        })
    ],
    secret:process.env.AUTH_SECRET,
    callbacks:{
        async session({session}) {
            const mongodbUser = await User.findOne({email:session.user.email})
            session.user.id = mongodbUser._id.toString()
            session.user.userName = mongodbUser.userName
            session.user.fullName = mongodbUser.fullName
            session.user.avatar=mongodbUser.avatar 

            return session
        }
    }
})

export {handler as GET , handler as POST}