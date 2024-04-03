// var.1.009 odszukuje dokładne słowo i w tym pliku w którym jest  

document.addEventListener('DOMContentLoaded', function () {
  const options = {
    keys: ['textContent', 'innerText'], // Klucze do wyszukiwania (tekst w elementach)
    includeMatches: true, // Włączenie zwracania informacji o dopasowanych fragmentach
    minMatchCharLength: 3, // Minimalna długość dopasowania
    includeScore: true // Włączenie zwracania informacji o ocenie dopasowania
  };

  const fuse = new Fuse([], options); // Inicjalizacja pustego obiektu Fuse

  // Funkcja do aktualizacji danych wyszukiwania
  function updateFuseData() {
    const textNodes = document.querySelectorAll('p, h2, #fruit-list li'); // Znajdź wszystkie tekstowe elementy na stronie, w tym elementy listy owoców
    const data = Array.from(textNodes).map(node => ({ textContent: node.textContent, innerText: node.innerText })); // Zbierz tekst z tych elementów
    fuse.setCollection(data); // Ustaw nowe dane do wyszukiwania w bibliotece Fuse
  }

  // Funkcja do tworzenia linków na podstawie bieżącej lokalizacji
  function createLinks(result) {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ''; // Wyczyść poprzednie wyniki

    // Dodaj tekstowe wyniki wyszukiwania powyżej linków
    modalBody.innerHTML += `<p>Found ${result.length} results:</p>`;

    // Wyświetl wyniki wyszukiwania tekstowego w modalu
    result.forEach(match => {
      modalBody.innerHTML += `<p>${match.item.textContent}</p>`;
    });

    // Dodaj linki do odpowiednich stron
    pages.forEach(page => {
      if (window.location.pathname.includes(page.name)) {
        const link = document.createElement('a');
        link.href = page.name;
        link.textContent = page.title;
        modalBody.appendChild(link);
      }
    });
  }

  // Funkcja obsługująca kliknięcie przycisku "Search"
  function handleSearch() {
    const searchTerm = document.querySelector('input[type="search"]').value; // Pobierz wartość wpisaną w pole wyszukiwania
    const result = fuse.search(searchTerm); // Wyszukaj po tym terminie za pomocą biblioteki Fuse

    // Wyświetl wyniki wyszukiwania w modalu
    if (result.length > 0) {
      createLinks(result);
    } else {
      const modalBody = document.querySelector('.modal-body');
      modalBody.innerHTML = '<p>No results found.</p>';
    }

    // Wyświetl modal po przeszukaniu
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    searchModal.show();
  }

  // Nasłuchuj kliknięcie na przycisk "Search"
  document.querySelector('button').addEventListener('click', handleSearch);

  // Funkcja do obsługi zmiany zawartości pola wyszukiwania
  document.querySelector('input[type="search"]').addEventListener('input', function () {
    updateFuseData(); // Aktualizuj dane wyszukiwania po zmianie zawartości pola
  });

  // Tablica z informacjami o stronach
  const pages = [
    { name: 'index.html', title: 'Home Owoce' },
    { name: 'features.html', title: 'Features Kolorowe Rzeczy' }
  ];

  // Aktualizuj dane wyszukiwania przy załadowaniu strony
  updateFuseData();
});