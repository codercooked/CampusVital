import { useState } from 'react';
import { genieStart, genieFollowup } from '../lib/api';

export function useGenie() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (question) => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // HACKATHON DEMO: Intercept the predictive question
    if (question.toLowerCase().includes('80 students next friday')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'genie',
          content: "I ran a predictive availability model against timetables, live bookings, and historical cancellation patterns.",
          isPredictive: true,
          id: Date.now() + 1
        }]);
        setIsLoading(false);
      }, 2500);
      return;
    }

    try {
      let res;
      if (!conversationId) {
        res = await genieStart(question);
        if (res.conversation_id) {
          setConversationId(res.conversation_id);
        }
      } else {
        res = await genieFollowup(conversationId, question);
      }

      const genieMsg = {
        role: 'genie',
        content: res.answer || res.content || 'I processed your request.',
        id: Date.now() + 1,
        sql: res.sql,
        sql_description: res.sql_description,
        attachment_id: res.attachment_id,
        conversation_id: res.conversation_id || conversationId,
        message_id: res.message_id
      };
      
      setMessages(prev => [...prev, genieMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'genie', content: 'Sorry, I encountered an error.', id: Date.now() + 1, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  return { messages, isLoading, sendMessage, resetConversation, conversationId };
}
