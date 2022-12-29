import { useState } from 'react';
import style from 'src/styles/modules/home.module.css';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

type Payment = {
  paymentsId: number;
  currency: string;
  amount: number;
}

type Balance = {
  currency: string;
  amount: number;
}

const supportedCurrencies = ['GBP', 'EUR'];

const valueFormat = (value: number, countryCurrency = '') => {
  if (!countryCurrency) return value;
  const newValue = value.toLocaleString('en-GB', {
    style: 'currency',
    currency: countryCurrency,
  });

  return newValue;
};

const withFee = (amount: number, currency: string) => {
  const fee = currency === 'GBP' ? 3 : 2;
  return amount - amount / 100 / fee;
};

function Home() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleBalancesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const balancesInput = event.target.elements.balances as HTMLInputElement;

    const parsedBalances = balancesInput.value
      .split(',')
      .filter((line: string) => {
        const [currency] = line.split(':');
        if (!supportedCurrencies.includes(currency)) return false;
        return true;
      }).map((line: string) => {
        const [currency, amount] = line.split(':');
        return { currency, amount: Number(amount) };
      });

    const processedBalances: Balance[] = [];

    parsedBalances.forEach((b) => {
      const currency = balances.find((c) => c.currency === b.currency);
      if (!!currency && b.amount > 0) {
        processedBalances.push({
          currency: b.currency,
          amount: b.amount + currency.amount,
        });
      } else {
        processedBalances.push({
          currency: b.currency,
          amount: b.amount,
        });
      }
    });
    setBalances(processedBalances);
  };

  const handlePaymentsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const paymentsInput = event.target.elements.payments as HTMLInputElement;

    const parsedPayments = paymentsInput.value
      .split(',')
      .map((line: string) => {
        const [paymentsId, currency, amount] = line.split(':');

        return {
          paymentsId: parseInt(paymentsId, 10),
          currency,
          amount: withFee(Number(amount), currency),
        };
      });

    const processedPayments: Payment[] = [];
    const processedBalances: Balance[] = balances;

    parsedPayments.forEach((payment) => {
      const remainingBalance = processedBalances.find((b) => b.currency === payment.currency);
      if (!remainingBalance) return;
      if (
        payment.currency === remainingBalance.currency
        && payment.amount <= remainingBalance.amount
        && payment.amount > 0
      ) {
        remainingBalance.amount -= payment.amount;
        processedPayments.push(payment);
      }
    });

    setBalances(processedBalances);
    setPayments(payments.concat(processedPayments));
  };

  return (
    <div className={style.home}>
      <Header />
      <div className={style.body}>
        <div className={style.form}>
          <form onSubmit={handleBalancesSubmit} className={style.inputs}>
            <label htmlFor="balances">
              <p>Balances</p>
              <textarea data-testid="balancesInput" id="balances" required name="balances" />
            </label>
            <button data-testid="balancesButton" type="submit" className={style.submitButton}>Top Up</button>
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
            <div className={style.list}>
              <p>Balances:</p>
              <div data-testid="balances">
                {balances.length > 0 ? balances.map((balance: Balance) => (
                  <p key={balance.currency}>
                    <span>{`${balance.currency} Account `}</span>
                    <span>{valueFormat(balance.amount, balance.currency)}</span>
                  </p>
                )) : <span>No balances</span>}
              </div>
            </div>
            <div className={style.list}>
              <p>Processed Payments:</p>
              <div data-testid="payments">
                {payments.length > 0 ? payments.map((payment: Payment) => (
                  <p key={payment.paymentsId}>
                    <span>{`Payments ID ${payment.paymentsId} `}</span>
                    <span>{valueFormat(payment.amount, payment.currency)}</span>
                  </p>
                )) : <span>No payments</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
