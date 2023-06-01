const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZmQ2OTNjYzEwNjdhNGI1NzcxYzJjOGI0YTJlNzJjOCIsInN1YiI6IjY0NzA4ZWExYzVhZGE1MDBmYjcyYTE1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jmSIWUTekJ4ECS8onLQDDKlfcYm6kDJbtxgwVEsrAZA",
  },
};

//DOM 제어 이벤트리스너 사용1. 모든 컨텐츠들이 불러져왔을 때 listing 함수 실행.
document.addEventListener("DOMContentLoaded", function () {
  listing();
});

function listing() {
  fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Not Loaded.");
      }
    })
    .then(function (data) {
      let movies = data.results;

      let searchButton = document.getElementById("search-button");
      let searchInput = document.getElementById("search-input");

      //클릭 이벤트 함수 실수로 스페이스바 누르거나 공백값 들어갔을경우 제거하기위해 trim
      searchButton.addEventListener("click", function () {
        performSearch(movies, searchInput.value.trim());
      });

      //키 입력 이벤트 함수
      searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          performSearch(movies, searchInput.value.trim());
        }
      });
      displayMovies(movies);
    });
}

function displayMovies(movies) {
  let cardsBox = document.getElementById("cards-box");
  cardsBox.innerHTML = "";

  //배열 메소드2 forEach, 화살표 함수 사용
  movies.forEach((movie) => {
    let id = movie.id;
    let title = movie.title;
    let image = movie.poster_path;
    let desc = movie.overview;
    let score = movie.vote_average;

    //DOM 문서 객체 생성
    let card = document.createElement("div");
    card.className = "col";

    let temp_html = `
        <div class="card h-100"> 
        <img src="https://image.tmdb.org/t/p/w500${image}"
         class="card-img-top"> 
          <div class="card-body"> 
            ${title}<h5 class="card-title> 
        </h5> 
          <p class="card-text">${desc} </p> 
        <p> ${score}</p> 
          </div> 
        </div>`;

    //eventLister 하나 사용 DOM 제어 api 사용3. 익명함수로서 forEach로 가져온 값 참조
    card.addEventListener("click", function () {
      alert("ID: " + id);
    });

    card.innerHTML = temp_html;
    cardsBox.appendChild(card);
  });
}

function performSearch(movies, Search) {
  let loading = document.getElementById("loading");
  loading.style.display = "block";

  //배열 메소드1 filter, 화살표 함수 사용, toLowerCase는 대소문자 구분없이 입력받기 위해서 사용
  //검색어에 따라서 필터링된 movie배열을 frlteredMovies라는 새로운 배열에 저장
  let filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(Search.toLowerCase())
  );
  setTimeout(function () {
    displayMovies(filteredMovies);
    loading.style.display = "none";
  }, 500);
}

//검색이벤트 핸들 함수
function handleSearch(event) {
  //(이벤트)새로고침 방지 안해주면 0.1초 필터링 값 보여주고 초기화 됨
  event.preventDefault();
  let searchInput = document.getElementById("search-input");
  let Search = searchInput.value.trim();
  if (Search !== "") {
    performSearch(movies, Search);
  } else {
    alert("검색어를 입력해주세요");
  }
}
