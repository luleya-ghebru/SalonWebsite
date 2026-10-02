// ===== Mobile menu toggle =====
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

// ===== Hide broken images so the pink "Add your photo here" slot shows instead =====
document.querySelectorAll('.slot-img').forEach(img => {
  const hide = () => { img.style.display = 'none'; };
  img.addEventListener('error', hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

// ===== Services page: search box filters the service cards =====
const search = document.getElementById('service-search');
if (search) {
  search.addEventListener('input', () => {
    const term = search.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('#service-list .card').forEach(card => {
      const match = card.dataset.name.toLowerCase().includes(term);
      card.hidden = !match;
      if (match) shown++;
    });
    document.getElementById('no-results').hidden = shown > 0;
  });
}

// ===== Gallery page: category filter buttons =====
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active-filter', b === btn);
      b.classList.toggle('outline', b !== btn);
    });
    document.querySelectorAll('#gallery [data-category]').forEach(item => {
      item.hidden = btn.dataset.filter !== 'all' && item.dataset.category !== btn.dataset.filter;
    });
  });
});

// ===== Form helpers =====
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = v => /^(\+27|0)[0-9]{9}$/.test(v.replace(/[\s-]/g, ''));

// Shows or clears the error under a field; returns true if the field is valid
function check(id, valid, message) {
  const field = document.getElementById(id);
  field.classList.toggle('invalid', !valid);
  document.getElementById(id + '-err').textContent = valid ? '' : message;
  return valid;
}

// ===== Booking (enquiry) form: validate, then show a booking summary and estimate =====
const enquiry = document.getElementById('enquiry-form');
if (enquiry) {
  const dateInput = document.getElementById('e-date');
  dateInput.min = new Date().toISOString().split('T')[0]; // no past dates

  enquiry.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('e-name').value.trim();
    const date = dateInput.value;
    const isSunday = date && new Date(date + 'T00:00').getDay() === 0;
    const isMonday = date && new Date(date + 'T00:00').getDay() === 1;
    const results = [
      check('e-name', name.length >= 2, 'Enter your full name.'),
      check('e-email', emailOk(document.getElementById('e-email').value.trim()), 'Enter a valid email, like name@example.com.'),
      check('e-phone', phoneOk(document.getElementById('e-phone').value), 'Enter a valid SA number, like 082 123 4567.'),
      check('e-service', document.getElementById('e-service').value !== '', 'Choose a service.'),
      check('e-date', date !== '' && date >= dateInput.min && !isSunday && !isMonday, 'Choose a future date, Tuesday to Saturday.'),
      check('e-time', document.getElementById('e-time').value !== '', 'Choose a time.')
    ];
    if (results.includes(false)) return;

    const select = document.getElementById('e-service');
    const price = Math.round(Number(select.value) * Number(enquiry.elements.length.value));
    document.getElementById('enquiry-response').innerHTML =
      `<strong>Thank you, ${name}!</strong> We received your request for <em>${select.options[select.selectedIndex].text.split(' (')[0]}</em> ` +
      `on ${date} at ${document.getElementById('e-time').value} with ${document.getElementById('e-stylist').value.toLowerCase()}. ` +
      `Your estimated price is about <strong>R${price}</strong>. We will confirm by phone or email within one working day.`;
    enquiry.reset();
  });
}

// ===== Contact form: validate, then open an email addressed to the salon =====
const contact = document.getElementById('contact-form');
if (contact) {
  contact.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const type = document.getElementById('c-type').value;
    const msg = document.getElementById('c-message').value.trim();
    const results = [
      check('c-name', name.length >= 2, 'Enter your full name.'),
      check('c-email', emailOk(email), 'Enter a valid email, like name@example.com.'),
      check('c-type', type !== '', 'Choose a message type.'),
      check('c-message', msg.length >= 10, 'Write at least 10 characters.')
    ];
    if (results.includes(false)) return;

    const body = `Name: ${name}\nEmail: ${email}\n\n${msg}`;
    // Change this address to the salon's real email
    window.location.href = `mailto:hello@glowhairsalon.co.za?subject=${encodeURIComponent(type)}&body=${encodeURIComponent(body)}`;
  });
}
