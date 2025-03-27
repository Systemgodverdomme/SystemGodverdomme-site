// script.js – animations et interactions Godverdomme

window.addEventListener('DOMContentLoaded', () => {
  // Animation : retirer l’intro glitch après délai
  const intro = document.getElementById('glitch-intro');
  setTimeout(() => {
    intro.style.display = 'none';
  }, 3500);

  // (Optionnel) Lecture d’un son glitch en boucle
  const glitchSound = new Audio('assets/glitch.mp3');
  glitchSound.loop = true;
  glitchSound.volume = 0.05;
  glitchSound.play().catch(e => {
    console.log('Lecture auto du son bloquée par le navigateur.');
  });

  // Action du bouton "Je veux être godverdommisé"
  const button = document.querySelector('.sidebar button');
  if (button) {
    button.addEventListener('click', () => {
      alert('Bienvenue dans le chaos. Tu es maintenant godverdommisé.');
      // Ici tu peux rediriger ou ouvrir un formulaire :
      // window.location.href = 'https://tonlien.com/formulaire';
    });
  }
});
