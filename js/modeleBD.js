jQuery(document).ready(function ($) {
	const srcImg = "images/"; // emplacement des images de l'appli
	const albumDefaultMini = srcImg + "noComicsMini.jpeg";
	const albumDefault = srcImg + "noComics.jpeg";
	const srcAlbumMini = "albumsMini/"; // emplacement des images des albums en petit
	const srcAlbum = "albums/"; // emplacement des images des albums en grand

	


	// console.log("Liste des albums");
	// albums.forEach(album => {
	// 	serie = series.get(album.idSerie);
	// 	auteur = auteurs.get(album.idAuteur);
	// 	console.log(album.titre+" N°"+album.numero+" Série:"+serie.nom+" Auteur:"+auteur.nom);
	// });


	// console.log("Liste des albums par série");
	// for(let [idSerie, serie] of series.entries()) {
	// 	// Recherche des albums de la série
	// 	for (let [idAlbum, album] of albums.entries()) {
	// 		if (album.idSerie == idSerie) {
	// 			console.log(serie.nom+", Album N°"+album.numero+" "+album.titre+", Auteur:"+auteurs.get(album.idAuteur).nom);
	// 		}
	// 	}
	// }


	// console.log("Liste des albums par auteur");
	// for(let [idAuteur, auteur] of auteurs.entries()) {
	// 	// Recherche des albums de l'auteur
	// 	for (let [idAlbum, album] of albums.entries()) {
	// 		if (album.idAuteur == idAuteur) {
	// 			console.log(auteur.nom+", Album N°"+album.numero+" "+album.titre+", Série:"+series.get(album.idSerie).nom);
	// 		}
	// 	}  
	// }



	// AFFIHAGE DES BD
	let txtSerie = document.getElementById("serie");
	let txtNumero = document.getElementById("numero");
	let txtTitre = document.getElementById("titre");
	let txtAuteur = document.getElementById("auteur");
	let txtPrix = document.getElementById("prix");
	let imgAlbum = document.getElementById("album");
	let imgAlbumMini = document.getElementById("albumMini");

	imgAlbum.addEventListener("error", function () {
		prbImg(this)
	});

	imgAlbumMini.addEventListener("error", function () {
		prbImg(this)
	});

	let id = document.getElementById("id");
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

		let album = albums.get(num.value);

		if (album === undefined) {
			txtSerie.value = "";
			txtNumero.value = "";
			txtTitre.value = "";
			txtAuteur.value = "";
			txtPrix.value = 0;

			afficheAlbums($("#albumMini"), $("#album"), albumDefaultMini, albumDefault);

		} else {

			let serie = series.get(album.idSerie);
			let auteur = auteurs.get(album.idAuteur);

			txtSerie.value = serie.nom;
			txtNumero.value = album.numero;
			txtTitre.value = album.titre;
			txtAuteur.value = auteur.nom;
			txtPrix.value = album.prix;

			let nomFic = serie.nom + "-" + album.numero + "-" + album.titre;

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
	series.forEach(serie => {
		albums.forEach(album => {
			if (album.idSerie === serie.id && serie.nom.toLowerCase().includes(searchInput)) {
				displayResult(album);
			}
		});
	});
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



// Ajouter au panier ou retirer du panier
// Attend que le document soit chargé avant d'exécuter le code jQuery
// jQuery(document).ready(function ($) {

//     // Déclaration des chemins des images par défaut
//     const srcImg = "images/";
//     const albumDefaultMini = srcImg + "noComicsMini.jpeg";
//     const albumDefault = srcImg + "noComics.jpeg";

//     const srcAlbumMini = "albumsMini/";
//     const srcAlbum = "albums/";

//     // Sélection des boutons "Ajouter au panier" et "Retirer du panier"
//     const addToCartButton = $(".btn:contains('Ajouter au panier')");
//     const remFromCartButton = $(".btn:contains('Retirer du panier')");

//     // Ajout des gestionnaires d'événements pour les boutons
//     addToCartButton.click(function () {
//         addToCart();
//     });

//     remFromCartButton.click(function () {
//         remFromCart();
//     });

//     // Sélection des éléments HTML à mettre à jour
//     const txtSerie = $("#serie");
//     const txtNumero = $("#numero");
//     const txtTitre = $("#titre");
//     const txtAuteur = $("#auteur");
//     const txtPrix = $("#prix");
//     const imgAlbum = $("#album");
//     const imgAlbumMini = $("#albumMini");
//     const idInput = $("#id");

//     // Gestionnaire d'erreur pour les images
//     imgAlbum.on("error", function () {
//         handleImageError(this);
//     });

//     imgAlbumMini.on("error", function () {
//         handleImageError(this);
//     });

//     // Gestionnaire de changement d'ID
//     idInput.on("change", function () {
//         getAlbum(this);
//     });

//     // Fonction pour récupérer les détails de l'album par son ID
//     function getAlbum(input) {
//         const album = albums.get(input.val());

//         if (album === undefined) {
//             clearAlbumDetails();
//             displayAlbums(imgAlbumMini, imgAlbum, albumDefaultMini, albumDefault);
//         } else {
//             const serie = series.get(album.idSerie);
//             const auteur = auteurs.get(album.idAuteur);

//             txtSerie.val(serie.nom);
//             txtNumero.val(album.numero);
//             txtTitre.val(album.titre);
//             txtAuteur.val(auteur.nom);
//             txtPrix.val(album.prix);

//             const nomFic = serie.nom + "-" + album.numero + "-" + album.titre;
//             const sanitizedNomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");

//             displayAlbums(
//                 imgAlbumMini,
//                 imgAlbum,
//                 srcAlbumMini + NomFic + ".jpg",
//                 srcAlbum + NomFic + ".jpg"
//             );
//         }
//     }

//     // Fonction pour effacer les détails de l'album
//     function clearAlbumDetails() {
//         txtSerie.val("");
//         txtNumero.val("");
//         txtTitre.val("");
//         txtAuteur.val("");
//         txtPrix.val(0);
//     }

//     // Fonction pour afficher les images de l'album
//     function displayAlbums($albumMini, $album, nomFicMini, nomFic) {
//         $album.stop(true, true).clearQueue().fadeOut(100, function () {
//             $album.attr('src', nomFic);
//             $albumMini.stop(true, true).clearQueue().fadeOut(150, function () {
//                 $albumMini.attr('src', nomFicMini);
//                 $albumMini.slideDown(200, function () {
//                     $album.slideDown(200);
//                 });
//             })
//         });
//     }

//     // Gestionnaire d'erreur pour les images
//     function handleImageError(element) {
//         const defaultImage = element.id === "albumMini" ? albumDefaultMini : albumDefault;
//         element.src = defaultImage;
//     }

//     // Fonction pour ajouter un album au panier
//     function addToCart() {
//         const id = idInput.val();
//         // Ajouter la logique réelle pour ajouter au panier avec l'ID de l'album
//         // (Remplacez cette ligne par la logique réelle que vous souhaitez exécuter)
//     }

//     // Fonction pour retirer un album du panier
//     function remFromCart() {
//         const id = idInput.val();
//         // Ajouter la logique réelle pour retirer du panier avec l'ID de l'album
//         // (Remplacez cette ligne par la logique réelle que vous souhaitez exécuter)
//     }
// });