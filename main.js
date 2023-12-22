import { Kontakt } from "./modules/Kontakt.js";

const provjImena = /^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,}){1,}$/;
const provjTel = /^0(1|2|3|6)[0-9]\/[0-9]{3}-[0-9]{3,4}$/;

document.querySelector("#dodaj").addEventListener("click", dodajIKreiraj);

function dodajIKreiraj(e) {
  e.preventDefault();

  let ime = document.querySelector("#imePrezime").value;
  let tel = document.querySelector("#telefon").value;
  let imeError = document.querySelector("#imeError");
  let telError = document.querySelector("#telError");
  let dodajAcept = document.querySelector("#dodajAcept");

  if (imaIstiPodatak(ime, tel)) {
    //alert("Uneseni podaci već postoje!");
    dodajError.textContent = "Neki od unesenih podatak vec vec postoje";
    dodajAcept.textContent = "";

    return; // Prekini izvršavanje funkcije ako postoje isti podaci
  } else {
    if (provjImena.test(ime)) {
      imeError.textContent = ""; // Clear any existing error message
      if (provjTel.test(tel)) {
        telError.textContent = ""; // Clear any existing error message

        const noviKontakt = new Kontakt(ime, tel);

        dodajUTabelu(noviKontakt);

        sacuvajUKontakte(noviKontakt);

        document.querySelector("#imePrezime").value = "";
        document.querySelector("#telefon").value = "";
        dodajAcept.textContent = "Uspjesno ste unijeli kontakt";
        dodajError.textContent = "";
      } else {
        telError.textContent = "Unesite ispravan broj telefona (064/222-444)"; // Display error message below the telephone input
      }
    } else {
      imeError.textContent = "Unesite ispravno ime i prezime"; // Display error message below the name input
    }
  }
}

function dodajUTabelu(kontakt) {
  const tabela = document.querySelector("#desni table");

  if (!tabela) {
    const tabelaDiv = document.querySelector("#desni");
    tabela = document.createElement("table");
    tabelaDiv.appendChild(tabela);

    const thNaziv = `<tr><th>Ime i prezime</th><th>Telefon</th><th>Brisi</th><th>Izmeni</th></tr>`;
    tabela.innerHTML = thNaziv;
  }

  const redovi = `<tr><td>${kontakt.ime}</td><td>${kontakt.broj}</td><td><button id="brisi" class="brisi">&#10060; Brisi</button></td><td><button id="izmeni" class="izmeni">&#x1F589; Izmeni</button></td></tr>`;
  tabela.innerHTML += redovi;
}

function sacuvajUKontakte(kontakt) {
  let kontakti = JSON.parse(localStorage.getItem("kontakti"));
  kontakti.push(kontakt);
  localStorage.setItem("kontakti", JSON.stringify(kontakti));
}

document.addEventListener("DOMContentLoaded", () => {
  const postojećiKontakti = JSON.parse(localStorage.getItem("kontakti"));
  postojećiKontakti.forEach((kontakt) => {
    dodajUTabelu(kontakt);
  });
});

function imaIstiPodatak(ime, telefon) {
  const postojećiKontakti = JSON.parse(localStorage.getItem("kontakti"));

  for (const kontakt of postojećiKontakti) {
    if (kontakt.ime == ime || kontakt.broj == telefon) {
      return true; // Pronađeni su isti podaci
    }
  }

  return false; // Nisu pronađeni isti podaci
}

document.querySelector("#desni").addEventListener("click", function (event) {
  if (event.target.classList.contains("brisi")) {
    const red = event.target.parentNode.parentNode; // Get the parent <tr> element
    const index = red.rowIndex - 1; // Adjust for the table header

    // Remove the row from the table
    red.remove();

    // Update localStorage by removing the deleted contact using splice
    const kontakti = JSON.parse(localStorage.getItem("kontakti"));
    kontakti.splice(index, 1); // Remove 1 element at the specified index
    localStorage.setItem("kontakti", JSON.stringify(kontakti));
  }
});



document.querySelector("#desni").addEventListener("click", function (event) {
  const target = event.target;

  if (target.classList.contains("brisi")) {
    // ... (existing code for deleting a contact)
  } else if (target.classList.contains("izmeni")) {
    // If the "IZMENI" button is clicked
    const red = target.parentNode.parentNode; // Get the parent <tr> element
    const index = red.rowIndex - 1; // Adjust for the table header

    // Get the contact data from localStorage
    const kontakti = JSON.parse(localStorage.getItem("kontakti"));
    const kontakt = kontakti[index];

    // Populate the form with the contact data
    document.querySelector("#imePrezime").value = kontakt.ime;
    document.querySelector("#telefon").value = kontakt.broj;

    // Remove the contact from localStorage
    kontakti.splice(index, 1);
    localStorage.setItem("kontakti", JSON.stringify(kontakti));

    // Update the UI by removing the row from the table
    red.remove();
  }
});


