export const enhancedCarBrands = [
  {
    id: "br-audi",
    label: "Audi",
    logo: "https://www.carlogos.org/car-logos/audi-logo-2016-640.png",
    country: "Germany",
    category: "Luxury",
    popular: true,
    accentColor: "#000000"
  },
  {
    id: "br-bentley",
    label: "Bentley",
    logo: "https://www.carlogos.org/car-logos/bentley-logo-2002-640.png",
    country: "UK",
    category: "Luxury",
    popular: false,
    accentColor: "#1a1a1a"
  },
  {
    id: "br-bmw",
    label: "BMW",
    logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-gray.png",
    country: "Germany",
    category: "Luxury",
    popular: true,
    accentColor: "#0066b1"
  },
  {
    id: "br-chevrolet",
    label: "Chevrolet",
    logo: "https://www.carlogos.org/logo/Chevrolet-logo-2013-2560x1440.png",
    country: "USA",
    category: "Economy",
    popular: true,
    accentColor: "#c99a2e"
  },
  {
    id: "br-ferrari",
    label: "Ferrari",
    logo: "https://www.carlogos.org/car-logos/ferrari-logo-2002-640.png",
    country: "Italy",
    category: "Sport",
    popular: true,
    accentColor: "#ff2800"
  },
  {
    id: "br-ford",
    label: "Ford",
    logo: "https://www.carlogos.org/car-logos/ford-logo-2017-640.png",
    country: "USA",
    category: "Economy",
    popular: true,
    accentColor: "#003478"
  },
  {
    id: "br-lexus",
    label: "Lexus",
    logo: "https://www.carlogos.org/logo/Lexus-logo-1988-1920x1080.png",
    country: "Japan",
    category: "Luxury",
    popular: false,
    accentColor: "#555555"
  },
  {
    id: "br-mercedes",
    label: "Mercedes-Benz",
    logo: "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-1920x1080.png",
    country: "Germany",
    category: "Luxury",
    popular: true,
    accentColor: "#a4a4a4"
  },
  {
    id: "br-porsche",
    label: "Porsche",
    logo: "https://www.carlogos.org/car-logos/porsche-logo-2014-full-640.png",
    country: "Germany",
    category: "Sport",
    popular: true,
    accentColor: "#d51b20"
  },
  {
    id: "br-tesla",
    label: "Tesla",
    logo: "https://www.carlogos.org/car-logos/tesla-logo-2003-640.png",
    country: "USA",
    category: "Electric",
    popular: true,
    accentColor: "#e82127"
  }
];

// Fallback mapper so it doesn't break other screens that depend on 'carLogos' exact naming
export const carLogos = enhancedCarBrands.map(b => ({
  name: b.label,
  slug: b.label.toLowerCase().replace(/ /g, '-'),
  image: {
    source: b.logo
  }
}));
