GameOfLife
=============
The **Game of Life** - cellular automaton devised by the British mathematician John Horton Conway in 1970.

More information: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

Description
-------------------
JavaScript zero-player game. Evolution of cells is determined by their initial state, requiring no further input.The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, or "populated" or "unpopulated". Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

1. Any live cell with **fewer than two live neighbours dies**, as if caused by ***underpopulation***.
2. Any live cell with **two or three live neighbours lives** on to the ***next generation***.
3. Any live cell with **more than three live neighbours dies**, as if by ***overpopulation***.
4. Any dead cell with **exactly three live neighbours becomes a live cell**, as if by ***reproduction***.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations.

Usage
-------------------
**Play** - Start Game of Life
**Pause** - Pause current game
**Reset/Apply changes** - Reset table/ Apply settings set via Options menu
**Options** - game options
  1. **Board Settings** - Allows you to change the height and width of the board(min 100/max 800), the size of the cell(min 5/max 50) and the speed of the animation. Providing invalid values ​​will cause fallback to the default settings.
  2. **Cells color** - Allows you to change the color of the cells by defining RGB values ​​(red, green, blue / from 0 to 255) or set random colors for each next generation of cells.
  3. **Starting patterns** - Allows you to select a predefined starting pattern.
