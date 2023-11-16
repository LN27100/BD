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
			// Si les détails ne sont pas disponibles, affiche les images par défaut
			clearAlbumDetails();
			afficheAlbums(imgAlbumMini, imgAlbum, srcAlbumMini + 'defaultMini.jpeg', srcAlbum + 'default.jpeg');
		} else {
			// Si les détails sont disponibles, affiche les détails et les images correspondantes
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

document.addEventListener("DOMContentLoaded", function () {
	// Fonction pour ajouter un album au panier avec son prix
	function addToCart(albumName, albumPrice) {
		const cartItems = document.getElementById('cartItems');
		const cartTotal = document.getElementById('cartTotal');

		// Créer un nouvel élément li pour l'album ajouté
		const newItem = document.createElement('li');
		newItem.textContent = `${albumName} - Prix : ${albumPrice}$`; // Afficher le nom de l'album et son prix

		// Ajouter l'album à la liste du panier
		cartItems.appendChild(newItem);

		// Mettre à jour le total du panier avec le prix de l'album
		let currentTotal = parseFloat(cartTotal.textContent) || 0; // Utiliser parseFloat pour gérer les prix décimaux
		currentTotal += albumPrice;
		cartTotal.textContent = currentTotal.toFixed(2); // Mettre à jour le total avec le prix de l'album (arrondi à 2 décimales)

		// Afficher un message de confirmation (vous pouvez personnaliser cela)
		alert(`L'album "${albumName}" a été ajouté au panier pour ${albumPrice}$.`);
	}

	// Fonction pour retirer un album du panier avec son prix
	function removeFromCart(albumName, albumPrice) {
		const cartItems = document.getElementById('cartItems');
		const cartTotal = document.getElementById('cartTotal');
		const items = cartItems.getElementsByTagName('li');

		// Parcourir les éléments du panier pour trouver et retirer l'album correspondant
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.textContent.includes(albumName)) {
				const itemPrice = parseFloat(item.textContent.match(/Prix : (\d+\.\d+)/)[1]);
				cartItems.removeChild(item); // Retirer l'élément correspondant de la liste du panier
				// Mettre à jour le total du panier en retirant le prix de l'album retiré
				let currentTotal = parseFloat(cartTotal.textContent) || 0;
				currentTotal -= itemPrice;
				cartTotal.textContent = currentTotal.toFixed(2);
				// Afficher un message de confirmation (vous pouvez personnaliser cela)
				alert(`L'album "${albumName}" a été retiré du panier.`);
				return; // Arrêter la boucle après avoir retiré l'album
			}
		}
		// Si l'album n'est pas trouvé dans le panier
		alert(`L'album "${albumName}" n'est pas dans le panier.`);
	}

	// Sélection de tous les boutons avec la classe "addToCartButton"
	const addToCartButtons = document.querySelectorAll('.addToCartButton');

	// Ajout d'un écouteur d'événements pour chaque bouton "Ajouter au panier"
	addToCartButtons.forEach(button => {
		button.addEventListener('click', function (event) {
			// Récupération de la carte parente du bouton cliqué
			const card = event.target.closest('.card');

			// Récupération du nom et du prix de l'album à partir de la carte
			const albumName = card.querySelector('#titre').value;
			const albumPrice = parseFloat(card.querySelector('#prix').value) || 0;

			// Appel de la fonction d'ajout au panier avec le nom et le prix de l'album
			if (albumPrice > 0) {
				addToCart(albumName, albumPrice);
			} else {
				alert('Prix invalide pour cet album.');
			}
		});
	});

	// Sélection de tous les boutons "Retirer du panier"
	const removeFromCartButtons = document.querySelectorAll('.removeFromCartButton');

	// Ajout d'un écouteur d'événements pour chaque bouton "Retirer du panier"
	removeFromCartButtons.forEach(button => {
		button.addEventListener('click', function (event) {
			// Récupération de la carte parente du bouton cliqué
			const card = event.target.closest('.card');

			// Récupération du nom et du prix de l'album à partir de la carte
			const albumName = card.querySelector('#titre').value;
			const albumPrice = parseFloat(card.querySelector('#prix').value) || 0;

			// Appel de la fonction de retrait du panier avec le nom et le prix de l'album
			if (albumPrice > 0) {
				removeFromCart(albumName, albumPrice);
			} else {
				alert('Prix invalide pour cet album.');
			}
		});
	});
});

//BARRE DE RECHERCHE AVEC FILTRES

// // Écouteur d'événement pour le bouton de recherche
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

	// Crée l'image de la card
	const image = document.createElement('img');
	image.classList.add('card-img-top');
	image.src = "albums/" + nomFic + ".jpg"; // Ajoute le nom du fichier et l'extension de l'image
	image.alt = 'Card image cap';

	// Ajoute l'image à la card
	card.appendChild(image);

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

	// Ajoute les éléments à la card
	cardBody.appendChild(title);
	cardBody.appendChild(details);

	card.appendChild(image);
	card.appendChild(cardBody);

	// Ajoute la card à la zone de résultats
	document.getElementById('results').appendChild(card);
}



