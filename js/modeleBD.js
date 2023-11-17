// SUPPRESSION DU JQUERY DE BASE POUR UTILISER DES FONTIONS FULL JS
document.addEventListener('DOMContentLoaded', function () {
	// Définition des chemins vers les images par défaut et les répertoires d'images
	const srcImg = 'images/';
	const albumDefaultMini = srcImg + 'noComicsMini.jpeg';
	const albumDefault = srcImg + 'noComics.jpeg';
	const srcAlbumMini = 'albumsMini/';
	const srcAlbum = 'albums/';

	// Sélection des éléments du DOM
	const txtSerie = document.querySelector('#serie');
	const txtNumero = document.querySelector('#numero');
	const txtTitre = document.querySelector('#titre');
	const txtAuteur = document.querySelector('#auteur');
	const txtPrix = document.querySelector('#prix');
	const imgAlbum = document.querySelector('#album');
	const imgAlbumMini = document.querySelector('#albumMini');

	// Gestion des événements d'erreur pour les images
	imgAlbum.addEventListener('error', handleImageError);
	imgAlbumMini.addEventListener('error', handleImageError);

	const id = document.querySelector('#id');
	id.addEventListener('change', function () {
		getAlbum(this);
	});


	// Fonction pour obtenir les détails de l'album en fonction de son ID
	function getAlbum(num) {
		const albumId = num.value;

		const albumDetails = getAlbumDetails(albumId);
		if (!albumDetails) {
			// Si les détails sont disponibles, affiche les détails et les images correspondantes
			clearAlbumDetails();
			afficheAlbums(imgAlbumMini, imgAlbum, srcAlbumMini + 'defaultMini.jpeg', srcAlbum + 'default.jpeg');
		} else {
			// Si les détails ne sont pas disponibles, affiche les images par défaut

			const cheminImageMiniature = srcAlbumMini + albumDetails.imageMiniature;
			const cheminImageNormale = srcAlbum + albumDetails.imageNormale;

			displayAlbumDetails(albumDetails);
			afficheAlbums(imgAlbumMini, imgAlbum, cheminImageMiniature, cheminImageNormale);
		}
	}

	// Fonction pour afficher les détails de l'album dans les éléments de l'interface utilisateur
	function displayAlbumDetails(albumDetails) {
		txtSerie.value = albumDetails.serie;
		txtNumero.value = albumDetails.numero;
		txtTitre.value = albumDetails.titre;
		txtAuteur.value = albumDetails.auteur;
		txtPrix.value = albumDetails.prix;
	}

	// Fonction pour réinitialiser les champs de détails d'album
	function clearAlbumDetails() {
		txtSerie.value = '';
		txtNumero.value = '';
		txtTitre.value = '';
		txtAuteur.value = '';
		txtPrix.value = 0;
	}

	// Fonction pour afficher les images de l'album avec un effet de transition
	function afficheAlbums(albumMini, album, nomFicMini, nomFic) {
		albumMini.src = nomFicMini;
		album.src = nomFic;

		addTransitionEffect(albumMini);
		addTransitionEffect(album);
	}

	// Fonction pour ajouter un effet de transition à un élément spécifié
	function addTransitionEffect(element) {
		element.classList.add('transition-effect');
		setTimeout(() => {
			element.classList.remove('transition-effect');
		}, 1000);

	}

	function getAlbum(num) {
		const albumId = num.value;

		// Récupère les détails de l'album en utilisant son ID dans la collection d'albums
		const album = albums.get(albumId);

		// Si l'album n'est pas trouvé, efface les détails affichés et montre des images par défaut
		if (!album) {
			clearAlbumDetails();
			afficheAlbums(imgAlbumMini, imgAlbum, albumDefaultMini, albumDefault);

			// Si l'album est trouvé, récupère les détails de la série et de l'auteur associés à cet album
		} else {
			const serie = series.get(album.idSerie);
			const auteur = auteurs.get(album.idAuteur);

			// Met à jour les champs d'affichage avec les détails de l'album, de la série et de l'auteur
			txtSerie.value = serie.nom;
			txtNumero.value = album.numero;
			txtTitre.value = album.titre;
			txtAuteur.value = auteur.nom;
			txtPrix.value = album.prix;

			// Crée un nom de fichier pour les images de l'album en combinant les détails de l'album
			let nomFic = serie.nom + '-' + album.numero + '-' + album.titre;

			// Utilisation d'une expression régulière pour supprimer les caractères non autorisés dans les noms de fichiers : '!?.":$
			nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, '');

			// Affiche les images de l'album en utilisant les chemins appropriés basés sur le nom de fichier construit
			afficheAlbums(
				imgAlbumMini,
				imgAlbum,
				srcAlbumMini + nomFic + '.jpg',
				srcAlbum + nomFic + '.jpg'
			);
		}
	}

	// Fonction pour effacer les détails affichés de l'album
	function clearAlbumDetails() {
		txtSerie.value = '';
		txtNumero.value = '';
		txtTitre.value = '';
		txtAuteur.value = '';
		txtPrix.value = 0;
	}

	// Fonction pour gérer les erreurs d'image
	function handleImageError(img) {
		img.src = './noComics.jpeg';
		img.alt = 'Image non disponible';
		img.onerror = null;
	}
});




