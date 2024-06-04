# StockMonitor

**Introduction**

StockMonitor is a web application that allows users to subscribe to a wide range of stocks and track the company's analytics and historical data.

## Tech Stack

* **Backend:** NestJS, MongoDB, redis and jwt
* **Frontend:** Next.js, tailwind and redux

**Backend Architecture**

The backend is meticulously structured into distinct modules, each encapsulating specific functionalities:

- **Auth:**
  - signup - Handles user signup (creating accounts and creates and session for login).
  - login- Verifies login credentials and authorization, and establishes login sessions.
  - renewaccess - Provides a mechanism for refreshing access tokens upon expiration, utilizing a refresh token stored in an HTTP-only cookie.
  - logout - Enables secure logout operations, clearing cookies on the client-side.
- **Admin:**
  - Authenticated admins can view a comprehensive user list with subscription details, and disable/enable user accounts.
- **Subscriptions:**
  - This module allows users to manage their interests by adding, removing, and viewing subscribed stocks for easy tracking.
- **Stocks:**
  - Although this api is currently not implemented due to API limitations, it was designed to search for stocks using Alpha Vantage and display the results.
  - Fetches comprehensive company details based on provided stock symbols. Employs caching to minimize API calls and improve response times.
  - Serves historical stock data (daily, weekly, monthly) for specified symbols. Employs caching to minimize API calls and improve response times.

**Frontend Architecture**

- **Auth (/ and /register):**
  - Provides dedicated routes for user login and account creation workflows.
- **User Login (/dashboard):**
  - Upon successful login, users are presented with a dashboard featuring two interactive tables.
    - The first table displays a comprehensive list of available stocks. Users can seamlessly subscribe to these stocks.
    - The second table showcases all the user's currently subscribed stocks, allowing them to view details and easily unsubscribe as needed.
- **Stock Details (/dashboard/:stock):**
  - Users can navigate to a specific stock's detail page by clicking on its symbol in the dashboard.
  - This page visually presents interactive charts (daily, weekly, monthly) and vital company information for investment decisions.
- **Admin Login (/admin):**
  - Admins can access this dedicated portal to view a complete list of all users, along with options to disable or enable user accounts as necessary.

**Docker Architecture**
- Individual Dockerfiles are created for the NestJS and Next.js applications. These Dockerfiles build their respective images, and a Docker Compose file orchestrates the process. When run, the Docker Compose file creates the build images for both the server and UI, then starts containers that run on port 1337 for the backend and port 3000 for the UI.

**Note:** Due to Alpha Vantage's API limitations, StockMonitor currently retrieves a static CSV file containing stock information for user display.

**Development Environment Setup**

To use on the StockMonitor app in local, ensure you have Docker and Docker Compose installed on your system.


1. **Clone the Project:**

   ```bash
   git clone git@github.com:samuelp244/StockMonitor.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd StockMonitor
   ```

3. **Start the Application:**

    ```bash
    docker-compose up
    ```

4. **Access the Application:**

    - Open http://localhost:3000 to use StockMonitor application.

    - Register for a new account using the signup - /register.

    - Admin Access: The default admin credentials are username: admin@stockmonitor.com and password: 1234. 

5. **Stop the Application:**

    ```bash
    docker-compose down --remove-orphans
    ```


**Disclaimer**

Alpha Vantage API Limitations: The current implementation utilizes a static CSV file stored in frontend for stock symbols due to Alpha Vantage's API limitations of 5 requests/minute and 25 requests/day. These limitations significantly hinder user experience because company financial information requires the latest data. To mitigate this, a caching mechanism is implemented to store downloaded data for one day, as only daily, monthly, and weekly data is used.
