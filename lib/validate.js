// Shared validation helper for contact form
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

function validateContact(body) {
  if (!body || typeof body !== 'object') return false;
  const { name, email, phone, message } = body;

  // name and message required
  if (!name || !message) return false;

  // require at least one of email or phone
  if ((!email || email.trim() === '') && (!phone || phone.trim() === '')) return false;

  // if email provided, validate format
  if (email && email.trim() !== '' && !emailRegex.test(email)) return false;

  // if phone provided, validate basic format
  if (phone && phone.trim() !== '' && !phoneRegex.test(phone)) return false;

  return true;
}

module.exports = { validateContact };
