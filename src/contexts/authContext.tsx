import React, { createContext, useContext, useState, useEffect } from 'react';

import { auth, firebase } from '../services/firebase';

interface IProps {
    children: React.ReactNode;
}

interface IUserState {
    id: string;
    name: string;
    avatar: string;
}

interface IAuthContext {
    signInWithGoogle: () => Promise<boolean>;
    user: IUserState | undefined;
}

const Context = createContext({} as IAuthContext);

export function AuthProvider({ children }: IProps) {

    const [userState, setUserState] = useState<IUserState>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            try {
                if (!user || !user.displayName || !user.photoURL) {
                    throw new Error('Missing information on Google account');
                }
    
                const { displayName, photoURL, uid } = user;
    
                setUserState({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            } catch (error) {
                console.error(error);
            }
        });

        return () => unsubscribe();
    }, []);

    async function signInWithGoogle() {
        try {
            if (!userState) {

                const provider = new firebase.auth.GoogleAuthProvider();

                const response = await auth.signInWithPopup(provider);

                if (!response.user || !response.user.displayName || !response.user.photoURL) {
                    throw new Error('Missing information on Google account');
                }

                const { displayName, photoURL, uid } = response.user;

                setUserState({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }

            return true;

        } catch (error) {
            alert('Erro ao acessar a autenticação da Google:' + error);

            return false;
        }
    }

    return (
        <Context.Provider
            value={{
                signInWithGoogle,
                user: userState,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useAuth() {

    return useContext(Context);
}
