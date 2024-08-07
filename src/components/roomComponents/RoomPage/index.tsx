import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import { useAuth } from '../../../contexts/authContext';

import Header from '../../Header';
import QuestionCard from '../QuestionCard';
import AvatarAndUserName from '../AvatarAndUserName';
import { firebase, database } from '../../../services/firebase';

declare global {
    interface Array<T>  {
        move: (from: number, to: number) => void;
    }
}

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

interface IFirebaseQuestion {
    [key: string]: {
        author: {
            name: string;
            avatar: string;
        };
        content: string;
        isAnswered: boolean;
        isHighlighted: boolean;
        likes?: {
            [key: string]: {
                authorId: string;
            };
        };
    }
}

export interface IQuestionState {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likesCount: number;
    myLikeId: string | undefined;
}

export default function RoomPage(){

    const [newQuestionState, setNewQuestion] = useState('');
    const [questionsState, setQuestions] = useState<IQuestionState[]>([]);
    const [roomTitleState, setRoomTitle] = useState('');
    const [roomAuthorId, setRoomAuthor] = useState('');

    const authContext = useAuth();
    const router = useRouter();

    const isAuthor = authContext.user?.id == roomAuthorId;

    useEffect(() => {
        const roomRef = fetchQuestions();

        () => roomRef?.off('value');

    }, [router.query.roomId, authContext.user?.id]);

    function fetchQuestions(){
        try {

            const roomRef = database.ref(`rooms/${router.query.roomId}`);
            
            roomRef.on('value', (room) => {

                if(room.exists() == false){

                    roomRef.off('value');
                    alert('Sala encerrada');
                    //router.push('/');
                    return;
                }
                
                const firebaseRoom = room.val();
                const firebaseQuestions: IFirebaseQuestion = firebaseRoom?.questions ?? {};
                
                const parsedQuestions = Object.entries(firebaseQuestions).map( ([key, values]) => {
                    return {
                        id: key,
                        ...values,
                        likesCount: Object.values(values.likes ?? {}).length,
                        myLikeId: Object.entries(values.likes ?? {}).find( ([key, like]) => like.authorId == authContext.user?.id)?.[0],
                        likes: undefined,
                    }
                });

                /*if(parsedQuestions.length > 1){
                    for(let i=0; i < parsedQuestions.length; i++){
    
                        if(parsedQuestions[i].isAnswered && parsedQuestions[i].isHighlighted){
                            parsedQuestions.move(i, parsedQuestions.length-1)
                        }
                    }
                }*/
                
                setRoomAuthor(firebaseRoom.authorId)
                setRoomTitle(firebaseRoom.title);
                setQuestions(parsedQuestions);
            });

            return roomRef;

        } catch (error) {
            alert('Erro ao buscar perguntas')
        }
    }

    function loginWithGoogle(){

        authContext.signInWithGoogle();
    }

    async function handleSendQuestion(event: FormEvent<HTMLFormElement>){

        event.preventDefault();

        if(newQuestionState.trim().length == 0) return;

        if(authContext.user == null) return;

        const question = {
            content: newQuestionState,
            author: {
                name: authContext.user.name,
                avatar: authContext.user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        }

        try {

            await database.ref(`rooms/${router.query.roomId}/questions`).push(question);

            setNewQuestion('');
            
        } catch (error) {
            alert('Erro ao enviar pergunta');
        }
    }

    return (
        <>
            <Header isAuthor={isAuthor} />

            <div className={styles.container}>
                <main>

                    <div className={styles.roomTitle}>
                        <h2>Sala: {roomTitleState} Q&A</h2>
                        {questionsState.length > 0 && <span>{questionsState.length == 1 
                            ? questionsState.length + ' Pergunta' 
                            : questionsState.length + ' Perguntas'}</span>
                        }
                    </div>
                    
                    {isAuthor == false && (

                        <form onSubmit={handleSendQuestion}>
                            <textarea 
                                name="question" 
                                placeholder='O que você quer perguntar?'
                                value={newQuestionState}
                                onChange={(event) => setNewQuestion(event.target.value)}
                            />

                            <div className={styles.questionAuthorContainer}>
                                {authContext.user ? (
                                    <AvatarAndUserName 
                                        avatar={authContext.user!.avatar} 
                                        name={authContext.user!.name} 
                                    />
                                ) : (
                                    <p>
                                        Para enviar uma pergunta,{' '}
                                        <button 
                                            type='button' 
                                            name='google-login-button'
                                            onClick={loginWithGoogle}
                                        >
                                            faça seu login.
                                        </button>
                                    </p>
                                )}

                                <button 
                                    type='submit'
                                    disabled={!authContext.user || newQuestionState.trim().length == 0}
                                >
                                    Enviar Pergunta
                                </button>
                            </div>
                        </form>
                    )}

                    {questionsState.length == 0 ? (
                        <div className={styles.noQuestions}>

                            <div className={styles.imageContainer}>
                                <Image
                                    src='/images/no-questions.svg'
                                    alt='sem perguntas'
                                    width={153.22}
                                    height={150}
                                />
                            </div>

                            <h3>Nenhuma pergunta por aqui...</h3>
                            <span>Envie o código dessa sala para seus amigos e<br/>comece a responder perguntas!</span>
                        </div>
                    ) : (
                        <div className={styles.questionsContainer}>
                            {questionsState.map( (question) => {
                                return (
                                    <QuestionCard 
                                        key={question.id} 
                                        question={question} 
                                        isAuthor={isAuthor}
                                    />
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}