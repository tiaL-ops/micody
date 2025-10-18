
# Contributing to the Micody Wall

First off, **thank you for your time!** This is such a great way to learn together.
By participating, you agree to abide by our project’s **Code of Conduct**.

---

## How to Add Your Profile to the Mighty Wall

Follow these simple steps to add yourself to the wall.
It might look like a lot, but it’s a standard process for contributing to open-source projects — and a valuable skill to learn!

---

### 1. Fork the Repository

Click the **“Fork”** button at the top-right corner of this page.
This will create a copy of this project in your own GitHub account.

---

### 2. Clone Your Fork

Go to your forked repository on GitHub, click the green **“Code”** button, and copy the URL.

Then, open your terminal or command prompt and run:

```bash
git clone "url-you-just-copied"
```

This will download the project to your local computer.

---

### 3. Create a New Branch

Navigate into the project directory:

```bash
cd week01
```

Now, create a new branch for your changes.
It’s good practice to name your branch something descriptive, like `add-your-name`:

```bash
git checkout -b add-your-name
```

---

### 4. Add Your Profile

This is the fun part!

1. Open the **`index.html`** file in your favorite code editor.
2. Scroll down to the `<script>` section.
3. Locate the **`contributors`** array — it looks like this:

```js
const contributors = [
  {
    name: "Landy Tia",
    passion: "I love ramen and dumplings"
  },
  {
    name: "Someone else",
    passion: "Liking some nice stuff"
  },
  // V-- ADD YOUR PROFILE OBJECT BELOW THIS LINE --V
  
  
  // ^-- ADD YOUR PROFILE OBJECT ABOVE THIS LINE --^
];
```

Now, add your own profile object below the comment.
Use this template (and don’t forget the comma **`,`** before your entry!):

```js
{
  name: "Your Name",
  passion: "Something you are passionate about in life!"
}
```

**Example:**

```js
const contributors = [
  {
    name: "Landy Tia",
    passion: "I love ramen and dumplings"
  },
  {
    name: "Someone else",
    passion: "Liking some nice stuff"
  },
  // V-- ADD YOUR PROFILE OBJECT BELOW THIS LINE --V
  {
    name: "Rakoto",
    passion: "Eat Ravitoto"
  }
  // ^-- ADD YOUR PROFILE OBJECT ABOVE THIS LINE --^
];
```

> 💡 Note: Your pixel-art avatar is generated automatically from your name — no need to add an image!

Save the `index.html` file.

---

### 5. Commit and Push Your Changes

Save your changes to your forked repository:

```bash
# Stage your changes
git add index.html

# Commit your changes
git commit -m "feat: Add [Your Name] to micody wall"

# Push your changes
git push origin add-your-name
```

---

### 6. Open a Pull Request

Go back to your forked repository on GitHub.
You should see a **“Compare & pull request”** button — click it!

Add a title and a short description, then click **“Create pull request”**.

---

🎉 **That’s it!**
You’ve successfully made your first open-source contribution.
We’ll review your pull request soon and merge it.

Thank you for being part of our community ❤️


