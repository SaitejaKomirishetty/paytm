'use client'
import {AppBar} from '@repo/ui/AppBar'
import { signIn, signOut, useSession } from 'next-auth/react';
export default function IndexPage() {
    const session = useSession()
    console.log(session)
    return (
        <div>
            <AppBar onSignIn={signIn} onSignOut={signOut} user={session.data?.user}/>
        </div>
    );
}
