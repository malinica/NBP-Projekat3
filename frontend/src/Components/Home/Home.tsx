import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from 'react';
import { faHouseChimney, faPeopleArrows, faPlus } from "@fortawesome/free-solid-svg-icons";
//import pocetna from "../../Assets/pocetna2.png";

export const Home = () => {

    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    const handleScroll = () => {
        if (window.scrollY > 20) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <div className={`container-fluid p-0 bg-light-yellow`}>
            <div className={`container d-flex justify-content-between flex-grow-1`}>
                <div className={`row container-fluid d-flex justify-content-center my-4`}>
                    <div className={`col-xxl-3 col-xl-3 col-lg-4 col-md-12 col-sm-12 text-center mx-5 mt-5`}>
                        <h1 className={`text-orange`}>Tvoj idealan dom čeka na tebe!</h1>
                        <p className={`lead text-purple fw-normal my-4`}>
                        Bilo da tražiš savršen stan u centru grada, mirnu kuću na periferiji ili komercijalni prostor za tvoj biznis, tu smo da ti pomognemo u pronalaženju nekretnine iz snova. Naš cilj je da ti obezbedimo jednostavno i brzo pretraživanje ponuda, uputimo te u sve detalje i učinimo da tvoja potraga za nekretninom bude što lakša i efikasnija.                        </p>
                        <Link
                                to="/"
                                className={`btn-lg text-white text-center rounded py-2 px-3 ${styles.slova1} ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                            >
                                Pronađi Nekretninu
                        </Link>
                    </div>
                    <div className={`col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-7 d-flex justify-content-cetner mx-5`}>
                    </div>
                </div>
            </div>

            <hr className={`text-purple mx-5`}></hr>

            <div className={`container my-5 d-flex justify-content-center`}>
                <div className={`row justify-content-center text-center`}>
                    <div className={`col-md-3`}>
                        <FontAwesomeIcon icon={faHouseChimney} className={`text-green fs-1`} />            
                        <h5 className={`mt-3 text-red`}>Ogroman broj ponuda</h5>
                        <p className={`text-purple`}>Pregledaj najnovije i najatraktivnije nekretnine koje odgovaraju tvojim željama i potrebama.</p>
                        <Link
                                to="/"
                                className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.slova} ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
                            >
                                Pregledaj Nekretnine
                        </Link>
                    </div>
                    <div className={`col-md-3`}>
                        <FontAwesomeIcon icon={faPlus} className={`text-green fs-1`} />
                        <h5 className={`mt-3 text-red`}>Jednostavno postavljanje oglasa</h5>
                        <p className={`text-purple`}>Kreirajte oglas sa svim potrebnim informacijama o nekretnini.</p>
                        <Link
                                to="/"
                                className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.slova} ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
                            >
                                Kreiraj Nekretninu
                        </Link>
                    </div>
                    <div className={`col-md-3`}>
                        <FontAwesomeIcon icon={faPeopleArrows} className={`text-green fs-1`} />
                        <h5 className={`mt-3 text-red`}>Poboljšajte našu uslugu</h5>
                        <p className={`text-purple`}>Svaka povratna informacija nam pomaže da postanemo bolji!</p>
                        <Link
                                to="/"
                                className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.slova} ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
                            >
                                Podeli Mišljenje
                        </Link>
                    </div>
                </div>
            </div>

            <hr className={`text-purple mx-5`}></hr>

            <div className={`text-center bg-light-yellow py-5`}>
                <h2 className={`text-purple`}>Počni svoju potragu odmah!</h2>
                <p className={`text-red`}>Registrujte se i pronađite savršene nekretnine već danas!</p>
                <Link to="/register" className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.slova} ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}>Registruj Se</Link>
            </div>

            <button onClick={scrollToTop} className={`bg-red text-white ${styles.pocetak} ${showButton ? 'd-block' : 'd-none'}`} title="Idi na pocetak">^</button>
        </div>
    );
}

export default Home;