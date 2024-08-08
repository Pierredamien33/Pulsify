import styles from '../styles/Project.module.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectModal from '../components/ProjectModal';
import GenresModal from '../components/GenresModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";

import Header from '../components/Header';


function Project() {
    const [projectTitle, setProjectTitle] = useState("");
    const [prompt, setPrompt] = useState("")
    const [search, setSearch] = useState("");
    const [genresModalIsOpen, setGenresModalIsOpen] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [suggestionsList, setSuggestionsList] = useState(["Rock", "Pop", "Guitar", "Bass", "Drums", "papa", "Maman", "couilles", "babar"]);
    const [isCopied, setIsCopied] = useState(false);
    const [projectGenre, setProjectGenre] = useState('')
    const router = useRouter();


    //set a list of all suggestions, TODO: fetch on BD
    let suggestion = suggestionsList.map((data, i) => {
        return (
            <div className={styles.suggestionItem} onClick={() => addGenreFromSearchBar(data)}>
                <div className={styles.suggestionItemLeft}>
                    <div key={i} >{data}</div>
                </div>
                <div className={styles.suggestionItemRight}>10%</div>
            </div>
        )
    }
    );
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(prompt).then(() => {
            setIsCopied(true); // Set the copied state to true
            setTimeout(() => setIsCopied(false), 2000); // Hide the icon after 2 seconds
        });
    };


    // Go back to previous page clicking on "retour"
    const handleBack = () => {
        router.back();
    };


    //Call route to fetch Genre by Artist name on Spotify
    const fetchGenreArtistOnSpotify = async (search) => {
        const fetchArtist = await fetch('http://localhost:3000/spotify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search: search }),
        });
        const res = await fetchArtist.json();
        setSearchResults(res)
    }

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchGenreArtistOnSpotify(search);
        }
    }

    console.log('searchResults :', searchResults)
    const genres = searchResults.map((data, i) => {
        if (!data) {
            return (
                <div key={i}>Pas d'artistes trouvés a ce nom</div>
            )
        } else {
            return (
                <div key={i} className={styles.genreItem} onClick={() => addGenreFromSearchBar(data)}>
                    <div>{data}</div>
                </div>
            );

        }
    });
    console.log('genres :', genres)

    const openGenresModal = () => {
        setGenresModalIsOpen(true)
    }

    const closeGenresModal = () => {
        setGenresModalIsOpen(false)
    }


    // Open project modal on click on "Enregistrer"
    const openProjectModal = () => {
        console.log('projectTitle :', projectTitle)
        if (prompt.length === 0 || projectTitle.length === 0 || projectGenre.length === 0) {
            alert('Renseignez un titre, un genre et un prompt pour votre projet.')
        } else {
            setIsOpen(true)
        }
    }

    const closeProjectModal = () => {
        setIsOpen(false);
    }

    //Add a genre from the search Container to the prompt with onClick
    const addGenreFromSearchBar = (genre) => {
        if (prompt.length === 0) {
            setPrompt(`${genre}, `)
        } else if ((prompt.length + genre.length) < 120) {
            setPrompt(prompt + `${genre}, `)
        }
    }

    return (
        <div className={styles.main}>
            <Header></Header>
            <div className={styles.projectBody}>
                <div className={styles.leftContainer}>
                    <div className={styles.suggestionContainer}>
                        <div className={styles.suggestionTitle}>Suggestions</div>
                        <div className={styles.suggestionList}>
                            {suggestion}
                        </div>
                        <div className={styles.bottomSuggestionList}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkBoxSuggestion} />
                                <span className={styles.customCheckbox}></span>
                                Intégrez les favoris de la communauté
                            </label>
                        </div>
                    </div>
                    <button className={styles.btn} onClick={handleBack}>Retour</button>
                </div>
                <div className={styles.projectContainer}>
                    <div className={styles.projectHeader}>
                        <div className={styles.leftPartHeader}>
                            <div className={styles.textHeader}>Titre du projet</div>
                            <input className={styles.inputProjectTitle}
                                placeholder='Le nom de votre projet'
                                onChange={(e) => setProjectTitle(e.target.value)}
                                value={projectTitle}
                                maxLength={40}
                            ></input>
                        </div>
                        <div className={styles.rightPartHeader}>
                            <div className={styles.textHeader}>Genre de votre projet</div>
                            <div className={styles.genreProject}>
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className={styles.searchGenreBtn}
                                    onClick={openGenresModal}
                                />
                                <input className={styles.colorTheme}
                                    placeholder='Genre du projet'
                                    onChange={(e) => setProjectGenre(e.target.value)}
                                    value={projectGenre}
                                    maxLength={40}>
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputPromptContainer}>
                        <textarea className={styles.inputProjectPrompt}
                            placeholder='Entrez votre prompt ici'
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            maxLength={120}
                            onKeyPress={e => {
                                if (e.key === 'Enter')
                                    e.preventDefault()
                            }} />
                        <div className={styles.promptBottom}>
                            <div className={styles.totalCharacters}>{`${prompt.length} / 120`}</div>
                            {isCopied ? (
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className={styles.copyPasteIcon}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    className={styles.copyPasteIcon}
                                    onClick={handleCopyToClipboard} // Use the new copy handler
                                />
                            )}
                        </div>

                    </div>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchTitle}>Recherche de genre par artiste</div>
                        <div>
                            <input className={styles.searchInput}
                                placeholder='Enter an artist here'
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                onKeyDown={handleSearchKeyDown}></input>
                            <FontAwesomeIcon icon={faSearch}
                                className={styles.searchBtn}
                                onClick={() => fetchGenreArtistOnSpotify(search)} />
                        </div>
                        <div className={styles.genresList} >
                            {genres}
                        </div>
                    </div>
                    <button className={styles.btn}
                        onClick={() => openProjectModal()}
                    >Enregistrer</button>
                    <ProjectModal isOpen={modalIsOpen}
                        onRequestClose={closeProjectModal}
                        projectTitle={projectTitle}
                        prompt={prompt}
                        projectGenre={projectGenre}
                    />
                    <GenresModal isOpen={genresModalIsOpen}
                        onRequestClose={closeGenresModal}
                        projectGenre={projectGenre} />
                </div>
            </div>
        </div>
    )
}

export default Project;