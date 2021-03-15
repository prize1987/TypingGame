import GameView from './components/GameView.js';
import ScoreView from './components/ScoreView.js';

export default class App {
  constructor(el) {
    this.el = el;

    this.$gameContainer = document.createElement('div');
    this.$gameContainer.className = 'game-container';

    this.$scoreContainer = document.createElement('div');
    this.$scoreContainer.className = 'score-container';

    this.el.appendChild(this.$gameContainer);
    this.el.appendChild(this.$scoreContainer);

    this.gameView = new GameView(this.$gameContainer);
    this.scoreView = new ScoreView(this.$scoreContainer);

    window.history.pushState({ page: 'game' }, 'In game', 'game');
    this.$gameContainer.hidden = false;
    this.$scoreContainer.hidden = true;

    this.scoreView.bindHandleClick(() => {
      this.routeGameView();
    });

    this.gameView.bindHandleClick((clearTime) => {
      this.routeScoreView(clearTime);
    });
  }

  routeGameView() {
    window.history.replaceState({ page: 'game' }, 'In game', 'game');
    this.$gameContainer.hidden = false;
    this.$scoreContainer.hidden = true;
  }

  routeScoreView(clearTime) {
    window.history.replaceState({ page: 'score' }, 'score board', 'score');
    this.$gameContainer.hidden = true;
    this.$scoreContainer.hidden = false;

    this.scoreView.renderScore(clearTime);
  }
}
