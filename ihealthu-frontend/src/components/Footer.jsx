import React from 'react'
import { Leaf } from '@phosphor-icons/react'
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Leaf size={22} weight="fill" color="var(--sage)" />
        <span>iHealthU</span>
      </div>
      <p className={styles.footerCopy}>© 2026 iHealthU. All rights reserved.</p>
      <div className={styles.footerTeam}>
        <span>GHAMMAD Aya</span>
        <span>BENNOUR Rafaa</span>
        <span>RIAD Marwa</span>
        <span>AMANZOU Amal</span>
      </div>
    </footer>
  )
}

export default Footer
