# 🌍 **Global Tax Calculator**

**A premium, interactive financial tool providing real-time salary breakdowns, dynamic tax analytics, and professional PDF reporting for global users.**

---

## 🚀 **Overview**

**This application is designed to simplify complex international tax laws into an intuitive, visual experience.** **Whether you are an expat, a remote worker, or a financial planner, the Global Tax Calculator provides precise "Take-Home" pay estimates by accounting for regional tax brackets, standard deductions, and personal allowances.**

---

## ✨ **Core Features**

* 🖼️ **Premium Glassmorphism UI**: **A modern, high-performance interface featuring backdrop filters and a responsive grid layout for all devices.**
* ⚙️ **Advanced Tax Engines**: **Hard-coded logic for major economies including the USA, UK, India, and Canada, reflecting 2024-2025/26 tax laws.**
* 📊 **Live Data Visualization**: **Integrated Chart.js implementation that renders a dynamic doughnut chart as you type, comparing your net income against the total tax burden.**
* 📄 **One-Click PDF Reports**: **Instantly generate a structured financial breakdown including every tax band and deduction, formatted for professional use.**
* 🛠️ **Customizable Deductions**: **Add or remove multiple custom tax-saving investments or allowances to see their immediate impact on your effective tax rate.**
* 🌍 **Universal Mode**: **Support for any country via a "Custom" mode where users define their own tax rate and currency.**

---

## 📈 **Regional Logic Coverage**

**The calculator manages sophisticated regional rules automatically:**
* **USA (Federal 2025)**: **Applies a $15,000 standard deduction and processes seven progressive federal tax brackets ranging from 10% to 37%.**
* **United Kingdom (2024-2025)**: **Features the "High Earner Rule" where the £12,570 Personal Allowance tapers off for income exceeding £100,000.**
* **India (FY 2025-26)**: **Calculates using the New Tax Regime with a ₹75,000 standard deduction and the Section 87A rebate for income up to ₹12.75L.**
* **Canada (2025)**: **Calculates combined Federal and Ontario provincial taxes, including the 15% Basic Personal Amount (BPA) credit.**

---

## 🛠️ **Technical Architecture**

* **Frontend**: **Vite + TypeScript for type-safe, ultra-fast development.**
* **Styling**: **Pure CSS3 utilizing CSS Variables for easy theme customization.**
* **Calculations**: **Modular engine design with isolated country-specific logic files for scalability.**
* **Libraries**: **Chart.js (Analytics) and jsPDF (Document Export).**

---

## 📥 **Installation & Setup**

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/atharvapisal16/global-tax-calculator.git](https://github.com/atharvapisal16/global-tax-calculator.git)
    ```
2.  **Navigate to Directory**:
    ```bash
    cd Global-Tax-Calculator
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Start Development Server**:
    ```bash
    npm run dev
    ```

---

## 📄 **License**

**This project is licensed under the MIT License.**

**Copyright (c) 2026 Atharva Pisal**
