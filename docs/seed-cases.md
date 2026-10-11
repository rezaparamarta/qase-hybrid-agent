# Seed test cases — SauceDemo

Used by `/qase-seed` to create a demo suite in Qase. Suite name: **SauceDemo – Hybrid Pilot**.
Password for every user below: the value of `SAUCE_PASSWORD` in `.env` (do not write it into Qase;
steps say "the valid password").

Case 5 is intentionally a **real bug** in SauceDemo (`problem_user` sees the same image on every
product), so the pilot shows how a genuine failure flows through explore → spec → regression.

---

## 1. Login with valid credentials
- **Severity:** critical · **Priority:** high · **Type:** smoke
- **Precondition:** user is logged out.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open the login page | Login form with Username, Password and Login button is shown |
| 2 | Enter username "standard_user" and the valid password | Fields are filled |
| 3 | Click the Login button | User is redirected to /inventory.html and the page title reads "Products" |

## 2. Login with locked-out user is rejected
- **Severity:** major · **Priority:** high · **Type:** functional (negative)
- **Precondition:** user is logged out.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open the login page | Login form is shown |
| 2 | Enter username "locked_out_user" and the valid password | Fields are filled |
| 3 | Click the Login button | User stays on the login page and the error "Epic sadface: Sorry, this user has been locked out." is shown |

## 3. Add a product to the cart
- **Severity:** critical · **Priority:** high · **Type:** functional
- **Precondition:** logged in as "standard_user", cart is empty.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | On the Products page, click "Add to cart" on "Sauce Labs Backpack" | The button changes to "Remove" |
| 2 | Look at the cart icon in the header | The cart badge shows "1" |
| 3 | Click the cart icon | Cart page lists "Sauce Labs Backpack" with quantity 1 |

## 4. Checkout a single item
- **Severity:** critical · **Priority:** high · **Type:** functional (end-to-end)
- **Precondition:** logged in as "standard_user", "Sauce Labs Backpack" is in the cart.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open the cart and click "Checkout" | "Checkout: Your Information" page is shown |
| 2 | Fill First Name "Reza", Last Name "Tester", Postal Code "12190" and click "Continue" | "Checkout: Overview" page shows "Sauce Labs Backpack" and an item total of $29.99 |
| 3 | Click "Finish" | "Thank you for your order!" is shown |

## 5. Product images match their products (problem_user)
- **Severity:** minor · **Priority:** medium · **Type:** functional (UI)
- **Precondition:** user is logged out.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Log in with username "problem_user" and the valid password | Products page is shown |
| 2 | Compare the image of each product on the Products page | Every product shows its own distinct image (no two products share the same image) |