// AJOUTER OU RETIRER UN ALBUM DU PANIER

// Sélection des éléments du DOM pour le panier
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour AJOUTER un album au panier avec son prix
    function addToCart(albumName, albumPrice) {
        const newItem = document.createElement('li');
        newItem.textContent = `${albumName} - Prix : ${albumPrice}€`;

        cartItems.appendChild(newItem);

        let currentTotal = parseFloat(cartTotal.textContent) || 0;
        currentTotal += albumPrice;
        cartTotal.textContent = currentTotal.toFixed(2);
    }

    // Fonction pour RETIRER un article du panier avec son prix
    function removeFromCart(articleName, articlePrice) {
        const items = cartItems.getElementsByTagName('li');

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.textContent.includes(articleName)) {
                const itemPrice = parseFloat(item.textContent.match(/Prix : (\d+\.\d+)/)[1]);
                cartItems.removeChild(item);

                let currentTotal = parseFloat(cartTotal.textContent) || 0;
                currentTotal -= itemPrice;
                cartTotal.textContent = currentTotal.toFixed(2);
                return;
            }
        }
        alert(`L'album "${articleName}" n'est pas dans le panier.`);
    }

	
    // Sélection de tous les boutons avec la classe "addToCartButton"
    const addToCartButtons = document.querySelectorAll('.addToCartButton');

    // Ajout d'un écouteur d'événements pour chaque bouton "Ajouter au panier"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Récupération de la carte parente du bouton cliqué
            const card = event.target.closest('.card');

            // Récupération de l'élément correspondant au nom de l'album
            const albumNameElement = card.querySelector('#titre');

            // Vérification si l'élément existe avant d'accéder à sa valeur
            if (albumNameElement) {
                const albumName = albumNameElement.value;
                console.log(albumName);
                
                // Modification pour vérifier l'existence de l'élément #prix
                const prixElement = card.querySelector('#prix');
                if (prixElement) {
                    const albumPrice = parseFloat(prixElement.value) || 0;

                    // Appel de la fonction d'ajout au panier avec le nom et le prix de l'album
                    if (albumPrice > 0) {
                        addToCart(albumName, albumPrice);
                    } else {
                        alert('Prix invalide pour cet album.');
                    }
                } else {
                    console.error('L\'élément #prix est introuvable.');
                    // Gérer cette situation, comme afficher un message d'erreur ou prendre une autre action nécessaire.
                }
            } else {
                console.error('L\'élément #titre est introuvable.');
            }
        });
    });

});


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

// Appel initial de la fonction pour déterminer le format de la fenêtre
detectAndDisplayFormat();

// Écouteur d'événement pour détecter les changements de taille de fenêtre
window.addEventListener('resize', detectAndDisplayFormat);

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

async function displayAlbums(viewType) {
	const albumsArray = mapToAlbumsArray(albums);

	const container = viewType === 'cards' ? document.getElementById('result') : document.getElementById('albumTable');
	container.innerHTML = '';

	if (viewType === 'table') {
		displayAlbumsAsTable(albumsArray, container);
	} else {
		displayAlbumsAsCards(albumsArray, container);
	}
}

