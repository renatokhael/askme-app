import Image from 'next/image';

import styles from './styles.module.scss';


interface IProps {
    name: string;
    avatar: string;
}

export default function AvatarAndUserName(props: IProps){

    return (
        <div className={styles.container}>
            <div className={styles.avatarImageContainer}>
                <Image
                    src={props.avatar}
                    alt='avatar'
                    width={32}
                    height={32}
                />
            </div>
            {props.name}
        </div>
    );
}