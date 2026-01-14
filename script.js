// Инициализация: получаем ссылки на элементы
const bootFill = document.getElementById('progressFill');
const bootText = document.getElementById('boot-text');
const bootDiv = document.getElementById('boot');
const terminalDiv = document.getElementById('terminal');
const terminalTextElem = document.getElementById('terminalText');
const cursor = document.getElementById('cursor');
const puzzleDiv = document.getElementById('puzzle');
const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const resultP = document.getElementById('result');

// Обработка загрузочного экрана (boot)
// Увеличиваем прогресс от 0% до 100%
function startBoot() {
  let progress = 0;
  const interval = setInterval(() => {
    progress++;
    bootFill.style.width = progress + '%';
    bootText.textContent = 'Загрузка ' + progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      // Запускаем эффект глитч-перехода перед показом терминала
      bootDiv.style.animation = 'glitch 0.6s steps(2) forwards';
    }
  }, 50);
}

// Анимация «глитч» для экрана загрузки
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes glitch {
  0% { transform: none; opacity: 1; }
  20% { transform: skew(-5deg, -2deg); }
  40% { transform: skew(5deg, 5deg); }
  60% { transform: skew(-3deg, 1deg); opacity: 0.8; }
  80% { transform: skew(2deg, -4deg); }
  100% { transform: none; opacity: 0; }
}`, styleSheet.cssRules.length);

// После анимации загрузки скрываем Boot и показываем терминал
bootDiv.addEventListener('animationend', () => {
  bootDiv.style.display = 'none';
  terminalDiv.style.display = 'block';
  startTyping(); // запускаем печать в терминале
});

// Пишем текст в терминал по символам (typewriter effect)
const lines = [
  'Инициализация системы...',
  'Система запущена.',
  'Введите код доступа:'
];
let lineIndex = 0;
let charIndex = 0;

function startTyping() {
  if (lineIndex < lines.length) {
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      terminalTextElem.textContent += currentLine.charAt(charIndex);
      charIndex++;
      setTimeout(startTyping, 100);
    } else {
      // Переход на новую строку после завершения линии
      terminalTextElem.textContent += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(startTyping, 300);
    }
  } else {
    // Конец печати: скрываем курсор и переходим к экрану Puzzle
    cursor.style.display = 'none';
    setTimeout(() => {
      terminalDiv.style.display = 'none';
      puzzleDiv.style.display = 'flex';
      codeInput.focus();
    }, 500);
  }
}

// Обработка нажатия кнопки Отправить
submitBtn.addEventListener('click', () => {
  const entered = codeInput.value.trim().toUpperCase();
  if (entered === 'NUMENE') {
    resultP.style.color = '#d4af37'; // золотистый цвет при успехе
    resultP.textContent = 'Доступ получен';
  } else {
    resultP.style.color = '#dd3333'; // красный цвет ошибки
    resultP.textContent = 'Неверный код. Попробуйте ещё.';
  }
});

// Регистрация сервис-воркера для PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker зарегистрирован.'))
    .catch(error => console.log('Ошибка регистрации SW:', error));
}

// Запускаем загрузочный процесс при открытии страницы
window.addEventListener('load', () => {
  startBoot();
});
