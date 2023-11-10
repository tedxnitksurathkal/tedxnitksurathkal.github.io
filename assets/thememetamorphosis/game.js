let tog = 1;
let rollingSound = new Audio("rpg-dice-rolling-95182.mp3");
let winSound = new Audio("winharpsichord-39642.mp3");

let score = 750;
let p1sum = 0;
let p2sum = 0;

// make the variable to use in the  function
const quizModal = document.getElementById("quizModal");
const questionElement = document.getElementById("question");
const options = document.querySelectorAll('input[name="answer"]');
const submitButton = document.getElementById("submitAnswer");
const quizModalsnake = document.getElementById("quizModalsnake");
const submitButtons = document.getElementById("submitAnswers");
const questionElements = document.getElementById("questions");

// these are the question for the quick quize
const ladderQuestions = {
  1: {
    question:
      "What is the most critical skill for success in software development?",
    option1: "Problem-solving",
    option2: "Art appreciation",
    option3: "Baking",
    option4: "Playing the guitar",
    correctAnswer: "Problem-solving",
  },

  2: {
    question:
      "In project management, what is the primary purpose of a Gantt chart?",
    option1: "To create art",
    option2: "To track project timelines and dependencies",
    option3: "To bake delicious cakes",
    option4: "To compose music",
    correctAnswer: "To track project timelines and dependencies",
  },

  3: {
    question:
      "Which programming language is commonly used for data analysis and machine learning?",
    option1: "Python",
    option2: "Dance",
    option3: "Pottery",
    option4: "Watercolor painting",
    correctAnswer: "Python",
  },

  4: {
    question:
      "What is the term for a brief document that summarizes a job applicant's qualifications and experience?",
    option1: "Curriculum Vitae",
    option2: "Stand-up comedy",
    option3: "Gardening",
    option4: "Poetry",
    correctAnswer: "Curriculum Vitae",
  },

  5: {
    question:
      "In a job interview, what should you do to establish a positive first impression?",
    option1: "Share your favorite jokes",
    option2: "Dress professionally and maintain eye contact",
    option3: "Dance spontaneously",
    option4: "Share your cooking recipes",
    correctAnswer: "Dress professionally and maintain eye contact",
  },

  6: {
    question:
      "What social media platform is commonly used for personal branding and showcasing professional achievements?",
    option1: "Pinterest",
    option2: "Instagram",
    option3: "LinkedIn",
    option4: "Karaoke",
    correctAnswer: "LinkedIn",
  },

  7: {
    question:
      "Which professional skill involves the ability to persuade and influence others effectively?",
    option1: "Public speaking",
    option2: "Yodeling",
    option3: "Acting",
    option4: "Origami",
    correctAnswer: "Public speaking",
  },

  8: {
    question:
      "What is the process of identifying, attracting, and evaluating potential job candidates?",
    option1: "Bowling",
    option2: "Talent acquisition",
    option3: "Glassblowing",
    option4: "Cooking",
    correctAnswer: "Talent acquisition",
  },

  9: {
    question:
      "What is the term for a systematic training and development plan for employees within an organization?",
    option1: "Professional development",
    option2: "Skydiving",
    option3: "Salsa dancing",
    option4: "Marathon running",
    correctAnswer: "Professional development",
  },

  10: {
    question:
      "What communication skill involves active listening, empathy, and understanding the speaker's perspective?",
    option1: "Texting",
    option2: "Interpretive dance",
    option3: "Empathetic communication",
    option4: "Magic tricks",
    correctAnswer: "Empathetic communication",
  },
  11: {
    question:
      "What is the term for a work arrangement where employees work from a location outside of the office, often from home?",
    option1: "Office work",
    option2: "Remote work",
    option3: "On-site work",
    option4: "Underwater work",
    correctAnswer: "Remote work",
  },

  12: {
    question:
      "Which term refers to the skills and knowledge specific to a particular profession or industry?",
    option1: "Hobby skills",
    option2: "Transferable skills",
    option3: "Professional skills",
    option4: "Universal skills",
    correctAnswer: "Professional skills",
  },

  13: {
    question:
      "What is the process of assessing and evaluating an employee's job performance and providing feedback?",
    option1: "Performance assessment",
    option2: "Employee celebration",
    option3: "Performance appraisal",
    option4: "Job termination",
    correctAnswer: "Performance appraisal",
  },

  14: {
    question:
      "What term describes the ability to adapt to new technologies and learn new skills as they emerge in the workplace?",
    option1: "Technological resistance",
    option2: "Technological stagnation",
    option3: "Technological agility",
    option4: "Technological rebellion",
    correctAnswer: "Technological agility",
  },

  15: {
    question: "In the context of a resume, what does 'CV' stand for?",
    option1: "Creative Vision",
    option2: "Continuous Vacation",
    option3: "Curriculum Vitae",
    option4: "Culinary Variety",
    correctAnswer: "Curriculum Vitae",
  },

  16: {
    question:
      "What is the term for a person who provides guidance and advice to someone in their career development?",
    option1: "Life artist",
    option2: "Career astronaut",
    option3: "Career counselor",
    option4: "Career DJ",
    correctAnswer: "Career counselor",
  },

  17: {
    question:
      "What is the process of setting specific and achievable goals for one's career development?",
    option1: "Goal surfing",
    option2: "Goal posting",
    option3: "Goal setting",
    option4: "Goal sleeping",
    correctAnswer: "Goal setting",
  },

  18: {
    question:
      "Which profession involves designing and creating visual materials for communication and marketing purposes?",
    option1: "Astronomy",
    option2: "Graphic design",
    option3: "Geology",
    option4: "Botany",
    correctAnswer: "Graphic design",
  },

  19: {
    question:
      "What is the practice of working for yourself and managing your own business called?",
    option1: "Teamwork",
    option2: "Freelancing",
    option3: "Competition",
    option4: "Hibernation",
    correctAnswer: "Freelancing",
  },

  20: {
    question:
      "What is the process of acquiring and developing new skills and knowledge to improve one's abilities in the workplace?",
    option1: "Skill regression",
    option2: "Skill depreciation",
    option3: "Skill stagnation",
    option4: "Skill development",
    correctAnswer: "Skill development",
  },
  21: {
    question:
      "What is the term for a group of people with complementary skills who work together to achieve a common goal or project?",
    option1: "Solo effort",
    option2: "Friendship club",
    option3: "Team",
    option4: "Fan club",
    correctAnswer: "Team",
  },

  22: {
    question:
      "Which professional skill involves the ability to efficiently manage and prioritize tasks and projects?",
    option1: "Procrastination",
    option2: "Time management",
    option3: "Daydreaming",
    option4: "Randomization",
    correctAnswer: "Time management",
  },

  23: {
    question:
      "What is the term for the practice of making connections and building relationships in a professional context?",
    option1: "Social gathering",
    option2: "Networking",
    option3: "Isolation",
    option4: "Meditation",
    correctAnswer: "Networking",
  },
  24: {
    question:
      "Which document typically outlines an organization's mission, vision, and values, guiding its strategic direction?",
    option1: "Recipe book",
    option2: "Annual report",
    option3: "Business card",
    option4: "Mission statement",
    correctAnswer: "Mission statement",
  },

  25: {
    question:
      "What is the term for the process of analyzing data to make informed business decisions?",
    option1: "Data analysis",
    option2: "Data collection",
    option3: "Data storage",
    option4: "Data origami",
    correctAnswer: "Data analysis",
  },

  26: {
    question:
      "In the context of job searching, what is a cover letter primarily used for?",
    option1: "Framing a picture",
    option2: "Sending recipes",
    option3: "Introducing oneself and expressing interest in a job",
    option4: "Designing clothing",
    correctAnswer: "Introducing oneself and expressing interest in a job",
  },

  27: {
    question:
      "What is the term for the process of comparing an organization's performance against industry standards or competitors?",
    option1: "Self-isolation",
    option2: "Benchmarking",
    option3: "Sculpting",
    option4: "Nature observation",
    correctAnswer: "Benchmarking",
  },

  28: {
    question: "In the context of interviews, what does 'SWOT' stand for?",
    option1: "Sneak while others talk",
    option2: "Strengths, Weaknesses, Opportunities, Threats",
    option3: "Synchronized water operation tactics",
    option4: "Sleep well on Tuesdays",
    correctAnswer: "Strengths, Weaknesses, Opportunities, Threats",
  },

  29: {
    question:
      "What is the term for the practice of submitting a formal application for a job position?",
    option1: "Job wish",
    option2: "Job celebration",
    option3: "Job application",
    option4: "Job breakdance",
    correctAnswer: "Job application",
  },

  30: {
    question:
      "Which professional field involves analyzing and managing financial resources and investments?",
    option1: "Zoology",
    option2: "Botany",
    option3: "Dentistry",
    option4: "Finance",
    correctAnswer: "Finance",
  },

  31: {
    question:
      "What is the term for the practice of evaluating and negotiating job offers to reach a mutually beneficial agreement?",
    option1: "Job negotiation",
    option2: "Job yoga",
    option3: "Job karate",
    option4: "Job mime",
    correctAnswer: "Job negotiation",
  },

  32: {
    question: "In a business context, what does ROI stand for?",
    option1: "Recipe Of Intelligence",
    option2: "Rain Of Ideas",
    option3: "Return On Investment",
    option4: "Radiant Office Interior",
    correctAnswer: "Return On Investment",
  },

  33: {
    question:
      "What is the term for a formal meeting in which a job applicant is asked questions to determine their suitability for a position?",
    option1: "Job celebration",
    option2: "Job appointment",
    option3: "Job interview",
    option4: "Job concert",
    correctAnswer: "Job interview",
  },

  34: {
    question:
      "In the context of personal finance, what is a 'budget' used for?",
    option1: "Planning vacations",
    option2: "Managing expenses and income",
    option3: "Decorating your home",
    option4: "Writing poetry",
    correctAnswer: "Managing expenses and income",
  },

  35: {
    question:
      "What is the process of assessing one's strengths, interests, and values to make informed career choices?",
    option1: "Career lottery",
    option2: "Career exploration",
    option3: "Career astrology",
    option4: "Career juggling",
    correctAnswer: "Career exploration",
  },

  36: {
    question: "In marketing, what does 'SWOT analysis' help identify?",
    option1: "Dinner recipes",
    option2: "Marketing acronyms",
    option3: "Strengths, Weaknesses, Opportunities, and Threats in a business",
    option4: "Musical notes",
    correctAnswer:
      "Strengths, Weaknesses, Opportunities, and Threats in a business",
  },

  37: {
    question:
      "What is the term for a written or digital document that showcases a person's work, skills, and experience?",
    option1: "Recipe book",
    option2: "Portfolio",
    option3: "Sketchbook",
    option4: "Fiction novel",
    correctAnswer: "Portfolio",
  },

  38: {
    question: "In the context of teamwork, what does 'collaboration' mean?",
    option1: "Singing solo",
    option2: "Working together effectively with others",
    option3: "Planting trees",
    option4: "Dancing alone",
    correctAnswer: "Working together effectively with others",
  },

  39: {
    question:
      "What is the term for the process of searching and applying for job opportunities?",
    option1: "Job daydreaming",
    option2: "Job search",
    option3: "Job magic",
    option4: "Job sleepwalking",
    correctAnswer: "Job search",
  },

  40: {
    question:
      "In project management, what is the term for the specific, measurable, achievable, relevant, and time-bound criteria used to define project goals?",
    option1: "Creative writing",
    option2: "SMART goals",
    option3: "Musical composition",
    option4: "Painting technique",
    correctAnswer: "SMART goals",
  },
};

