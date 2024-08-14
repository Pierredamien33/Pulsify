import React, { useState } from "react";
import Modal from 'react-modal';
import styles from '../styles/ProjectModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function ProjectModal(props) {
    const [isPublic, setIsPublic] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [hoveredStars, setHoveredStars] = useState(0);
    const [score, setScore] = useState(0);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const user = useSelector((state) => state.user.value);
    const router = useRouter()

    //upload prompt + audio si l'audio est présent
    const uploadPrompt = async () => {
        if (user.token) {

            const dataForPrompt = {
                genre: props.projectGenre,
                prompt: props.prompt,
                rating: score,
                isPublic: isPublic,
                username: user.username,
                email: user.email,
                token: user.token,
                title: props.projectTitle,
            };
            // Envoyer les data du prompt sans l'audio
            const saveDataForPrompt = await fetch("http://localhost:3000/projects/add", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataForPrompt),
            });

            const responseDataPrompt = await saveDataForPrompt.json();


            if (responseDataPrompt.result) {
                setMessage(`Ajout de l'audio en cours`);

                // Envoyer le fichier audio avec le l'id du prompt sauvegardé 
                if (file && file.length > 0) {
                    const formData = new FormData();
                    formData.append('audio', file[0]);

                    // Envoyer l'audio au backend au format formData
                    const audioResponse = await fetch(`http://localhost:3000/projects/${responseDataPrompt.prompt._id}/upload-audio`, {
                        method: "POST",
                        body: formData,
                    });
                    const audioResult = await audioResponse.json();

                    if (audioResult.result) {
                        setMessage(`L'audio a été ajouté avec succes`);

                    } else {
                        setMessage(`Echec de l'ajout de l'audio`);
                    }
                }
            } else {
                setMessage('Echec de la sauvegarde');
            }
        }
        router.push('/Profil')
    };

    const mouseOver = (rating) => {
        setHoveredStars(rating)
    }
    const mouseLeave = () => {
        setHoveredStars(0)
    }
    const clickToRate = (rating) => {
        setScore(rating)
    }


    return (
        <Modal
            isOpen={props.isOpen}
            className={styles.modalContainer}
            onRequestClose={props.onRequestClose}
            contentLabel="Example Modal">
            <div className={styles.content}>
                <div className={styles.modalTitleContent}>
                    <h1 className={styles.modalTitle}>{props.projectTitle}</h1>
                </div>
                <div className={styles.voteTxt}>genre du projet : {props.projectGenre}</div>
                <p className={styles.promptContainer}>{props.prompt}</p>
                <div className={styles.import}>
                    <input
                        type="file"
                        className={styles.inputImport}
                        onChange={(e) => setFile(e.target.files)}
                        accept="audio/*"
                    />
                    {message && <p>{message}</p>}
                </div>
                <div className={styles.voteContainer}>
                    <p className={styles.voteTxt}>Votre note :</p>
                    <div className={styles.voteStars}>
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isStarSelected = score >= star;
                            const isStarHovered = hoveredStars >= star;

                            let color = "gray"; // Couleur par défaut
                            if (isStarHovered && !isStarSelected) {
                                color = "white"; // Couleur lors du survol
                            } else if (isStarSelected) {
                                color = "#B300F2"; // Couleur lorsqu'une étoile est cliquée
                            }

                            return (
                                <FontAwesomeIcon
                                    key={star}
                                    icon={faStar}
                                    style={{ color }}
                                    onMouseEnter={() => mouseOver(star)}
                                    onMouseLeave={mouseLeave}
                                    onClick={() => clickToRate(star)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className={styles.modalBtnContainer}>
                    <div className={styles.public}>
                        <div
                            className={isPublic ? styles.isPublic : styles.isNotPublic}
                            onClick={() => setIsPublic(!isPublic)}
                        />
                        <span className={styles.text}>Public</span>
                    </div>
                    <button className={styles.btn} onClick={props.onRequestClose}>Retour</button>
                    <button className={styles.btn} onClick={uploadPrompt}>Valider</button>
                </div>
                <span className={styles.errorMessage}>{displayMessage}</span>
            </div>
        </Modal>
    );
}

export default ProjectModal;