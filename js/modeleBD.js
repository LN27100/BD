jQuery(document).ready(function ($) {
    const srcImg = "images/"; // emplacement des images de l'appli
    const albumDefaultMini = srcImg + "noComicsMini.jpeg";
    const albumDefault = srcImg + "noComics.jpeg";
    const srcAlbumMini = "albumsMini/"; // emplacement des images des albums en petit
    const srcAlbum = "albums/"; // emplacement des images des albums en grand


	// Affichage des BD
	var txtSerie = document.getElementById("serie");
	var txtNumero = document.getElementById("numero");
	var txtTitre = document.getElementById("titre");
	var txtAuteur = document.getElementById("auteur");
	var txtPrix = document.getElementById("prix");
	var imgAlbum = document.getElementById("album");
	var imgAlbumMini = document.getElementById("albumMini");

	imgAlbum.addEventListener("error", function () {
		prbImg(this)
	});

	imgAlbumMini.addEventListener("error", function () {
		prbImg(this)
	});

	var id = document.getElementById("id");
	id.addEventListener("change", function () {
		getAlbum(this)
	});


	/**
	 * Récupération de l'album par son id et appel de 
	 * la fonction d'affichage
	 * 
	 * @param {number} num 
	 */
	function getAlbum(num) {

		var album = albums.get(num.value);

		if (album === undefined) {
			txtSerie.value = "";
			txtNumero.value = "";
			txtTitre.value = "";
			txtAuteur.value = "";
			txtPrix.value = 0;

			afficheAlbums($("#albumMini"), $("#album"), albumDefaultMini, albumDefault);

		} else {

			var serie = series.get(album.idSerie);
			var auteur = auteurs.get(album.idAuteur);

			txtSerie.value = serie.nom;
			txtNumero.value = album.numero;
			txtTitre.value = album.titre;
			txtAuteur.value = auteur.nom;
			txtPrix.value = album.prix;

			var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;

			// Utilisation d'une expression régulière pour supprimer 
			// les caractères non autorisés dans les noms de fichiers : '!?.":$
			nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");

			afficheAlbums(
				$("#albumMini"),
				$("#album"),
				srcAlbumMini + nomFic + ".jpg",
				srcAlbum + nomFic + ".jpg"
			);

		}
	}

	/**
	 * Affichage des images, les effets sont chainés et traités
	 * en file d'attente par jQuery d'où les "stop()) et "clearQueue()" 
	 * pour éviter l'accumulation d'effets si défilement rapide des albums.
	 * 
	 * @param {object jQuery} $albumMini 
	 * @param {object jQuery} $album 
	 * @param {string} nomFic 
	 * @param {string} nomFicBig 
	 */
	function afficheAlbums($albumMini, $album, nomFicMini, nomFic) {
		$album.stop(true, true).clearQueue().fadeOut(100, function () {
			$album.attr('src', nomFic);
			$albumMini.stop(true, true).clearQueue().fadeOut(150, function () {
				$albumMini.attr('src', nomFicMini);
				$albumMini.slideDown(200, function () {
					$album.slideDown(200);
				});
			})
		});


	}

	/**
	 * Affichage de l'image par défaut si le chargement de l'image de l'album
	 * ne s'est pas bien passé
	 * 
	 * @param {object HTML} element 
	 */
	function prbImg(element) {
		// console.log(element);
		if (element.id === "albumMini")
			element.src = albumDefaultMini;
		else element.src = albumDefault;

	}

});


// AJOUTER OU RETIRER UN ALBUM DU PANIER

document.addEventListener("DOMContentLoaded", function() {
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
        button.addEventListener('click', function(event) {
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
        button.addEventListener('click', function(event) {
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
for(let [idSerie, serie] of series.entries()) {
	for (let [idAlbum, album] of albums.entries()) {
		if (album.idSerie == idSerie && album.titre.toLowerCase().includes(searchInput)) {
			console.log(serie.nom+", Album N°"+album.numero+" "+album.titre+", Auteur:"+auteurs.get(album.idAuteur).nom);
			displayResult(album);
		}
	}
}}



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



