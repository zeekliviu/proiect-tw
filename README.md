# Aplicație web pentru acordarea anonimă de note

## Obiectiv

Realizarea unei aplicații web care să permită acordarea de punctaje anonime de către un juriu anonim de studenți proiectului altor studenți.

## Descriere

Aplicația trebuie să permită acordarea unui punctaj unui proiect de către un juriu anonim de colegi.

Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive mobile sau tablete (considerând preferințele utilizatorului).

## Funcționalități (minime)

- Ca student membru în echipa unui proiect (MP) pot să îmi adaug un proiect și să definesc o serie de livrabile parțiale ale proiectului. La înscriere devin automat și parte din grupul de posibili evaluatori

* Ca MP pentru un livrabil parțial pot adăuga un video demonstrativ pentru proiect sau un link la un server unde poate fi accesat proiectul
* La data unui livrabil parțial, ca student care nu este MP pot fi selectat aleatoriu să fac parte din juriul unui proiect. Pot acorda o notă proiectului doar dacă am fost selectat în juriul pentru el.
* Nota la un proiect este anonimă, iar nota totală se calculează omițând cea mai mare și cea mai mică notă. Notele sunt de la 1-10 cu până la 2 cifre fracționare.
* Ca profesor, pot vedea evaluarea pentru fiecare proiect, fără a vedea însă identitatea membrilor juriului.
* Aplicația are și un sistem de permisiuni. Doar un membru al juriului poate să adauge/modifice note și doar notele lui pe o perioadă limitată de timp

---

# Template general

## [Obiectiv general]

Realizarea unei aplicații pe una dintre temele specificate, cu back-end RESTful care accesează date stocate într-o bază relațională pe baza unui API de persistenţă și date expuse de un serviciu extern și frontend SPA realizat cu un framework bazat pe componente.

## [Limitări tehnologice]

Front-end-ul trebuie realizat cu ajutorul unui framework bazat pe componente (React.js, care este acoperit în curs, sau Angular 2+, Vue.js)
Back-end-ul trebuie să aibă o interfață REST și să fie realizat în node.js
Stocarea se va face peste o bază relațională și accesul la baza se va face prin intermediul unui ORM
Codul trebuie versionat într-un repository git, cu commit incrementale cu descrieri clare

## [Stil și calitatea codului]

Aplicație reală, coerentă din punct de vedere al logicii de business
Codul trebuie să fie bine organizat, numele variabilelor trebuie să fie sugestive (și trebuie să se utilizeze un standard de numire oricare ar fi el e.g. camel case), codul trebuie să fie indentat pentru a fi ușor citibil
Codul trebuie documentat cu comentarii la fiecare clasa, funcție etc.
Aplicațiile care nu funcționeaza nu primesc punctaj. Se poate însă demonstra doar funcționarea back-end-ului sau a front-end-ului
Opțional: test coverage

## [Livrabile parțiale]

3 etape (livrare se face introducând un link la un repository într-un google form; cadrul didactic coordonator va fi invitat ca un contribuitor la repository) - nelivrarea la o etapă intermediară reduce punctajul maxim cu 10% (i.e. dacă punctajul maxim este de 5 puncte din nota finală livrarea direct la final implică un punctaj maxim de 4 puncte)

1. Specificații detaliate, planul de proiect, prezența unui proiect în git - N/A
1. Serviciu RESTful funcțional în repository + instrucţiuni de rulare - N/A
1. Aplicața completă - se livrează în ultimul seminariu (demo) - ultimul seminariu
