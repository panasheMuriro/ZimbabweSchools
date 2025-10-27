# Zimbabwe School Website Generator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E77F7?style=for-the-badge&logo=google-gemini&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A dynamic web application that automatically generates a modern, single-page website for any high school in Zimbabwe using its name and logo. The application leverages Google's Gemini AI to gather public information and construct a complete HTML page on the fly.

**Live Preview:** **[https://zimbabwe-schools.netlify.app/](https://zimbabwe-schools.netlify.app/)**

## Screenshots



![Zim schools Screenshot](./frontend/src/assets/screenshot.png)

Bradley High School Generated website 
![Zim schools Screenshot](./frontend/src/assets/screenshot2.png)


## ✨ Features

-   **AI-Powered Content Generation**: Uses Google's Gemini AI with web search capabilities to generate up-to-date content for sections like "About Us," "Academics," and "Contact."
-   **Dynamic Color Theming**: Automatically extracts a color palette from the school's logo to create a visually consistent and branded website theme.
-   **Fuzzy Search**: Implements Fuse.js to provide a robust and typo-tolerant search experience for finding schools.
-   **Serverless Architecture**: Built entirely on Netlify, using Netlify Functions for the backend logic, ensuring scalability and low maintenance.
-   **Firestore Caching**: Integrates with Google Firestore to cache generated websites for 24 hours, providing instant load times for subsequent visits and reducing API costs.
-   **On-Demand Regeneration**: Allows force-refreshing a school's page via a query parameter (`?new=true`) to fetch the latest information.

## 🛠️ How It Works & Tech Stack

The application has a simple frontend and a powerful serverless backend that handles the heavy lifting.

**The Workflow:**

1.  **User Search (Frontend):** A user searches for a school on the React-based homepage.
2.  **API Call:** The frontend calls a Netlify Serverless Function at `/api/school/:schoolName`.
3.  **School Matching (Backend):** The function uses **Fuse.js** to perform a fuzzy search on a local `schools.json` file to find the correct school name and logo URL.
4.  **Cache Check:** The function checks **Firebase Firestore** for a valid, non-expired cached version of the school's HTML page. If a valid cache exists, it's returned immediately.
5.  **AI Generation (on Cache Miss):**
    a. **Color Extraction**: The function uses **`node-vibrant`** to extract a primary, secondary, and accent color from the school's logo.
    b. **Prompt Engineering**: A detailed prompt is constructed for **Google Gemini**, providing the school's name, logo URL, and the extracted color palette. The prompt instructs the AI to act as a web developer, use TailwindCSS, and search the web for factual information.
    c. **AI Call**: The function calls the Gemini API, which uses its `googleSearch` tool to find information and generate a complete, single-file HTML website.
6.  **Caching Result:** The newly generated HTML is saved to Firestore with a 24-hour expiration timestamp.
7.  **Response:** The HTML is sent back to the frontend.
8.  **Display:** The React frontend renders the received HTML inside a sandboxed `<iframe>` to display the generated website.

### Tech Stack

| Category            | Technology                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | [React](https://reactjs.org/), [React Router](https://reactrouter.com/), [TailwindCSS](https://tailwindcss.com/) |
| **Backend**         | [Netlify Functions](https://docs.netlify.com/functions/overview/) (Node.js)                                   |
| **AI Generation**   | [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-lite` with Search)                               |
| **Database/Cache**  | [Google Firestore](https://firebase.google.com/docs/firestore)                                                |
| **Search**          | [Fuse.js](https://fusejs.io/)                                                                                 |
| **Color Extraction**| [Node-Vibrant](https://github.com/vibrant-js/node-vibrant)                                                      |
| **Deployment**      | [Netlify](https://www.netlify.com/)                                                                           |

## 🚀 Getting Started

### Prerequisites

-   Node.js and npm
-   A Netlify account
-   A Google Cloud account with the Gemini API enabled
-   A Firebase project with Firestore enabled

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zimbabwe-schools.git
cd zimbabwe-schools
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables.

```env
# Your Gemini API Key from Google AI Studio or Google Cloud
GEMINI_API_KEY=your_gemini_api_key

# Your Firebase service account credentials, encoded in Base64
# 1. Go to Firebase > Project Settings > Service accounts
# 2. Generate a new private key (JSON file)
# 3. Base64-encode the *entire content* of the JSON file
#    (You can use an online tool or `base64 -i serviceAccountKey.json` on macOS/Linux)
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_firebase_credentials
```

### 4. Run Locally

The Netlify CLI is the best way to run the project locally as it emulates the entire platform, including functions.

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Run the project
netlify dev
```

Your application will be running at `http://localhost:8888`.

## 📁 Project Structure

```
/
├── frontend/                 # Contains the React frontend application
│   ├── public/
│   │   └── data/
│   │       └── schools.json  # Master list of schools and their logo URLs
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (HomePage, SchoolPage)
│   │   ├── App.tsx           # Main app component with routing
│   │   └── index.tsx         # Entry point for the React app
│   └── ...
├── netlify/
│   └── functions/
│       └── school.ts         # The core serverless function for AI generation
├── .env                      # Local environment variables (ignored by git)
├── netlify.toml              # Netlify configuration file
└── package.json
```

## 🌐 Deployment

This project is configured for seamless deployment on Netlify.

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Connect the repository to a new site on your Netlify dashboard.
3.  **Configure Build Settings**:
    -   **Build command**: `npm run build`
    -   **Publish directory**: `frontend/dist`
    -   **Functions directory**: `netlify/functions`
4.  **Add Environment Variables**: Go to `Site settings > Build & deploy > Environment` and add the `GEMINI_API_KEY` and `FIREBASE_SERVICE_ACCOUNT_BASE64` variables, just like you did for your `.env` file.
5.  Trigger a deploy. Your site will be live!

---



# Embroidered Logos for Zimbabwean High Schools

Eaglesvale | Kutama | Regina Mundi
:---:|:---:|:---:
![Eaglesvale High School embroidered logo](./EmbroideredLogosOptimized/eaglesvale.png) | ![Kutama High School embroidered logo](./EmbroideredLogosOptimized/kutama.png) | ![Regina Mundi High School embroidered logo](./EmbroideredLogosOptimized/regina_mundi.png)

St Peters (Mbare) Secondary | Kwenda | Roosevelt Girls
:---:|:---:|:---:
![St Peters (Mbare) Secondary embroidered logo](./EmbroideredLogosOptimized/st_peters_(mbare)_secondary.png) | ![Kwenda High School embroidered logo](./EmbroideredLogosOptimized/kwenda.png) | ![Roosevelt Girls High School embroidered logo](./EmbroideredLogosOptimized/roosevelt_girls.png)

All Souls | Langham | Rusununguko
:---:|:---:|:---:
![All Souls High School embroidered logo](./EmbroideredLogosOptimized/all_souls.png) | ![Langham High School embroidered logo](./EmbroideredLogosOptimized/langham.png) | ![Rusununguko High School embroidered logo](./EmbroideredLogosOptimized/rusununguko.png)

Allan Wilson | Loreto | Ruya Adventist
:---:|:---:|:---:
![Allan Wilson High School embroidered logo](./EmbroideredLogosOptimized/allan_wilson.png) | ![Loreto High School embroidered logo](./EmbroideredLogosOptimized/loreto.png) | ![Ruya Adventist High School embroidered logo](./EmbroideredLogosOptimized/ruya_adventist.png)

Alpha College | Makumbe | Sandringham
:---:|:---:|:---:
![Alpha College embroidered logo](./EmbroideredLogosOptimized/alpha_college.png) | ![Makumbe High School embroidered logo](./EmbroideredLogosOptimized/makumbe.png) | ![Sandringham High School embroidered logo](./EmbroideredLogosOptimized/sandringham.png)

Anderson | Mandedza | Sanyati Baptist
:---:|:---:|:---:
![Anderson High School embroidered logo](./EmbroideredLogosOptimized/anderson.png) | ![Mandedza High School embroidered logo](./EmbroideredLogosOptimized/mandedza.png) | ![Sanyati Baptist High School embroidered logo](./EmbroideredLogosOptimized/sanyati_baptist.png)

Bernard Mzeki | Marange | Serima
:---:|:---:|:---:
![Bernard Mzeki High School embroidered logo](./EmbroideredLogosOptimized/bernard_mzeki.png) | ![Marange High School embroidered logo](./EmbroideredLogosOptimized/marange.png) | ![Serima High School embroidered logo](./EmbroideredLogosOptimized/serima.png)

Bradley | Marist Brothers Nyanga | Shungu
:---:|:---:|:---:
![Bradley High School embroidered logo](./EmbroideredLogosOptimized/bradley.png) | ![Marist Brothers Nyanga High School embroidered logo](./EmbroideredLogosOptimized/marist_brothers_nyanga.png) | ![Shungu High School embroidered logo](./EmbroideredLogosOptimized/shungu.png)

Chemanza | Marondera | Silveira
:---:|:---:|:---:
![Chemanza High School embroidered logo](./EmbroideredLogosOptimized/chemanza.png) | ![Marondera High School embroidered logo](./EmbroideredLogosOptimized/marondera.png) | ![Silveira High School embroidered logo](./EmbroideredLogosOptimized/silveira.png)

Chibi | Mashoko | St Alberts
:---:|:---:|:---:
![Chibi High School embroidered logo](./EmbroideredLogosOptimized/chibi.png) | ![Mashoko High School embroidered logo](./EmbroideredLogosOptimized/mashoko.png) | ![St Alberts High School embroidered logo](./EmbroideredLogosOptimized/st_alberts.png)

Chikwingwizhza | Mazowe | St Anne's Goto
:---:|:---:|:---:
![Chikwingwizhza High School embroidered logo](./EmbroideredLogosOptimized/chikwingwizhza.png) | ![Mazowe High School embroidered logo](./EmbroideredLogosOptimized/mazowe.png) | ![St Anne's Goto High School embroidered logo](./EmbroideredLogosOptimized/st_anne's_goto.png)

Chindunduma | Moleli | St Anthony Musiso
:---:|:---:|:---:
![Chindunduma High School embroidered logo](./EmbroideredLogosOptimized/chindunduma.png) | ![Moleli High School embroidered logo](./EmbroideredLogosOptimized/moleli.png) | ![St Anthony Musiso High School embroidered logo](./EmbroideredLogosOptimized/st_anthony_musiso.png)

Chinhoyi 2 | Monte Cassino | St Benedict's
:---:|:---:|:---:
![Chinhoyi 2 High School embroidered logo](./EmbroideredLogosOptimized/chinhoyi_2.png) | ![Monte Cassino High School embroidered logo](./EmbroideredLogosOptimized/monte_cassino.png) | ![St Benedict's High School embroidered logo](./EmbroideredLogosOptimized/st_benedict's.png)

Chinhoyi | Msengezi | St Columba
:---:|:---:|:---:
![Chinhoyi High School embroidered logo](./EmbroideredLogosOptimized/chinhoyi.png) | ![Msengezi High School embroidered logo](./EmbroideredLogosOptimized/msengezi.png) | ![St Columba High School embroidered logo](./EmbroideredLogosOptimized/st_columba.png)

Churchill | Mt Selinda | St David's Bonda
:---:|:---:|:---:
![Churchill High School embroidered logo](./EmbroideredLogosOptimized/churchill.png) | ![Mt Selinda High School embroidered logo](./EmbroideredLogosOptimized/mt_selinda.png) | ![St David's Bonda High School embroidered logo](./EmbroideredLogosOptimized/st_david's_bonda.png)

Dadaya | Mt St Mary's | St Dominics Chishawasha
:---:|:---:|:---:
![Dadaya High School embroidered logo](./EmbroideredLogosOptimized/dadaya.png) | ![Mt St Mary's High School embroidered logo](./EmbroideredLogosOptimized/mt_st_mary's.png) | ![St Dominics Chishawasha High School embroidered logo](./EmbroideredLogosOptimized/st_dominics_chishawasha.png)

Daramombe | Mtshabezi | St Faith's
:---:|:---:|:---:
![Daramombe High School embroidered logo](./EmbroideredLogosOptimized/daramombe.png) | ![Mtshabezi High School embroidered logo](./EmbroideredLogosOptimized/mtshabezi.png) | ![St Faith's High School embroidered logo](./EmbroideredLogosOptimized/st_faith's.png)

Emmanuel | Mucheke | St Francis of Assisi
:---:|:---:|:---:
![Emmanuel High School embroidered logo](./EmbroideredLogosOptimized/emmanuel.png) | ![Mucheke High School embroidered logo](./EmbroideredLogosOptimized/mucheke.png) | ![St Francis of Assisi High School embroidered logo](./EmbroideredLogosOptimized/st_francis_of_assisi.png)

Girls High Harare | Mufakose 1 High | St Ignatius
:---:|:---:|:---:
![Girls High Harare embroidered logo](./EmbroideredLogosOptimized/girls_high_harare.png) | ![Mufakose 1 High School embroidered logo](./EmbroideredLogosOptimized/mufakose_1_high.png) | ![St Ignatius High School embroidered logo](./EmbroideredLogosOptimized/st_ignatius.png)

Gokomere | Mukaro | St Johns Chikwaka
:---:|:---:|:---:
![Gokomere High School embroidered logo](./EmbroideredLogosOptimized/gokomere.png) | ![Mukaro High School embroidered logo](./EmbroideredLogosOptimized/mukaro.png) | ![St Johns Chikwaka High School embroidered logo](./EmbroideredLogosOptimized/st_johns_chikwaka.png)

Goromonzi | Murewa | St Johns Emerald Hill
:---:|:---:|:---:
![Goromonzi High School embroidered logo](./EmbroideredLogosOptimized/goromonzi.png) | ![Murewa High School embroidered logo](./EmbroideredLogosOptimized/murewa.png) | ![St Johns Emerald Hill High School embroidered logo](./EmbroideredLogosOptimized/st_johns_emerald_hill.png)

Green Gables | Mutendi | St Joseph's
:---:|:---:|:---:
![Green Gables High School embroidered logo](./EmbroideredLogosOptimized/green_gables.png) | ![Mutendi High School embroidered logo](./EmbroideredLogosOptimized/mutendi.png) | ![St Joseph's High School embroidered logo](./EmbroideredLogosOptimized/st_joseph's.png)

Hama | Nagle | St Killians
:---:|:---:|:---:
![Hama High School embroidered logo](./EmbroideredLogosOptimized/hama.png) | ![Nagle High School embroidered logo](./EmbroideredLogosOptimized/nagle.png) | ![St Killians High School embroidered logo](./EmbroideredLogosOptimized/st_killians.png)

Hartzell | Ndararama | St Matthias
:---:|:---:|:---:
![Hartzell High School embroidered logo](./EmbroideredLogosOptimized/hartzell.png) | ![Ndararama High School embroidered logo](./EmbroideredLogosOptimized/ndararama.png) | ![St Matthias High School embroidered logo](./EmbroideredLogosOptimized/st_matthias.png)

Holy Cross | Nyahuni | St Michaels
:---:|:---:|:---:
![Holy Cross High School embroidered logo](./EmbroideredLogosOptimized/holy_cross.png) | ![Nyahuni High School embroidered logo](./EmbroideredLogosOptimized/nyahuni.png) | ![St Michaels High School embroidered logo](./EmbroideredLogosOptimized/st_michaels.png)

Howard | Nyashanu | St Patrick
:---:|:---:|:---:
![Howard High School embroidered logo](./EmbroideredLogosOptimized/howard.png) | ![Nyashanu High School embroidered logo](./EmbroideredLogosOptimized/nyashanu.png) | ![St Patrick High School embroidered logo](./EmbroideredLogosOptimized/st_patrick.png)

Inyathi | Nyazura | St Pauls Musami
:---:|:---:|:---:
![Inyathi High School embroidered logo](./EmbroideredLogosOptimized/inyathi.png) | ![Nyazura High School embroidered logo](./EmbroideredLogosOptimized/nyazura.png) | ![St Pauls Musami High School embroidered logo](./EmbroideredLogosOptimized/st_pauls_musami.png)

Jameson | Pakame | St Philips
:---:|:---:|:---:
![Jameson High School embroidered logo](./EmbroideredLogosOptimized/jameson.png) | ![Pakame High School embroidered logo](./EmbroideredLogosOptimized/pakame.png) | ![St Philips High School embroidered logo](./EmbroideredLogosOptimized/st_philips.png)

John Tallach | Pamushana | Thekwane
:---:|:---:|:---:
![John Tallach High School embroidered logo](./EmbroideredLogosOptimized/john_tallach.png) | ![Pamushana High School embroidered logo](./EmbroideredLogosOptimized/pamushana.png) | ![Thekwane High School embroidered logo](./EmbroideredLogosOptimized/thekwane.png)

Knowledgevill College | Presbyterian | Waddilove
:---:|:---:|:---:
![Knowledgevill College embroidered logo](./EmbroideredLogosOptimized/knowledgevill_college.png) | ![Presbyterian High School embroidered logo](./EmbroideredLogosOptimized/presbyterian.png) | ![Waddilove High School embroidered logo](./EmbroideredLogosOptimized/waddilove.png)

Kriste Mambo | Queen Elizabeth | Visitation Makumbi
:---:|:---:|:---:
![Kriste Mambo High School embroidered logo](./EmbroideredLogosOptimized/kriste_mambo.png) | ![Queen Elizabeth High School embroidered logo](./EmbroideredLogosOptimized/queen_elizabeth.png) |![Visitation Makumbi High School embroidered logo](./EmbroideredLogosOptimized/visitation_makumbi_high_school.png)  
