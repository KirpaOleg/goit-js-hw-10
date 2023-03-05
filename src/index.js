import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputTextEl = document.querySelector('input');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputTextEl.addEventListener('input', debounce(serchByInput, DEBOUNCE_DELAY));

function serchByInput(event) {
  const countryNameInput = event.target.value.trim();
  clearCountryInfo('', '');
  if (!countryNameInput) {
    return;
  }

  fetchCountries(countryNameInput)
    .then(coutriesApi => {
      if (coutriesApi.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryInfo('', '');
        return;
      } else if (coutriesApi.length > 1 && coutriesApi.length <= 10) {
        const markupCountryListApi = coutriesApi.map(country =>
          countryList(country)
        );
        clearCountryInfo(markupCountryListApi.join(''), '');
      } else {
        const markupCountryCardApi = coutriesApi.map(country =>
          countryCard(country)
        );
        clearCountryInfo('', markupCountryCardApi.join(''));
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearCountryInfo('', '');
      return error;
    });
}

function clearCountryInfo(list, info) {
  countryListEl.innerHTML = list;
  countryInfoEl.innerHTML = info;
}

function countryList({ flags, name }) {
  return `
    <li class="country-list__item">
      <img class="country-list__flags" src="${flags.svg}" alt="${name.official}">
      <h2 class="country-list__name">${name.official}</h2>
    </li>
    `;
}

function countryCard({ flags, name, capital, population, languages }) {
  return `
    <div class="country-info__card">
      <div class="country-info__box">
        <img class="country-info__flag" src="${flags.svg}" alt="${
    name.official
  }">
        <h2 class="country-info__name">${name.official}</h2>
      </div>
      <p class="country-info__text"><span style=font-weight:bold;>Capital:</span> ${capital}</p>
      <p class="country-info__text"><span style=font-weight:bold;>Population:</span> ${population}</p>
      <p class="country-info__text"><span style=font-weight:bold;>Languages:</span> ${Object.values(
        languages
      )}</p>
    </div>
    `;
}
