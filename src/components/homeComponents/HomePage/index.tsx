import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

import Login from '../Login';
import CreateRoom from '../CreateRoom';

export default function HomePage() {

    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.loginBackground}>
                <div>
                    <Image 
                        src="/images/login-background.svg" 
                        alt="login background" 
                        width={313}
                        height={403}
                    />

                    <h2>Crie salas de Q&A ao-vivo.</h2>

                    <span>Tire dúvidas da sua audiência em tempo real</span>
                </div>
            </div>

            <div className={styles.login}>
                {router.query.page == 'create-room' ? (
                    <CreateRoom />
                    ) : (
                    <Login />
                )}
            </div>
        </div>
    );
}