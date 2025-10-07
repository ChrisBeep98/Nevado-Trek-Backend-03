const { db } = require('../../lib/firebase-config');

module.exports = async function handler(req, res) {
  // Only allow POST requests for creating tours
  if (req.method === 'POST') {
    // Verify admin authentication
    const adminKey = req.headers['x-admin-secret-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ 
        error: 'Unauthorized. Admin key required.' 
      });
    }

    try {
      // Extract tour data from request body
      const {
        tourId,
        name,
        shortDescription,
        longDescription,
        details,
        itinerary,
        inclusions,
        recommendations,
        faqs,
        pricingTiers,
        isActive = true
      } = req.body;

      // Validate required fields
      if (!tourId || !name || !pricingTiers) {
        return res.status(400).json({ 
          error: 'Missing required fields: tourId, name, and pricingTiers are required.' 
        });
      }

      // Validate bilingual fields (both English and Spanish)
      if (!name.en || !name.es) {
        return res.status(400).json({ 
          error: 'Name must include both English (en) and Spanish (es) versions.' 
        });
      }

      // Prepare the tour document with timestamps
      const tourData = {
        tourId,
        name,
        shortDescription: shortDescription || {},
        longDescription: longDescription || {},
        details: details || [],
        itinerary: itinerary || {},
        inclusions: inclusions || [],
        recommendations: recommendations || [],
        faqs: faqs || [],
        pricingTiers,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await db.collection('tours').doc(tourId).set(tourData);

      // Return success response
      res.status(200).json({ 
        success: true, 
        message: `Tour "${tourId}" created successfully`,
        tourId: tourId 
      });

    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  } else if (req.method === 'GET') {
    // For future use - getting all tours
    try {
      const toursSnapshot = await db.collection('tours').get();
      
      const tours = [];
      toursSnapshot.forEach(doc => {
        tours.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json({ tours });
    } catch (error) {
      console.error('Error getting tours:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ 
      error: 'Method not allowed. Use POST to create a tour or GET to retrieve tours.' 
    });
  }
}