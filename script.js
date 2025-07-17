const toggle = document.getElementById('toggleDark');
const body = document.body;

// === Apply theme ===
function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark-mode', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  // Toggle icon if present
  if (toggle) {
    toggle.classList.toggle('bi-moon', !isDark);
    toggle.classList.toggle('bi-brightness-high-fill', isDark);
  }

  // Footer link color
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.style.color = isDark ? '#DCDDDE' : '#23272A';
    link.style.transition = 'color 2s';
  });
}

// === On load ===
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("theme") === "dark";
  applyTheme(isDark);

  const currentPath = window.location.pathname.replace(/\/$/, ""); // removes trailing slash
  const links = document.querySelectorAll(".nav-bar nav ul li a");

  links.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  const codeSelector = document.getElementById("codeSelector");
  if (codeSelector) {
    codeSelector.dispatchEvent(new Event("change"));
  }

  const docsContainer = document.getElementById("docs-container");
  if (docsContainer) {
    if (typeof marked === 'undefined') {
      docsContainer.innerHTML = "<p>❌ Marked library not loaded. Please check your internet connection.</p>";
      return;
    }

    docsContainer.innerHTML = "<p>Loading documentation...</p>";

    // ✅ Custom Admonition Block Support
    const admonitionExtension = {
      extensions: [{
        name: 'admonition',
        level: 'block',
        start(src) {
          return src.match(/^\[!\w+\]/)?.index;
        },
        tokenizer(src) {
          const match = src.match(/^\[!(\w+)\][ \t]*(.*?)\n((?:.+\n?)*)/);
          if (match) {
            return {
              type: 'admonition',
              raw: match[0],
              kind: match[1].toLowerCase(),
              title: match[2].trim(),
              text: match[3].trim()
            };
          }
        },
        renderer(token) {
          const title = token.title || token.kind.toUpperCase();
          return `
            <div class="admonition admonition-${token.kind}">
              <div class="admonition-title">${title}</div>
              <div class="admonition-body">${marked.parse(token.text)}</div>
            </div>
          `;
        }
      }]
    };
    marked.use(admonitionExtension);

    const url = `https://raw.githubusercontent.com/TheDevConnor/Zura-Transpiled/experimental/docs/docs.md?t=${Date.now()}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(md => {
        docsContainer.innerHTML = marked.parse(md);

        // Auto-link and scroll to headings
        docsContainer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
          const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          heading.id = id;
          heading.innerHTML = `<a href="#${id}" class="anchor-link">${heading.innerHTML}</a>`;
          heading.style.scrollBehavior = 'smooth';
          heading.style.cursor = 'pointer';
          heading.addEventListener('click', () => {
            window.location.hash = `#${id}`;
          });
        });

        Prism.highlightAll();
      })
      .catch(err => {
        docsContainer.innerHTML = "<p>❌ Failed to load docs. Try again later.</p>";
        console.error("Error loading docs:", err);
      });
  }

  // ✅ Fetch latest GitHub release version and update DOM
  fetch("https://api.github.com/repos/TheDevConnor/Zura-Transpiled/releases/latest")
    .then(res => res.json())
    .then(data => {
      let versionRaw = data.tag_name || data.name || "";
      let versionClean = versionRaw.replace(/^Release-/, ''); // Remove 'Release-' prefix
      versionClean = versionClean.split('-')[0];
      if (!versionClean) {
        console.warn("⚠️ No valid version found in GitHub release data.");  
        return;
      }

      const heading = document.getElementById("version-heading");
      const versionSpan = heading?.querySelector(".version-number");
      if (versionSpan && versionClean) {
        versionSpan.textContent = versionClean;
      }
    })
    .catch(err => {
      console.warn("⚠️ Failed to fetch GitHub release version:", err);
    });
});

// === On toggle click ===
if (toggle) {
  toggle.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
    applyTheme(!isCurrentlyDark);
  });
}

// === HAMBURGER MENU TOGGLE ===
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    hamburger.innerHTML = navLinks.classList.contains("active")
      ? '<i class="bi bi-x"></i>'
      : '<i class="bi bi-list"></i>';
  });
}

// === CODE SELECTOR ===
const selector = document.getElementById('codeSelector');
const examples = document.querySelectorAll('.code-example');

if (selector && examples.length > 0) {
  selector.addEventListener('change', function () {
    examples.forEach(el => el.style.display = 'none');
    const selected = document.getElementById(this.value);
    if (selected) selected.style.display = 'block';
  });
}

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

const codeSelector = document.getElementById("codeSelector");
if (codeSelector) {
  codeSelector.addEventListener("change", (e) => {
    const selected = e.target.value;
    const codeElement = document.getElementById("codeOutput");
    if (codeElement) {
      // Update text content
      codeElement.textContent = codeSamples[selected] || "";

      // Make sure the language class is set on <code> or <pre>
      // For example, on <code>:
      codeElement.className = "language-zura";

      // Trigger Prism to highlight
      Prism.highlightElement(codeElement);
    }
  });
}