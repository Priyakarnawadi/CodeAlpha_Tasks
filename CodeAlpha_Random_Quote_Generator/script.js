console.log("JavaScript Loaded!");
const quotes = [
    {
        quote: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        quote: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    },
    {
        quote: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        quote: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery"
    },
    {
    quote: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer"
},
{
    quote: "Believe in yourself and all that you are.",
    author: "Christian D. Larson"
},
{
    quote: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
},
{
    quote: "Don't stop until you're proud.",
    author: "Unknown"
},
{
    quote: "Every day is a new beginning.",
    author: "Unknown"
},
{
    quote: "Opportunities don't happen. You create them.",
    author: "Chris Grosser"
},
{
    quote: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau"
},
{
    quote: "Never give up because great things take time.",
    author: "Unknown"
},
{
    quote: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki"
},
{
    quote: "Small progress is still progress.",
    author: "Unknown"
},
{
    quote: "Work hard in silence, let success make the noise.",
    author: "Frank Ocean"
},
{
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt"
},
{
    quote: "Stay focused and never give up.",
    author: "Unknown"
},
{
    quote: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb"
},
{
    quote: "Great things never come from comfort zones.",
    author: "Unknown"
}
];

function generateQuote() {

    let randomIndex = Math.floor(Math.random() * quotes.length);

    document.getElementById("quote").innerHTML =
        quotes[randomIndex].quote;

    document.getElementById("author").innerHTML =
        "- " + quotes[randomIndex].author;
}
function copyQuote() {
    const quote = document.getElementById("quote").innerText;
    const author = document.getElementById("author").innerText;

    navigator.clipboard.writeText(quote + " " + author);

    alert("Quote copied successfully!");
}

function shareQuote() {
    const quote = document.getElementById("quote").innerText;
    const author = document.getElementById("author").innerText;

    if (navigator.share) {
        navigator.share({
            title: "Random Quote",
            text: quote + " " + author
        });
    } else {
        alert("Sharing is not supported in this browser.");
    }
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Show a random quote when the page loads
generateQuote();