let currentLadderSquare = 14; // Initialize currentLadderSquare as a global variable.

// this is the function to display the question if player steps on a ladder
function displayQuizQuestion(squareNumber) {
  const question = ladderQuestions[squareNumber];

  if (question) {
    questionElement.textContent = question.question;
    document.getElementById("button1").value = question.option1;
    document.getElementById("button2").value = question.option2;
    document.getElementById("button3").value = question.option3;
    document.getElementById("button4").value = question.option4;
    document.getElementById("option1Text").textContent = question.option1;
    document.getElementById("option2Text").textContent = question.option2;
    document.getElementById("option3Text").textContent = question.option3;
    document.getElementById("option4Text").textContent = question.option4;
    quizModal.style.display = "block";
  }
}

// this is the function to display the question if player steps on a snake
function displayQuizQuestionsnake(squareNumber) {
  const question = ladderQuestions[squareNumber];

  if (question) {
    questionElements.textContent = question.question;
    document.getElementById("button1s").value = question.option1;
    document.getElementById("button2s").value = question.option2;
    document.getElementById("button3s").value = question.option3;
    document.getElementById("button4s").value = question.option4;
    document.getElementById("option1Texts").textContent = question.option1;
    document.getElementById("option2Texts").textContent = question.option2;
    document.getElementById("option3Texts").textContent = question.option3;
    document.getElementById("option4Texts").textContent = question.option4;
    console.log(document.getElementById("button1s").value);
    quizModalsnake.style.display = "block";
  }
}

