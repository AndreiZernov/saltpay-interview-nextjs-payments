import { render, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/index';
import '@testing-library/jest-dom';

const TEST_IDS = {
  input: {
    balancesInput: 'balancesInput',
    paymentsInput: 'paymentsInput',
  },
  button: {
    balancesButton: 'balancesButton',
    paymentsButton: 'paymentsButton',
  },
  output: {
    balances: 'balances',
    payments: 'payments',
  },
};

describe('Payments System', () => {
  let getByTestId;
  let balancesInput: HTMLElement;
  let paymentsInput: HTMLElement;
  let balancesButton: HTMLElement;
  let paymentsButton: HTMLElement;
  let balances: HTMLElement;
  let payments: HTMLElement;

  beforeEach(() => {
    const app = render(<Home />);

    getByTestId = app.getByTestId;
    balancesInput = getByTestId(TEST_IDS.input.balancesInput);
    paymentsInput = getByTestId(TEST_IDS.input.paymentsInput);
    balancesButton = getByTestId(TEST_IDS.button.balancesButton);
    paymentsButton = getByTestId(TEST_IDS.button.paymentsButton);
    balances = getByTestId(TEST_IDS.output.balances);
    payments = getByTestId(TEST_IDS.output.payments);
  });

  afterEach(() => {
    cleanup();
  });

  describe('App Initialization', () => {
    it('inputs and buttons should be rendered', () => {
      expect(balancesInput).toBeInTheDocument();
      expect(paymentsInput).toBeInTheDocument();
      expect(balancesButton).toBeInTheDocument();
      expect(paymentsButton).toBeInTheDocument();
    });

    it('balances and payments lists should be empty', () => {
      expect(payments.children[0].textContent).toEqual('No payments');
      expect(balances.children[0].textContent).toEqual('No balances');
    });
  });

  describe('Balance Actions', () => {
    it('should be able to update the EUR balance', () => {
      userEvent.type(balancesInput, 'EUR:100');
      fireEvent.click(balancesButton);

      expect(balances.children[0].textContent).toEqual('EUR Account €100.00');
    });

    it('should be able to update the EUR balance and round up to two decimals', () => {
      userEvent.type(balancesInput, 'EUR:100.206');
      fireEvent.click(balancesButton);

      expect(balances.children[0].textContent).toEqual('EUR Account €100.21');
    });

    it('should be able to update the GBP balance', () => {
      userEvent.type(balancesInput, 'GBP:100');
      fireEvent.click(balancesButton);

      expect(balances.children[0].textContent).toEqual('GBP Account £100.00');
    });

    describe('Multiple Balances', () => {
      it('should be able to update the balances', () => {
        userEvent.type(balancesInput, 'EUR:100,GBP:100');
        fireEvent.click(balancesButton);

        expect(balances.children[0].textContent).toEqual('EUR Account €100.00');
        expect(balances.children[1].textContent).toEqual('GBP Account £100.00');
      });
    });

    describe('Balance Input Validation', () => {
      it('should not be updated if currency not supported', () => {
        userEvent.type(balancesInput, 'USD:100');
        fireEvent.click(balancesButton);

        expect(balances.children[0].textContent).toEqual('No balances');
      });

      it('should not be updated if amount is not a number', () => {
        userEvent.type(balancesInput, 'USD:abc');
        fireEvent.click(balancesButton);

        expect(balances.children[0].textContent).toEqual('No balances');
      });

      it('should not be updated if amount is negative number', () => {
        userEvent.type(balancesInput, 'USD:-100');
        fireEvent.click(balancesButton);

        expect(balances.children[0].textContent).toEqual('No balances');
      });
    });
  });

  describe('Payments Actions', () => {
    it('should be processed account balance and one payment with 1/2 fee', () => {
      userEvent.type(balancesInput, 'EUR:1000');
      fireEvent.click(balancesButton);

      userEvent.type(paymentsInput, '764:EUR:100');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 €99.50');

      expect(payments).not.toHaveTextContent('No payments');
      expect(balances.children[0].textContent).toEqual('EUR Account €900.50');
    });

    it('should be processed account balance and one payment with 1/3 fee', () => {
      userEvent.type(balancesInput, 'GBP:1000');
      fireEvent.click(balancesButton);

      userEvent.type(paymentsInput, '764:GBP:100');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 £99.67');

      expect(payments).not.toHaveTextContent('No payments');
      expect(balances.children[0].textContent).toEqual('GBP Account £900.33');
    });

    it('should be processed account balance and one payment and round up to two decimals', () => {
      userEvent.type(balancesInput, 'EUR:100');
      fireEvent.click(balancesButton);

      userEvent.type(paymentsInput, '764:EUR:20.106');
      fireEvent.click(paymentsButton);

      expect(payments.children[0].textContent).toEqual('Payments ID 764 €20.01');

      expect(payments).not.toHaveTextContent('No payments');
      expect(balances.children[0].textContent).toEqual('EUR Account €79.99');
    });

    describe('Multiple Payments', () => {
      it('should be processed with the same currency as balance', () => {
        userEvent.type(balancesInput, 'EUR:100');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '764:EUR:10,765:EUR:20');
        fireEvent.click(paymentsButton);

        expect(payments.children[0].textContent).toEqual('Payments ID 764 €9.95');
        expect(payments.children[1].textContent).toEqual('Payments ID 765 €19.90');

        expect(balances.children[0].textContent).toEqual('EUR Account €70.15');
      });

      it('should be processed for Multiple Balances', () => {
        userEvent.type(balancesInput, 'EUR:100,GBP:100');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '764:EUR:10,765:GBP:20');
        fireEvent.click(paymentsButton);

        expect(payments.children[0].textContent).toEqual('Payments ID 764 €9.95');
        expect(payments.children[1].textContent).toEqual('Payments ID 765 £19.93');

        expect(balances.children[0].textContent).toEqual('EUR Account €90.05');
        expect(balances.children[1].textContent).toEqual('GBP Account £80.07');
      });

      it('should ignore all payments with different currency then balances', () => {
        userEvent.type(balancesInput, 'EUR:100');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '764:EUR:10,765:GBP:20,766:ISK:20,767:USD:20');
        fireEvent.click(paymentsButton);

        expect(payments.children[0].textContent).toEqual('Payments ID 764 €9.95');

        expect(payments).not.toHaveTextContent('Payments ID 765');
        expect(payments).not.toHaveTextContent('Payments ID 766');
        expect(payments).not.toHaveTextContent('Payments ID 767');

        expect(balances.children[0].textContent).toEqual('EUR Account €90.05');
      });
    });

    describe('Payments Input Validation', () => {
      it('should not be processed if balance is not enough', () => {
        userEvent.type(balancesInput, 'EUR:10');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '763:EUR:20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments');
        expect(balances.children[0].textContent).toEqual('EUR Account €10.00');
      });

      it('should not be processed if the currency is different from balances', () => {
        userEvent.type(balancesInput, 'EUR:10');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '764:GBP:20');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments');
        expect(balances.children[0].textContent).toEqual('EUR Account €10.00');
      });

      it('should not be processed if payment amount is 0 or below', () => {
        userEvent.type(balancesInput, 'EUR:10');
        fireEvent.click(balancesButton);

        userEvent.type(paymentsInput, '765:EUR:-20,766:EUR:0');
        fireEvent.click(paymentsButton);

        expect(payments).toHaveTextContent('No payments');
        expect(balances.children[0].textContent).toEqual('EUR Account €10.00');
      });
    });
  });
});
