(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const revealTargets = document.querySelectorAll(
    '.section-kicker, .invitation-card, .detail-card, .photo-tile, .closing-art, .closing-copy, .contact-inner > *'
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

