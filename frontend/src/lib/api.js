const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const genieStart = (question) => fetchJSON('/genie/start', { method: 'POST', body: JSON.stringify({ question }) });
export const genieFollowup = (conversationId, question) => fetchJSON('/genie/followup', { method: 'POST', body: JSON.stringify({ conversation_id: conversationId, question }) });
export const genieResults = (convId, msgId, attachId) => fetchJSON(`/genie/results/${convId}/${msgId}/${attachId}`);
export const fetchRooms = (filters = {}) => {
  const q = new URLSearchParams(filters).toString();
  return fetchJSON(`/rooms${q ? `?${q}` : ''}`);
};
export const fetchRoom = (id) => fetchJSON(`/rooms/${id}`);
export const bookRoom = (roomId, data) => fetchJSON(`/rooms/${roomId}/book`, { method: 'POST', body: JSON.stringify(data) });
export const fetchBookings = (status) => {
  const q = status ? `?status=${status}` : '';
  return fetchJSON(`/bookings${q}`);
};
export const fetchUserBookings = (userId) => fetchJSON(`/bookings/user/${userId}`);
export const updateBookingStatus = (id, status) => fetchJSON(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const fetchOverview = () => fetchJSON('/analytics/overview');
export const fetchHeatmap = () => fetchJSON('/analytics/heatmap');
export const fetchResources = () => fetchJSON('/analytics/resources');
