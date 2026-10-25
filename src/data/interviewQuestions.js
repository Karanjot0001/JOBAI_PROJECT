export const technicalTopics = {
  Java: {
    icon: "☕",
    title: "Java",
    badge: "Core & OOP",
    description: "Practice Core Java, OOP principles, collections, exceptions, and Java memory model fundamentals.",
    questions: [
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["implements", "extends", "inherits", "super"],
        correct: 1,
        explanation: "In Java, the 'extends' keyword is used by a class to inherit from another superclass, while 'implements' is used to implement an interface."
      },
      {
        question: "Which of these is NOT a primitive data type in Java?",
        options: ["int", "float", "String", "char"],
        correct: 2,
        explanation: "String is an immutable reference class (object) in Java, whereas int, float, and char are primitive data types."
      },
      {
        question: "Which keyword is used to create an object in Java?",
        options: ["create", "new", "object", "class"],
        correct: 1,
        explanation: "The 'new' keyword dynamically allocates memory on the heap for an object and calls its constructor."
      },
      {
        question: "Which method is the entry point of a standard Java program?",
        options: ["start()", "main()", "run()", "execute()"],
        correct: 1,
        explanation: "The JVM looks for the signature 'public static void main(String[] args)' as the starting point of program execution."
      },
      {
        question: "Which collection interface does NOT allow duplicate elements?",
        options: ["ArrayList", "LinkedList", "HashSet", "Vector"],
        correct: 2,
        explanation: "Set implementations like HashSet do not allow duplicate elements, modeling the mathematical set abstraction."
      }
    ]
  },
  DSA: {
    icon: "🧩",
    title: "DSA",
    badge: "Algorithms",
    description: "Practice arrays, linked lists, stacks, queues, trees, searching, and sorting algorithms.",
    questions: [
      {
        question: "Which data structure follows LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1,
        explanation: "A Stack follows LIFO order where the last element inserted is the first one removed."
      },
      {
        question: "Which data structure follows FIFO (First In, First Out)?",
        options: ["Stack", "Tree", "Queue", "Graph"],
        correct: 2,
        explanation: "A Queue operates on FIFO order where elements are enqueued at the back and dequeued from the front."
      },
      {
        question: "What is the average time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        explanation: "Binary search cuts the search space in half at each comparison, achieving O(log n) time complexity."
      },
      {
        question: "Which sorting algorithm has a guaranteed average and worst-case time complexity of O(n log n)?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Search"],
        correct: 2,
        explanation: "Merge Sort uses divide-and-conquer to recursively split and merge arrays with O(n log n) runtime."
      },
      {
        question: "Which data structure is commonly used to implement Breadth-First Search (BFS)?",
        options: ["Stack", "Queue", "Heap", "Array"],
        correct: 1,
        explanation: "BFS explores neighbor vertices level by level, utilizing a Queue to maintain visit order."
      }
    ]
  },
  DBMS: {
    icon: "🗄️",
    title: "DBMS",
    badge: "Databases",
    description: "Practice relational databases, primary keys, normalization, transactions, and SQL storage engines.",
    questions: [
      {
        question: "What does DBMS stand for?",
        options: ["Database Management System", "Data Backup Management System", "Database Monitoring System", "Data Management Software"],
        correct: 0,
        explanation: "DBMS stands for Database Management System, software designed to store, retrieve, and manage structured data."
      },
      {
        question: "Which key uniquely identifies each record in a database table?",
        options: ["Foreign Key", "Primary Key", "Candidate Key", "Composite Key"],
        correct: 1,
        explanation: "A Primary Key uniquely identifies every row and cannot contain NULL values."
      },
      {
        question: "Which normal form requires removing repeating groups and multi-valued attributes?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correct: 0,
        explanation: "First Normal Form (1NF) mandates atomic (indivisible) column values with no repeating groups."
      },
      {
        question: "Which SQL command is used to retrieve data from a database table?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correct: 2,
        explanation: "The SELECT statement queries and retrieves data subsets from one or more tables."
      },
      {
        question: "What does ACID stand for in database transaction management?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Accuracy, Control, Isolation, Data",
          "Atomicity, Control, Integrity, Data",
          "Access, Consistency, Isolation, Data"
        ],
        correct: 0,
        explanation: "ACID properties ensure reliable processing of database transactions."
      }
    ]
  },
  OOP: {
    icon: "🏛️",
    title: "OOP",
    badge: "Architecture",
    description: "Practice object-oriented principles: inheritance, polymorphism, encapsulation, and abstraction.",
    questions: [
      {
        question: "Which OOP concept allows a class to acquire fields and methods of another class?",
        options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"],
        correct: 1,
        explanation: "Inheritance creates an 'is-a' relationship, enabling code reuse and hierarchical class structures."
      },
      {
        question: "Which concept focuses on hiding internal implementation details and exposing only essential features?",
        options: ["Inheritance", "Polymorphism", "Abstraction", "Compilation"],
        correct: 2,
        explanation: "Abstraction isolates implementation complexity behind interfaces and abstract classes."
      },
      {
        question: "Which concept allows a single method or interface to have multiple implementations?",
        options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
        correct: 1,
        explanation: "Polymorphism (method overloading and overriding) allows an entity to take multiple forms."
      },
      {
        question: "Which access modifier provides the highest level of restriction?",
        options: ["public", "protected", "private", "default"],
        correct: 2,
        explanation: "Private members are accessible only within the declaring class itself."
      },
      {
        question: "Which OOP concept bundles data and functions that manipulate that data into a single unit?",
        options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        correct: 0,
        explanation: "Encapsulation prevents direct external manipulation of object state and protects data integrity."
      }
    ]
  },
  SQL: {
    icon: "📊",
    title: "SQL",
    badge: "Queries",
    description: "Practice writing queries, filtering data, joins, aggregations, and subqueries.",
    questions: [
      {
        question: "Which SQL command is used to retrieve records from a database?",
        options: ["GET", "SELECT", "FETCH", "READ"],
        correct: 1,
        explanation: "SELECT specifies the columns and expressions to retrieve from database tables."
      },
      {
        question: "Which clause is used to filter rows before any groupings are formed?",
        options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
        correct: 2,
        explanation: "WHERE filters rows before grouping, while HAVING filters aggregated grouped rows."
      },
      {
        question: "Which clause is used to sort query result sets in ascending or descending order?",
        options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE BY"],
        correct: 1,
        explanation: "ORDER BY sorts the returned rows based on one or more column expressions."
      },
      {
        question: "Which SQL aggregate function returns the count of rows matching a criteria?",
        options: ["SUM()", "COUNT()", "TOTAL()", "NUMBER()"],
        correct: 1,
        explanation: "COUNT(*) returns total matching rows in the result set."
      },
      {
        question: "Which JOIN returns only the records where matching values exist in both tables?",
        options: ["LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "INNER JOIN"],
        correct: 3,
        explanation: "INNER JOIN selects records that have matching values in both joined tables."
      }
    ]
  },
  OS: {
    icon: "💻",
    title: "OS",
    badge: "Systems",
    description: "Practice process scheduling, memory paging, deadlocks, and virtual memory.",
    questions: [
      {
        question: "What is the primary role of an Operating System?",
        options: ["Manage hardware and software resources", "Only run games", "Create websites", "Design databases"],
        correct: 0,
        explanation: "An OS acts as an intermediary between user applications and physical hardware resources."
      },
      {
        question: "Which CPU scheduling algorithm executes processes in the exact order they arrive?",
        options: ["Round Robin", "FCFS (First Come First Served)", "SJF (Shortest Job First)", "Priority"],
        correct: 1,
        explanation: "FCFS schedules tasks strictly in chronological arrival order."
      },
      {
        question: "Which memory management technique avoids external fragmentation by dividing physical memory into fixed-size frames?",
        options: ["Paging", "Sorting", "Hashing", "Parsing"],
        correct: 0,
        explanation: "Paging divides logical memory into blocks called pages and physical memory into page frames."
      },
      {
        question: "A process that is currently being executed by the CPU is in which state?",
        options: ["Waiting", "Ready", "Running", "Terminated"],
        correct: 2,
        explanation: "In the process lifecycle, 'Running' designates active instruction execution on the CPU."
      },
      {
        question: "Which condition is one of Coffman's four necessary conditions for deadlock?",
        options: ["Mutual exclusion", "Compilation", "Inheritance", "Encapsulation"],
        correct: 0,
        explanation: "The four deadlock conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait."
      }
    ]
  },
  Networks: {
    icon: "🌐",
    title: "Networks",
    badge: "Protocols",
    description: "Practice the OSI 7-layer model, TCP/IP, IP routing, DNS, and HTTP/HTTPS security.",
    questions: [
      {
        question: "How many layers are defined in the standard OSI reference model?",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "The 7 OSI layers are Physical, Data Link, Network, Transport, Session, Presentation, and Application."
      },
      {
        question: "Which protocol provides encrypted web communication over TLS/SSL?",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        correct: 1,
        explanation: "HTTPS (HTTP Secure) encrypts all communication between browser and web server using TLS/SSL."
      },
      {
        question: "Which hardware device operates at Layer 3 to forward packets across different networks?",
        options: ["Switch", "Hub", "Router", "Repeater"],
        correct: 2,
        explanation: "A Router inspects destination IP addresses at the Network Layer (Layer 3) to route packets."
      },
      {
        question: "Which protocol is primarily used for sending email messages across mail servers?",
        options: ["SMTP", "HTTP", "FTP", "ARP"],
        correct: 0,
        explanation: "Simple Mail Transfer Protocol (SMTP) handles outgoing email transmission."
      },
      {
        question: "Which layer of the OSI model handles logical addressing and path determination?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correct: 2,
        explanation: "The Network Layer manages IP addressing and selects optimal packet routes across networks."
      }
    ]
  },
  JavaScript: {
    icon: "⚡",
    title: "JavaScript",
    badge: "Modern ES6+",
    description: "Practice event loop, closures, promises, DOM manipulation, and modern array methods.",
    questions: [
      {
        question: "Which keyword declares a block-scoped variable that can be reassigned?",
        options: ["var", "let", "function", "define"],
        correct: 1,
        explanation: "'let' declares block-scoped variables, unlike function-scoped 'var'."
      },
      {
        question: "What does the browser acronym DOM stand for?",
        options: ["Data Object Model", "Document Object Model", "Digital Object Mode", "Document Order Map"],
        correct: 1,
        explanation: "DOM stands for Document Object Model, representing HTML documents as a node tree."
      },
      {
        question: "Which built-in JSON method converts a valid JSON string into a JavaScript object?",
        options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "Object.parse()"],
        correct: 0,
        explanation: "JSON.parse() parses a JSON string into corresponding JavaScript primitives and objects."
      },
      {
        question: "Which DOM event triggers when an element receives a click interaction?",
        options: ["hover", "submit", "click", "change"],
        correct: 2,
        explanation: "The 'click' event fires when a pointing device button is pressed and released on an element."
      },
      {
        question: "Which array method creates a brand new array populated with the results of calling a function on every element?",
        options: ["map()", "push()", "pop()", "join()"],
        correct: 0,
        explanation: "Array.prototype.map() returns an immutable transformed array of equal length."
      }
    ]
  }
};

