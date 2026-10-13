# Swanston Autonomous Supermarket

This project simulates a small unattended supermarket near Melbourne Town Hall for 60 consecutive days. The React website displays the reports, Express provides access to stored history and creates new runs, and SQLite stores the data. This is a fictional project for local assessment and has no affiliation with IGA.

## Requirements and start

Use Node.js 24.x and npm 11.x. Node.js 24 is required for the built-in `node:sqlite` module. No credentials, cloud services or environment variables are needed for the default setup.

From the extracted project folder, run:

npm install
npm run dev

Open **http://127.0.0.1:5173/** in your browser. The backend runs on `127.0.0.1:3001`, and Vite forwards `/api` requests to it. Ports 3001 and 5173 must be available.

The included `data/supermarket.sqlite` database already contains the **Submitted Run `SW-20261010015053-w8ceg`**, using seed `20261011` and model version `1.1.0`.

If starting with an empty database, run `npm run seed` before `npm run dev`. The seed command creates a Submitted Run only when one does not already exist. Run `npm test` to check reconciliation and daily audit records, or `npm run build` to build the frontend.

The database is stored in `data/supermarket.sqlite`. To use a different location, set `DB_PATH` when running both the seed and development commands. Keep the included database for assessment because it contains the Submitted Run and its history.

Click **+ New 60-day run** to create another simulation. It receives a separate Run ID and does not replace the Submitted Run. Use the selector at the top of the page to switch between runs. The normal application does not allow completed history to be edited or deleted. Each run’s fixed configuration and 60-day history are saved together in a database transaction.

## Find the assessment evidence

The default **60-Day Report** shows customer activity, basket size, revenue, gross profit, and product and category results.

**Store Brain** shows stockouts, low stock, expiry, slow-moving products, replenishment and closing inventory.

**Diagnosis** presents three findings. Each follows the sequence: observation → evidence → diagnosis → business implication → recommendation.

**Daily Reports** lets you select any day from Day 1 to Day 60 and inspect transactions, basket items, batch IDs, inventory movements, orders, cash records and alerts.

**Commercial Assurance** checks that inventory, revenue and operating cash agree with the stored records and reports any exceptions.

**Model Declaration** shows the selected run’s fixed assumptions, Store Brain rules and 59-product catalogue. If you create another run, use the header selector to return to the Submitted Run.

## Model and data flow

The catalogue contains 59 products across eight categories. Opening inventory costs **A$9,952**, within the A$40,000 budget. Any unused inventory budget remains separate from the A$15,000 starting operating cash. All money calculations use integer cents to avoid rounding errors.

Customers have four shopping missions: commute, lunch, top-up and essentials. These affect their product choices and basket sizes. Daily customer numbers use seeded Poisson sampling, with a baseline of 110 customers on weekdays and 82 on weekends. The model also includes daily variation, a small growth assumption and busier commuter and lunch hours. Unavailable requested products are skipped, while visits and completed sales are still recorded.

The simulation tracks stock in batches and sells the oldest available stock first. At the start of each day, the previous day’s orders arrive and expired stock is removed before customers shop.

At closing, the Store Brain estimates demand using recent sales and product baselines. It records sold-out products, low stock coverage, approaching expiry and slow-moving stock. Sold-out products are reviewed first, followed by products with fewer estimated days of stock remaining.

The Store Brain avoids replenishing overstocked slow movers, limits perishable orders using shelf life, and keeps spending within available cash. Orders are paid for when placed and arrive before customers on the next day. No orders are placed on Day 60 because they would arrive after the simulation ends.

The main code is in `server/catalog.js`, `server/sim.js`, `server/db.js` and `server/report.js`. The frontend reports are displayed through `client/main.jsx`.

`runs.config` and `products` store each run’s fixed model inputs. The `customers`, `transactions`, `sale_items`, `batches`, `movements`, `orders`, `brain_events`, `cash_events` and `days` tables store its operating history.

Reports calculate totals from that history. Assurance checks compare product stock, batch usage, transaction amounts, daily revenue and cash balances. Viewing reports does not change completed records. SQLite is the only persistent database.

The database uses WAL mode. Close the application before copying or packaging the database so pending changes can be saved into the main database file.

## AI collaboration and review

I used **OpenAI Codex** to assist with drafting and refining application code and documentation. I reviewed the work and remained responsible for validating and explaining the final system.


## Limits

Customer traffic, prices, supplier terms and shopping behaviour are assumptions rather than measurements from a real store. Theft, returns, rent, electricity, refrigeration costs, equipment, payment fees, taxes and remote management expenses are outside the model.

Gross profit and closing cash do not show net profit or prove that a real store would be financially viable. Stockout alerts describe stock levels at closing, and unavailable basket items are not recorded individually as lost sales.

The simulation starts on a synthetic Monday, so weekday and weekend comparisons apply to the simulated period. Real store data would be needed to validate the assumptions and recommendations.

