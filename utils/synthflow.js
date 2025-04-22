const axios = require('axios');

async function scheduleCall(phone) {
  await axios.post('https://api.synthflow.ai/v1/calls', {
    to: phone,
    agent_id: process.env.SYNTHFLOW_AGENT_ID,
    workspace_id: process.env.SYNTHFLOW_WORKSPACE_ID,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.SYNTHFLOW_API_KEY}`
    }
  });
}

module.exports = { scheduleCall };