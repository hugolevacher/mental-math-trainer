# Mental Math Trainer

A distraction-free multiplication trainer, built to drill the mental arithmetic asked in quant trading interviews.

**Live:** https://hugolevacher.github.io/mental-math-trainer/

## Modes

### Tables 1–12 (timed)

- Random questions from the 1–12 times tables, one after another, until you stop.
- Each question gets 1 second by default; a slider on the start screen sets it from 1 to 5 seconds in 0.1 s steps. Type the answer: it moves on as soon as the right number is in, no Enter needed.
- Run out of time and the question goes, with its answer, into the **Missed** panel on the right.
- A fact is listed once: 7 × 8 and 8 × 7 count as the same. **Clear** empties the panel.

### 1–99 (no time limit)

- Random products with both factors from 1 to 99. Type the answer and press Enter.
- After each answer you see the correct product (green if right, red if wrong) and how long you took.
- The stats panel tracks answered, accuracy, average time, current streak and best streak. **Reset** clears them.

The missed list and the stats are saved in your browser (localStorage).

## Keyboard

| Key   | Action                    |
|-------|---------------------------|
| Enter | Start the tables drill / submit an answer |
| Esc   | Stop the tables drill     |

## Run locally

```sh
npm install
npm run dev    # http://localhost:5173
npm test       # logic tests
npm run build  # production build in dist/
```

Built with React and Vite. Every push to `main` deploys to GitHub Pages through GitHub Actions.
