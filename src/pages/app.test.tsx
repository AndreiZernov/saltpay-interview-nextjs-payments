import { render, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './index';
import '@testing-library/jest-dom';

const TEST_IDS = {
  input: {
    balanceInput: 'balanceInput',
    paymentsInput: 'paymentsInput',
  },
  button: {
    balanceButton: 'balanceButton',
    paymentsButton: 'paymentsButton',
  },
  output: {
    balance: 'balance',
    payments: 'payments',
  },
};

describe('Payments System', () => {
  let getByTestId;
  let balanceInput: HTMLElement;
  let paymentsInput: HTMLElement;
  let balanceButton: HTMLElement;
  let paymentsButton: HTMLElement;
  let balance: HTMLElement;
  let payments: HTMLElement;

  beforeEach(() => {
    const app = render(<Home />);
    getByTestId = app.getByTestId;
    balanceInput = getByTestId(TEST_IDS.input.balanceInput);
    paymentsInput = getByTestId(TEST_IDS.input.paymentsInput);
    balanceButton = getByTestId(TEST_IDS.button.balanceButton);
    paymentsButton = getByTestId(TEST_IDS.button.paymentsButton);
    balance = getByTestId(TEST_IDS.output.balance);
    payments = getByTestId(TEST_IDS.output.payments);
  });

  afterEach(() => {
    cleanup();
  });

  describe('App Initialization', () => {
    it('payments list should be empty', () => {
      expect(payments).toHaveTextContent('No payments yet');
    });

    it('balance should be 0', () => {
      expect(balance).toHaveTextContent('0');
    });
  });

  describe('Balance Actions', () => {
    it('should be updated with 100 EUR', () => {
      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      expect(balance).toHaveTextContent('€100.00');
    });

    it('should be updated with 100 GBP', () => {
      userEvent.type(balanceInput, 'GBP:100');
      fireEvent.click(balanceButton);

      expect(balance).toHaveTextContent('£100.00');
    });

    it('should be updated with 100 ISK', () => {
      userEvent.type(balanceInput, 'ISK:100');
      fireEvent.click(balanceButton);

      expect(balance).toHaveTextContent('ISK 100');
    });

    it('should be updated more then 1 times for the same currency', () => {
      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      userEvent.clear(balanceInput);

      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      expect(balance).toHaveTextContent('€200.00');
    });

    describe('Balance Input Validation', () => {
      it('should not be updated if currency not supported', () => {
        userEvent.type(balanceInput, 'USD:100');
        fireEvent.click(balanceButton);

        expect(balance).toHaveTextContent('0');
      });

      it('should not be updated if amount is not a number', () => {
        userEvent.type(balanceInput, 'USD:abc');
        fireEvent.click(balanceButton);

        expect(balance).toHaveTextContent('0');
      });

      it('should not be updated if amount is negative', () => {
        userEvent.type(balanceInput, 'USD:-100');
        fireEvent.click(balanceButton);

        expect(balance).toHaveTextContent('0');
      });
    });
  });

  describe('Payments', () => {
    it('should be processed with 20 EUR', () => {
      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      userEvent.type(paymentsInput, '764:EUR:20');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 €20.00');

      expect(balance).toHaveTextContent('€80.00');
      expect(payments).not.toHaveTextContent('No payments yet');
    });

    describe('Payments Input Validation', () => {
      it('should not be processed if not enough balance', () => {
        userEvent.type(balanceInput, 'EUR:10');
        fireEvent.click(balanceButton);

        userEvent.type(paymentsInput, '764:EUR:20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments yet');
        expect(balance).toHaveTextContent('€10.00');
      });

      it('should not be processed if currency is different from balance', () => {
        userEvent.type(balanceInput, 'EUR:100');
        fireEvent.click(balanceButton);

        userEvent.type(paymentsInput, '764:GBP:20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments yet');
        expect(balance).toHaveTextContent('€100.00');
      });

      it('should not be processed if currency is not supported', () => {
        userEvent.type(balanceInput, 'EUR:100');
        fireEvent.click(balanceButton);

        userEvent.type(paymentsInput, '764:USD:20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments yet');
        expect(balance).toHaveTextContent('€100.00');
      });

      it('should not be processed if amount is 0', () => {
        userEvent.type(balanceInput, 'EUR:100');
        fireEvent.click(balanceButton);

        userEvent.type(paymentsInput, '764:EUR:0');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments yet');
        expect(balance).toHaveTextContent('€100.00');
      });

      it('should not be processed if amount is negative', () => {
        userEvent.type(balanceInput, 'EUR:100');
        fireEvent.click(balanceButton);

        userEvent.type(paymentsInput, '764:EUR:-20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments yet');
        expect(balance).toHaveTextContent('€100.00');
      });
    });
  });

  describe('Multiple Payments', () => {
    it('should be processed with the same currency as amount', () => {
      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      userEvent.type(paymentsInput, '764:EUR:10\n765:EUR:20');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 €10.00');
      expect(payments.children[1].textContent).toEqual('Payments ID 765 €20.00');

      expect(balance).toHaveTextContent('€70.00');
    });

    it('should ignore all payments with different currency then amount', () => {
      userEvent.type(balanceInput, 'EUR:100');
      fireEvent.click(balanceButton);

      userEvent.type(paymentsInput, '764:EUR:10\n765:GBP:20\n766:ISK:20\n767:USD:20');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 €10.00');

      expect(payments).not.toHaveTextContent('£20.00');
      expect(payments).not.toHaveTextContent('Payments ID 765');

      expect(payments).not.toHaveTextContent('ISK 20');
      expect(payments).not.toHaveTextContent('Payments ID 766');

      expect(payments).not.toHaveTextContent('USD 20');
      expect(payments).not.toHaveTextContent('Payments ID 767');

      expect(balance).toHaveTextContent('€90.00');
    });
  });
});
