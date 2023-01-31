# Overview

As an international payments provider, SaltPay handles customer transactions on behalf of merchants. Each day we pay our merchants the value of their transactions from SaltPay's bank account - minus a processing fee - in a process known as "settling".

Your objective is to simulate the flow of a settlement by creating a simple web page that supports both the input of incoming balance top-ups to our bank account, as well as outgoing payments to merchants.

# Acceptance Criteria

<b>Business Logic:</b>

- The page should support two currencies (GBP and EUR), with each currency having its own total balance
- When processing payments, fees should be deducted from each payment as a percentage of the amount being processed:
- For payments in GBP - one third of a percent of the total payment amount
- For payments in EUR - one half of a percent of the total payment amount
- Only payments that can be paid in full from the corresponding currency's balance should be processed successfully
- The final value of a payment (post processing fee) should always be rounded up to two decimal places

<b>Functionality</b>

- The page should include two forms with an input field and submit button - one for entering balance top-ups and one for entering payments
- Balance top-ups should be entered in the format of "currency:amount" (e.g. GBP:100,EUR:200)
- Payments should be entered in the format of "ID:currency:amount" (e.g. 1:EUR:5.76,2:GBP:32.10)
- The page should render a list of balances and a list of payments, which should display "No balances" / "No payments" when empty
- Entering a balance top-up should update the total balance for that currency in the list
- Details of each payment (including the payment ID and currency) should be added to the list of payments when entered

# Technical details:

There is a suite of tests that will run against your code to validate your implementation. In order for these tests to work, they rely on your UI components having these specific data-testid attributes:

<table>
  <tr>
    <th>Component</th>
    <th>Attribute</th>
  </tr>
  <tr>
    <td>Balances Input</td>
    <td>balancesInput</td>
  </tr>
    <tr>
    <td>Payments Input</td>
    <td>paymentsInput</td>
  </tr>
    <tr>
    <td>Balances “Top Up” Button</td>
    <td>balancesButton</td>
  </tr>
    <tr>
    <td>Payments “Process Payments” Button</td>
    <td>paymentsButton</td>
  </tr>
    <tr>
    <td>Balances Output</td>
    <td>balances</td>
  </tr>
    <tr>
    <td>Payments Output</td>
    <td>payments</td>
  </tr>
</table>


<i>Please note that the component has `data-testid `attributes for test cases. They should not be changed.</i>