// Fonction pour afficher les albums sous forme de tableau
function displayAlbumsAsTable(albumsData, container) {
    // Crée un conteneur pour le tableau
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('album-table-container'); // Ajoute une classe pour le style

    // Crée un élément tableau
    const table = document.createElement('table');
    table.classList.add('album-table'); // Ajoute une classe pour le style

    // Crée l'en-tête du tableau
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    // Ajoute les titres des colonnes
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
    tableHeader.appendChild(headerRow); // Ajoute la ligne d'en-tête au tableau
    table.appendChild(tableHeader); // Ajoute l'en-tête au tableau

    // Crée le corps du tableau
    const tableBody = document.createElement('tbody');

    // Parcourt les données des albums pour créer les lignes du tableau
    albumsData.forEach(album => {
        const row = document.createElement('tr'); // Crée une ligne pour chaque album

        // Ajoute les données de l'album dans les cellules de la ligne
        row.innerHTML = `
            <td><img src="./albumsMini/${album.idSerie}-${album.numero}-${album.titre}.jpg" alt="Image"></td>
            <td>${album.idSerie}</td>
            <td>${album.numero}</td>
            <td>${album.titre}</td>
            <td>${album.idAuteur}</td>
            <td>${album.prix}€</td>
        `;

        // Crée des cellules pour les boutons "Ajouter au panier" et "Retirer du panier"
        const addToCartCell = document.createElement('td');
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('btn', 'addToCartButton');
        addToCartButton.textContent = 'Ajouter au panier';
        addToCartCell.appendChild(addToCartButton);
        row.appendChild(addToCartCell); // Ajoute le bouton "Ajouter au panier" à la ligne du tableau

        const removeFromCartCell = document.createElement('td');
        const removeFromCartButton = document.createElement('button');
        removeFromCartButton.classList.add('btn', 'removeFromCartButton');
        removeFromCartButton.textContent = 'Retirer du panier';
        removeFromCartCell.appendChild(removeFromCartButton);
        row.appendChild(removeFromCartCell); // Ajoute le bouton "Retirer du panier" à la ligne du tableau

        // Ajoute des écouteurs d'événements pour les boutons "Ajouter au panier" et "Retirer du panier"
        addToCartButton.addEventListener('click', function () {
            addToCart(album.titre, album.prix); // Appelle la fonction pour ajouter l'album au panier
        });

        removeFromCartButton.addEventListener('click', function () {
            removeFromCart(album.titre, album.prix); // Appelle la fonction pour retirer l'album du panier
        });

        tableBody.appendChild(row); // Ajoute la ligne au corps du tableau
    });

    table.appendChild(tableBody); // Ajoute le corps au tableau
    tableContainer.appendChild(table); // Ajoute le tableau dans le conteneur
    container.appendChild(tableContainer); // Ajoute le conteneur au conteneur principal
}

const tableBody = document.createElement('tbody');


// Fonction pour afficher les albums sous forme de cartes
function displayAlbumsAsCards(albumsData, container) {
    const cardContainer = document.createElement('div'); // Crée un conteneur pour les cartes

    albumsData.forEach(album => {
        const cardHTML = `
            <div class="card"> 
                <img src="./albumsMini/${album.idSerie}-${album.numero}-${album.titre}.jpg" class="card-img-top" alt="Image">
                <div class="card-body">
				<h5 id="titre" class="card-title">${album.titre}</h5>
				<p class="card-text">N°${album.numero}, Série: ${album.idSerie}, Auteur: ${album.idAuteur}</p>
                    <button class="btn addToCartButton">Ajouter au panier</button>
                    <button class="btn removeFromCartButton">Retirer du panier</button>
                </div>
            </div>
        `;

        cardContainer.innerHTML += cardHTML; // Ajoute le code HTML de la carte au conteneur
    });

    container.appendChild(cardContainer); // Ajoute toutes les cartes au conteneur principal
}
// FONCTION PAGINATION