//the function to check where the player is and act acordingly
function play(player, psum, correction, num) {
  let sum;
  if (psum == "p1sum") {
    p1sum = p1sum + num;

    if (p1sum > 100) {
      p1sum = p1sum - num;
      // sum = p1sum
    }

    if (p1sum == 5) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 25;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 14) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 29;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 22) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 41;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 34) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 53;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 38) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 59;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 54) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 75;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 65) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 83;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 68) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 90;
      displayQuizQuestion(squareNumber);
    }
    if (p1sum == 21) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 3;
      displayQuizQuestionsanke(squareNumber);
    }
    if (p1sum == 27) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 9;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 60) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 4;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 56) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 26;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 69) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 31;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 80) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 58;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 95) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 73;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 97) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 75;
      displayQuizQuestionsnake(squareNumber);
    }
    if (p1sum == 82) {
      squareNumber = Math.floor(Math.random() * 40) + 1;
      currentLadderSquare = 37;
      displayQuizQuestionsnake(squareNumber);
    }

    sum = p1sum;
  }

  document.getElementById(`${player}`).style.transition = `linear all .7s`;

  if (sum < 10) {
    document.getElementById(`${player}`).style.left = `${(sum - 1) * 60}px`;
    document.getElementById(`${player}`).style.top = `${
      -0 * 60 - correction
    }px`;
  } else if (sum == 100) {
    winSound.play();
    alert("Congratulations! Your score is: " + score);
    location.reload();
  } else {
    numarr = Array.from(String(sum));
    n1 = eval(numarr.shift());
    n2 = eval(numarr.pop());
    console.log(n1, n2);

    if (n1 % 2 != 0) {
      if (n2 == 0) {
        document.getElementById(`${player}`).style.left = `${9 * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          (-n1 + 1) * 62 - correction
        }px`;
      } else {
        document.getElementById(`${player}`).style.left = `${
          (9 - (n2 - 1)) * 62
        }px`;
        document.getElementById(`${player}`).style.top = `${
          -n1 * 62 - correction
        }px`;
      }
    } else if (n1 % 2 == 0) {
      if (n2 == 0) {
        document.getElementById(`${player}`).style.left = `${0 * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          (-n1 + 1) * 62 - correction
        }px`;
      } else {
        document.getElementById(`${player}`).style.left = `${(n2 - 1) * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          -n1 * 62 - correction
        }px`;
      }
    }
  }
}

