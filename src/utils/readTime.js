function calculateReadTime(text, wpm = 225) {
  try {
    const words = text.trim().split(/\s+/).length;
    // dividing the number of words by the words-per-minute
    const time = Math.ceil(words / wpm);
    return time;
  } catch {
    console.error('Error calculating reading time:', error);
    return 0;
  }
}

module.exports = { calculateReadTime };
