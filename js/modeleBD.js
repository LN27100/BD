// SUPPRESSION DU JQUERY DE BASE POUR UTILISER DES FONTIONS FULL JS

// La fonction s'exécute lorsque le chargement du DOM est terminé
function init() {

    document.addEventListener('DOMContentLoaded', function () {

        // Chemins vers les images par défaut et les répertoires d'images
        const srcImg = 'images/';
        const albumDefaultMini = srcImg + 'noComicsMini.jpeg';
        const albumDefault = srcImg + 'noComics.jpeg';
        const srcAlbumMini = 'albumsMini/';
        const srcAlbum = 'albums/';

        // Sélection des éléments du DOM
        const elements = {
            txtSerie: document.querySelector('#serie'),
            txtNumero: document.querySelector('#numero'),
            txtTitre: document.querySelector('#titre'),
            txtAuteur: document.querySelector('#auteur'),
            txtPrix: document.querySelector('#prix'),
            imgAlbum: document.querySelector('#album'),
            imgAlbumMini: document.querySelector('#albumMini'),
            id: document.querySelector('#id')
        };

        // Gestion des événements d'erreur pour les images
        elements.imgAlbum.addEventListener('error', handleImageError);
        elements.imgAlbumMini.addEventListener('error', handleImageError);

        // Événement de changement de l'ID
        elements.id.addEventListener('change', function () {
            getAlbum(this);
        });

        // Obtention des détails de l'album en fonction de son ID
        function getAlbum(num) {
            const albumId = num.value;
            const albumDetails = getAlbumDetails(albumId);

            if (!albumDetails) {
                clearAlbumDetails();
                displayDefaultImages();
            } else {
                const { imageMiniature, imageNormale } = albumDetails;
                displayAlbumDetails(albumDetails);
                displayAlbumImages(imageMiniature, imageNormale);
            }
        }

        // Affichage des détails de l'album dans les éléments de l'interface utilisateur
        function displayAlbumDetails(albumDetails) {
            for (const key in albumDetails) {
                if (elements[key]) {
                    elements[key].value = albumDetails[key];
                }
            }
        }

        // Réinitialisation des champs de détails d'album
        function clearAlbumDetails() {
            for (const key in elements) {
                if (key.startsWith('txt')) {
                    elements[key].value = '';
                }
            }
            elements.txtPrix.value = 0;
        }

        // Affichage des images de l'album avec un effet de transition
        function displayAlbumImages(imageMiniature, imageNormale) {
            elements.imgAlbumMini.src = srcAlbumMini + imageMiniature;
            elements.imgAlbum.src = srcAlbum + imageNormale;

            addTransitionEffect(elements.imgAlbumMini);
            addTransitionEffect(elements.imgAlbum);
        }

        // Ajout d'un effet de transition à un élément spécifié
        function addTransitionEffect(element) {
            element.classList.add('transition-effect');
            setTimeout(() => {
                element.classList.remove('transition-effect');
            }, 1000);
        }

        // Affichage des images par défaut en cas d'absence de détails d'album
        function displayDefaultImages() {
            let defaultMiniature = '';
            let defaultImage = '';

            // Vérifiez la vue actuelle pour définir les images par défaut
            if (currentView === 'table') {
                defaultMiniature = 'defaultMiniTablet.jpeg'; // Remplacez par le chemin de l'image par défaut pour le tableau en version desktop
                defaultImage = 'defaultTablet.jpeg'; // Remplacez par le chemin de l'image par défaut pour le tableau en version desktop
            } else {
                defaultMiniature = 'defaultMiniMobile.jpeg'; // Remplacez par le chemin de l'image par défaut pour les cartes en version mobile
                defaultImage = 'defaultMobile.jpeg'; // Remplacez par le chemin de l'image par défaut pour les cartes en version mobile
            }

            displayAlbumImages(defaultMiniature, defaultImage);
        }
    });



    //MON CODE


    // BARRE DE RECHERCHE AVEC FILTRES

    // Écouteur d'événement pour le bouton de recherche
    document.getElementById('searchButton').addEventListener('click', function () {
        const radioByAlbum = document.getElementById('ChoixTwo');
        const radioByAuteur = document.getElementById('ChoixOne');
        const radioBySerie = document.getElementById('ChoixThree');
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const resultsContainer = document.getElementById('results');

        // Efface les résultats précédents
        resultsContainer.innerHTML = '';

        // Recherche en fonction du critère sélectionné
        if (radioByAlbum.checked) {
            console.log("Recherche par album");
            searchByAlbum(searchInput);
        } else if (radioByAuteur.checked) {
            console.log("Recherche par auteur");
            searchByAuteur(searchInput);
        } else if (radioBySerie.checked) {
            console.log("Recherche par série");
            searchBySerie(searchInput);
        } else {
            console.log("Veuillez sélectionner un critère de recherche.");
        }
    });

    // Fonction pour la recherche par album
    function searchByAlbum(searchInput) {
        albums.forEach(album => {
            if (album.titre.toLowerCase().includes(searchInput)) {
                displayResult(album);
            }
        });
    }

    // Fonction pour la recherche par auteur
    function searchByAuteur(searchInput) {
        for (let [idAuteur, auteur] of auteurs.entries()) {
            for (let [idAlbum, album] of albums.entries()) {
                if (album.idAuteur == idAuteur && auteur.nom.toLowerCase().includes(searchInput)) {
                    displayResult(album);
                }
            }
        }
    }

    // Fonction pour la recherche par série
    function searchBySerie(searchInput) {
        for (let [idSerie, serie] of series.entries()) {
            for (let [idAlbum, album] of albums.entries()) {
                if (album.idSerie == idSerie && album.titre.toLowerCase().includes(searchInput)) {
                    console.log(serie.nom + ", Album N°" + album.numero + " " + album.titre + ", Auteur:" + auteurs.get(album.idAuteur).nom);
                    displayResult(album);
                }
            }
        }
    }

    // AFFICHER LE RESULTAT DE LA RECHERCHE DANS UNE CARD
    function displayResult(album) {
        // Crée une card pour chaque résultat
        const card = document.createElement('div');
        card.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

        // Utilise l'id de la série pour obtenir le nom de la série
        let nomFic = series.get(album.idSerie).nom + "-" + album.numero + "-" + album.titre;

        // Définir le chemin vers l'image par défaut
        const srcImg = "images/noComicsMini.jpeg";

        // Crée l'image de la card
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = "albums/" + nomFic + ".jpg"; // Ajoute le nom du fichier et l'extension de l'image
        image.alt = 'Card image cap';

        // Gestionnaire d'événements pour l'erreur de chargement de l'image
        image.onerror = function () {
            // En cas d'erreur, charge l'image par défaut
            image.src = srcImg;
        };

        // Crée le corps de la card
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Crée le titre de la card
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = album.titre;

        // Crée les détails de la card
        const details = document.createElement('p');
        details.classList.add('card-text');
        details.textContent = `N°${album.numero}, Série: ${series.get(album.idSerie).nom}, Auteur: ${auteurs.get(album.idAuteur).nom}`;

        // Crée les boutons "Ajouter au panier" et "Retirer du panier"
        const addToCartButton = document.createElement('a');
        addToCartButton.classList.add('btn', 'addToCartButton');
        addToCartButton.textContent = 'Ajouter au panier';

        const removeFromCartButton = document.createElement('a');
        removeFromCartButton.classList.add('btn', 'removeFromCartButton');
        removeFromCartButton.textContent = 'Retirer du panier';

        // Ajout des écouteurs d'événements pour les boutons d'ajout et de retrait du panier
        addToCartButton.addEventListener('click', function () {
            addToCart(album.titre, album.prix); // Ajoute l'album au panier avec son nom et son prix
        });

        removeFromCartButton.addEventListener('click', function () {
            removeFromCart(album.titre, album.prix); // Retire l'album du panier avec son nom et son prix
        });

        // Ajoute les éléments à la card
        cardBody.appendChild(title);
        cardBody.appendChild(details);
        cardBody.appendChild(addToCartButton);
        cardBody.appendChild(removeFromCartButton);

        card.appendChild(image);
        card.appendChild(cardBody);

        // Ajoute la card à la zone de résultats
        document.getElementById('results').appendChild(card);
    }




    //FONCTION POUR AFFICHER LE MODE TABLEAU OU CARD SELON LA TAILLE DE L'ECRAN

    // Fonction pour mapper les albums à un tableau
    function mapToAlbumsArray(albumsMap) {
        const albumsArray = [];

        for (const [key, value] of albumsMap) {
            const album = {
                id: key,
                titre: value.titre,
                numero: value.numero,
                idSerie: value.idSerie,
                idAuteur: value.idAuteur,
                prix: parseFloat(value.prix)
            };
            albumsArray.push(album);
        }

        return albumsArray;
    }

    // Ajoutez une variable pour stocker la vue actuelle
    let currentView = ''; // Initialisez avec une chaîne vide

    // Fonction pour afficher les albums avec le format souhaité (tableau ou cartes) en fonction de la taille de l'écran
    async function displayAlbums(viewType) {
        const albumsArray = mapToAlbumsArray(albums);

        const container = viewType === 'cards' ? document.getElementById('result') : document.getElementById('albumTable');
        container.innerHTML = '';

        if (viewType === 'table') {
            displayAlbumsAsTableWithPagination(albumsArray, container); // Utilisation de la fonction correctement définie
        } else {
            displayAlbumsAsCardsWithPagination(albumsArray, container); // Utilisation de la fonction correctement définie
        }

        currentView = viewType; // Mettez à jour la vue actuelle

    }

    // Fonction pour détecter et afficher le format (tableau ou cartes) en fonction de la taille de l'écran
    function detectAndDisplayFormat() {
        const windowWidth = window.innerWidth;

        if (windowWidth < 800) {
            console.log("Petit écran");
            displayAlbums('cards');
        } else {
            console.log("Grand écran");
            displayAlbums('table');
        }
    }

    detectAndDisplayFormat(); // Appel initial pour déterminer le format de la fenêtre


    // FONCTION POUR AFFICHER LES ALBUMS SOUS FORME DE TABLEAU EN DESKTOP

    function displayAlbumsAsTableWithPagination(albumsData, container) {
        const itemsPerPage = 30; // Nombre d'éléments par page
        let currentPage = 1; // Page actuelle

        // Fonction pour afficher une page du tableau
        function displayTablePage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedAlbums = albumsData.slice(start, end);

            // Création du tableau HTML
            const tableContainer = document.createElement('div');
            tableContainer.classList.add('album-table-container');

            const table = document.createElement('table');
            table.classList.add('album-table');

            // Création de l'en-tête du tableau
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
            <th>Image</th>
            <th>Série</th>
            <th>Numéro</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Prix</th>
            <th>Ajouter au panier</th>
            <th>Retirer du panier</th>
        `;
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');

            // Remplissage des lignes du tableau avec les données des albums
            paginatedAlbums.forEach(album => {
                const row = document.createElement('tr');
                const imageCell = document.createElement('td');

                // Création du lien pour l'image correspondante avec les détails de l'album
                const imageLink = document.createElement('a');
                const albumImagePath = `albums/${series.get(album.idSerie).nom}-${album.numero}-${album.titre}.jpg`;
                const imageDetails = `./descriptifAlbum.html?details=${encodeURIComponent(JSON.stringify(album))}`;
                imageLink.href = imageDetails;

                const image = document.createElement('img');
                image.src = albumImagePath;
                image.alt = 'Image';
                image.style.width = '150px';
                image.style.height = 'auto';


                // Ajoutez ensuite cette ligne pour charger l'image par défaut si l'image de l'album n'est pas disponible
                image.onerror = function () {
                    image.src = defaultImage; // Utilisation de l'image par défaut pour l'album
                };

                image.src = albumImagePath; // Charge l'image de l'album
                imageLink.appendChild(image);
                imageCell.appendChild(imageLink);
                row.appendChild(imageCell);



                // Création des autres cellules pour les détails de l'album
                const otherCellsHTML = `
                <td>${album.idSerie}</td>
                <td>${album.numero}</td>
                <td>${album.titre}</td>
                <td>${album.idAuteur}</td>
                <td>${album.prix}€</td>
                `;

                row.innerHTML += otherCellsHTML;



                // Ajout de boutons pour ajouter et retirer des éléments du panier
                const addToCartCell = document.createElement('td');
                const addToCartButton = document.createElement('button');
                addToCartButton.classList.add('btn', 'addToCartButton');
                addToCartButton.textContent = 'Ajouter au panier';
                addToCartCell.appendChild(addToCartButton);
                row.appendChild(addToCartCell);

                const removeFromCartCell = document.createElement('td');
                const removeFromCartButton = document.createElement('button');
                removeFromCartButton.classList.add('btn', 'removeFromCartButton');
                removeFromCartButton.textContent = 'Retirer du panier';
                removeFromCartCell.appendChild(removeFromCartButton);
                row.appendChild(removeFromCartCell);

                // Gestion des événements pour les boutons d'ajout et de retrait du panier
                addToCartButton.addEventListener('click', function () {
                    addToCart(album.titre, album.prix);
                });

                removeFromCartButton.addEventListener('click', function () {
                    removeFromCart(album.titre, album.prix);
                });

                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);
            tableContainer.appendChild(table);
            container.innerHTML = '';
            container.appendChild(tableContainer);

            // Ajout des contrôles de pagination
            const pagination = document.createElement('ul');
            pagination.classList.add('pagination');

            const totalPages = Math.ceil(albumsData.length / itemsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('li');
                const pageLink = document.createElement('a');
                pageLink.textContent = i;
                pageButton.appendChild(pageLink);
                pagination.appendChild(pageButton);

                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    changeTablePage(i);
                });
            }

            container.innerHTML = '';
            container.appendChild(tableContainer);
            container.appendChild(pagination);
        }

        // Fonction pour changer de page dans le tableau
        function changeTablePage(page) {
            currentPage = page;
            displayTablePage(currentPage);
        }

        displayTablePage(currentPage);
    }

    // FONCTION POUR AFFICHER LES ALBUMS SOUS FORMES DE CARDS AVEC PAGINATION EN ECRAN REDUIT

    function displayAlbumsAsCardsWithPagination(albumsData, container) {
        const itemsPerPage = 15; // Nombre d'éléments par page
        let currentPage = 1; // Page actuelle

        // Fonction pour afficher une page de cartes
        function displayCardsPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedAlbums = albumsData.slice(start, end);

            // Création du conteneur de cartes
            const cardContainer = document.createElement('div');
            cardContainer.classList.add('card-container');

            // Création des cartes pour chaque album paginé
            paginatedAlbums.forEach(album => {
                const cardHTML = `
                <div class="card"> 
                <img src="albumsMini/${series.get(album.idSerie).nom}-${album.numero}-${album.titre}.jpg" class="card-img-top" alt="Image album">
                    <div class="card-body">
                        <h5 id="titre" class="card-title">${album.titre}</h5>
                        <p class="card-text">N°${album.numero}, Série: ${album.idSerie}, Auteur: ${album.idAuteur}</p>
                        <button class="btn addToCartButton">Ajouter au panier</button>
                        <button class="btn removeFromCartButton">Retirer du panier</button>
                    </div>
                </div>
            `;
                cardContainer.innerHTML += cardHTML;
            });

            container.innerHTML = '';
            container.appendChild(cardContainer);

            // Calcul du nombre total de pages
            const totalPages = Math.ceil(albumsData.length / itemsPerPage);

            // Création des boutons de pagination
            const pagination = document.createElement('ul');
            pagination.classList.add('pagination');

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('li');
                const pageLink = document.createElement('a');
                pageLink.textContent = i;
                pageLink.href = '#'; // Ajoute ton lien vers la page si nécessaire
                pageButton.appendChild(pageLink);
                pagination.appendChild(pageButton);

                if (i === currentPage) {
                    pageButton.classList.add('active');
                }

                pageLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    changeCardsPage(i);
                });
            }

            container.innerHTML = '';
            container.appendChild(cardContainer);
            container.appendChild(pagination);
        }

        // Fonction pour changer de page dans les cartes
        function changeCardsPage(page) {
            currentPage = page;
            displayCardsPage(currentPage);
        }

        displayCardsPage(currentPage);

        // Appel initial des fonctions de pagination
        window.addEventListener('resize', detectAndDisplayFormat);
    }




    // RECUPERATION DES PARAMETRES D'URL DU TABLEAU
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const detailsParam = urlParams.get('details');

    if (detailsParam) {
        // Décodage des données JSON
        const albumDetails = JSON.parse(decodeURIComponent(detailsParam));

        // Affichage des détails dans la page
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('album-details');

        const albumTitle = document.createElement('h2');
        albumTitle.textContent = albumDetails.titre;

        const albumImage = document.createElement('img');
        albumImage.src = `albums/${series.get(albumDetails.idSerie).nom}-${albumDetails.numero}-${albumDetails.titre}.jpg`;
        albumImage.alt = 'Image de l\'album';

        const albumDetailsList = document.createElement('ul');
        const seriesItem = document.createElement('li');
        seriesItem.textContent = `Série: ${albumDetails.idSerie}`;

        const numberItem = document.createElement('li');
        numberItem.textContent = `Numéro: ${albumDetails.numero}`;

        const authorItem = document.createElement('li');
        authorItem.textContent = `Auteur: ${albumDetails.idAuteur}`;

        const priceItem = document.createElement('li');
        priceItem.textContent = `Prix: ${albumDetails.prix}€`;

        albumDetailsList.appendChild(seriesItem);
        albumDetailsList.appendChild(numberItem);
        albumDetailsList.appendChild(authorItem);
        albumDetailsList.appendChild(priceItem);

        detailsContainer.appendChild(albumTitle);
        detailsContainer.appendChild(albumImage);
        detailsContainer.appendChild(albumDetailsList);

        // Affichage des détails dans la page HTML
        document.body.appendChild(detailsContainer);
    }


    // AJOUTER OU RETIRER UN ALBUM DU PANIER
    let cartItems = {}; // Stocke les éléments du panier

    // Fonction pour AJOUTER un album au panier
    function addToCart(titre, prix) {
        if (cartItems[titre]) {
            // Si l'album est déjà dans le panier, augmenter la quantité
            cartItems[titre].quantity++;
        } else {
            // Sinon, ajouter l'album avec une quantité de 1
            cartItems[titre] = { titre: titre, prix: prix, quantity: 1 };
        }
        updateCartDisplay(); // Met à jour l'affichage du panier
    }

    // Fonction pour RETIRER un album du panier
    function removeFromCart(titre, prix) {
        if (cartItems[titre]) {
            // Diminuer la quantité de l'album dans le panier
            cartItems[titre].quantity--;
            // Si la quantité devient 0, retirer l'album du panier
            if (cartItems[titre].quantity === 0) {
                delete cartItems[titre];
            }
            updateCartDisplay(); // Met à jour l'affichage du panier
        }
    }

    // Mise àjour du panier
    function updateCartDisplay() {
        const cartItemsList = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        // Réinitialise la liste des éléments du panier et le total
        cartItemsList.innerHTML = '';
        let total = 0;

        // Parcoure les éléments du panier et les ajoutent à la liste
        for (const itemKey in cartItems) {
            const item = cartItems[itemKey];
            const listItem = document.createElement('li');
            listItem.textContent = `${item.titre} - Quantité: ${item.quantity} - €${item.prix * item.quantity}`;
            cartItemsList.appendChild(listItem);
            total += item.prix * item.quantity; // Ajoute le prix total pour cet album
        }

        // Met à jour le total affiché
        cartTotal.textContent = total.toFixed(2); // Fixe le total à 2 décimales
    }



}

// Attend que le DOM soit chargé pour exécuter la fonction init
document.addEventListener('DOMContentLoaded', init);