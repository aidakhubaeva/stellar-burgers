# Stellar Burgers

**"Stellar Burgers"** is a cosmic burger builder where you can create your own "out-of-this-world" burger.


[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

![Stellar Burgers](https://drive.google.com/uc?export=view&id=1qiRng4JMiPNuOtI2a152olQgftKUYDdA)

---

### What Was Done:

- ✅ **Routing Setup**:
  - Installed the `react-router-dom` library.
  - Configured routes for the application pages:
    - `/` — `ConstructorPage` component.
    - `/feed` — `Feed` component.
    - `/login`, `/register`, `/forgot-password`, `/reset-password`, `/profile`, `/profile/orders` — protected routes with corresponding components.
    - `*` — `NotFound404` component.
  - Configured modals for additional information:
    - `/feed/:number` — modal with the `OrderInfo` component.
    - `/ingredients/:id` — modal with the `IngredientDetails` component.
    - `/profile/orders/:number` — modal with the `OrderInfo` component.

- ✅ **Server Integration**:
  - Created a **global store** using Redux.
  - Configured API requests using `utils/burger-api.ts`.
  - Developed **slices** with `createSlice` and `Thunk functions` to fetch data from the server.
  - Implemented data rendering from the store using selectors.

- ✅ **Authorization**:
  - Implemented authorization checks and protected routes.
  - If the user is not authorized, they are redirected to the login page when trying to place an order or access the profile.
  - Developed registration, login, and profile editing functionalities:
    - Profile data can be edited, canceled, or saved through API requests.
    - After successful login, the user gains access to their order history and personal data.

- ✅ **Modal and UX Enhancements**:
  - Clicking on an ingredient or an order opens modal windows with detailed information.
  - Real-time order feed updates were implemented.
  - Loaders were added for better user experience during API requests.

---

### Application Features:
1. **Burger Constructor**:
   - Users can view a list of ingredients and add them to the constructor.
   - The total order price is calculated automatically.

2. **Order Feed**:
   - The feed updates in real time.
   - Displays order details, including total price and status.

3. **Order History**:
   - Accessible only to authorized users.
   - Displays detailed information about the status and contents of each order.

4. **Modal Windows**:
   - Open upon clicking ingredients or orders for more details.

---

### Critical Requirements:
This section outlines the tests and configurations implemented to ensure the project meets all requirements:

#### Application Testing:
- Set up and configured **Cypress** and **Jest** testing libraries.
- Added `scripts` in the `package.json` file to run Cypress and Jest tests.
- Grouped tests related to specific functionalities into `describe` blocks with clear descriptions.
- All tests are written in **TypeScript**.
- Uniform code formatting and naming conventions are maintained across all test files.

#### Cypress Tests:
- **Test Cases**:
  - Adding ingredients from the list to the burger constructor.
  - Opening and closing the modal window with ingredient details.
  - Verifying that the modal displays the correct ingredient data.
  - Creating an order: adding ingredients to the constructor, verifying the modal with the correct order number, and checking that the constructor is cleared after order submission.
- **Additional Configurations**:
  - Created mock response data in the `cypress/fixtures` folder.
  - Used `cy.intercept` to mock all backend requests during tests.
  - Before the order creation test, fake authorization tokens are set in `localStorage` and cookies, and they are cleared after the test.

#### Jest Tests:
- **Test Cases**:
  - Verifying `rootReducer` behavior: calling `rootReducer` with `undefined` state and an unknown action (e.g., `{ type: 'UNKNOWN_ACTION' }`) returns the correct initial state.
  - Testing the burger constructor reducer for handling actions related to adding and removing ingredients.
  - Testing reducers for handling actions generated during async requests: actions for request initiation, successful response, and errors.

---

With all features and tests in place, Stellar Burgers is ready to deliver the most delicious cosmic burgers to any corner of the universe! 🚀🍔
