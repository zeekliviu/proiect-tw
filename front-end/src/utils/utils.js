export const esteTrecut = (livrabil) => {
  const dataCurenta = new Date();
  dataCurenta.setHours(0, 0, 0, 0);
  const dataLivrabil = new Date(livrabil.date);
  dataLivrabil.setHours(0, 0, 0, 0);
  return dataCurenta > dataLivrabil;
};
export const esteViitor = (livrabil) => {
  const dataCurenta = new Date();
  dataCurenta.setHours(0, 0, 0, 0);
  const dataLivrabil = new Date(livrabil.date);
  dataLivrabil.setHours(0, 0, 0, 0);
  return dataCurenta < dataLivrabil;
};
export const estePrezent = (livrabil) => {
  const dataCurenta = new Date();
  dataCurenta.setHours(0, 0, 0, 0);
  const dataLivrabil = new Date(livrabil.date);
  dataLivrabil.setHours(0, 0, 0, 0);
  return dataCurenta.getTime() === dataLivrabil.getTime();
};
