import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                password:{
                    label:'Password',
                    type:'password',
                    placeholder:'password'
                }
            },
            async authorize(credentials:any) {
                console.log(credentials.password)
              return {
                password:credentials.password,
                id:"1"
              }
            }
        })
    ],
    secret: process.env.JWT_SECRET || 'secret',
    callbacks:{
        async session({token,session}:any){
            console.log(token,session);
            session.user.id=token.sub
            return session
        }
    }
};
