export function numberToWords(num: number): string {
    if (num === 0) return "Zero";

    const belowTwenty = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
        "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty",
        "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const thousands = ["", "Thousand", "Million", "Billion"];

    function helper(n: number): string {
        if (n === 0) return "";
        if (n < 20) return belowTwenty[n] + " ";
        if (n < 100)
            return tens[Math.floor(n / 10)] + " " + helper(n % 10);
        return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    }

    let word = "";
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            word = helper(num % 1000) + thousands[i] + " " + word;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return word.trim();
}


export function animatedNumber(
  end: number,
  duration: number,
  callback: (value: number) => void
) {
  let startTime: number | null = null;

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp;

    const progress = timestamp - startTime;
    const percent = Math.min(progress / duration, 1);

    const value = Math.floor(percent * end);
    callback(value);

    if (percent < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}