export const openEndedPracticeQuestions = [
  {
    id: "oe-1",
    category: "Behavioral",
    role: "All Roles",
    title: "Tell me about a challenging technical project you worked on and how you resolved an obstacle.",
    hint: "Use the STAR method (Situation, Task, Action, Result). Mention specific tools, problem diagnosis, and measurable impact.",
    expectedKeywords: ["situation", "task", "action", "result", "debug", "solved", "team", "performance", "learned"],
    idealLength: "100-250 words",
    modelAnswer: "In my recent project building a real-time web application, our frontend experienced noticeable rendering latency when processing large datasets. As the lead developer, my task was to diagnose the root cause without rewriting the core UI. I profiled the component tree using DevTools, identified redundant re-renders, and refactored state management using React memoization (useMemo/useCallback) alongside virtualized lists. This reduced render times by 65% and delivered a buttery smooth 60fps user experience."
  },
  {
    id: "oe-2",
    category: "Architecture",
    role: "Full Stack / Frontend",
    title: "Explain how React's Virtual DOM works and why it improves web performance.",
    hint: "Explain real DOM bottlenecks, in-memory representation, the reconciliation algorithm (diffing), and batched updates.",
    expectedKeywords: ["virtual dom", "reconciliation", "diffing", "batch", "tree", "memory", "repaint", "performance"],
    idealLength: "80-200 words",
    modelAnswer: "The real browser DOM is slow to manipulate because DOM tree modifications trigger browser reflows and repaints. React maintains an in-memory Virtual DOM tree representing the desired UI state. When state changes, React constructs a new Virtual DOM tree, runs a fast heuristic diffing algorithm (reconciliation) against the previous tree, calculates the minimal set of changes, and batches only those necessary mutations directly to the real DOM."
  },
  {
    id: "oe-3",
    category: "Database & Backend",
    role: "Backend / Database",
    title: "How do database indexes speed up read operations and what is their tradeoff on writes?",
    hint: "Mention B-Trees, logarithmic search times vs linear scans, and write overhead during INSERT/UPDATE operations.",
    expectedKeywords: ["index", "b-tree", "lookup", "write", "insert", "update", "scan", "overhead", "tradeoff"],
    idealLength: "80-180 words",
    modelAnswer: "Database indexes work like the index of a book. Without an index, the database engine must execute a full table scan O(n) across every row. An index builds a balanced data structure (typically a B+ Tree) that enables rapid O(log n) lookups. The tradeoff is write performance: every INSERT, UPDATE, or DELETE requires the database to also update and rebalance the index tree on disk, consuming extra I/O and storage."
  },
  {
    id: "oe-4",
    category: "System Design",
    role: "Cloud / DevOps",
    title: "What is the difference between horizontal and vertical scaling and when would you choose each?",
    hint: "Discuss scale-up vs scale-out, hardware limits, distributed architectures, load balancing, and single points of failure.",
    expectedKeywords: ["horizontal", "vertical", "scale-up", "scale-out", "load balancer", "distributed", "cost", "redundancy"],
    idealLength: "90-200 words",
    modelAnswer: "Vertical scaling (scaling up) means adding more compute resources (CPU, RAM, NVMe) to an existing server machine. It is simpler because no distributed architecture changes are needed, but it has hard physical ceilings and leaves a single point of failure. Horizontal scaling (scaling out) means adding more machine instances behind a load balancer. It offers elastic scalability, high availability, and fault tolerance, making it the industry standard for production cloud applications."
  }
];
