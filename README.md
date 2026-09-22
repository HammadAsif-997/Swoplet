# 🔄 Swoplet — Fulda University Marketplace Platform

A full-stack, university-restricted marketplace web application built for the **Global Software Development (GSDS) Master Team Project, Summer 2025** at **Hochschule Fulda**. Swoplet lets verified Fulda University students, faculty and staff securely buy, sell and swap items within their own campus community — solving the trust, authenticity and fair-pricing problems of public marketplaces.

> ⚠️ **Status:** This was a semester project deployed for demonstration/testing during the course (Render + AWS RDS). It is no longer live, and the UI carried the required banner *"Fulda University of Applied Sciences Software Engineering Project, Summer 2025 – For Demonstration Only"* on every page, per the course's non-functional requirements.

---

## 👥 Team Members

| Name             | Email                                          | GitHub Username     | Role                |
|------------------|------------------------------------------------|---------------------|---------------------|
| **Hammad Asif**      | **hammad.asif@informatik.hs-fulda.de**             | **@HammadAsif-997**     | **Team Lead**           |
| Hamza Butt       | muhammad-hamza.butt@informatik.hs-fulda.de     | @hamza-butt         | Frontend Developer  |
| Karan Patel      | karan-hiteshkumar.patel@informatik.hs-fulda.de | @PatelKaran0104     | Github Lead         |
| Pooja Vayal      | pooja.puthu-vayal@informatik.hs-fulda.de       | @Poojapv16          | Backend Lead        |
| Akhil  Sajan     | akhil.sajan@informatik.hs-fulda.de             | @akhxls             | Frontend Lead       |   
| Hasara Koralege  | hasara-nimashi.koralege@informatik.hs-fulda.de | @HNK-ENG            | Backend Developer   |

---

## 💡 Product Summary

Buying, selling and exchanging items within a university community is poorly served by public marketplaces — they raise concerns about security, pricing fairness and item authenticity. Swoplet closes that gap with a platform restricted to verified `@hs-fulda.de` email addresses, moderator oversight, and an **AI-powered pricing assistant** that helps users estimate a fair market price before a transaction — the project's stated Unique Selling Point.

---

## 🛠️ Tech Stack & Architecture

```
Client → React + Tailwind CSS → NGINX → Backend (Node.js + Express) → MySQL
                                              ↕
                                          Firebase (media storage)

CI/CD: GitHub Actions  |  Hosting: AWS EC2 (planned) / Render (deployed) + AWS RDS (MySQL)
```

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router DOM, Socket.io Client |
| Backend | Node.js, Express.js, Sequelize ORM, Socket.io |
| Database | MySQL (hosted on AWS RDS) |
| Media Storage | Firebase |
| Auth & Security | JWT, bcrypt password hashing, express-validator |
| AI/ML | Flask microservice for price prediction |
| CI/CD | GitHub Actions |
| Reverse Proxy | NGINX |

---

## ✨ Features (from the committed P1 requirement list)

- **University-verified registration** — sign-up restricted to official `@hs-fulda.de` email addresses
- **Browse, search, filter & sort listings** by category, price and recency
- **Internal messaging** — buyers and sellers chat in real time via Socket.io without sharing personal contact details
- **Wishlist / Favourites** — save items for later
- **Seller dashboard** — create, edit, delete, hide, and mark listings as sold
- **Media uploads** — up to 4 images per listing, stored via Firebase
- **Admin approval workflow** — every listing is reviewed before going public
- **Admin moderation** — remove content, ban/warn abusive users, handle reports
- **Seller reviews & ratings** — buyers rate sellers after a transaction
- **AI-powered price prediction** *(see below)* — the project's Unique Selling Point
- **Location autocomplete** for listings
- **Share listings** externally

---

## 🤖 AI Price Prediction — My Contribution

I built the **`ProductDetailPage.jsx`** page (peer-reviewed by a teammate as part of our formal code review process), which integrates the platform's AI pricing feature:

- A **"Predict Price"** button calls a separate **Flask ML microservice**
- The frontend sends the product's **Title, Description, Category and Condition**
- The model returns a **predicted average market price**, shown instantly to the user
- Designed to reduce mispricing and support fairer, more transparent transactions

```js
POST https://gsds-2025-team-6-flask.onrender.com/predict
Body: { Title, Description, Category, Condition }
→ { predicted_price }
```

I also reviewed a teammate's **`sellerreview.controller.js`** as part of our peer code-review cycle.

---

## ✅ Quality Assurance

This wasn't just "build and ship" — the team ran a full QA and usability process:

- **Formal QA test plan** for the Create-Listing flow: field validation, image upload limits/format checks, category requirements — tested and passed on Chrome and Edge
- **Usability testing** with 8 real test participants, measuring task success rate, time-on-task and satisfaction via a Likert-scale questionnaire. Results included:
  - 50% "strongly agree" + 12.5% "agree" that Swoplet is easy to navigate and use
  - 62.5% "strongly agree" + 25% "agree" that creating/managing listings is straightforward
  - 75% "strongly agree" or "agree" with overall satisfaction using Swoplet
- **Peer code reviews** across the team, each with a named reviewer, owner, file, strengths and concrete improvement suggestions (DRY violations, missing null checks, hardcoded status codes, etc.)
- **Security self-check**: bcrypt-hashed passwords, JWT-authenticated API routes, input validation and sanitization on both frontend and backend, role-based access control for the admin dashboard, database isolated in a private AWS subnet

---

## 📁 Project Structure

```
├── Backend/
│   ├── controllers/          # auth, chat, productlisting, productsearch,
│   │                         # favourite, sellerreview, userreport, share
│   ├── models/                # Sequelize models (Users, ProductListings,
│   │                         # Chat, Messages, Favourites, Reports, MediaFiles...)
│   ├── routes/, middleware/, validator/, utils/
│   └── server.js / socket.js
├── UI/
│   └── src/
│       ├── Pages/             # Auth, Chat, ProductDetail, MyListings, AdminDashboard
│       ├── components/        # Home, Marketplace, Chat, WishList, Common
│       └── hooks/, context/, utils/
└── Milestones/                # Requirements docs, QA plan, code reviews, wireframes
```

---

## 🖼️ Screenshots

The deployment is no longer live, but here's the finished product from our final milestone submission:

**Search & Filter Results**
![Search results page](swoplet_screenshots/search-results-page.png)

**Product Detail Page** — including the AI price prediction widget
![Product detail page](swoplet_screenshots/product-detail-page.png)

**Real-time Messaging**
![Messaging page](swoplet_screenshots/messaging-page.png)

Our original hand-drawn wireframes (Home, Login, Profile, Create Listing, My Listings, Marketplace/filters, Chat, Registration) used to plan the UI before building it in React are in `/Milestones/wireframes`.

---

## ▶️ Getting Started

```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd UI
npm install
npm run dev
```

---

## 👤 Team Lead

**Hammad Asif**
- 📧 hmmd97@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/hammad-asif-26466a91)
- 💻 [GitHub](https://github.com/HammadAsif-997)
