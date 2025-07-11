const toggle = document.getElementById('toggleDark');
const body = document.body;

toggle.addEventListener('click', () => {
  const isDark = toggle.classList.toggle('bi-brightness-high-fill');
  toggle.classList.toggle('bi-moon', !isDark);
  body.style.background = isDark ? '#23272A' : '#DCDDDE';
  body.style.color = isDark ? '#DCDDDE' : '#23272A';
  body.style.transition = 'background 2s, color 2s';

  // Chahnge the footer-link text color
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.style.color = isDark ? '#DCDDDE' : '#23272A';
    link.style.transition = 'color 2s';
  });
});

const selector = document.getElementById('codeSelector');
const examples = document.querySelectorAll('.code-example');

selector.addEventListener('change', function () {
  examples.forEach(el => el.style.display = 'none');
  const selected = document.getElementById(this.value);
  if (selected) selected.style.display = 'block';
});

const codeSamples = {
  "Hello-There": `const main := fn () int! {
  have person: [5]str = ["Software Dev", "Compiler Dev", 
                    "Low-Level Dev", "C Dev", "Rust Dev"];

  loop (i = 0; i < 5) : (i++) {
    @outputln(1, "Hello there, ", person[i], "!");
  }

  return 0;
};`,

  "Variables-and-Types": `const main := fn () int! {
  # signed integer,    9,223,372,036,854,775,807 (64-bit)
  have x: int? = 42;
  # unsigned integer, 18,446,744,073,709,551,615 (64-bit)
  have y: int! = 100; 
  have z: float = 3.14;

  have message: *char = "Hello, Zura!";
  have message2: str = "Hello, Zura!";
  have c: char = @cast<char>(65); # 'A'

  have isTrue: bool = true;
  have isFalse: bool = false;

  have arr: [3]int! = [1, 2, 3];               
  have arr2: [3]str = ["one", "two", "three"];
  return 0;
};`,

  "Functions": `const fib := fn (n: int) int! {
    if (n <= 1) return n;

  have a: int! = 0;
  have b: int! = 1;

  loop (i = 2; i <= n) : (i++) {
    have temp: int! = b;
    b = a + b;
    a = temp;
  }
  return b;
};

const main := fn () int! {
  @outputln(1, "Fibonacci of 5 is: ", fib(5));
  return 0;
};`,

  "Structs-Enums": ``,

  "Memory-Management": ``,

  "Arrays": `have nums: [5]int = [1, 2, 3, 4, 5];`
};

document.getElementById("codeSelector").addEventListener("change", (e) => {
  const selected = e.target.value;
  const codeElement = document.getElementById("codeOutput");
  codeElement.textContent = codeSamples[selected] || "";
  Prism.highlightElement(codeElement); // re-highlight
});

// Set default on load
window.addEventListener("DOMContentLoaded", () => {
  const codeSelector = document.getElementById("codeSelector");
  codeSelector.dispatchEvent(new Event("change"));
});

