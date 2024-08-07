import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiCopy } from 'react-icons/fi';
import Link from 'next/link';

import styles from './styles.module.scss';
import CloseRoomModal from '../roomComponents/CloseRoomModal';

interface IProps {
    isAuthor: boolean;
}

export default function Header({ isAuthor }: IProps){

    const [isCloseModalOpenState, setIsCloseModalOpenState] = useState(false);

    const router = useRouter();

    return (
        <>
            {isCloseModalOpenState && (
                <CloseRoomModal 
                    setIsCloseModalOpen={setIsCloseModalOpenState}
                />
            )}
        
            <header className={styles.container}>
                <Link href='/' passHref>
                    <a>
                        <Image
                            src='/images/logo.svg'
                            alt='logo'
                            width={100.26}
                            height={45}
                        />
                    </a>
                </Link>

                <div>
                    <button 
                        type='button' 
                        name='room'
                        title='Copiar'
                        onClick={() => navigator.clipboard.writeText(`${router.query.roomId}`)}
                    >
                        <div>
                            <FiCopy size={20} color='#fff' />
                        </div>
                        Sala {router.query.roomId}
                    </button>

                    {isAuthor && (
                        <button 
                            type='button' 
                            name='close'
                            onClick={() => setIsCloseModalOpenState(true)}
                        >
                            Encerrar sala
                        </button>
                    )}
                </div>
            </header>
        </>
    );
}