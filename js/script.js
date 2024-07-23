var header = document.getElementById('header');

window.onscroll = function () {
	if (window.scrollY > 5) {
		header.className = 'header header--scroll';
	} else {
		header.className = 'header';
	}
};

function closePopup(id) {
	var popup = document.getElementById(id);
	popup.style.visibility = 'hidden';
	popup.style.opacity = 0;

	//remove hashtag target (#popup) from url
	history.pushState('', document.title, window.location.pathname + window.location.search);
}

function openPopup(id) {
	var popup = document.getElementById(id);
	popup.style.visibility = 'visible';
	popup.style.opacity = 1;
}

document.addEventListener('DOMContentLoaded', function () {
	var splideTeachers = new Splide('#splide-teachers', {
		type : 'loop',
		perPage: 3,
		focus: 0,
		omitEnd: true,
		arrows: false,
		flickPower: 400
	});
	splideTeachers.mount();

	var splideGallery = new Splide('#splide-gallery', {
		type : 'loop',
		perPage: 3,
		focus: 0,
		omitEnd: true,
		arrows: false,
		flickPower: 400
	});
	splideGallery.mount();

	var splideBlog = new Splide('#splide-blog', {
		type : 'loop',
		perPage: 3,
		focus: 0,
		omitEnd: true,
		arrows: false,
		flickPower: 400
	});
	splideBlog.mount();
});
