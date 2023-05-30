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
  //cardsBox에 cards-box ID값을 기준으로 요소 선택 DOM제어 api 사용 2
  let cardsBox = document.getElementById("cards-box");
  // //cardsBox에 리스팅 된 새로운 card들이 들어오기 전에 초기화
  // cardsBox.innerHTML = "";

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
      //배열을 복사한 이유 : 기존의 cards들에 영향을 주지 않기위해서
      let allMovies = [...movies];

      let searchButton = document.getElementById("search-button");
      let searchInput = document.getElementById("search-input");

      //클릭 이벤트 함수
      searchButton.addEventListener("click", function () {
        performSearch(movies, searchInput.value);
        // location.reload(); 새로고침효과 보완 필요
      });

      //키 입력 이벤트 함수
      searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          performSearch(movies, searchInput.value);
        }
      });
      displayMovies(allMovies);
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
  //배열 메소드1 filter, 화살표 함수 사용, toLowerCase는 대소문자 구분없이 입력받기 위해서 사용
  //검색어에 따라서 필터링된 movie배열을 frlteredMovies라는 새로운 배열에 저장
  let filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(Search.toLowerCase())
  );
  displayMovies(filteredMovies);
  // window.location.reload(); 리로드효과 어캐줄지 찾는 중
}

//검색이벤트 핸들 함수
function handleSearch(event) {
  //(이벤트)새로고침 방지
  event.preventDefault();
  let searchInput = document.getElementById("search-input");
  //실수로 스페이스바 입력 할 수도 있으니 trim으로 공백 제거 후 값 가져오기
  let Search = searchInput.value.trim();
  if (Search !== "") {
    performSearch(movies, Search);
  }
}
