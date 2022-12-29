import Head from 'next/head';
import style from './Header.module.css';

function Header() {
  return (
    <header className={style.header}>
      <Head>
        <title>SaltPay Team</title>
        <meta name="description" content="Payments" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <h3>SaltPay: Payments System</h3>
    </header>
  );
}

export default Header;
