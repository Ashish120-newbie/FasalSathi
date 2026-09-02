# 🌾 FasalSathi — Your Crop Companion

**FasalSathi** (Hindi for *"crop companion"*) is a farmer-friendly web app that helps Indian farmers diagnose crop diseases, get fertilizer recommendations, discover government schemes, and reach expert support — all in one place.

Built with **React + TypeScript + Vite + Tailwind CSS**, powered by **Supabase**.

---

## ✨ Features

### 🔍 Scan — Crop Health Diagnosis
- Upload or capture a photo of an affected leaf, fruit, or plant part
- Select crop type (Wheat, Rice, Cotton, Tomato, Potato, Sugarcane, Maize, Soybean, and more)
- Select growth stage for more accurate diagnosis
- Get an AI-powered analysis of crop health issues

### 🧪 Fertilizer Recommendations
- Get estimated nutrient needs (Nitrogen, Phosphate, Potash) per acre
- View approximate product quantities (Urea, DAP, MOP)
- Follow a clear application schedule (at sowing, top dressing stages)
- Practical tips like watering guidance after fertilizer application

### 🏛️ Government Schemes
- Browse verified government schemes and subsidies for farmers, including:
  - **PM-KISAN** — Direct income support
  - **PMFBY** — Crop insurance
  - **Kisan Credit Card (KCC)** — Concessional credit
  - **Soil Health Card Scheme** — Free soil testing
  - **Nutrient Based Subsidy (NBS)** — Subsidized fertilizers
  - **PKVY** — Organic farming support
  - **PMKSY (Per Drop More Crop)** — Micro-irrigation subsidies
- Search and filter schemes
- View eligibility criteria and key benefits at a glance
- Bookmark schemes for later reference

### 📞 Helpline
- Direct access to the **Kisan Call Centre** (toll-free, 6 AM–10 PM, 7 days a week)
- Get guidance on crop diseases, fertilizers, pesticides, weather-related issues, and animal husbandry
- Local language support

### 🤖 AI Assistant
- Built-in AI assistant accessible from every screen for on-demand farming guidance

### 🗂️ Additional
- Multi-language support (English and regional languages)
- Scan history tracking
- Clean, mobile-first, farmer-friendly UI

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend / Database:** Supabase
- **Linting:** ESLint

---

## 📁 Project Structure

```
FasalSathi/
├── src/                # Application source code
├── supabase/           # Supabase config, migrations, and functions
├── index.html          # App entry point
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.ts      # Vite configuration
├── tsconfig*.json      # TypeScript configuration
└── eslint.config.js    # ESLint configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm
- A [Supabase](https://supabase.com/) project (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ashish120-newbie/FasalSathi.git
cd FasalSathi

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

```bash
npm run build
```

---

## ⚠️ Disclaimer

FasalSathi's diagnosis and recommendations are AI-generated and intended for informational purposes only. Always consult a local agricultural expert or the Kisan Call Centre before making major decisions about pesticides, fertilizers, or crop treatment.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/Ashish120-newbie/FasalSathi/issues) if you'd like to contribute.

---

## 📄 License

This project currently has no license specified. Please contact the repository owner for usage permissions.

---

## 🙏 Acknowledgements

- Ministry of Agriculture & Farmers Welfare, Government of India — for public scheme data
- Kisan Call Centre — for farmer helpline support information
