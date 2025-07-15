import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-snake-game',
  imports: [RouterModule],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss'
})
export class SnakeGameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('playBoard', { static: false }) playBoard!: ElementRef;

  gameOver = false;
  foodX = 0;
  foodY = 0;
  snakeX = 5;
  snakeY = 10;
  snakeBody: number[][] = [];
  velocityX = 0;
  velocityY = 0;
  gameInterval: any;
  score = 0;
  highScore = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.highScore = parseInt(localStorage.getItem('openhd-snake-high-score') || '0');
      this.changeFoodPosition();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Starte das Spiel nach der View-Initialisierung
      setTimeout(() => {
        this.startGame();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    this.changeDirection(event);
  }

  startGame() {
    this.ngZone.runOutsideAngular(() => {
      this.gameInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.initGame();
        });
      }, 125);
    });
  }

  changeFoodPosition() {
    this.foodX = Math.floor(Math.random() * 30) + 1;
    this.foodY = Math.floor(Math.random() * 30) + 1;
  }

  handleGameOver() {
    clearInterval(this.gameInterval);
    this.gameOver = true;
  }

  restartGame() {
    this.gameOver = false;
    this.score = 0;
    this.snakeX = 5;
    this.snakeY = 10;
    this.snakeBody = [];
    this.velocityX = 0;
    this.velocityY = 0;
    this.changeFoodPosition();
    this.startGame();
  }

  changeDirection(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    } else if (event.key === 'ArrowDown' && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    } else if (event.key === 'ArrowLeft' && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    } else if (event.key === 'ArrowRight' && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    }
  }

  onControlClick(direction: string) {
    const event = { key: direction } as KeyboardEvent;
    this.changeDirection(event);
  }

  initGame() {
    if (this.gameOver) return this.handleGameOver();
    
    if (!this.playBoard?.nativeElement) {
      console.error('PlayBoard element not found');
      return;
    }

    let htmlMarkup = `<div class="food" style="grid-area: ${this.foodY} / ${this.foodX}"></div>`;

    // Check if snake hit food
    if (this.snakeX === this.foodX && this.snakeY === this.foodY) {
      this.changeFoodPosition();
      this.snakeBody.push([this.foodX, this.foodY]);
      
      this.score++;
      this.highScore = this.score >= this.highScore ? this.score : this.highScore;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('openhd-snake-high-score', this.highScore.toString());
      }
    }

    // Update snake body
    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      this.snakeBody[i] = this.snakeBody[i - 1];
    }

    this.snakeBody[0] = [this.snakeX, this.snakeY];

    // Update snake head position
    this.snakeX += this.velocityX;
    this.snakeY += this.velocityY;

    // Check wall collision
    if (this.snakeX <= 0 || this.snakeX > 30 || this.snakeY <= 0 || this.snakeY > 30) {
      this.gameOver = true;
    }

    // Draw snake body and check self collision
    for (let i = 0; i < this.snakeBody.length; i++) {
      htmlMarkup += `<div class="head" style="grid-area: ${this.snakeBody[i][1]} / ${this.snakeBody[i][0]}"></div>`;
      if (i !== 0 && this.snakeBody[0][1] === this.snakeBody[i][1] && this.snakeBody[0][0] === this.snakeBody[i][0]) {
        this.gameOver = true;
      }
    }

    this.playBoard.nativeElement.innerHTML = htmlMarkup;
  }
}