// src/mock_data/pros.ts
export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Pro = {
  id: string;
  name: string;
  age: number;
  trade: string;
  city: string;
  rating: number;
  reviewsCount: number;
  hourlyFrom: number;
  tags: string[];
  description: string;
  reviews: Review[];
};

export const MOCK_PROS: Pro[] = [
  {
    id: '1',
    name: 'Alex M.',
    age: 28,
    trade: 'Electrician',
    city: 'Chișinău',
    rating: 4.9,
    reviewsCount: 11,
    hourlyFrom: 15,
    tags: ['Verified', 'Fast response'],
    description:
      'Electrician cu experiență în apartamente și case. Montaj prize, tablouri electrice, iluminat, depanare rapidă. Lucrez curat și respect termenul.',
    reviews: [
      { id: 'a1', author: 'Vlad', rating: 5, date: '2025-12-03', text: 'Foarte rapid, a rezolvat problema în 30 min.' },
      { id: 'a2', author: 'Ana', rating: 5, date: '2025-11-20', text: 'Profesional, explica clar și lucrează curat.' },
      { id: 'a3', author: 'Sergiu', rating: 5, date: '2025-11-02', text: 'Instalația refăcută impecabil, recomand.' },
      { id: 'a4', author: 'Irina', rating: 5, date: '2025-10-18', text: 'Punctual și atent la detalii.' },
      { id: 'a5', author: 'Andrei', rating: 4.9, date: '2025-10-01', text: 'Foarte bun, comunicare excelentă.' },
      { id: 'a6', author: 'Daria', rating: 5, date: '2025-09-12', text: 'A găsit rapid problema din tablou.' },
      { id: 'a7', author: 'Radu', rating: 5, date: '2025-08-29', text: 'Curat, rapid, fără surprize la preț.' },
      { id: 'a8', author: 'Maria', rating: 4.8, date: '2025-08-10', text: 'Recomand, a fost foarte amabil.' },
      { id: 'a9', author: 'Nicu', rating: 5, date: '2025-07-22', text: 'A venit în aceeași zi, super.' },
      { id: 'a10', author: 'Elena', rating: 4.9, date: '2025-07-01', text: 'Lucrare bună, finalizată rapid.' },
      { id: 'a11', author: 'Eduard', rating: 4.9, date: '2026-02-01', text: 'Foarte curat, totul funcționează bine.' },
    ],
  },
  {
    id: '2',
    name: 'Irina P.',
    age: 31,
    trade: 'Plumber',
    city: 'Bălți',
    rating: 4.8,
    reviewsCount: 5,
    hourlyFrom: 12,
    tags: ['Top rated'],
    description:
      'Instalații sanitare, schimb baterii, robineți, repar scurgeri, montaj chiuvete/boilere. Disponibilă și în weekend.',
    reviews: [
      { id: 'p1', author: 'Mihail', rating: 5, date: '2025-12-01', text: 'A rezolvat scurgerea foarte repede.' },
      { id: 'p2', author: 'Ion', rating: 4.8, date: '2025-11-15', text: 'Punctuală și atentă.' },
      { id: 'p3', author: 'Nadia', rating: 5, date: '2025-11-03', text: 'Montaj boiler fără probleme.' },
      { id: 'p4', author: 'Vera', rating: 4.7, date: '2025-10-19', text: 'Bună comunicare, lucrare ok.' },
      { id: 'p5', author: 'Sasha', rating: 4.9, date: '2025-10-02', text: 'Recomand, a explicat tot.' },
    ],
  },
  {
    id: '3',
    name: 'Mihai C.',
    age: 35,
    trade: 'Carpenter',
    city: 'Chișinău',
    rating: 4.9,
    reviewsCount: 10,
    hourlyFrom: 18,
    tags: ['Verified'],
    description:
      'Mobilă la comandă, reparații uși, montaj plinte, ajustări fine. Atenție la detalii și materiale de calitate.',
    reviews: [
      { id: 'c1', author: 'Elena', rating: 5, date: '2025-12-02', text: 'Ușă reglată perfect, recomand.' },
      { id: 'c2', author: 'Vladislav', rating: 5, date: '2025-11-18', text: 'Mobilă la comandă super.' },
      { id: 'c3', author: 'Maria', rating: 4.9, date: '2025-11-01', text: 'Foarte atent la detalii.' },
      { id: 'c4', author: 'Radu', rating: 5, date: '2025-10-16', text: 'Montaj rapid și curat.' },
      { id: 'c5', author: 'Ana', rating: 4.8, date: '2025-10-03', text: 'Comunicare bună, rezultat ok.' },
      { id: 'c6', author: 'Sergiu', rating: 5, date: '2025-09-14', text: 'Recomand cu încredere.' },
      { id: 'c7', author: 'Irina', rating: 5, date: '2025-08-28', text: 'Calitate foarte bună.' },
      { id: 'c8', author: 'Denis', rating: 4.9, date: '2025-08-09', text: 'Lucrează foarte bine.' },
    ],
  },
  {
    id: '4',
    name: 'Elena D.',
    age: 27,
    trade: 'Painter',
    city: 'Cahul',
    rating: 4.7,
    reviewsCount: 8,
    hourlyFrom: 8,
    tags: ['Fast response'],
    description:
      'Vopsire pereți/tavane, pregătire suprafețe, glet, reparații mici. Finisaj uniform și curățenie la final.',
    reviews: [
      { id: 'e1', author: 'Daria', rating: 5, date: '2025-12-01', text: 'Finisaj foarte bun.' },
      { id: 'e2', author: 'Mihai', rating: 4.7, date: '2025-11-14', text: 'Curat și rapid.' },
      { id: 'e3', author: 'Ana', rating: 4.8, date: '2025-11-02', text: 'Rezultat frumos.' },
      { id: 'e4', author: 'Ion', rating: 4.6, date: '2025-10-17', text: 'Ok, recomand.' },
      { id: 'e5', author: 'Vera', rating: 4.7, date: '2025-10-03', text: 'A venit la timp.' },
      { id: 'e6', author: 'Sergiu', rating: 4.8, date: '2025-09-13', text: 'Foarte ok.' },
      { id: 'e7', author: 'Olga', rating: 4.6, date: '2025-08-29', text: 'Bună comunicare.' },
      { id: 'e8', author: 'Radu', rating: 4.7, date: '2025-08-10', text: 'Finisat bine.' },
    ],
  },
  {
    id: '5',
    name: 'Sergiu R.',
    age: 40,
    trade: 'Handyman',
    city: 'Orhei',
    rating: 4.6,
    reviewsCount: 10,
    hourlyFrom: 9,
    tags: ['Budget'],
    description:
      'Reparații generale în casă: montaj rafturi, mici reparații, asamblare mobilă, diverse lucrări.',
    reviews: [
      { id: 'h1', author: 'Nicu', rating: 4.7, date: '2025-12-02', text: 'A ajutat cu mai multe lucruri.' },
      { id: 'h2', author: 'Ana', rating: 4.6, date: '2025-11-16', text: 'Ok pentru preț.' },
      { id: 'h3', author: 'Vlad', rating: 4.8, date: '2025-11-04', text: 'Rapid.' },
      { id: 'h4', author: 'Elena', rating: 4.5, date: '2025-10-19', text: 'Recomand.' },
      { id: 'h5', author: 'Irina', rating: 4.6, date: '2025-10-01', text: 'Bun.' },
      { id: 'h6', author: 'Denis', rating: 4.7, date: '2025-09-15', text: 'A făcut treabă.' },
      { id: 'h7', author: 'Olga', rating: 4.6, date: '2025-08-30', text: 'Ok.' },
      { id: 'h8', author: 'Radu', rating: 4.7, date: '2025-08-11', text: 'Serios.' },
      { id: 'h9', author: 'Maria', rating: 4.5, date: '2025-07-24', text: 'Mulțumită.' },
      { id: 'h10', author: 'Victor', rating: 4.6, date: '2025-07-03', text: 'Bun pentru buget.' },
    ],
  },
  {
    id: '6',
    name: 'Radu S.',
    age: 19,
    trade: 'HVAC',
    city: 'Chișinău',
    rating: 1.3,
    reviewsCount: 3,
    hourlyFrom: 27,
    tags: ['Not Recommended'],
    description:
      'Reparăm condiționere',
    reviews: [
      { id: 's1', author: 'Andrei', rating: 1.2, date: '2026-02-02', text: 'S-a stricat a doua zi iar' },
      { id: 's2', author: 'Tudor', rating: 1.3, date: '2026-01-23', text: 'A cerut ceai dar nu a facut nimic' },
      { id: 's3', author: 'Ovidiu', rating: 1.4, date: '2025-11-04', text: 'A spus ca se apropie intr-o ora dar nu a mai venit.' },
    ],
  },
];