//this is the function to roll the dice
document.getElementById("diceBtn").addEventListener("click", function () {
  rollingSound.play();
  num = Math.floor(Math.random() * (6 - 1 + 1) + 1);
  score = score - 10;
  document.getElementById("score").innerText = "Your score is: " + score;
  document.getElementById("sucess_alert").style.opacity = "0%";
  // num=27

  document.getElementById("dice").innerText = num;
  document.getElementById("tog").innerText = "Walk on your career journey";
  play("p1", "p1sum", -7, num);
});

//this is the function to check the ans for ladder question and act acordingly
submitButton.addEventListener("click", () => {
  const selectedAnswer = Array.from(options).find((option) => option.checked);

  console.log(document.getElementById("button1").value);

  if (selectedAnswer) {
    if (selectedAnswer.value === ladderQuestions[squareNumber].correctAnswer) {
      // alert('Correct answer! You can climb the ladder.');
      p1sum = currentLadderSquare; // Update the player's position.
      play("p1", "p1sum", -7, 0); // You might need to adjust these values.
      document.getElementById("sucess_alert").style.opacity = "100%";
      document.getElementById("sucess_alert").innerText =
        "Correct Answer!! You can climb the ladder of success!";
    } else {
      document.getElementById("sucess_alert").style.opacity = "100%";
      document.getElementById("sucess_alert").innerText =
        "Incorrect. No progress.";
    }

    quizModal.style.display = "none";
  }
});

//this the the function to the ans for the snake question and act accordingly
submitButtons.addEventListener("click", () => {
  const selectedAnswer = Array.from(options).find((option) => option.checked);

  console.log(document.getElementById("button1").value);

  if (selectedAnswer) {
    if (selectedAnswer.value !== ladderQuestions[squareNumber].correctAnswer) {
      // alert('Correct answer! You can climb the ladder.');
      p1sum = currentLadderSquare; // Update the player's position.
      play("p1", "p1sum", -7, 0); // You might need to adjust these values.
      document.getElementById("sucess_alert").style.opacity = "100%";
      document.getElementById("sucess_alert").innerText =
        "Wrong answer!! Descend.";
    } else {
      document.getElementById("sucess_alert").style.opacity = "100%";
      document.getElementById("sucess_alert").innerText =
        "Correct Answer!! You don't need to descend in your career, you can stay here.";
    }

    quizModalsnake.style.display = "none";
  }
});

//this is used for slecting the options
function selectOption(inputId) {
  var input = document.getElementById(inputId);
  input.checked = true;
}
