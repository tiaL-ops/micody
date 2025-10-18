Contributing to the micody wall

First off, appreciate your time for coming here! Such a good way to learn together. 

By participating, you agree to abide by our project's code of conduct.

How to Add Your Profile to the mighty wall!

To add your profile, you'll need to follow these simple steps. It might look like a lot, but it's a standard process for contributing to open-source projects, and it's a great skill to learn!

1. Fork the Repository

Click the "Fork" button at the top-right corner of this page. This will create a copy of this project in your own GitHub account.

2. Clone Your Fork

Now, go to your forked repository on GitHub. Click the green "Code" button and copy the URL.

Open your terminal or command prompt and run the following git command:

git clone "url-you-just-copied"


This will download the project to your local computer.

3. Create a New Branch

Navigate into the project directory on your computer:

cd wall-of-coders


Now, create a new branch to work on. It's good practice to name your branch something descriptive, like add-your-name.

git checkout -b add-your-name


4. Add Your Profile

This is the fun part!

Open the index.html file in your favorite code editor.

Scroll down to the bottom until you find the <script> section.

Locate the contributors array. It will look like this:

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
       


Add your own profile object to the array. Copy the template below and replace the values with your information. Make sure to add a comma , after the object before yours!

Your profile object template:

{
    name: "Your Name",
    passion: "Something you are passionate about in life!"
}


Example:

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
            name: "Rakoto"
            passion: "Eat Ravitoto"
            
            // ^-- ADD YOUR PROFILE OBJECT ABOVE THIS LINE --^
        ];
       


Note: Your pixel-art avatar is generated automatically from your name, so you don't need to add an image URL!

Save the index.html file.

5. Commit and Push Your Changes

Now, you need to save your changes to your forked repository on GitHub.

# Stage your changes
git add index.html

# Commit your changes with a message
git commit -m "feat: Add [Your Name] to micody wall"

# Push your changes to your fork on GitHub
git push origin add-your-name


6. Open a Pull Request

Go back to your forked repository on GitHub. You should see a new button that says "Compare & pull request". Click it!

This will take you to a new page where you can add a title and a description for your pull request. Once you're done, click "Create pull request".

That's it! You've successfully made your first open-source contribution. We will review your pull request shortly and merge it. Thank you for being part of our community!