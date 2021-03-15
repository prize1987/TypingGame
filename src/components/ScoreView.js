export default class ScoreView {
  constructor(el) {
    this.el = el;

    this.$restartBtn = null;
    this.$score = null;
    this.$avgTime = null;

    this.firstRender();
  }

  renderScore(clearTime = []) {
    clearTime = clearTime.filter((item) => item >= 0);
    const totalScore = clearTime.length;
    const avgTime = (clearTime.reduce((sum, item) => (sum += item), 0) / clearTime.length) >> 0;

    this.$score.innerText = `당신의 점수는 ${totalScore}점입니다.`;
    this.$avgTime.innerText = `단어당 평균 답변 시간은 ${avgTime}초입니다.`;
  }

  bindHandleClick(handler) {
    this.$restartBtn.addEventListener('click', handler);
  }

  firstRender() {
    const $header = document.createElement('div');
    $header.className = 'score--header';

    const $score = document.createElement('div');
    $score.className = 'score--score';

    const $avgTime = document.createElement('div');
    $avgTime.className = 'score--avg-time';

    const $restartBtnContainer = document.createElement('div');
    $restartBtnContainer.className = 'score--restart-btn-container';

    const $restartBtn = document.createElement('button');
    $restartBtn.className = 'score--restart-btn';

    $restartBtnContainer.appendChild($restartBtn);

    this.el.appendChild($header);
    this.el.appendChild($score);
    this.el.appendChild($avgTime);
    this.el.appendChild($restartBtnContainer);

    this.$restartBtn = $restartBtn;
    this.$score = $score;
    this.$avgTime = $avgTime;

    // debug
    $header.innerText = 'Mission Complete!';
    $score.innerText = '당신의 점수는 0점입니다.';
    $avgTime.innerText = '단어당 평균 답변 시간은 4초입니다.';
    $restartBtn.innerText = '다시 시작';
  }
}
