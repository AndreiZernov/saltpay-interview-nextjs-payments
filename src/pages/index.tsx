import Head from 'next/head';
import style from 'src/styles/modules/home.module.css';
import { useState } from 'react';

type Payment = {
  paymentsId: number;
  currency: string;
  amount: number;
}

type Balance = {
  currency?: string;
  amount: number;
}

const valueFormat = (value: number, countryCurrency = '') => {
  if (!countryCurrency) return value;
  const newValue = value.toLocaleString('en-GB', {
    style: 'currency',
    currency: countryCurrency,
    minimumFractionDigits: countryCurrency !== 'ISK' ? 2 : 0,
    maximumFractionDigits: countryCurrency !== 'ISK' ? 2 : 0,
  });

  return newValue;
};

function Home() {
  const [balance, setBalance] = useState<Balance>({ currency: undefined, amount: 0 });
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleBalanceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const balanceInput = event.target.elements.balance as HTMLInputElement;
    const balanceCurrency = balanceInput.value.split(':')[0];
    const balanceAmount = Number(balanceInput.value.split(':')[1]);

    if (!['GBP', 'EUR', 'ISK'].includes(balanceCurrency)) return;

    const newBalance = balance.amount > 0 && balanceCurrency === balance.currency
      ? balanceAmount + balance.amount : balanceAmount;

    setBalance({ currency: balanceCurrency, amount: newBalance });
  };

  const handlePaymentsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const paymentsInput = event.target.elements.payments as HTMLInputElement;

    const parsedPayments = paymentsInput.value
      .split('\n')
      .map((line: string) => {
        const [paymentsId, currency, amount] = line.split(':');
        return {
          paymentsId: parseInt(paymentsId, 10),
          currency,
          amount: Number(amount),
        };
      });

    const remainingBalance = balance;
    let remainingBalanceAmount = balance.amount;
    const processedPayments: Payment[] = [];

    parsedPayments.forEach((payment: Payment) => {
      const paymentsAmount = payment.amount;
      if (
        payment.currency === remainingBalance.currency
        && paymentsAmount <= remainingBalanceAmount
        && paymentsAmount > 0
      ) {
        remainingBalanceAmount -= paymentsAmount;
        processedPayments.push(payment);
      }
    });

    setBalance({ currency: remainingBalance.currency, amount: remainingBalanceAmount });
    setPayments(payments.concat(processedPayments));
  };

  return (
    <div className={style.home}>
      <header className={style.header}>
        <Head>
          <title>SaltPay Team</title>
          <meta name="description" content="Payments" />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <h3>SaltPay: Payments System</h3>
      </header>
      <div className={style.body}>
        <div className={style.form}>
          <form onSubmit={handleBalanceSubmit} className={style.inputs}>
            <label htmlFor="balance">
              <p>Balance</p>
              <input data-testid="balanceInput" id="balance" required name="balance" type="text" />
            </label>
            <button data-testid="balanceButton" type="submit" className={style.submitButton}>Top Up</button>
          </form>
          <br />
          <form onSubmit={handlePaymentsSubmit} className={style.inputs}>
            <label htmlFor="payments">
              <p>Payments</p>
              <textarea data-testid="paymentsInput" id="payments" required name="payments" />
            </label>
            <button data-testid="paymentsButton" type="submit" className={style.submitButton}>Process Payments</button>
          </form>
          <br />
          <hr />
          <div className={style.output}>
            <p className={style.balance}>
              <span>Balance:</span>
              <span data-testid="balance">{valueFormat(balance.amount, balance.currency)}</span>
            </p>
            <div className={style.payments}>
              <p>Processed Payments:</p>
              <div data-testid="payments">
                {payments.length > 0 ? payments.map((payment: Payment) => (
                  <p key={payment.paymentsId}>
                    <span>{`Payments ID ${payment.paymentsId} `}</span>
                    <span>{valueFormat(payment.amount, payment.currency)}</span>
                  </p>
                )) : 'No payments yet'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className={style.footer}>
        <a href="https://saltpay.com" target="_blank" rel="noopener noreferrer">
          Powered by SaltPay
        </a>
      </footer>
    </div>
  );
}

export default Home;
