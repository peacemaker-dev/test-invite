(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const envelope = document.querySelector('#invite-envelope');
  const envelopeSummary = envelope?.querySelector('summary');
  const envelopeLetter = envelope?.querySelector('.envelope-letter');

  envelope?.addEventListener('toggle', () => {
    if (!envelope.open) {
      envelopeSummary?.setAttribute('aria-label', 'Vula isimemo');
      return;
    }
    envelopeSummary?.setAttribute('aria-label', 'Vala isimemo');
    if (!prefersReducedMotion && envelopeLetter?.animate) {
      envelopeLetter.animate(
        [
          { opacity: 0, transform: 'translateY(28px) scale(.98)', filter: 'blur(4px)' },
          { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
        ],
        { duration: 720, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'both' }
      );
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const revealTargets = document.querySelectorAll(
    '.section-kicker, .detail-card, .photo-tile, .closing-art, .closing-copy, .contact-inner > *'
  );
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    revealTargets.forEach((element) => {
      element.classList.add('will-reveal');
      observer.observe(element);
    });
  }

  const venue = { name: '', address: '', mapsUrl: '' };
  const locationCard = document.querySelector('[data-location-card]');
  const locationName = locationCard?.querySelector('[data-location-name]');
  const mapButton = locationCard?.querySelector('[data-map-link]');
  const mapAddress = venue.mapsUrl || (venue.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`
    : '');

  if (venue.name && locationName) {
    locationName.replaceChildren(document.createTextNode(venue.name));
    if (venue.address && venue.address !== venue.name) {
      const addressLine = document.createElement('span');
      addressLine.textContent = venue.address;
      locationName.append(document.createElement('br'), addressLine);
    }
  }

  if (mapButton && mapAddress) {
    mapButton.disabled = false;
    mapButton.addEventListener('click', () => {
      window.open(mapAddress, '_blank', 'noopener,noreferrer');
    });
  }

  const calendarLink = document.querySelector('[data-calendar]');
  calendarLink?.addEventListener('click', (event) => {
    event.preventDefault();
    const eventText = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InviteHarbour//Umemulo ka Asemahle//ZU',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:umemulo-asemahle-20270320@inviteharbour.co.za',
      'DTSTAMP:' + new Date().toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}/, ''),
      'DTSTART:20270320T090000Z',
      'DURATION:PT1H',
      'SUMMARY:Umemulo ka Asemahle',
      'DESCRIPTION:Hosted by the Sithole family. Dress code: Traditional attire (White Izintombi). End time and venue to be confirmed.',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const file = new Blob([eventText], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'umemulo-ka-asemahle.ics';
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });
})();

