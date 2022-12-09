import * as _ from "lodash";

export interface Generator<T> {
  next: () => T;
}

export class CyclicGenerator implements Generator<string> {
  private sequence: string;

  constructor(sequence: string = "ABC") {
    this.sequence = sequence;
  }

  next(): string {
    const rand = Math.floor(Math.random() * this.sequence.length);
    return this.sequence.charAt(rand);
  }
}

export class Position {
  private row: number;
  private col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  getRow(): number {
    return this.row;
  }
  getCol(): number {
    return this.col;
  }
  setRow(row: number) {
    if (row) this.row = row;
  }
  setCol(col: number) {
    if (col) this.col = col;
  }
  equals(pos: Position): boolean {
    return this.col === pos.getCol() && this.row === pos.getRow();
  }
}

export class Match<String> {
  private matched: string;
  private positions: Position[] | undefined;

  constructor(matched: string, positions: Position[] | undefined) {
    this.matched = matched;
    this.positions = positions;
  }

  getMatched(): string {
    return this.matched;
  }
  getPositions(): Position[] | undefined {
    return this.positions;
  }
  setMatched(matched: string) {
    if (matched) this.matched = matched;
  }
  setPositions(positions: Position[]) {
    if (positions) this.positions = positions;
  }
  addPosition(position: Position) {
    if (position) this.positions?.push(position);
  }
}

export class BoardEvent<String> {
  private kind: string;
  private match: Match<string> | undefined;

  constructor(kind: string, match: Match<string> | undefined) {
    this.kind = kind;
    this.match = match;
  }

  getKind(): string {
    return this.kind;
  }
  getMatch(): Match<string> | undefined {
    return this.match;
  }
  setKind(kind: string) {
    if (kind) this.kind = kind;
  }
  setMatch(match: Match<string>) {
    if (match) this.match = match;
  }
}

export function BoardListener<String>(event: BoardEvent<string>): void {
  if (event.getKind() === "Match") {
    let str =
      "kind: " +
      event.getKind() +
      "\n" +
      "match: " +
      event.getMatch()?.getMatched() +
      "\n";
    if (
      event.getMatch() != undefined &&
      event.getMatch()?.getPositions() != undefined
    ) {
      str +=
        "positions: " +
        event
          .getMatch()!
          .getPositions()!
          .map((pos) => pos.getRow() + ":" + pos.getCol() + " ") +
        "\n";
    }

    console.log(str);
  } else if (event.getKind() === "Refill") {
    console.log("kind: " + event.getKind() + "\n");
  }
}

export class Board<String> {
  private tiles: Array<Array<string | undefined>>;
  private width: number;
  private height: number;
  private generator: Generator<string>;
  private listeners: Array<any>;

  // properties for storing matches
  private matchAfterMove: Match<string>[];
  private matchAfterRefill: Match<string>[];

  constructor(
    generator: Generator<string>,
    width: number = 3,
    height: number = 3
  ) {
    this.width = width;
    this.height = height;
    this.generator = generator;
    this.listeners = new Array();
    this.matchAfterMove = new Array<Match<string>>();
    this.matchAfterRefill = new Array<Match<string>>();

    // create empty array of length "height"
    this.tiles = new Array(this.height);

    // insert into each index new array of length "width"
    for (let i: number = 0; i < this.tiles.length; i++)
      this.tiles[i] = new Array(this.width);

    for (let i: number = 0; i < this.tiles.length; i++) {
      for (let j: number = 0; j < this.tiles[i].length; j++) {
        this.tiles[i][j] = this.generator.next();
      }
    }
  }

  //getTiles():
  getTiles(): Array<Array<string | undefined>> {
    return this.tiles;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  addListener(listener: any) {
    if (listener != undefined) {
      this.listeners.push(listener);
    }
  }

  private fire(event: BoardEvent<string>) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }

  private notify(kind: string): Array<Position> | any {
    if (kind === "Match") {
      //arr to store all matches regarding the move
      let matches = new Array<Position>();

      // notify listeners of the board
      if (this.matchAfterMove.length > 0) {
        this.matchAfterMove.forEach((element) => {
          this.fire(new BoardEvent("Match", element));
          if (element.getPositions() != undefined) {
            matches.push(...element.getPositions()!);
          }
        });
      }

      return matches;
    } else if (kind === "Refill") {
      this.fire(new BoardEvent("Refill", undefined));
    } else if (kind === "Match->Refill") {
      //arr to store all matches regarding the move
      let matches = new Array<Position>();

      if (this.matchAfterRefill.length > 0) {
        this.matchAfterRefill.forEach((element) => {
          this.fire(new BoardEvent("Match", element));
          if (element.getPositions() != undefined) {
            matches.push(...element.getPositions()!);
          }
        });
      }

      return matches;
    }
  }

