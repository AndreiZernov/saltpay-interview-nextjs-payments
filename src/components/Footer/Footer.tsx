import style from './Footer.module.css';

function Footer() {
  return (
    <footer className={style.footer}>
      <a href="https://saltpay.com" target="_blank" rel="noopener noreferrer">
        Powered by SaltPay
      </a>
    </footer>
  );
}

export default Footer;
