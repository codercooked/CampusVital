import dotenv from 'dotenv';
dotenv.config();

const getGenieHeaders = () => ({
  'Authorization': `Bearer ${process.env.DATABRICKS_TOKEN}`,
  'Content-Type': 'application/json'
});

async function test() {
  const url = `${process.env.DATABRICKS_HOST}/api/2.0/genie/spaces/${process.env.GENIE_SPACE_ID}/start-conversation`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getGenieHeaders(),
    body: JSON.stringify({ content: "Show this week's busiest periods" })
  });
  
  if (!response.ok) {
    console.error('Failed to start conversation', await response.text());
    return;
  }
  
  const data = await response.json();
  const { conversation_id, message_id } = data;
  console.log("Started:", conversation_id, message_id);
  
  let delay = 5000;
  const start = Date.now();
  const maxTime = 10 * 60 * 1000;
  while (Date.now() - start < maxTime) {
    await new Promise(resolve => setTimeout(resolve, delay));
    const url = `${process.env.DATABRICKS_HOST}/api/2.0/genie/spaces/${process.env.GENIE_SPACE_ID}/conversations/${conversation_id}/messages/${message_id}`;
    const res = await fetch(url, { headers: getGenieHeaders() });
    const data = await res.json();
    console.log("Status:", data.status);
    if (data.status === 'COMPLETED' || data.status === 'FAILED') {
      console.log(JSON.stringify(data, null, 2));
      break;
    }
  }
}
test();
