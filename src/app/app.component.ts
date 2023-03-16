import { Component } from '@angular/core';

interface Card {
  id: number;
  index: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Variable Declaration
  
  // game board config variables
  rowCount: number = 3;
  colCount: number = 4;
  type: 'color' | 'icon' | 'image' = 'color';

  // game status variables
  clickable: boolean = true;
  gameStarted: boolean = false;
  cardOpen: number = 0;
  score: number = 0;
  time: number = 0;
  minute: number = 0;
  second: number = 0;

  interval!: ReturnType<typeof setInterval>; // stores interval reference
  
  // game data store variables
  array = this.getRandomArray(); // stores all cards
  opened: Card[] = []; // stores cards currently open (data visible)  
  colors = [
    '#C71585',
    '#E6E6FA',
    '#FF0000',
    '#FF4500',
    '#FFD700',
    '#ADFF2F',
    '#00FFFF',
    '#000080',
    '#F4A460',
    '#000000',
    '#696969',
    '#FF00FF',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
  ];

  // Function: Resets game to it's initial state.
  resetGame(): void {
    this.type = 'color';
    this.opened = [];
    this.time = 0;
    this.second = 0;
    this.minute = 0;
    this.score = 0;
    this.gameStarted = false;
    this.cardOpen = 0;
    this.changeGrid(3, 4);
    clearInterval(this.interval);
  }

  // Function: Returns array of length (rows * cols).
  // Return Type: Card[].
  getRandomArray(): Card[] {
    const count = (this.colCount * this.rowCount) / 2;

    // Pairs will contain (row*col)/2 unique numbers which will be considered as pairs.
    const pairs: number[] = [];
    while (pairs.length < count) {
      let generated = Math.round(Math.random() * 15) % 15;
      if (!pairs.includes(generated)) {
        pairs.push(generated);
      }
    }

    // data will contain the desired form of data, in which every member of 'pairs' will appear exactly 2 times.
    let data: Card[] = [];
    pairs.forEach((item) => {
      data = [
        ...data,
        { id: data.length, index: item },
        { id: data.length + 1, index: item },
      ];
    });

    // data will be sorted randomly before sending back.
    data.sort(() => {
      return Math.round(Math.random() * 10 - Math.random() * 10);
    });

    return data;
  }

  // Function: will change grid size configuration and will generate new random data according to that.
  changeGrid(row: number, col: number): void {
    (this.rowCount = row), (this.colCount = col);
    this.array = this.getRandomArray();
  }

  // Function: will choose game configuration randomly.
  randomizeGame(): void {
    const types = ['color', 'icon', 'image'].filter(
      (item) => item !== this.type
    );
    const sizes = ['2*3', '3*4', '4*5'].filter(
      (item) => item !== `${this.rowCount}*${this.colCount}`
    );

    let selectedType = types[Math.round(Math.random())];
    let selectedSize = sizes[Math.round(Math.random())];

    // @ts-ignore
    this.type = selectedType;
    this.changeGrid(
      Number(selectedSize.split('*')[0]),
      Number(selectedSize.split('*')[1])
    );
  }

  // Function: Performs all required logic on cards click.
  handleClick(target: Card): void {
    // To prevent multiple clicks on same target
    if (this.opened.includes(target)) {
      return;
    }

    // Starts timer & disables board config. controls when game starts.
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.interval = setInterval(() => {
        this.time += 1;
        let remaining = this.time;
        this.minute = Math.floor(remaining / 60);
        remaining -= this.minute * 60;
        this.second = remaining;
      }, 1000);
    }


    this.cardOpen += 1;
    this.opened.push(target);
    this.clickable = false;

    // checks & return from here if 1st of 2 card is opened 
    if (this.opened.length % 2 === 1) {
      setTimeout(() => {
        this.clickable = true;
      }, 400);
      return;
    }

    // if both opened cards are same, (+10 score for every right selection)
    if (
      this.opened[this.opened.length - 1].index ===
      this.opened[this.opened.length - 2].index
    ) {
      this.score += 10;
      // if array & opened are of same length: Game Over.
      if (this.opened.length === this.array.length) {
        clearInterval(this.interval);
      }
      setTimeout(() => {
        this.clickable = true;
      }, 400);
      return;
    }

    //  else remove both cards from opened array after 1 second
    setTimeout(() => {
      this.opened.pop();
      this.opened.pop();
      this.score -= 5; // (-5 score for every wrong selection)

      setTimeout(() => {
        this.clickable = true;
      }, 400);
      return;
    }, 1000);
  }
}
