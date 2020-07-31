import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from "./Header.module.scss";
import { Button } from '../Button/Button';
import { HomeHeader } from "../HomeHeader/HomeHeader";
import SearchHeader from '../SearchHeader/SearchHeader';

export function Header(props) {
    const headerRef = useRef(null);
    const [isSticky, setSticky] = useState(false);
    const handleScroll = () => {
        if (headerRef.current) {
            setSticky(window.pageYOffset > headerRef.current.offsetTop);
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    return (
        <header className={styles.container}>
            <div ref={headerRef} className={`${styles.myHeader} ${isSticky ? styles.sticky : ''}`}>
                {props.isHome ? <HomeHeader isMobile={props.isMobile} /> : <SearchHeader isMobile={props.isMobile} />
                } </div>
        </header>




    );
}
/*export class Header extends React.Component {
constructor(props){
    super(props);
    this.state = {isSticky: false};
    const handleScroll = () => {
    if (headerRef.current) {
        headerRef.current.getBoundingClientRect().top <= 0 ? setState({isSticky: true}) : this.setState({isSticky: false});
    }
    };
}

useEffect();


    render() {
        const isHome = this.props.isHome;

        return (

            <header className={styles.myHeader} >
                <div className={styles.container}>
                {isHome ? <HomeHeader isMobile={this.props.isMobile} /> : <SearchHeader isMobile={this.props.isMobile} />
                }
                </div>


            </header>
        );
    }
} */