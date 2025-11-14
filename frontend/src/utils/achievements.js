

export const triggerAchievementsRefresh = () => {
 
  window.dispatchEvent(new Event('achievements:refresh'));

  const now = Date.now();
  const lastShown = parseInt(localStorage.getItem('achievements:lastNotify') || '0', 10);
  const MIN_INTERVAL = 5 * 60 * 1000; 

 
  if (now - lastShown < MIN_INTERVAL) return;

  const showNotification = () => {
    new Notification('🏆 ¡Nuevo logro desbloqueado!', {
      body: 'Ve a tu perfil para verlo.',
      icon: '/icons/trophy.png',
    });
    localStorage.setItem('achievements:lastNotify', String(now));
  };

  // Notificación nativa del navegador
  if (Notification.permission === 'granted') {
    showNotification();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') showNotification();
    });
  }
};
