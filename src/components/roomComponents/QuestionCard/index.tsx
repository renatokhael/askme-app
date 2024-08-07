import { useState } from 'react';
import { BiCheckCircle, BiLike } from 'react-icons/bi';
import { GoComment } from 'react-icons/go';
import { FiTrash } from 'react-icons/fi';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import { IQuestionState } from '../RoomPage';
import DeleteQuestionModal from '../DeleteQuestionModal';
import AvatarAndUserName from '../AvatarAndUserName';
import { database } from '../../../services/firebase';
import { useAuth } from '../../../contexts/authContext';

interface IProps {
    question: IQuestionState;
    isAuthor: boolean;
}

export default function QuestionCard({ question, isAuthor }: IProps){

    const [isDeleteQuestionModalOpenState, setIsDeleteQuestionModalOpen] = useState(false);

    const router = useRouter();
    const authContext = useAuth();

    async function handleLikeQuestion(){
        
        if(question.myLikeId){
            
            await database.ref(`rooms/${router.query.roomId}/questions/${question.id}/likes/${question.myLikeId}`).remove();

        } else {

            await database.ref(`rooms/${router.query.roomId}/questions/${question.id}/likes`).push({
                authorId: authContext.user?.id,
            });
        }
    }

    async function responded(){

        await database.ref(`rooms/${router.query.roomId}/questions/${question.id}`).update({
            isAnswered: !question.isAnswered
        });
    }

    async function responding(){

        await database.ref(`rooms/${router.query.roomId}/questions/${question.id}`).update({
            isHighlighted: !question.isHighlighted
        });
    }
    
    return (
        <>
            {isDeleteQuestionModalOpenState && (
                <DeleteQuestionModal 
                    setIsDeleteModalOpen={setIsDeleteQuestionModalOpen} 
                    roomId={router.query.roomId as string}
                    questionId={question.id}
                />
            )}
            
            <div 
                className={`
                    ${styles.questionCard} 
                    ${question.isHighlighted && styles.isHighlighted}
                    ${(question.isAnswered) && styles.wasAnswered}
                `}
            >
                <p>
                    {question.content}
                </p>
                <footer>
                    
                    <AvatarAndUserName avatar={question.author.avatar} name={question.author.name} />

                    {isAuthor ? (
                        <div>
                            <button 
                                type='button'
                                onClick={responded}
                                title='Respondida'
                            >
                                <BiCheckCircle size={24} color={question.isAnswered ? '#835AFD' : '#737380'} />
                            </button>

                            <button 
                                type='button'
                                onClick={responding}
                                title='Respondendo'
                            >
                                <GoComment size={24} color={question.isHighlighted ? '#835AFD' : '#737380'} />
                            </button>

                            <button 
                                type='button'
                                onClick={() => setIsDeleteQuestionModalOpen(true)}
                                title='Excluir'
                            >
                                <FiTrash size={24} color={'#737380'} />
                            </button>
                        </div>
                    ) : (
                        <div>
                            {(!question.isAnswered && !question.isHighlighted) && (
                                <>
                                    {question.likesCount > 0 && <span>{question.likesCount}</span>}
                                    
                                    <button 
                                        type='button'
                                        name='like-button'
                                        onClick={handleLikeQuestion/*() => setIsLiked(!isLikedState)*/}
                                    >
                                        <BiLike size={24} color={question.myLikeId ? '#835AFD' : '#737380'} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                </footer>
            </div>
        </>
    );
}