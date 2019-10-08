(function () {
  //==========A.HTML載入宣告區==========
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination');//取得分頁元素
  const ITEM_PER_PAGE = 12;
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //==========B.HTML產生區==========
  // displayDataList(data)
  getPageData(1, data);
  getTotalPages(data);
  //==========C.HTML產生後宣告區==========
  //==========D.動態執行區==========
  // listen to data panel
  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-movie")) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  });
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      console.log(event.target.dataset.page);
      getPageData(event.target.dataset.page, data);
    }
  });
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
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
  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie movie and update localStorage
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    // repaint dataList
    displayDataList(data)
  }
  function getPageData(pageNum, data) {
    // console.log("data");
    // console.log(data);
    // console.log("pageNum");
    // console.log(pageNum);

    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = data.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData);
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
    }//javascript:;
    pagination.innerHTML = pageItemContent;
  }

  //==========E.直譯區==========




})()