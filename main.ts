export {}; 

// 7. Generics 
class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  getAllItems(): T[] {
    return [...this.items];
  }
}

// 1. Base Class
class User {
  public readonly id: number;
  public name: string;
  public email: string;
  private password: string;
  public phone: string;
  private _age: number = 18;

  // 5. Aggregation
  protected notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age; 
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  checkPassword(input: string): boolean {
    return this.password === input;
  }

  // Aggregation
  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  getNotebooks(): NoteBook[] {
    return [...this.notebooks];
  }

  displayInfo(): void {
    console.log(
      `User Info -> ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, ` +
        `Phone: ${this.phone}, Age: ${this._age}`,
    );
  }
}

// 2. Inheritance
class Admin extends User {
  // Allows the admin to manage notes (here: delete any note from a notebook)
  manageNotes(notebook: NoteBook, noteId: number): void {
    console.log(`Admin ${this.name} is managing notes...`);
    const removed = notebook.removeNote(noteId);
    console.log(
      removed
        ? `Note ${noteId} removed by admin.`
        : `Note ${noteId} not found.`,
    );
  }

  override displayInfo(): void {
    console.log("[Admin]");
    super.displayInfo();
  }
}

// 3. Class
class Note {
  public id: number;
  public tittle: string; // spelled as in the assignment
  public content: string;
  public userId: number; // reference to User (id)
  public author: User; // association with User

  constructor(id: number, tittle: string, content: string, author: User) {
    this.id = id;
    this.tittle = tittle;
    this.content = content;
    this.author = author;
    this.userId = author.id;
  }

  preview(length: number = 20): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}

// 4. Composition - NoteBook owns its Notes
class NoteBook {
  private notes: Note[] = [];
  private nextNoteId: number = 1;

  constructor(public title: string) {}

  addNote(tittle: string, content: string, author: User): Note {
    const note = new Note(this.nextNoteId++, tittle, content, author);
    this.notes.push(note);
    return note;
  }

  removeNote(noteId: number): boolean {
    const index = this.notes.findIndex((n) => n.id === noteId);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }

  getNotes(): Note[] {
    return [...this.notes];
  }
}

// Demo
const user1 = new User(
  1,
  "Ahmed",
  "ahmed@mail.com",
  "123456",
  "01012345678",
  25,
);
const admin1 = new Admin(
  2,
  "Sara",
  "sara@mail.com",
  "admin123",
  "01098765432",
  30,
);

user1.displayInfo();
admin1.displayInfo();

// Aggregation
const notebook1 = new NoteBook("Study Notes");
user1.addNotebook(notebook1);

// Composition
notebook1.addNote(
  "TypeScript",
  "TypeScript is a typed superset of JavaScript.",
  user1,
);
notebook1.addNote(
  "OOP",
  "Encapsulation, inheritance, polymorphism, abstraction.",
  user1,
);

notebook1
  .getNotes()
  .forEach((n) =>
    console.log(
      `Note #${n.id} [${n.tittle}] by ${n.author.name}: ${n.preview()}`,
    ),
  );

admin1.manageNotes(notebook1, 2);
console.log("Notes left:", notebook1.getNotes().length);

// Generics
const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
numbers.removeItem(10);
console.log("Numbers:", numbers.getAllItems());

const users = new Storage<User>();
users.addItem(user1);
users.addItem(admin1);
console.log("Users count:", users.getAllItems().length);

// Age validation test
try {
  new User(3, "Kid", "kid@mail.com", "pw", "010", 15);
} catch (e) {
  console.log("Error:", (e as Error).message);
}
