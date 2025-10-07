# Nevado Trek API

This is the backend API for the Nevado Trek tour management system.

## Project Structure
- `api/admin/tours.js` - Admin endpoint for creating and managing tours
- `lib/firebase-config.js` - Firebase configuration and connection
- `vercel.json` - Vercel deployment configuration

## Environment Variables
The following environment variables need to be set for the API to work:

- `ADMIN_KEY` - Admin authentication key
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase client email
- `FIREBASE_PRIVATE_KEY` - Firebase private key

## API Endpoints

### POST `/api/admin/tours`
Create a new tour (admin only)

Headers:
- `X-Admin-Secret-Key`: Your admin key

Body:
```json
{
  "tourId": "unique-tour-id",
  "name": {
    "es": "Nombre del Tour",
    "en": "Tour Name"
  },
  "shortDescription": {
    "es": "Descripción corta",
    "en": "Short description"
  },
  "longDescription": {
    "es": "Descripción larga",
    "en": "Long description"
  },
  "pricingTiers": [
    { "pax": 1, "pricePerPerson": 500000 },
    { "pax": 2, "pricePerPerson": 450000 }
  ],
  "isActive": true
}
```

## Deployment
This project is designed for deployment on Vercel.