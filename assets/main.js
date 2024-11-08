document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputBook");
  const checkBox = document.getElementById("inputBookIsComplete");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const deleteBookButton = document.getElementsByClassName("btn_remove_book");
  const completeButton = document.getElementsByClassName("btn_Complete");
  const InCompleteButton = document.getElementsByClassName("btn_InComplete");
  const filter_book = document.getElementById("searchBookTitle");

  const data_exist = getLocalStorage();
  if (data_exist.length !== 0) {
    loadDataStorage();
  }

  form.addEventListener("submit", insertBook);
  checkBox.addEventListener("change", isChacked);
  filter_book.addEventListener("keyup", filterBook);
  Array.from(deleteBookButton).forEach(function (btn_remove) {
    btn_remove.addEventListener("click", deleteBook);
  });
  Array.from(completeButton).forEach(function (btn_selesai) {
    btn_selesai.addEventListener("click", moveBookToCompleteShelf);
  });
  Array.from(InCompleteButton).forEach(function (btn_belum_selsai) {
    btn_belum_selsai.addEventListener("click", moveBookToInCompleteShelf);
  });

  /**---------Menambahkan data----------- */
  function insertBook(i) {
    i.preventDefault();

    const id = +new Date();
    const books = getLocalStorage();
    const judul = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const tahun = document.getElementById("inputBookYear").value;
    const isComplete = checkBox.checked;

    const book = {
      id: id,
      title: judul,
      author: penulis,
      year: tahun,
      isComplete: isComplete,
    };
    books.push(book);
    setLocalStorage(books);
    form.reset();
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    loadDataStorage();
  }

  function deleteBook() {
    id = this.getAttribute("data-id");
    if (confirm("Yakin ingin menghapus buku?")) {
      deleteBookLocalStorage(id);
    }
  }

  function moveBookToCompleteShelf() {
    id = this.getAttribute("data-id");
    if (confirm("Memindahkan buku ke selesai dibaca?")) {
      moveBook(id);
    }
  }

  function moveBookToInCompleteShelf() {
    id = this.getAttribute("data-id");
    if (confirm("Memindahkan buku ke belum sesesai dibaca?")) {
      moveBook(id);
    }
  }

  function isChacked(i) {
    const span = document.getElementById("bookSubmit").children[0];

    if (i.currentTarget.checked) {
      span.innerText = "Selesai Dibaca";
    } else {
      span.innerText = "Belum selesai dibaca";
    }
  }

  //fungsi dapat digunakan kembali
  function getLocalStorage() {
    let books = JSON.parse(localStorage.getItem("data_book"));

    if (books) {
      return books;
    } else {
      return (books = []);
    }
  }
  function setLocalStorage(book) {
    const myJson = JSON.stringify(book);
    localStorage.setItem("data_book", myJson);
  }

  function loadDataStorage() {
    const books = getLocalStorage();
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    /** Membuat Element */
    books.forEach((book) => {
      console.log(book);
      //Membuat article
      const article = document.createElement("article");
      article.classList.add("book_item");

      // membuat h3 dan p
      const title = document.createElement("h3");
      const author = document.createElement("p");
      const year = document.createElement("p");

      // membuat action
      const action = document.createElement("div");
      action.classList.add("action");

      const buttonHapus = document.createElement("button");
      buttonHapus.classList.add("red", "btn_remove_book");
      buttonHapus.setAttribute("data-id", book.id);

      const txtHapus = document.createTextNode("Hapus");
      buttonHapus.appendChild(txtHapus);

      // perulangan
      if (book.isComplete) {
        const titleText = document.createTextNode(book.title);
        title.appendChild(titleText);

        const authorText = document.createTextNode("Penulis : " + book.author);
        author.appendChild(authorText);

        const yeartext = document.createTextNode("Tahun : " + book.year);
        year.appendChild(yeartext);

        const buttonInComplete = document.createElement("button");
        buttonInComplete.classList.add("green", "btn_InComplete");
        buttonInComplete.setAttribute("data-id", book.id);

        const textInComplete = document.createTextNode("Belum Selesai diBaca");
        buttonInComplete.appendChild(textInComplete);

        action.append(buttonInComplete, buttonHapus);

        article.append(title, author, year, action);

        completeBookshelfList.appendChild(article);
      } else {
        const titleText = document.createTextNode(book.title);
        title.appendChild(titleText);

        const authorText = document.createTextNode("Penulis : " + book.author);
        author.appendChild(authorText);

        const yeartext = document.createTextNode("Tahun : " + book.year);
        year.appendChild(yeartext);

        const buttonComplete = document.createElement("button");
        buttonComplete.classList.add("green", "btn_Complete");
        buttonComplete.setAttribute("data-id", book.id);

        const textInComplete = document.createTextNode("Selesai diBaca");
        buttonComplete.appendChild(textInComplete);

        action.append(buttonComplete, buttonHapus);

        article.append(title, author, year, action);

        incompleteBookshelfList.appendChild(article);
      }
    });
  }

  function deleteBookLocalStorage(id) {
    const books = getLocalStorage();

    books.forEach((book, index) => {
      if (book.id == id) {
        books.splice(index, 1);
      }
    });

    alert("Buku berhasil dihapus");
    setLocalStorage(books);
    loadDataStorage();
    location.reload();
  }

  function moveBook(id) {
    const books = getLocalStorage();
    let text = "";

    books.forEach((book, index) => {
      if (book.id == id) {
        if (book.isComplete) {
          book.isComplete = false;
          text = "belum selesai dibaca";
        } else {
          book.isComplete = true;
          text = "selesai dibaca";
        }
      }
    });

    alert("Memindahkan buku ke " + text);
    setLocalStorage(books);
    loadDataStorage();
    location.reload();
  }
  function filterBook() {
    let books = document.getElementsByClassName("book_item");
    let text_filter = document.getElementById("searchBookTitle").value;

    Array.from(books).forEach(function (book) {
      const title = book.firstChild.textContent.toLowerCase();

      if (title.indexOf(text_filter) !== -1) {
        book.setAttribute("style", "display : block;");
      } else {
        book.setAttribute("style", "display : none !important;");
      }
    });
  }
});
