// In netlify/functions/school.ts

import { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI } from '@google/genai';
import Fuse from 'fuse.js';
// import Vibrant from 'node-vibrant'; // This works on Netlify!
import { Vibrant } from "node-vibrant/node";
import admin from 'firebase-admin'; 

// Import the school data. Netlify will bundle this.
// Make sure the path is correct relative to this function file.
import schoolData from '../../frontend/public/data/schools.json';

// --- INITIALIZATION (runs on cold start) ---


const URL = "https://raw.githubusercontent.com/panasheMuriro/ZimbabweSchools/refs/heads/main/frontend/public"

if (!admin.apps.length) {
  const encodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!encodedServiceAccount) {
    throw new Error("Firebase service account credentials are not set in environment variables.");
  }
  const decodedServiceAccount = Buffer.from(encodedServiceAccount, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(decodedServiceAccount);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore(); // Initialize Firestore


// Initialize Gemini AI client
// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface School {
    name: string;
    imageUrl: string;
}


// Initialize Fuse.js (Identical to your Express setup)
const schoolList: School[] = schoolData;

// Initialize Fuse with the correct list.
const fuse = new Fuse(schoolList, {
  keys: ['name'],
  includeScore: true,
  threshold: 0.4,
});


console.log(schoolList)

// Your existing color extraction function - NO CHANGES NEEDED
async function getPaletteFromImageUrl(imageUrl: string) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    const colors = {
      primary: palette.Vibrant?.hex || palette.Muted?.hex || '#0D47A1',
      secondary: palette.DarkVibrant?.hex || palette.DarkMuted?.hex || '#F5F5F5',
      accent: palette.LightVibrant?.hex || palette.Vibrant?.hex || '#FFC107'
    };
    return `primary: ${colors.primary}, secondary: ${colors.secondary}, accent: ${colors.accent}`;
  } catch (error) {
    console.error('Error extracting color palette:', error);
    return 'primary: #1E3A8A, secondary: #E5E7EB, accent: #F59E0B';
  }
}

// The main handler function for our serverless endpoint
const handler: Handler = async (event: HandlerEvent) => {
  // Get the user query from the URL path, e.g., /api/school/bradley
  const userQuery = event.path.split("/").pop() || "";

  if (!userQuery) {
    return { statusCode: 400, body: 'Missing school name query.' };
  }

  try {
    // --- STEP 1: Find the official school name FIRST (Identical logic) ---
    const results = fuse.search(userQuery);




    if (results.length === 0) {
      const body = '<h1>School Not Found</h1><p>We could not find a match for this school in our records.</p>';
      return { statusCode: 404, body, headers: { 'Content-Type': 'text/html' } };
    }

    const { name: officialName,imageUrl } = results[0].item;
    let imageUrlFull = URL+imageUrl
    console.log(`[FOUND MATCH] Matched "${userQuery}" to "${officialName}"`);

    const canonicalKey = officialName.toLowerCase().replace(/\s+/g, '-');
    const schoolDocRef = db.collection('schools').doc(canonicalKey); // <-- Firestore doc reference

    // --- STEP 3: Check the cache (Redis -> Firestore) ---
    const docSnap = await schoolDocRef.get();

    if (docSnap.exists) {
      const data = docSnap.data()!;
      // **MANUAL TTL CHECK**: Check if the cache entry has expired
      const expiresAt = data.expiresAt?.toDate(); // Firestore timestamps need conversion
      if (expiresAt && expiresAt > new Date()) {
        console.log(`[CACHE HIT] Found valid entry for "${officialName}" in Firestore.`);
        return { statusCode: 200, body: data.html, headers: { 'Content-Type': 'text/html' } };
      } else if (expiresAt) {
          console.log(`[CACHE STALE] Entry for "${officialName}" has expired. Regenerating.`);
      }
    }

    console.log(`[CACHE MISS] No entry for "${officialName}". Generating new page...`);
    

    // --- YOUR EXISTING LOGIC - NO CHANGES ---
    const paletteString = await getPaletteFromImageUrl(imageUrlFull);
    const palette = Object.fromEntries(paletteString.split(', ').map(p => p.split(': ')));
    const promptText = `
      You are an expert web developer specializing in TailwindCSS. Your task is to generate a complete, single HTML file for a school website based on live web search results.
      **Instructions:**
      1. Create a modern, professional, and visually appealing school website for **${officialName} high school, Zimbabwe**.
      2. Use the **TailwindCSS** framework for all styling. You must include the Tailwind CDN script in the <head> section: <script src="https://cdn.tailwindcss.com"></script>.
      3. Hero Section: Prominently feature the school's logo, found at this URL: **${imageUrlFull}**.
      4. Color Palette: Strictly use the following colors for the theme:
          - Primary (headings, buttons): **${palette.primary}**
          - Secondary (backgrounds, borders): **${palette.secondary}**
          - Accent (calls-to-action, links): **${palette.accent}**
      5. Content (Crucial): Use your web search tool to find the most current and factual information about ${officialName}, Zimbabwe. Include sections for About Us, Academics, Admissions, and Contact Us.
      6. Contact Us Section: Ensure the physical address, phone number, and email are as accurate as possible based on your search results. Include a contact form.
      7. Contact Form: The form must not refresh the page on submission. Use an inline JavaScript onsubmit attribute to show an alert: alert('Thank you! We will get back to you shortly.'); return false;
      8. For the image placeholders, just use the colored containers with colors coming from the color palette provided
      Generate only the full HTML code, starting with <!DOCTYPE html> and ending with </html>. Do not wrap your response in markdown.
    `;
    
    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash-lite",
    //   contents: [{ role: "user", parts: [{ text: promptText }] }],
    //   config: { tools: [{ googleSearchRetrieval: {} }] }
    // });

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite", // Use a model that supports grounding
  contents: [{ role: "user", parts: [{ text: promptText }] }],
  config: { 
    tools: [{ 
      googleSearch: {} // Use googleSearch instead of googleSearchRetrieval
    }] 
  }
});

    const generatedHtml = response.text;
    console.log(`Generated HTML for ${officialName}`);

    // --- STEP 4: Save to cache (Firestore -> Redis) ---
    // Cache for 1 week (604800 seconds)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await schoolDocRef.set({
      name: officialName,
      html: generatedHtml,
      expiresAt: expiresAt, // Store the expiration timestamp
    });
    console.log(`[CACHE SET] Saved page for "${officialName}" to Firestore.`);


    return {
      statusCode: 200,
      body: generatedHtml,
      headers: { 'Content-Type': 'text/html' }
    };

  } catch (error) {
    console.error('Error in Netlify Function:', error);
    return { statusCode: 500, body: 'An error occurred while processing your request.' };
  }
};

export { handler };