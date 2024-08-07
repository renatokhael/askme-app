import React from 'react';
import { FiTrash } from 'react-icons/fi';

import { database } from '../../../services/firebase';

import styles from './styles.module.scss';

interface IProps {
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    roomId: string;
    questionId: string;
}

export default function CloseRoomModal({ setIsDeleteModalOpen, roomId, questionId }: IProps) {

    async function deleteQuestion(){

        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    return (
        <div className={styles.container}>

            <div className={styles.modal}>

                <FiTrash size={48} color='#E73F5D' />

                <h2>Excluir pergunta</h2>

                <span>Tem certeza que deseja excluir esta pergunta?</span>

                <div>
                    <button 
                        type='button'
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        Cancelar
                    </button>

                    <button 
                        type='button'
                        onClick={deleteQuestion}
                    >
                        Sim, excluir
                    </button>
                </div>
            </div>
        </div>
    )
}
