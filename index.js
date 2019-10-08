(function () {
  //==========A.HTML載入宣告區==========
  const BASE_URL = "https://movie-list.alphacamp.io";
  const INDEX_URL = BASE_URL + "/api/v1/movies/";
  const POSTER_URL = BASE_URL + "/posters/";
  const data = [];
  const dataPanel = document.getElementById("data-panel");
  const searchForm = document.getElementById("search");
  const searchInput = document.getElementById("search-input");
  const pagination = document.getElementById('pagination');//取得分頁元素
  const ITEM_PER_PAGE = 12;//每12部電影一頁
  const displayMode = document.getElementById("display-mode");
  let currentPage = 1;  //當前頁面
  let currentModel = false;  //當前顯示狀態 false表用card表示
  //==========B.HTML產生區==========
  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results);
      getTotalPages(data);
      getPageData(currentPage, data);       // add this
    })
    .catch(err => console.log(err));
  //==========C.HTML產生後宣告區==========
  //==========D.動態執行區==========
  //listen to display-mode 這裡是唯一控制顯示狀態的地方
  displayMode.addEventListener("click", event => {
    if (event.target.classList.contains("fa-th")) {
      currentModel = false;
    } else if (event.target.classList.contains("fa-bars")) {
      currentModel = true;
    }
    getPageData(currentPage, data);
  });
  // listen to search form submit event
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const regex = new RegExp(searchInput.value, "i");
    let results = [];
    results = data.filter(movie => movie.title.match(regex));
    console.log(results);
    getPageData(1, results);
    getTotalPages(results);
  });
  // listen to data panel
  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-movie")) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id);
      // console.log(event.target.dataset.id);
    }
  });
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      //console.log(event.target.dataset.page);
      getPageData(event.target.dataset.page, data);
    }
  });
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
  function displayDataList(data) {
    let htmlContent = "";
    if (currentModel) {
      data.forEach(function (item, index) {
        htmlContent += `
          <div class="container">
            <div class="row list py-3">
              <div class="col-sm-9 pt-2">  
                <h6>${item.title}</h6>
              </div>
              <div class="col-sm-3">
                <button class="btn btn-primary btn-show-movie mr-2" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `;
      });

    } else {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${
          item.image
          }" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${
          item.id
          }">More</button>
        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;
      });
    }
    dataPanel.innerHTML = htmlContent;
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById("show-movie-title");
    const modalImage = document.getElementById("show-movie-image");
    const modalDate = document.getElementById("show-movie-date");
    const modalDescription = document.getElementById("show-movie-description");

    // set request url
    const url = INDEX_URL + id;
    console.log(url);

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results;
      console.log(data);

      // insert data into modal ui
      modalTitle.textContent = data.title;
      modalImage.innerHTML = `<img src="${POSTER_URL}${
        data.image
        }" class="img-fluid" alt="Responsive image">`;
      modalDate.textContent = `release at : ${data.release_date}`;
      modalDescription.textContent = `${data.description}`;
    });
  }
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  function getPageData(pageNum, data) {
    currentPage = pageNum;
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = data.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})();
