function mapToAlbumsArray(albumsMap) {
    const albumsArray = [];

    for (const [key, value] of albumsMap) {
        const album = {
            id: key,
            titre: value.titre,
            numero: value.numero,
            idSerie: value.idSerie,
            idAuteur: value.idAuteur,
            prix: parseFloat(value.prix) // Convertir en nombre si nécessaire
        };
        albumsArray.push(album);
    }

    return albumsArray;
}

async function displayAlbums(viewType) {
    const albumsArray = mapToAlbumsArray(albums);

    const container = viewType === 'cards' ? document.getElementById('results') : document.getElementById('albumTable');
    container.innerHTML = '';

    if (viewType === 'table') {
        displayAlbumsAsTable(albumsArray, container);
    } else {
        displayAlbumsAsCards(albumsArray, container);
    }
}

function displayAlbumsAsTable(albumsData, container) {
    const table = document.createElement('table');
    table.classList.add('album-table');

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Série</th>
        <th>Numéro</th>
        <th>Titre</th>
        <th>Auteur</th>
        <th>Prix</th>
    `;
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');

    albumsData.forEach(album => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${album.idSerie}</td>
            <td>${album.numero}</td>
            <td>${album.titre}</td>
            <td>${album.idAuteur}</td>
            <td>${album.prix}</td>
        `;
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    container.appendChild(table);
}

function displayAlbumsAsCards(albumsData, container) {
    const cardContainer = document.createElement('div'); // Crée un conteneur temporaire

    albumsData.forEach(album => {
        const cardHTML = `
            <!-- Structure HTML d'une carte d'album -->
            <div class="col-6 mb-4">
                <div class="card">
                    <img src="albums/${album.idSerie}-${album.numero}-${album.titre}.jpg" class="card-img-top" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${album.titre}</h5>
                        <p class="card-text">N°${album.numero}, Série: ${album.idSerie}, Auteur: ${album.idAuteur}</p>
                        <!-- Vous pouvez ajouter d'autres éléments de la carte ici si nécessaire -->
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });

    container.appendChild(cardContainer); // Ajoute toutes les cartes une seule fois
}

detectAndDisplayFormat();
window.addEventListener('resize', detectAndDisplayFormat);