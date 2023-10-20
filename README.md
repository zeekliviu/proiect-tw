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
