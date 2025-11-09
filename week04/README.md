
### Last week !

So this week, we’re building **Imposter** — based on the  TikTok “imposter” trend… but for people who don’t have friends 😅 (lol yeah i mlonely lol).

Honestly, this week’s been kinda rough, so I didn’t get to brainstorm too much. Also, this is the **last week** of our little experiment for a "public repo" , so  lowkey feel free to add *anything* you want to make it better.

If you make changes or add stuff, just drop it below like this:
**Name – Feature:** (what you added)

---

### The idea 

Basically, this platform/game will have **3 +  players** —

* **1 human (you)**
* **ANy other AI players** (local or custom, not API-based like OpenAI or Gemini)

The AI will run on a local predictor model.

---

### How the game works 

* Everyone gets a **random word**.
* 3 out of 4 players know the word, but **one is the imposter**.(so 1 out of N Players)
* The goal: **figure out who the imposter is.**

Each round, everyone says **one word related** to the given word.
You can’t repeat words.
After 4 rounds, you all try to guess who is the one ( imposter)

---

### Bot behavior

* **Imposter:** Just tries to throw others under the bus and act innocent.
* **Non-imposters:** Try to spot the imposter by looking at everyone’s words — they’ll analyze how “related” each word is and flag the one that seems off (lowest probability).

---

### Word data example 

```json
{
  "cake": ["sweet", "dessert", "chocolate", "birthday"],
  "computer science": ["smell", "smart", "google", "meta", "jobless"],
  "suitcase": ["travel", "flight", "TSA", "23kg"]
}
```

---

That’s mostly it 
Feel free to tweak, add your own features, or make the logic smarter 

Oh main.py is when I was brainstorming how to built it, and lowkey through it into claude to finish it  cuz ... yeah 