import React from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../../../assets/Logo';
import Instagram from '../../../assets/SocialMedia/Instagram';
import Twitter from '../../../assets/SocialMedia/Twitter';
import TikTok from '../../../assets/SocialMedia/TikTok';
import Youtube from '../../../assets/SocialMedia/Youtube';
import LinkedIn from '../../../assets/SocialMedia/LinkedIn';

import styles from './styles.module.scss';
import { version } from 'config';

const Footer = () => {
  return (
    <div className='container'>
      <footer className='d-flex flex-wrap justify-content-between align-items-center py-3 mt-2 mb-1 border-top'>
        <div className='col-12 col-md-4 d-flex align-items-center'>
          <a
            href='/'
            className='mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1'
          >
            <span className={`text-muted ${styles.copy}`}>
              <div className={styles.logo}>
                <Logo />
              </div>
              &copy; 2022 Equistar | {version}
            </span>
          </a>
        </div>
        <h1 className={`col-12 col-md-4 mt-md-3 text-muted ${styles.message}`}>
          Made with more
          <span className={styles.heart}>
            <FontAwesomeIcon icon={faHeart} />
          </span>
          by EstarTeam!
        </h1>
        <ul
          className={`nav col-12 col-md-4 justify-content-end list-unstyled d-flex ${styles.icons}`}
        >
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://isengard.market/collection/EQUISTAR-3f393f'
              target='_blank'
              rel='noopener noreferrer'
            >
              Mint
            </a>
          </li>
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://www.instagram.com/estargames/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Instagram />
            </a>
          </li>
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://twitter.com/EstarToken'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Twitter />
            </a>
          </li>
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://www.tiktok.com/@estar.games'
              target='_blank'
              rel='noopener noreferrer'
            >
              <TikTok />
            </a>
          </li>
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://www.youtube.com/channel/UCIIG8P1T9rMWjgUr-e34K3Q'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Youtube />
            </a>
          </li>
          <li className='mr-3'>
            <a
              className='text-muted'
              href='https://www.linkedin.com/company/estar-games/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <LinkedIn />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
