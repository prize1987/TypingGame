import * as api from '../api/api.js';

export default class GameView {
  constructor(el) {
    this.el = el;

    this.status = 'init'; // init, game, complete

    this.wordInfo = [];
    this.clearTime = [];
    this.failCount = 0;
    this.inputWord = '';
    this.currentTimerId = 0;
    this.currentWordIdx = 0;
    this.currentTickId = 0;
    this.currentTick = 0;

    this.$wordDisplay = null;
    this.$timer = null;
    this.$input = null;
    this.$startBtn = null;

    this.firstRender();
  }

  showWords(i) {
    clearTimeout(this.currentTimerId);
    clearInterval(this.currentTickId);

    this.currentWordIdx = i;
    this.$wordDisplay.innerText = this.wordInfo[i].text;
    this.showSecondsTick(this.wordInfo[i].second);

    this.currentTimerId = setTimeout(() => {
      this.failCount++;
      this.showScore();

      if (i + 1 < this.wordInfo.length) {
        this.showWords(i + 1);
      } else {
        this.endGame();
        this.routeToScoreView(this.clearTime);
      }
    }, this.wordInfo[i].second * 100);
  }

  showSecondsTick(seconds) {
    this.currentTick = 0;
    this.$timer.innerText = `남은 시간 : ${seconds}초`;

    this.currentTickId = setInterval(() => {
      this.$timer.innerText = `남은 시간 : ${seconds - ++this.currentTick}초`;
      if (this.currentTick === seconds) {
        clearInterval(this.currentTickId);
      }
    }, 100);
  }

  showScore() {
    this.$score.innerText = `점수 : ${this.wordInfo.length - this.failCount}점`;
  }

  async getData() {
    const data = await api.fetchWords();
    this.clearTime = new Array(data.length).fill(-1);

    this.wordInfo = data;
  }

  onButtonClick(e) {
    if (this.status === 'init') {
      this.startGame();
      e.target.innerText = '초기화';
    } else {
      this.endGame();
      e.target.innerText = '시작';
    }
  }

  onKeyUp(e) {
    if (this.status === 'game') {
      if (e.key === 'Enter') {
        if (this.isMatching(e.target.value)) {
          this.clearTime[this.currentWordIdx] = this.currentTick;
          if (this.currentWordIdx + 1 < this.wordInfo.length) {
            this.showWords(this.currentWordIdx + 1);
          } else {
            this.endGame();
            this.routeToScoreView(this.clearTime);
          }
        }
        this.$input.value = '';
      } else if (e.key === 'Escape') {
        if (this.currentWordIdx + 1 < this.wordInfo.length) {
          this.showWords(this.currentWordIdx + 1);
          this.failCount++;
          this.showScore();
        } else {
          this.endGame();
          this.routeToScoreView(this.clearTime);
        }
        this.$input.value = '';
      } else {
        this.inputWord = e.target.value;
      }
    }
  }

  isMatching(input) {
    const currentAnswer = this.wordInfo[this.currentWordIdx].text;
    return currentAnswer === input;
  }

  async startGame() {
    await this.getData();

    this.failCount = 0;
    this.showWords(0);
    this.showScore();
    this.status = 'game';
    this.$input.value = '';
    this.$input.focus();
  }

  endGame() {
    clearTimeout(this.currentTimerId);
    clearInterval(this.currentTickId);

    this.$timer.innerText = '남은 시간 :';
    this.$score.innerText = '점수 : ';
    this.$wordDisplay.innerText = '문제 단어';
    this.$input.value = '입력';
    this.$startBtn.innerText = '시작';
    this.status = 'init';
  }

  bindHandleClick(handler) {
    this.routeToScoreView = handler;
  }

  firstRender() {
    const $statusBar = document.createElement('div');
    $statusBar.className = 'status-bar';

    const $timer = document.createElement('div');
    $timer.className = 'timer';

    const $score = document.createElement('div');
    $score.className = 'score';

    $statusBar.appendChild($timer);
    $statusBar.appendChild($score);

    const $wordDisplay = document.createElement('div');
    $wordDisplay.className = 'word-display';

    const $inputContainer = document.createElement('div');
    $inputContainer.className = 'input-container';

    const $input = document.createElement('input');
    $input.className = 'input';

    $inputContainer.appendChild($input);

    const $startBtnContainer = document.createElement('div');
    $startBtnContainer.className = 'start-btn-container';

    const $startBtn = document.createElement('button');
    $startBtn.className = 'start-btn';

    $startBtnContainer.appendChild($startBtn);

    this.el.appendChild($statusBar);
    this.el.appendChild($wordDisplay);
    this.el.appendChild($inputContainer);
    this.el.appendChild($startBtnContainer);

    // event listner
    $input.addEventListener('keyup', (e) => this.onKeyUp(e));
    $startBtn.addEventListener('click', (e) => this.onButtonClick(e));

    // set element variables
    this.$wordDisplay = $wordDisplay;
    this.$timer = $timer;
    this.$input = $input;
    this.$score = $score;
    this.$startBtn = $startBtn;

    $timer.innerText = '남은 시간 :';
    $score.innerText = '점수 : ';
    $wordDisplay.innerText = '문제 단어';
    $input.value = '입력';
    $startBtn.innerText = '시작';
  }
}
