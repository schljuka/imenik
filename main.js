import { Kontakt } from "./modules/Kontakt.js";

const provjImena = /^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,}){1,}$/;
const provjTel = /^0(1|2|3|6)[0-9]\/[0-9]{3}-[0-9]{3,4}$/;

document.querySelector(`#dodaj`).addEventListener("click", dodajIKreiraj);
document.querySelector(`#desni`).addEventListener("click", brisanjeIzmjena);

function dodajIKreiraj(e) {
  e.preventDefault();

  let ime = document.querySelector(`#imePrezime`).value;
  let tel = document.querySelector(`#telefon`).value; 
  let imeError = document.querySelector(`#imeError`);
  let telError = document.querySelector(`#telError`);
  let dodajAcept = document.querySelector(`#dodajAcept`);
  let dodajError = document.querySelector(`#dodajError`);

  if (istiBroj(tel)) {
    dodajError.textContent = "Uneseni broj telefona postoji u imeniku";
    dodajAcept.textContent = "";
    return;
  } else {
    if (provjImena.test(ime)) {
      imeError.textContent = "";
      if (provjTel.test(tel)) {
        telError.textContent = "";
        const noviKontakt = new Kontakt(ime, tel);

        dodajUTabelu(noviKontakt);
        sacuvajUKontakte(noviKontakt);

        document.querySelector("#imePrezime").value = "";
        document.querySelector("#telefon").value = "";
        dodajAcept.textContent = "Uspjesno ste unijeli kontakt";
        dodajError.textContent = "";
      } else {
        telError.textContent = "Unesite ispravan br telefona(npr 064/111-555)";
      }
    } else {
      imeError.textContent = "Unesite ispravno ime i prezime";
    }
  }
}

function dodajUTabelu(kontakt) {
  const tabela = document.querySelector(`#desni table`);

  if (!tabela) {
    const novaTabela = document.querySelector(`#desni`);
    novaTabela = document.createElement("table");
    novaTabela.appendChild(tabela);

    const thNaziv = `<tr>
        <th>Ime i prezime</th>
        <th>Telefon</th>
        <th>Brisi</th>
        <th>Izmeni</th>
        </tr>`;

    tabela.innerHtml = thNaziv;
  }

  const redovi = `<tr><td>${kontakt.imePrezime} </td> <td>${kontakt.broj}</td> <td> <button id="brisi" class="brisi">&#10060; Brisi</button></td>   <td> <button id="izmeni" class="izmeni">&#x1F589; Izmeni</button></td></tr>`;
  tabela.innerHTML += redovi;
}


function sacuvajUKontakte(kontakt) {
  let kontakti = JSON.parse(localStorage.getItem("kontakti")) || [];
  kontakti.push(kontakt);
  localStorage.setItem("kontakti", JSON.stringify(kontakti));
}


document.addEventListener("DOMContentLoaded", () => {
  let postojeciKontakti = JSON.parse(localStorage.getItem("kontakti"));
  if (!postojeciKontakti) {
    postojeciKontakti = [];
    localStorage.setItem("kontakti", JSON.stringify(postojeciKontakti));
  }
  postojeciKontakti.forEach((kontakt) => {
    dodajUTabelu(kontakt);
  });
});


function istiBroj(telefon) {
  let kontakti = JSON.parse(localStorage.getItem("kontakti")) || [];

  for (const kontakt of kontakti) {
    if (kontakt.broj == telefon) {
      return true;
    }
  }
  return false;
}


function brisanjeIzmjena(event) {
  const target = event.target;
  if (target.classList.contains("brisi")) {
    const red = event.target.parentNode.parentNode;
    const index = red.rowIndex - 1;
    red.remove();
    const kontakti = JSON.parse(localStorage.getItem("kontakti"));
    kontakti.splice(index, 1);
    localStorage.setItem("kontakti", JSON.stringify(kontakti));
  } else if (target.classList.contains("izmeni")) {
    const red = target.parentNode.parentNode;
    const index = red.rowIndex - 1;

    const kontakti = JSON.parse(localStorage.getItem("kontakti"));
    const kontakt = kontakti[index];

    document.querySelector(`#imePrezime`).value = kontakt.imePrezime;
    document.querySelector(`#telefon`).value = kontakt.broj;

    const dodajButton = document.querySelector(`#dodaj`);
    dodajButton.textContent = "IZMENI";

    dodajButton.removeEventListener("click", dodajIKreiraj);

    dodajButton.addEventListener("click", function (e) {
      e.preventDefault();

      const novoImePrezime = document.querySelector(`#imePrezime`).value;
      const noviBroj = document.querySelector(`#telefon`).value;

      kontakt.imePrezime = novoImePrezime;
      kontakt.broj = noviBroj;

      localStorage.setItem("kontakti", JSON.stringify(kontakti));

      document.querySelector(`#imePrezime`).value = "";
      document.querySelector(`#telefon`).value = "";

      dodajButton.textContent = "DODAJ";
      dodajButton.removeEventListener("click", dodajIKreiraj);
      dodajButton.addEventListener("click", dodajIKreiraj);
      location.reload();
    });
  }
}
