import express from 'express';
import db from '../db/database.js';

// In Node 18+, fetch is available globally. If older, node-fetch would be needed.
// Assuming Node >= 18 based on instructions.

const router = express.Router();

const { DATABRICKS_HOST, DATABRICKS_TOKEN, GENIE_SPACE_ID } = process.env;

const getGenieHeaders = () => ({
  'Authorization': `Bearer ${process.env.DATABRICKS_TOKEN}`,
  'Content-Type': 'application/json'
});

const getPrompt = (question) => {
  return `User query: "${question}"\n\nINSTRUCTION: If the user query is asking to book, reserve, or schedule a room, you must act as a data extractor. DO NOT say you cannot book rooms. DO NOT generate SQL. You are NOT making a booking, you are just extracting the requested booking parameters into JSON.\n\nIf it IS a booking request, reply EXACTLY and ONLY with this JSON block (do not add any other text):\n\`\`\`json\n{\n  "action": "BOOK_ROOM",\n  "room_name": "Room Name or Number",\n  "date": "YYYY-MM-DD",\n  "start_time": "HH:MM",\n  "end_time": "HH:MM",\n  "purpose": "Purpose"\n}\n\`\`\`\nAssume the current date is ${new Date().toISOString().split('T')[0]}. Use reasonable defaults for missing times (e.g. "10:00" to "11:00" in 24h format). If it is NOT a booking request, answer their question normally using the database.`;
};

const handlePotentialBooking = (answerText, originalQuestion) => {
  try {
    const jsonMatch = answerText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, answerText];
    let parsed = null;
    try {
      const maybeJson = jsonMatch[1] || answerText;
      const startIdx = maybeJson.indexOf('{');
      const endIdx = maybeJson.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        parsed = JSON.parse(maybeJson.slice(startIdx, endIdx + 1));
      }
    } catch(e) {}
    
    if (!parsed && originalQuestion && /book|reserve/i.test(originalQuestion)) {
      // Regex fallback if Genie refuses or fails to output JSON
      const roomMatch = originalQuestion.match(/(?:book|reserve)\s+(?:room\s+)?([A-Za-z0-9-]+)/i);
      if (roomMatch) {
        // Try to extract time if possible, e.g. "from 2 pm to 3 pm" -> "14:00" and "15:00"
        let start_time = '10:00';
        let end_time = '11:00';
        
        // Very basic time extraction for demo purposes
        const timeMatch = originalQuestion.match(/([0-9]{1,2})(?:\s*(am|pm))?\s*(?:to|-)\s*([0-9]{1,2})(?:\s*(am|pm))?/i);
        if (timeMatch) {
          const parseTime = (hr, ampm) => {
             let h = parseInt(hr);
             if (ampm && ampm.toLowerCase() === 'pm' && h < 12) h += 12;
             if (ampm && ampm.toLowerCase() === 'am' && h === 12) h = 0;
             return h.toString().padStart(2, '0') + ':00';
          };
          start_time = parseTime(timeMatch[1], timeMatch[2] || timeMatch[4]);
          end_time = parseTime(timeMatch[3], timeMatch[4] || timeMatch[2]);
        }

        parsed = {
          action: 'BOOK_ROOM',
          room_name: roomMatch[1],
          date: new Date().toISOString().split('T')[0],
          start_time,
          end_time,
          purpose: 'Chat Booking'
        };
      }
    }

    if (parsed && parsed.action === 'BOOK_ROOM') {
      const rawName = (parsed.room_name || '').trim();
      const normalizedQuery = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

      // 1. Try exact or normalized match (e.g. "CS 101" -> "CS-101")
      let room = db.prepare('SELECT id, name FROM rooms WHERE LOWER(name) = LOWER(?) LIMIT 1').get(rawName);
      if (!room) {
        room = db.prepare("SELECT id, name FROM rooms WHERE LOWER(REPLACE(REPLACE(name, '-', ''), ' ', '')) = ? LIMIT 1").get(normalizedQuery);
      }
      if (!room) {
        room = db.prepare('SELECT id, name FROM rooms WHERE LOWER(name) LIKE LOWER(?) LIMIT 1').get(`%${rawName}%`);
      }
      if (!room) {
        const roomNumberMatch = rawName.match(/\d+/);
        if (roomNumberMatch) {
          room = db.prepare('SELECT id, name FROM rooms WHERE name LIKE ? LIMIT 1').get(`%${roomNumberMatch[0]}%`);
        }
      }
      
      if (!room) {
        return `I couldn't find a room matching "${parsed.room_name}". Could you be more specific?`;
      }
      
      const conflict = db.prepare(`
        SELECT id FROM bookings 
        WHERE room_id = ? AND date = ? AND status IN ('approved', 'pending')
        AND start_time < ? AND end_time > ?
      `).get(room.id, parsed.date, parsed.end_time, parsed.start_time);
      
      if (conflict) {
        return `Sorry, ${room.name} is already booked on ${parsed.date} from ${parsed.start_time} to ${parsed.end_time}.`;
      }

      db.prepare(`
        INSERT INTO bookings (room_id, user_id, user_name, date, start_time, end_time, purpose, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `).run(room.id, 1, 'Teacher Demo', parsed.date, parsed.start_time, parsed.end_time, parsed.purpose || 'Chat Booking');
      
      return `I have successfully submitted a booking request for ${room.name} on ${parsed.date} from ${parsed.start_time} to ${parsed.end_time}.`;
    }
  } catch (e) {
    // Ignore errors
  }
  return answerText;
};

