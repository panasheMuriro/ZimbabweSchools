import 'dotenv/config';
import express from 'express';
import admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import { getPaletteFromImageUrl } from './services/colorExtractor.js';
import Fuse from 'fuse.js';

import serviceAccount from './firebase-service-account.json' with { type: 'json' };
import schoolLogos from './school_logos.json' with { type: 'json' };

// Firebase init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Gemini / GenAI init (Your original logic)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Fuse.js Initialization
const schoolList = Object.keys(schoolLogos).map(name => ({
  name: name,
  logoUrl: schoolLogos[name]
}));
const fuseOptions = {
  keys: ['name'],
  includeScore: true,
  threshold: 0.4,
  limit: 1
};
const fuse = new Fuse(schoolList, fuseOptions);

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/school/:userQuery', async (req, res) => {
  const { userQuery } = req.params;

  try {
    // --- STEP 1: Find the official school name FIRST ---
    const results = fuse.search(userQuery);

    if (results.length === 0) {
      console.log(`[NOT FOUND] No fuzzy match for "${userQuery}"`);
      return res.status(404).send('<h1>School Not Found</h1><p>We could not find a match for this school in our records.</p>');
    }

    const { name: officialName, logoUrl } = results[0].item;
    console.log(`[FOUND MATCH] Matched "${userQuery}" to "${officialName}" with score: ${results[0].score}`);

    // --- STEP 2: Use the OFFICIAL name to create a canonical cache key ---
    const canonicalDocId = officialName.toLowerCase().replace(/\s+/g, '-');
    const schoolDocRef = db.collection('schools').doc(canonicalDocId);

    // --- STEP 3: Check the cache using the CANONICAL key ---
    const docSnap = await schoolDocRef.get();

    if (docSnap.exists) {
      console.log(`[CACHE HIT] Found canonical entry for "${officialName}" in Firebase.`);
      return res.status(200).send(docSnap.data().html);
    }

    // --- If we are here, it's a true cache miss. Proceed to generate. ---
    console.log(`[CACHE MISS] No entry for "${officialName}". Generating new page...`);

    // Get color palette
    const paletteString = await getPaletteFromImageUrl(logoUrl);
    const palette = Object.fromEntries(
      paletteString.split(', ').map(p => p.split(': '))
    );

    // Construct prompt using the officialName
    const promptText = `
    You are an expert web developer specializing in TailwindCSS. Your task is to generate a complete, single HTML file for a school website based on live web search results.

    **Instructions:**
    1. Create a modern, professional, and visually appealing school website for **${officialName} high school, Zimbabwe**.
    2. Use the **TailwindCSS** framework for all styling. You must include the Tailwind CDN script in the <head> section: <script src="https://cdn.tailwindcss.com"></script>.
    3. Hero Section: Prominently feature the school's logo, found at this URL: **${logoUrl}**.
    4. Color Palette: Strictly use the following colors for the theme:
        - Primary (headings, buttons): **${palette.primary}**
        - Secondary (backgrounds, borders): **${palette.secondary}**
        - Accent (calls-to-action, links): **${palette.accent}**
    5. Content (Crucial): Use your web search tool to find the most current and factual information about ${officialName}, Zimbabwe. Include sections for About Us, Academics, Admissions, and Contact Us.
    6. Contact Us Section: Ensure the physical address, phone number, and email are as accurate as possible based on your search results. Include a contact form.
    7. Contact Form: The form must not refresh the page on submission. Use an inline JavaScript onsubmit attribute to show an alert: alert('Thank you! We will get back to you shortly.'); return false;

    Generate only the full HTML code, starting with <!DOCTYPE html> and ending with </html>. Do not wrap your response in markdown.
    `;

    // Call Gemini with grounding (Your original logic and model)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        { role: "user", parts: [ { text: promptText } ] }
      ],
      config: {
        tools: [
          { google_search: {} }
        ]
      }
    });

    // NOTE: The SDK returns a function here. Calling .text() gets the string.
    const generatedHtml = response.text;
    console.log(`Generated HTML for ${officialName}`);

    // --- STEP 4: Save to cache using the CANONICAL key ---
    await schoolDocRef.set({
      name: officialName,
      html: generatedHtml,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`[CACHE SET] Saved page for "${officialName}" to Firebase.`);

    res.status(200).send(generatedHtml);

  } catch (error) {
    console.error('Error in /api/school/:userQuery:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Your existing frontend routing code would go here...

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});