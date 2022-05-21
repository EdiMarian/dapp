import React from 'react'

import styles from '../styles.module.scss';
import Buy from './Buy';

const Marketplace_Item = ({ item, socket, address }) => {
  return (
    <div className="col-12 col-md-4 col-lg-3 mt-2">
        <div className={styles.Marketplace_ItemCard}>
          <div className={styles.Marketplace_ItemCardContent}>
            <img
              className={styles.Marketplace_ItemCardContentImg}
              src={item.img}
            />
            <h3
              className={styles.Marketplace_ItemCardContentName}
            >
              {item.name}
            </h3>
            <h4
              className={styles.Marketplace_ItemCardContentDescription}
            >
              {item.description}
            </h4>
            <h4
              className={styles.Marketplace_ItemCardContentAvailable}
            >
              Available: {item.available}
            </h4>
            {item.available === 0 ? (
              <button disabled className={styles.buyBtn}>Sold Out</button>
            ) : (
              <Buy item={item} socket={socket} address={address} />
            )}
          </div>
        </div>
      </div>
  )
}

export default Marketplace_Item;
