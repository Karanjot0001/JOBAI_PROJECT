export const skillAssessmentTopics = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    badge: "JS",
    color: "#f59e0b",
    subtitle: "Fundamentals & Web Development",
    questionCount: 10,
    difficulty: "Beginner to Intermediate",
    questions: [
      { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "function", "define"], correct: 1 },
      { q: "What does DOM stand for?", options: ["Data Object Model", "Document Object Model", "Digital Object Mode", "Document Order Map"], correct: 1 },
      { q: "Which method converts JSON text into an object?", options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "Object.parse()"], correct: 0 },
      { q: "Which event fires when a button is clicked?", options: ["hover", "submit", "click", "change"], correct: 2 },
      { q: "Which method transforms every element of an array into a new array?", options: ["map()", "push()", "pop()", "join()"], correct: 0 },
      { q: "Which symbol is used for strict equality in JavaScript?", options: ["=", "==", "===", "!=="], correct: 2 },
      { q: "Which keyword creates a constant variable that cannot be reassigned?", options: ["constant", "fixed", "const", "let"], correct: 2 },
      { q: "Which method adds one or more elements to the end of an array?", options: ["shift()", "push()", "unshift()", "add()"], correct: 1 },
      { q: "Which syntax correctly creates an ES6 arrow function?", options: ["() => {}", "-> {}", "function => {}", "<= {}"], correct: 0 },
      { q: "Which method removes and returns the last element from an array?", options: ["shift()", "remove()", "pop()", "delete()"], correct: 2 }
    ]
  },
  java: {
    id: "java",
    name: "Java",
    badge: "JAVA",
    color: "#ef4444",
    subtitle: "Core Java & Object-Oriented Programming",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { q: "Which keyword is used to declare a class in Java?", options: ["class", "Class", "object", "new"], correct: 0 },
      { q: "Which keyword is used to instantiate an object?", options: ["create", "object", "new", "this"], correct: 2 },
      { q: "Which concept allows a class to inherit properties from another class?", options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"], correct: 1 },
      { q: "Which keyword refers to the current instance of the calling class?", options: ["self", "current", "this", "super"], correct: 2 },
      { q: "Which keyword is used for inheritance between two classes?", options: ["inherits", "extends", "implements", "inherit"], correct: 1 },
      { q: "Which method is the starting entry point of any Java application?", options: ["start()", "run()", "main()", "execute()"], correct: 2 },
      { q: "Which keyword prevents a class from being subclassed or inherited?", options: ["static", "private", "final", "const"], correct: 2 },
      { q: "Which OOP concept focuses on hiding internal implementation details?", options: ["Abstraction", "Inheritance", "Compilation", "Casting"], correct: 0 },
      { q: "Which collection interface does not allow duplicate items?", options: ["List", "Set", "ArrayList", "Vector"], correct: 1 },
      { q: "Which keyword is used by a class to implement an interface?", options: ["extends", "inherits", "implements", "interface"], correct: 2 }
    ]
  },
  python: {
    id: "python",
    name: "Python",
    badge: "PY",
    color: "#3b82f6",
    subtitle: "Programming & Data Fundamentals",
    questionCount: 10,
    difficulty: "Beginner",
    questions: [
      { q: "Which symbol is used to write a single-line comment in Python?", options: ["//", "#", "/*", "--"], correct: 1 },
      { q: "Which keyword defines a function in Python?", options: ["function", "define", "def", "fun"], correct: 2 },
      { q: "Which built-in data type stores key-value pairs?", options: ["List", "Tuple", "Dictionary", "Set"], correct: 2 },
      { q: "Which function is used to output text to the console?", options: ["display()", "console()", "print()", "write()"], correct: 2 },
      { q: "Which keyword is used to iterate over a sequence in Python?", options: ["loop", "for", "repeat", "iterate"], correct: 1 },
      { q: "Which of these Python data structures is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], correct: 2 },
      { q: "Which keyword is used to create a class in Python?", options: ["class", "Class", "object", "define"], correct: 0 },
      { q: "Which operator is used for exponentiation (power) in Python?", options: ["^", "**", "//", "^^"], correct: 1 },
      { q: "Which built-in function returns the length of a string or list?", options: ["length()", "size()", "len()", "count()"], correct: 2 },
      { q: "Which keyword starts an exception handling block in Python?", options: ["catch", "error", "try", "exception"], correct: 2 }
    ]
  },
  sql: {
    id: "sql",
    name: "SQL",
    badge: "SQL",
    color: "#10b981",
    subtitle: "Queries & Database Management",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { q: "Which command is used to retrieve data from a table?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correct: 1 },
      { q: "Which SQL command adds new records into a database table?", options: ["ADD", "INSERT", "CREATE", "APPEND"], correct: 1 },
      { q: "Which command modifies existing data within a table?", options: ["CHANGE", "MODIFY", "UPDATE", "ALTER"], correct: 2 },
      { q: "Which SQL command removes rows from a table based on conditions?", options: ["REMOVE", "DELETE", "DROP", "CLEAR"], correct: 1 },
      { q: "Which clause is used to filter rows prior to grouping?", options: ["FILTER", "WHERE", "HAVING", "SELECT"], correct: 1 },
      { q: "Which clause is used to sort query results in ascending/descending order?", options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE"], correct: 1 },
      { q: "Which command creates a new database table?", options: ["CREATE TABLE", "MAKE TABLE", "NEW TABLE", "BUILD TABLE"], correct: 0 },
      { q: "Which function counts the number of rows matching query criteria?", options: ["TOTAL()", "COUNT()", "NUMBER()", "ROWS()"], correct: 1 },
      { q: "Which keyword eliminates duplicate rows from query results?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "ONLY"], correct: 1 },
      { q: "Which clause groups rows having identical values into summary rows?", options: ["GROUP BY", "ORDER BY", "WHERE", "JOIN"], correct: 0 }
    ]
  },
  dsa: {
    id: "dsa",
    name: "DSA",
    badge: "DSA",
    color: "#8b5cf6",
    subtitle: "Data Structures & Algorithms",
    questionCount: 10,
    difficulty: "Advanced",
    questions: [
      { q: "Which data structure operates on a Last-In-First-Out (LIFO) basis?", options: ["Queue", "Stack", "Array", "Tree"], correct: 1 },
      { q: "Which data structure operates on a First-In-First-Out (FIFO) basis?", options: ["Stack", "Queue", "Tree", "Graph"], correct: 1 },
      { q: "Which algorithm finds the single-source shortest path in a weighted graph?", options: ["Dijkstra's Algorithm", "Binary Search", "Bubble Sort", "DFS"], correct: 0 },
      { q: "What is the worst-case time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
      { q: "Which non-linear data structure represents hierarchical parent-child relationships?", options: ["Array", "Stack", "Tree", "Queue"], correct: 2 },
      { q: "Which graph traversal systematically uses a Queue data structure?", options: ["DFS", "BFS", "Binary Search", "Backtracking"], correct: 1 },
      { q: "Which sorting algorithm repeatedly swaps adjacent elements that are out of order?", options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"], correct: 2 },
      { q: "Which data structure consists of nodes containing data and pointers to next nodes?", options: ["Array", "Linked List", "String", "Matrix"], correct: 1 },
      { q: "What is the worst-case time complexity of linear search?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2 },
      { q: "Which call stack structure is utilized under the hood during recursive function calls?", options: ["Queue", "Stack", "Graph", "Heap"], correct: 1 }
    ]
  },
  htmlcss: {
    id: "htmlcss",
    name: "HTML & CSS",
    badge: "WEB",
    color: "#ec4899",
    subtitle: "Web Development Foundations",
    questionCount: 10,
    difficulty: "Beginner",
    questions: [
      { q: "Which HTML tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
      { q: "Which HTML heading tag represents the highest level heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correct: 2 },
      { q: "Which CSS property specifies the text color of an element?", options: ["font-color", "text-color", "color", "foreground"], correct: 2 },
      { q: "Which CSS property sets the background color of an element?", options: ["background", "background-color", "bg-color", "color"], correct: 1 },
      { q: "Which CSS property controls the size of font text?", options: ["text-size", "font-size", "size", "font"], correct: 1 },
      { q: "Which HTML tag is used to define a paragraph of text?", options: ["<paragraph>", "<p>", "<para>", "<text>"], correct: 1 },
      { q: "Which modern CSS layout module is ideal for one-dimensional layouts?", options: ["Grid", "Flexbox", "Float", "Table"], correct: 1 },
      { q: "Which CSS property sets the spacing between the content and the border of an element?", options: ["margin", "padding", "spacing", "border"], correct: 1 },
      { q: "Which HTML attribute provides alternative text for accessibility and broken images?", options: ["title", "src", "alt", "description"], correct: 2 },
      { q: "Which CSS property declaration establishes a new flex container context?", options: ["position: flex", "display: flex", "flex: true", "layout: flex"], correct: 1 }
    ]
  }
};
