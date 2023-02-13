const listaMarcas = [
  { marca: "Volkswagen", modelo: "Gol", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Polo", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Saveiro", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Amarok", tasa: 1.5 },
  { marca: "Fiat", modelo: "Argo", tasa: 2 },
  { marca: "Fiat", modelo: "Palio", tasa: 2 },
  { marca: "Fiat", modelo: "Cronos", tasa: 2 },
  { marca: "Fiat", modelo: "Punto", tasa: 2 },
  { marca: "Honda", modelo: "Fit", tasa: 0.8 },
  { marca: "Honda", modelo: "Civic", tasa: 0.8 },
  { marca: "Honda", modelo: "City", tasa: 0.8 },
  { marca: "Honda", modelo: "CRV", tasa: 0.8 },
  { marca: "Toyota", modelo: "Corolla", tasa: 1 },
  { marca: "Toyota", modelo: "Yaris", tasa: 1 },
  { marca: "Toyota", modelo: "Hilux", tasa: 1 },
  { marca: "Toyota", modelo: "Etios", tasa: 1 },
  { marca: "Toyota", modelo: "SW4", tasa: 1 },
  { marca: "Peugeot", modelo: "207", tasa: 2.5 },
  { marca: "Peugeot", modelo: "208", tasa: 2.5 },
  { marca: "Peugeot", modelo: "308", tasa: 2.5 },
  { marca: "Peugeot", modelo: "408", tasa: 2.5 },
];

let arraySoloMarcas = listaMarcas.map(valor => valor.marca);
console.log(arraySoloMarcas);

let marcasSinDuplicados = listaMarcas.filter((item, index) => {
  return listaMarcas.indexOf(item.marca) === index;
});

console.log(marcasSinDuplicados);
