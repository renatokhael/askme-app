import { useState } from 'react';
import Image from 'next/image';
import { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from './styles.module.scss';

import { useAuth } from '../../../contexts/authContext';
import { database } from '../../../services/firebase';

export default function CreateRoom() {

    const [newRoomState, setNewRoom] = useState('');

    const router = useRouter();
    const authContext = useAuth();

    useEffect( () => {
        if(!authContext.user) router.replace('/');
    }, []);

    async function handleCreateRoom(event: FormEvent<HTMLFormElement>){

        event.preventDefault();

        if(newRoomState.trim().length == 0) return;

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoomState,
            authorId: authContext.user?.id
        });

        router.push(`/room/${firebaseRoom.key}`);
    }

    return (
        <div className={styles.container}>
            <Image 
                src='/images/logo.svg'
                alt='logo'
                width={154.2}
                height={69}
            />

            <form onSubmit={handleCreateRoom}>

                <h2>Crie uma nova sala</h2>

                <input 
                    type="text" 
                    placeholder='Nome da sala'
                    value={newRoomState}
                    onChange={(event) => setNewRoom(event.target.value)}
                />

                <button type="submit">
                    Criar sala
                </button>

                <span>
                    Quer entrar em uma sala já existente?
                    {' '}<Link href='/'>Clique aqui</Link>
                </span>
            </form>
        </div>
    );
}