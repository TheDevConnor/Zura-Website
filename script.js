const toggle = document.getElementById('toggleDark');
const body = document.body;

toggle.addEventListener('click', () => {
  const isDark = toggle.classList.toggle('bi-brightness-high-fill');
  toggle.classList.toggle('bi-moon', !isDark);
  body.style.background = isDark ? '#23272A' : '#DCDDDE';
  body.style.color = isDark ? '#DCDDDE' : '#23272A';
  body.style.transition = 'background 2s, color 2s';
});

const selector = document.getElementById('codeSelector');
const examples = document.querySelectorAll('.code-example');

selector.addEventListener('change', function () {
  examples.forEach(el => el.style.display = 'none');
  const selected = document.getElementById(this.value);
  if (selected) selected.style.display = 'block';
});
