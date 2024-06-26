const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
var cors = require("cors");

// Function to get the access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Error getting access token');
  }
};

// Endpoint to create a Zoom meeting
router.post('/create-meeting', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const meetingDetails = {
      topic: 'Test Meeting',
      type: 1,
      settings: {
        host_video: true,
        participant_video: true,
      },
    };

    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingDetails, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating meeting:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error creating meeting' });
  }
});

module.exports = router;