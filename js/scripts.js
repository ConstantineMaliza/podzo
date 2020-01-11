const APIKEY = '7d144944ce7438250b8307cd10f3cbf4';

const numbFound = document.querySelector('#numb-found');
const restosOutput = document.querySelector('#restos-list');
const searchForm = document.querySelector('#search-form');

const getCityDets = async location => {
    const res = await fetch(`https://developers.zomato.com/api/v2.1/locations?q=${location}`, {
            headers: {
                'user-key': APIKEY
            }
        });
    const data = await res.json();
    
    return(data.location_suggestions[0]);
}

const getRestaurantsIn = async location => {
    const { entity_type, entity_id} = await getCityDets(location);

    const res = await fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=${entity_id}&entity_type=${entity_type}`, {
            headers: {
                'user-key': APIKEY
            }
        });
    const data = await res.json();
    numbFound.textContent = data.results_found;
    return data.restaurants.map(resto => resto.restaurant);
}

const disp_restos = async location => {
    const restos = await getRestaurantsIn(location);
    let html = '';

    restos.forEach(resto => {

        html += resto.featured_image.length ? `
        <div class="col-12 col-lg-3">
        <div class="card" style="width: 18rem;">
            <div class="thumbnail">
                <img src="${resto.featured_image}" class="card-img-top" alt="food">
            </div>
            <div class="card-body row">
                <div class="col-sm-3">
                    <img src="${resto.thumb}" class="img-responsive">
                </div>
                <div class="col-sm-8 ml-3 mt-2">
                    <h5><b>${resto.name}</b></h5>
                    <p class="card-text text-dark-gray">${resto.location.locality_verbose}</p>
                </div>
                </div>
            </div>
        </div>
        ` :
        `
        <div class="col-12 col-lg-3">
        <div class="card" style="width: 18rem;">
            <div class="thumbnail">
                <img src="./Assets/food.png" class="card-img-top" alt="food">
            </div>
            <div class="card-body row">
                <div class="col-sm-3">
                    <img src="./Assets/restaurant.png" class="img-responsive">
                </div>
                <div class="col-sm-8 ml-3 mt-2">
                    <h5><b>${resto.name}</b></h5>
                    <p class="card-text text-dark-gray">${resto.location.locality_verbose}</p>
                </div>
                </div>
            </div>
        </div>
        `
    });

    restosOutput.innerHTML += html;

}


searchForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const query = searchForm.query.value;
    
    disp_restos(query);

});