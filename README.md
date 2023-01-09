# Overview

SaltPay is acquiring merchants across Europe who are paid out daily, with the funds coming from SaltPay’s bank account.

Your objective is to write an App that will support a part of the payment system, it should allow input of the balances, and payments and be able to process them accordingly to business rules.

<b>Business Rules:</b>

- Only GBP and EUR currencies should be supported
- Before paying out, deduct processing fees for each payment as a % of the amount being processed: 1/3rd of a percent for GBP, 1/2 a percent for the other currencies
- For each balance (`balance` -> `currency`), process payments that can be paid based on the funds available
- When paying merchants, amounts should always be rounded up (e.g. `43.545` -> `43.55`, `43.512` -> `43.52`, `43.5102` -> `43.52`)

## The app should implement the following functionalities:

- The initial view should display two input fields and two buttons for Balances and Payments. The output should show No balances and No payments
- Filling the balances input and clicking Top Up should reflect the right balance in the output
- Filling the payments input and clicking Process Payments should reflect the right payments in the output

## Technical details:

- <b>Balance Fields</b>: Currency, and amount. (e.g. `GBP:100`,`EUR:200`)
- <b>Payments Fields</b>: Payment ID, currency, and amount. (e.g. `743:EUR:5.76`, `932:GBP:32.10`)
- <b>Testing</b>: The following `data-testid` attributes are required in the component for the tests to pass:

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

