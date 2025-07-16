const toggle = document.getElementById('toggleDark');
const body = document.body;

// Restore dark mode from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  if (isDark) {
    body.style.background = '#23272A';
    body.style.color = '#DCDDDE';
    toggle.classList.remove('bi-moon');
    toggle.classList.add('bi-brightness-high-fill');
  } else {
    body.style.background = '#DCDDDE';
    body.style.color = '#23272A';
    toggle.classList.remove('bi-brightness-high-fill');
    toggle.classList.add('bi-moon');
  }

  // Apply footer-link color
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.style.color = isDark ? '#DCDDDE' : '#23272A';
    link.style.transition = 'color 2s';
  });

  // Trigger initial code sample load
  const codeSelector = document.getElementById("codeSelector");
  codeSelector.dispatchEvent(new Event("change"));

  // Code block animation
  const codeBlock = document.querySelector('.code_block');
  codeBlock.style.transition = 'background 2s, color 2s';
});

// Toggle dark mode with click
toggle.addEventListener('click', () => {
  const isCurrentlyMoon = toggle.classList.contains('bi-moon');
  const isDark = isCurrentlyMoon; // we are switching TO dark if it currently shows moon

  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  body.style.background = isDark ? '#23272A' : '#DCDDDE';
  body.style.color = isDark ? '#DCDDDE' : '#23272A';
  body.style.transition = 'background 2s, color 2s';

  toggle.classList.toggle('bi-moon', !isDark);
  toggle.classList.toggle('bi-brightness-high-fill', isDark);

  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.style.color = isDark ? '#DCDDDE' : '#23272A';
    link.style.transition = 'color 2s';
  });
});

// ====== HAMBURGER MENU TOGGLE ======
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  hamburger.innerHTML = navLinks.classList.contains("active")
    ? '<i class="bi bi-x"></i>'
    : '<i class="bi bi-list"></i>';
});

// ====== CODE SELECTOR TOGGLE DISPLAY ======
const selector = document.getElementById('codeSelector');
const examples = document.querySelectorAll('.code-example');

selector.addEventListener('change', function () {
  examples.forEach(el => el.style.display = 'none');
  const selected = document.getElementById(this.value);
  if (selected) selected.style.display = 'block';
});

// ====== CODE SAMPLE DATA AND PRISM HIGHLIGHTING ======
const codeSamples = {
  "Hello-There": `const main := fn () int! {
  have person: [7]str = ["Software Dev", "Compiler Dev", 
                        "Low-Level Dev", "C Dev", 
                        "Rust Dev", "Zig Dev", "Zura Dev"];

  loop (i = 0; i < 7) : (i++) {
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

  "Functions": `const fib := fn (n: int!) int! {
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

const fib_tail := fn (n: int!, a: int!, b: int!) int! {
  if (n == 0) return a;
  if (n == 1) return b;
  return fib_tail(n - 1, b, a + b);
};

const main := fn () int! {
  @outputln(1, "Fib(92) = ", fib(92));
  @outputln(1, "Fib(92)(tail rec) = ", fib_tail(92, 0, 1));
  return 0;
};`,

  "Control-Flow": `const main := fn () int! {
  # For loop with optional condition
  loop (i = 0; i < 10) : (i++) {
    if (i == 5) { @outputln(1, "Reached halfway point at i = ", i); }
    else @outputln(1, "Current value of i: ", i);
  }

  # While loop with optional condition
  have i: int! = 0;
  loop (i < 5) : (i++) {
    if (i == 3) { @outputln(1, "SPECIAL CASE: i is 3"); }
    else @outputln(1, "Current value of i: ", i);
  }

  # While loop
  have j: int! = 0;
  loop (j < 5) {
    if (j == 2) { @outputln(1, "Skipping j = 2"); j++; }
    @outputln(1, "Current value of j: ", j);
    j++;
  }
  return 0;
};`,

  "Structs": `const Person := struct {
  name: str,
  age: int!,

  greet := fn (self: *Person) void {
    @outputln(1, "Hello, my name is ", self.name, 
                 " and I am ", self.age, " years old.");
  };
};

const main := fn () int! {
  have person: Person = {
    name: "Zura",
    age: 1
  };

  person.greet();
  return 0;
};`,

  "Enums": `const Day := enum {
  Monday,     # 0
  Tuesday,    # 1
  Wednesday,  # 2
  Thursday,   # 3
  Friday,     # 4
  Saturday,   # 5
  Sunday,     # 6
};

const isWeekend := fn (d: int!) bool {
  match (d) {
    case 4 ->  { return true; } # Friday
    case 5 ->  { return true; } # Saturday
    case 6 ->  { return true; } # Sunday
    default -> { return false; }
  }

  return false; # Default case, should not be reached
};

const main := fn () int! {
  have today: Day = Day.Friday; 

  if (isWeekend(@cast<int!>(today))) {
    @outputln(1, "It's the weekend!");
  } else {
    @outputln(1, "It's a weekday.");
  }

  return 0;
};`,

  "Memory-Management": `const readFile := fn (path: *char, size: int!) *char {
  have bytes: *char = @cast<*char>(@alloc(size));
  if (bytes == nil) {
    @outputln(1, 
              "Memory alloc failed for reading file: ", 
              path);
    return 6;
  }
  
  have fd: int! = @open(path, true, false, false);
  if (fd < 0) {
    return nil;
  }

  @input(fd, bytes, size);
  @close(fd);
  return bytes;
};

const main := fn () int! {
  have path: *char = "example.txt";
  hacve size: int! = 1024;

  have contents: *char = readFile(path, size);
  if (contents == nil) {
    @outputln(2, "Failed to read file: ", path);
    return 1; # Return error code if reading fails
  }

  have realSize: int! = size;
  loop (i = size - 1; i >= 0) : (i--) {
    if (contents[i] == @cast<char>(0)) realSize--;
    else break;
  }
  contents[realSize - 1] = @cast<char>(0);
  @outputln(1, "File contents: ", contents);
  @free(contents, size); # Free the allocated memory
  return 0;
};

`,
};

document.getElementById("codeSelector").addEventListener("change", (e) => {
  const selected = e.target.value;
  const codeElement = document.getElementById("codeOutput");
  codeElement.textContent = codeSamples[selected] || "";
  Prism.highlightElement(codeElement);
});