  piece(p: Position): string | undefined {
    // if row value of the p is invalid => undefined
    if (p.getRow() < 0 || p.getRow() > this.tiles.length - 1) return undefined;

    // if col value of the p is invalid => undefined
    if (p.getCol() < 0 || p.getCol() > this.tiles[p.getRow()].length - 1)
      return undefined;

    // otherwise return
    return this.tiles[p.getRow()][p.getCol()];
  }

  canMove(first: Position, second: Position): boolean {
    //moves on different rows and columns are invalid
    if (first.getRow() != second.getRow() && first.getCol() != second.getCol())
      return false;

    //build tile1 with updated position
    const tile1 = {
      piece: this.piece(first),
      position: second,
    };

    //build tile2 with updated position
    const tile2 = {
      piece: this.piece(second),
      position: first,
    };

    // check if positions are valid
    if (tile1.piece === undefined || tile2.piece === undefined) return false;

    // swap tiles
    const swappedTiles = this.swapTwoTiles(
      first,
      second,
      this.copyTwoDimensionalArray(this.tiles)
    );

    //tile checkup
    //update poperty for matches
    this.matchAfterMove = new Array();

    //loop twice(for each tile)
    for (let index: number = 0; index < 2; index++) {
      //make value of service match default
      let match: Match<string> = new Match("", undefined);
      let currentTile: { piece: string | undefined; position: Position } = {
        piece: "",
        position: new Position(-5, -5),
      };

      if (index == 0) {
        match = new Match(tile1.piece, []);
        currentTile = tile1;
      } else if (index == 1) {
        match = new Match(tile2.piece, []);
        currentTile = tile2;
      }

      //horizontal checkup--------------------------------------
      for (let i: number = 0; i < swappedTiles[0].length; i++) {
        if (
          swappedTiles[currentTile.position.getRow()][i] === currentTile.piece
        ) {
          const p = new Position(currentTile.position.getRow(), i);

          // push position of matched tile
          match.addPosition(p);
        } else match.setPositions([]);

        // check if there are 3 matches(positions)
        if (match.getPositions()?.length === 3) {
          // make sure to include 1 match only once
          if (
            this.matchAfterMove.filter(
              (m) =>
                m.getMatched() === match.getMatched() &&
                _.isEqual(m.getPositions(), match.getPositions())
            ).length == 0
          ) {
            this.matchAfterMove.push(
              new Match(match.getMatched(), match.getPositions())
            );
            break;
          }
        }
      }
      //horizontal checkup--------------------------------------

      //make value of service match default
      match.setPositions([]);

      //vertical chekup-----------------------------------------
      for (let i: number = 0; i < swappedTiles.length; i++) {
        if (
          swappedTiles[i][currentTile.position.getCol()] === currentTile.piece
        ) {
          const p = new Position(i, currentTile.position.getCol());

          // push position of matched tile
          match.addPosition(p);
        } else match.setPositions([]);

        // check if there are 3 matches(positions)
        if (match.getPositions()?.length === 3) {
          // make sure to include 1 match only once
          if (
            this.matchAfterMove.filter(
              (m) =>
                m.getMatched() === match.getMatched() &&
                _.isEqual(m.getPositions(), match.getPositions())
            ).length == 0
          ) {
            this.matchAfterMove.push(
              new Match(match.getMatched(), match.getPositions())
            );
            break;
          }
        }
      }
      //vertical chekup-----------------------------------------
    }

    return this.matchAfterMove.length > 0;
  }