const pollMessage = async (conversationId, messageId) => {
  let delay = 5000;
  const start = Date.now();
  const maxTime = 10 * 60 * 1000;

  while (Date.now() - start < maxTime) {
    // Wait before polling — Genie needs processing time
    await new Promise(resolve => setTimeout(resolve, delay));

    const url = `${DATABRICKS_HOST}/api/2.0/genie/spaces/${GENIE_SPACE_ID}/conversations/${conversationId}/messages/${messageId}`;
    
    try {
      const res = await fetch(url, { headers: getGenieHeaders() });
      if (!res.ok) {
        return { ok: false, error: `HTTP error! status: ${res.status}` };
      }
      
      const data = await res.json();
      const status = data.status;
      
      if (status === 'COMPLETED') {
        return { ok: true, data };
      } else if (status === 'FAILED' || status === 'CANCELLED') {
        return { ok: false, error: `Message status: ${status}`, data };
      }
      // FETCHING_METADATA, FILTERING_CONTEXT, ASKING_AI, PENDING_WAREHOUSE, EXECUTING_QUERY → still thinking
    } catch (e) {
      return { ok: false, error: e.message };
    }
    
    // Exponential backoff after 2 minutes
    if (Date.now() - start > 2 * 60 * 1000) {
      delay = Math.min(delay * 1.5, 30000);
    }
  }
  return { ok: false, error: 'Timeout exceeded' };
};

router.post('/start', async (req, res) => {
  try {
    const { question } = req.body;
    const url = `${process.env.DATABRICKS_HOST}/api/2.0/genie/spaces/${process.env.GENIE_SPACE_ID}/start-conversation`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getGenieHeaders(),
      body: JSON.stringify({ content: getPrompt(question) })
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to start conversation' });
    }
    
    const data = await response.json();
    const { conversation_id, message_id } = data;
    
    const pollResult = await pollMessage(conversation_id, message_id);
    if (pollResult.ok) {
      const msg = pollResult.data;
      
      let answerText = msg.content;
      const textAttachment = msg.attachments?.find(a => a.text?.purpose === 'TEXT_ATTACHMENT_PURPOSE_ANSWER');
      if (textAttachment) {
        answerText = textAttachment.text.content;
      }
      answerText = handlePotentialBooking(answerText, question);
      
      res.json({
        conversation_id,
        message_id,
        answer: answerText,
        sql: msg.attachments?.[0]?.query?.query,
        sql_description: msg.attachments?.[0]?.query?.description,
        attachment_id: msg.attachments?.[0]?.attachment_id,
        status: msg.status
      });
    } else {
      res.status(500).json({ error: pollResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/followup', async (req, res) => {
  try {
    const { conversation_id, question } = req.body;
    const url = `${process.env.DATABRICKS_HOST}/api/2.0/genie/spaces/${process.env.GENIE_SPACE_ID}/conversations/${conversation_id}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getGenieHeaders(),
      body: JSON.stringify({ content: getPrompt(question) })
    });
    
    if (!response.ok) return res.status(response.status).json({ error: 'Failed to send followup' });
    
    const data = await response.json();
    const msgId = data.id || data.message_id;
    
    const pollResult = await pollMessage(conversation_id, msgId);
    if (pollResult.ok) {
      const msg = pollResult.data;
      
      let answerText = msg.content;
      const textAttachment = msg.attachments?.find(a => a.text?.purpose === 'TEXT_ATTACHMENT_PURPOSE_ANSWER');
      if (textAttachment) {
        answerText = textAttachment.text.content;
      }
      answerText = handlePotentialBooking(answerText, question);
      
      res.json({
        conversation_id,
        message_id: msgId,
        answer: answerText,
        sql: msg.attachments?.[0]?.query?.query,
        sql_description: msg.attachments?.[0]?.query?.description,
        attachment_id: msg.attachments?.[0]?.attachment_id,
        status: msg.status
      });
    } else {
      res.status(500).json({ error: pollResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/results/:convId/:msgId/:attachId', async (req, res) => {
  try {
    const { convId, msgId, attachId } = req.params;
    const url = `${process.env.DATABRICKS_HOST}/api/2.0/genie/spaces/${process.env.GENIE_SPACE_ID}/conversations/${convId}/messages/${msgId}/attachments/${attachId}/query-result`;
    
    const response = await fetch(url, { headers: getGenieHeaders() });
    if (!response.ok) return res.status(response.status).json({ error: 'Failed to fetch results' });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
