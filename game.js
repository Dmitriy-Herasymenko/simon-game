var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
let tickingClockAudio;

function stopAllSounds() {
  const audios = document.querySelectorAll('audio');

  // Перебираємо кожен елемент і зупиняємо відтворення
  audios.forEach(function(audio) {
    audio.pause();  // Зупиняє відтворення
    audio.currentTime = 0;  // Скидає час відтворення на початок
  });

}
// Обробник для початку гри після натискання клавіші
$(document).keypress(function () {
  if (!started && !$("#game-over-section").is(":visible")) {
    var audio = new Audio("sounds/ticking-clock.mp3");
    audio.loop = true; 
    audio.volume = 0.2; 
    audio.play(); 
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// Обробник для натискання кнопок гри
$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});


// Перевірка правильності введення
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Enter Your Name");
    stopAllSounds(); // Вимикає всі звуки, які відтворюються

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    // При завершенні гри ховаємо блок гри і показуємо форму для введення імені
    $("#game-section").hide();  // Сховуємо гру
    $("#game-over-section").show();  // Показуємо блок введення імені
  }
}

// Функція для створення наступного рівня гри
function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColour);
}

// Анімація натискання кнопки
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Відтворення звуку для кнопки
function playSound(name) {

  if (name === "wrong") {
    var audio = new Audio("sounds/wrong.mp3");
  } else {

    var audio = new Audio("sounds/mouse-click.mp3");
  }
  
  audio.play();  // Відтворюємо звук
}

// Функція для скидання гри
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

// Функція для оновлення високих результатів
function updateHighScores(name, level) {
  const tableBody = $("#high-scores tbody");
  const newRow = `<tr><td>${name}</td><td>${level}</td></tr>`;
  tableBody.append(newRow);
}

// Обробник для кнопки "Submit"
// Обробник для кнопки "Submit"
$("#submit-name").click(function() {
  const playerName = $("#username").val();
  if (playerName) {
    // Перевіряємо чи є вже таке ім'я в таблиці
    let playerFound = false;
    $("#high-scores tbody tr").each(function() {
      const existingName = $(this).find("td").eq(0).text(); // Отримуємо ім'я з першої клітинки
      const existingLevel = parseInt($(this).find("td").eq(1).text()); // Отримуємо рівень з другої клітинки

      if (existingName === playerName) {
        // Якщо ім'я знайдено, перевіряємо рівень
        if (level > existingLevel) {
          // Якщо новий рівень більший, оновлюємо рівень
          $(this).find("td").eq(1).text(level); // Оновлюємо рівень
        }
        playerFound = true;
        return false; // Виходимо з each, бо знайшли відповідність
      }
    });

    // Якщо ім'я не знайдено, додаємо новий запис
    if (!playerFound) {
      updateHighScores(playerName, level);
    }

    // Сховуємо форму введення імені та показуємо гру
    $("#game-over-section").hide();
    $("#game-section").show();
    $("#level-title").text("Press A Key to Start");

    // Ініціалізуємо нову гру
    startOver();
  }
});