  canMoveAfterRefill(pieces: Array<string>, tiles: Array<Position>): boolean {
    //upd global state
    this.matchAfterRefill = new Array();

    //construct necessery _tiles obj
    let _tiles = [];
    for (let i: number = 0; i < tiles.length; i++) {
      _tiles.push({
        piece: pieces[i],
        position: tiles[i],
      });
    }

    //tile checkup
    _tiles.forEach((element) => {
      //make value of service match default
      let match: Match<string> = new Match(element.piece, []);

      //horizontal checkup--------------------------------------
      for (let i: number = 0; i < this.tiles[0].length; i++) {
        // tile1 horizontal checkup
        if (this.tiles[element.position.getRow()][i] === element.piece) {
          const p = new Position(element.position.getRow(), i);

          // push position of matched tile
          match.addPosition(p);
        } else match.setPositions([]);

        // check if there are 3 matches(positions)
        if (match.getPositions()?.length === 3) {
          // make sure to include 1 match only once
          if (
            this.matchAfterRefill.filter(
              (m) =>
                m.getMatched() === match.getMatched() &&
                _.isEqual(m.getPositions(), match.getPositions())
            ).length == 0
          ) {
            this.matchAfterRefill.push(
              new Match(match.getMatched(), match.getPositions())
            );
          }

          break;
        }
      }
      //horizontal checkup--------------------------------------

      //make value of service match default
      match = new Match(element.piece, []);

      //vertical chekup-----------------------------------------
      for (let i: number = 0; i < this.tiles.length; i++) {
        // tile1 vertical checkup
        if (this.tiles[i][element.position.getCol()] === element.piece) {
          const p = new Position(i, element.position.getCol());

          // push position of matched tile
          match.addPosition(p);
        } else match.setPositions([]);

        // check if there are 3 matches(positions)
        if (match.getPositions()?.length === 3) {
          // make sure to include 1 match only once
          if (
            this.matchAfterRefill.filter(
              (m) =>
                m.getMatched() === match.getMatched() &&
                _.isEqual(m.getPositions(), match.getPositions())
            ).length == 0
          ) {
            this.matchAfterRefill.push(
              new Match(match.getMatched(), match.getPositions())
            );
          }

          break;
        }
      }
      //vertical chekup-----------------------------------------
    });

    return this.matchAfterRefill.length > 0;
  }

  move(first: Position, second: Position) {
    if (this.canMove(first, second)) {
      //swap tiles on the board
      this.swapTwoTiles(first, second, this.tiles);

      //notify observers of occurring "Match" events
      let positions = this.notify("Match");

      //replace tiles
      let __tiles = this.replaceTiles(positions);

      //notify observers of occurring "Refill" event
      this.notify("Refill");

      //!!!!
      //check "cascading" effect of refill
      while (this.canMoveAfterRefill(__tiles.pieces, __tiles.pos)) {
        //notify observers of occurring "Match" events
        positions = this.notify("Match->Refill");

        //replace tiles
        __tiles = this.replaceTiles(positions);

        //notify observers of occurring "Refill" event
        this.notify("Refill");
      }
    }
  }

  private copyTwoDimensionalArray(
    arr: Array<Array<string | undefined>>
  ): Array<Array<string | undefined>> {
    const newArr = arr.map((val) => [...val]);
    return newArr;
  }

  private swapTwoTiles(
    first: Position,
    second: Position,
    _tiles: Array<Array<string | undefined>>
  ): Array<Array<string | undefined>> {
    // store tile1 value
    const tile1 = _tiles[first.getRow()][first.getCol()];

    // assign tile1 tile2's value
    _tiles[first.getRow()][first.getCol()] =
      _tiles[second.getRow()][second.getCol()];

    //assign tile2 old value of tile1
    _tiles[second.getRow()][second.getCol()] = tile1;

    return _tiles;
  }

  private replaceTiles(positions: Position[]): any {
    //mark matched tiles "undefined"
    positions.forEach((position) => {
      this.tiles[position.getRow()][position.getCol()] = undefined;
    });

    //console.log('matched tiles:\n' + this.toString())

    //shift tiles
    for (let i: number = 0; i < this.tiles.length; i++) {
      for (let j: number = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] === undefined) {
          this.shiftTilesRecurcisvely(this.tiles, i, j);
        }
      }
    }

    //console.log('shifted tiles:\n' + this.toString())

    //replace tiles with newly generated values
    //store pieces and positions of newly "refilled tiles"
    let pieces: Array<string | undefined> = [];
    let pos: Position[] = [];

    for (let i: number = 0; i < this.tiles.length; i++) {
      for (let j: number = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] === undefined) {
          this.tiles[i][j] = this.generator.next();

          //store piece and position of newly "refilled tile"
          pieces.push(this.piece(new Position(i, j)));
          pos.push(new Position(i, j));
        }
      }
    }

    return {
      pieces: pieces,
      pos: pos,
    };
  }

  private shiftTilesRecurcisvely(
    arr: Array<Array<string | undefined>>,
    row: number,
    col: number
  ) {
    if (row > 0) {
      arr[row][col] = arr[row - 1][col];
      this.shiftTilesRecurcisvely(arr, row - 1, col);
    } else if (row === 0) {
      arr[row][col] = undefined;
    }
  }

  copy(): Board<String> {
    return new Board(this.generator, this.width, this.height);
  }

  toString(): string {
    let str = "";

    for (let i: number = 0; i < this.height; i++) {
      for (let j: number = 0; j < this.width; j++) {
        str += this.piece(new Position(i, j)) + " ";
      }
      str += "\n";
    }

    return str;
  }
}
