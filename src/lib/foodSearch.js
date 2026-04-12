import { supabase } from './supabase'

// ─── Static Italian food database ────────────────────────────────────────────
// Covers the most common generic Italian foods that may be absent or mis-named
// in Open Food Facts.  Values are per 100 g (or 100 ml for liquids).
const STATIC_ITALIAN_FOODS = [
  // ── Cereali e derivati ──
  { id: 'st_pasta_secca',        name: 'Pasta secca',              brand: 'Generico', kcal_100g: 353, proteins_100g: 12.5, carbs_100g: 70.2, fats_100g: 1.5,  fiber_100g: 3.0 },
  { id: 'st_pasta_cotta',        name: 'Pasta cotta',              brand: 'Generico', kcal_100g: 157, proteins_100g: 5.8,  carbs_100g: 30.6, fats_100g: 0.9,  fiber_100g: 1.4 },
  { id: 'st_pasta_fresca',       name: 'Pasta fresca',             brand: 'Generico', kcal_100g: 275, proteins_100g: 9.5,  carbs_100g: 53.0, fats_100g: 2.2,  fiber_100g: 2.5 },
  { id: 'st_penne',              name: 'Penne (secche)',            brand: 'Generico', kcal_100g: 353, proteins_100g: 12.5, carbs_100g: 70.2, fats_100g: 1.5,  fiber_100g: 3.0 },
  { id: 'st_spaghetti',         name: 'Spaghetti (secchi)',        brand: 'Generico', kcal_100g: 353, proteins_100g: 12.5, carbs_100g: 70.2, fats_100g: 1.5,  fiber_100g: 3.0 },
  { id: 'st_riso_bianco',        name: 'Riso bianco cotto',        brand: 'Generico', kcal_100g: 130, proteins_100g: 2.7,  carbs_100g: 28.2, fats_100g: 0.3,  fiber_100g: 0.4 },
  { id: 'st_riso_secco',         name: 'Riso (secco)',              brand: 'Generico', kcal_100g: 360, proteins_100g: 6.7,  carbs_100g: 79.0, fats_100g: 0.4,  fiber_100g: 0.6 },
  { id: 'st_pane_bianco',        name: 'Pane bianco',              brand: 'Generico', kcal_100g: 265, proteins_100g: 8.1,  carbs_100g: 54.3, fats_100g: 1.4,  fiber_100g: 2.7 },
  { id: 'st_pane_integrale',     name: 'Pane integrale',           brand: 'Generico', kcal_100g: 247, proteins_100g: 9.0,  carbs_100g: 46.0, fats_100g: 2.0,  fiber_100g: 7.0 },
  { id: 'st_farina_00',          name: 'Farina 00',                brand: 'Generico', kcal_100g: 364, proteins_100g: 10.5, carbs_100g: 76.3, fats_100g: 1.0,  fiber_100g: 2.7 },
  { id: 'st_farina_integrale',   name: 'Farina integrale',         brand: 'Generico', kcal_100g: 340, proteins_100g: 13.0, carbs_100g: 64.0, fats_100g: 2.5,  fiber_100g: 10.0 },
  { id: 'st_avena',              name: 'Fiocchi di avena',         brand: 'Generico', kcal_100g: 389, proteins_100g: 17.0, carbs_100g: 66.3, fats_100g: 7.0,  fiber_100g: 10.6 },
  { id: 'st_mais_polenta',       name: 'Polenta (farina di mais)', brand: 'Generico', kcal_100g: 362, proteins_100g: 8.5,  carbs_100g: 74.3, fats_100g: 3.9,  fiber_100g: 9.4 },
  { id: 'st_crackers',           name: 'Crackers',                 brand: 'Generico', kcal_100g: 430, proteins_100g: 10.0, carbs_100g: 68.0, fats_100g: 14.0, fiber_100g: 3.0 },
  { id: 'st_grissini',           name: 'Grissini',                 brand: 'Generico', kcal_100g: 416, proteins_100g: 11.5, carbs_100g: 74.0, fats_100g: 8.9,  fiber_100g: 3.2 },
  { id: 'st_fette_biscottate',   name: 'Fette biscottate',         brand: 'Generico', kcal_100g: 410, proteins_100g: 11.3, carbs_100g: 75.0, fats_100g: 7.4,  fiber_100g: 5.0 },
  { id: 'st_orzo',               name: 'Orzo (secco)',             brand: 'Generico', kcal_100g: 354, proteins_100g: 10.0, carbs_100g: 73.5, fats_100g: 2.1,  fiber_100g: 15.6 },
  { id: 'st_farro',              name: 'Farro (secco)',            brand: 'Generico', kcal_100g: 335, proteins_100g: 14.7, carbs_100g: 63.0, fats_100g: 2.4,  fiber_100g: 11.0 },
  { id: 'st_quinoa',             name: 'Quinoa (secca)',           brand: 'Generico', kcal_100g: 368, proteins_100g: 14.1, carbs_100g: 64.2, fats_100g: 6.1,  fiber_100g: 7.0 },
  { id: 'st_cous_cous',          name: 'Cous cous (secco)',        brand: 'Generico', kcal_100g: 376, proteins_100g: 13.0, carbs_100g: 77.0, fats_100g: 0.6,  fiber_100g: 5.0 },
  // ── Carne ──
  { id: 'st_petto_pollo',        name: 'Petto di pollo',           brand: 'Generico', kcal_100g: 110, proteins_100g: 23.3, carbs_100g: 0.0,  fats_100g: 1.2,  fiber_100g: 0.0 },
  { id: 'st_coscia_pollo',       name: 'Coscia di pollo',          brand: 'Generico', kcal_100g: 185, proteins_100g: 18.0, carbs_100g: 0.0,  fats_100g: 12.0, fiber_100g: 0.0 },
  { id: 'st_tacchino',           name: 'Petto di tacchino',        brand: 'Generico', kcal_100g: 107, proteins_100g: 24.0, carbs_100g: 0.0,  fats_100g: 0.7,  fiber_100g: 0.0 },
  { id: 'st_manzo_macinato',     name: 'Manzo macinato',           brand: 'Generico', kcal_100g: 254, proteins_100g: 17.2, carbs_100g: 0.0,  fats_100g: 20.0, fiber_100g: 0.0 },
  { id: 'st_bistecca_manzo',     name: 'Bistecca di manzo',        brand: 'Generico', kcal_100g: 187, proteins_100g: 28.7, carbs_100g: 0.0,  fats_100g: 7.6,  fiber_100g: 0.0 },
  { id: 'st_maiale_lonza',       name: 'Lonza di maiale',          brand: 'Generico', kcal_100g: 140, proteins_100g: 22.0, carbs_100g: 0.0,  fats_100g: 5.5,  fiber_100g: 0.0 },
  { id: 'st_prosciutto_cotto',   name: 'Prosciutto cotto',         brand: 'Generico', kcal_100g: 164, proteins_100g: 19.0, carbs_100g: 0.5,  fats_100g: 9.0,  fiber_100g: 0.0 },
  { id: 'st_prosciutto_crudo',   name: 'Prosciutto crudo',         brand: 'Generico', kcal_100g: 268, proteins_100g: 25.9, carbs_100g: 0.3,  fats_100g: 17.8, fiber_100g: 0.0 },
  { id: 'st_bresaola',           name: 'Bresaola',                 brand: 'Generico', kcal_100g: 151, proteins_100g: 32.0, carbs_100g: 0.5,  fats_100g: 2.1,  fiber_100g: 0.0 },
  { id: 'st_mortadella',         name: 'Mortadella',               brand: 'Generico', kcal_100g: 311, proteins_100g: 15.0, carbs_100g: 0.5,  fats_100g: 27.0, fiber_100g: 0.0 },
  { id: 'st_salame',             name: 'Salame',                   brand: 'Generico', kcal_100g: 380, proteins_100g: 25.0, carbs_100g: 0.5,  fats_100g: 30.0, fiber_100g: 0.0 },
  { id: 'st_wurstel',            name: 'Wurstel di pollo',         brand: 'Generico', kcal_100g: 200, proteins_100g: 12.0, carbs_100g: 3.0,  fats_100g: 16.0, fiber_100g: 0.0 },
  // ── Pesce e frutti di mare ──
  { id: 'st_tonno_nat',          name: 'Tonno al naturale',        brand: 'Generico', kcal_100g: 103, proteins_100g: 23.5, carbs_100g: 0.0,  fats_100g: 0.8,  fiber_100g: 0.0 },
  { id: 'st_tonno_olio',         name: 'Tonno sott\'olio',         brand: 'Generico', kcal_100g: 198, proteins_100g: 25.0, carbs_100g: 0.0,  fats_100g: 11.0, fiber_100g: 0.0 },
  { id: 'st_salmone',            name: 'Salmone',                  brand: 'Generico', kcal_100g: 208, proteins_100g: 20.0, carbs_100g: 0.0,  fats_100g: 13.6, fiber_100g: 0.0 },
  { id: 'st_merluzzo',           name: 'Merluzzo / Baccalà',       brand: 'Generico', kcal_100g: 82,  proteins_100g: 17.8, carbs_100g: 0.0,  fats_100g: 0.7,  fiber_100g: 0.0 },
  { id: 'st_branzino',           name: 'Branzino / Spigola',       brand: 'Generico', kcal_100g: 97,  proteins_100g: 18.0, carbs_100g: 0.0,  fats_100g: 2.0,  fiber_100g: 0.0 },
  { id: 'st_orata',              name: 'Orata',                    brand: 'Generico', kcal_100g: 121, proteins_100g: 18.9, carbs_100g: 0.0,  fats_100g: 5.0,  fiber_100g: 0.0 },
  { id: 'st_gamberi',            name: 'Gamberi',                  brand: 'Generico', kcal_100g: 71,  proteins_100g: 13.6, carbs_100g: 0.5,  fats_100g: 1.0,  fiber_100g: 0.0 },
  { id: 'st_polipo',             name: 'Polipo / Polpo',           brand: 'Generico', kcal_100g: 82,  proteins_100g: 15.0, carbs_100g: 2.0,  fats_100g: 1.0,  fiber_100g: 0.0 },
  // ── Uova e latticini ──
  { id: 'st_uovo_intero',        name: 'Uovo intero',              brand: 'Generico', kcal_100g: 155, proteins_100g: 12.6, carbs_100g: 0.7,  fats_100g: 10.6, fiber_100g: 0.0 },
  { id: 'st_albume',             name: 'Albume d\'uovo',           brand: 'Generico', kcal_100g: 52,  proteins_100g: 10.9, carbs_100g: 0.7,  fats_100g: 0.2,  fiber_100g: 0.0 },
  { id: 'st_tuorlo',             name: 'Tuorlo d\'uovo',           brand: 'Generico', kcal_100g: 322, proteins_100g: 16.1, carbs_100g: 0.6,  fats_100g: 27.7, fiber_100g: 0.0 },
  { id: 'st_latte_intero',       name: 'Latte intero',             brand: 'Generico', kcal_100g: 64,  proteins_100g: 3.2,  carbs_100g: 4.8,  fats_100g: 3.6,  fiber_100g: 0.0 },
  { id: 'st_latte_parziale',     name: 'Latte parzialmente scremato', brand: 'Generico', kcal_100g: 46, proteins_100g: 3.4, carbs_100g: 4.9, fats_100g: 1.6,  fiber_100g: 0.0 },
  { id: 'st_latte_scremato',     name: 'Latte scremato',           brand: 'Generico', kcal_100g: 35,  proteins_100g: 3.6,  carbs_100g: 5.0,  fats_100g: 0.2,  fiber_100g: 0.0 },
  { id: 'st_yogurt_bianco',      name: 'Yogurt bianco intero',     brand: 'Generico', kcal_100g: 61,  proteins_100g: 3.5,  carbs_100g: 4.7,  fats_100g: 3.0,  fiber_100g: 0.0 },
  { id: 'st_yogurt_greco',       name: 'Yogurt greco 0%',          brand: 'Generico', kcal_100g: 57,  proteins_100g: 10.0, carbs_100g: 4.0,  fats_100g: 0.3,  fiber_100g: 0.0 },
  { id: 'st_yogurt_greco_int',   name: 'Yogurt greco intero',      brand: 'Generico', kcal_100g: 97,  proteins_100g: 5.7,  carbs_100g: 3.8,  fats_100g: 7.0,  fiber_100g: 0.0 },
  { id: 'st_ricotta',            name: 'Ricotta vaccina',          brand: 'Generico', kcal_100g: 146, proteins_100g: 11.0, carbs_100g: 3.5,  fats_100g: 10.0, fiber_100g: 0.0 },
  { id: 'st_mozzarella',         name: 'Mozzarella di vacca',      brand: 'Generico', kcal_100g: 253, proteins_100g: 18.7, carbs_100g: 2.2,  fats_100g: 19.5, fiber_100g: 0.0 },
  { id: 'st_parmigiano',         name: 'Parmigiano Reggiano',      brand: 'Generico', kcal_100g: 392, proteins_100g: 33.0, carbs_100g: 0.0,  fats_100g: 28.1, fiber_100g: 0.0 },
  { id: 'st_grana',              name: 'Grana Padano',             brand: 'Generico', kcal_100g: 384, proteins_100g: 33.0, carbs_100g: 0.0,  fats_100g: 27.0, fiber_100g: 0.0 },
  { id: 'st_pecorino',           name: 'Pecorino Romano',          brand: 'Generico', kcal_100g: 387, proteins_100g: 26.5, carbs_100g: 0.2,  fats_100g: 31.0, fiber_100g: 0.0 },
  { id: 'st_formaggio_light',    name: 'Formaggio light',          brand: 'Generico', kcal_100g: 245, proteins_100g: 28.0, carbs_100g: 2.0,  fats_100g: 13.0, fiber_100g: 0.0 },
  { id: 'st_fiocchi_latte',      name: 'Fiocchi di latte',         brand: 'Generico', kcal_100g: 72,  proteins_100g: 10.0, carbs_100g: 4.0,  fats_100g: 1.5,  fiber_100g: 0.0 },
  { id: 'st_burro',              name: 'Burro',                    brand: 'Generico', kcal_100g: 758, proteins_100g: 0.5,  carbs_100g: 0.6,  fats_100g: 83.0, fiber_100g: 0.0 },
  // ── Legumi ──
  { id: 'st_ceci_cotti',         name: 'Ceci cotti',               brand: 'Generico', kcal_100g: 164, proteins_100g: 8.9,  carbs_100g: 27.4, fats_100g: 2.6,  fiber_100g: 7.6 },
  { id: 'st_lenticchie_cotte',   name: 'Lenticchie cotte',         brand: 'Generico', kcal_100g: 116, proteins_100g: 9.0,  carbs_100g: 20.1, fats_100g: 0.4,  fiber_100g: 7.9 },
  { id: 'st_fagioli_cotti',      name: 'Fagioli borlotti cotti',   brand: 'Generico', kcal_100g: 113, proteins_100g: 7.5,  carbs_100g: 20.0, fats_100g: 0.5,  fiber_100g: 6.0 },
  { id: 'st_fagioli_bianchi',    name: 'Fagioli bianchi cotti',    brand: 'Generico', kcal_100g: 114, proteins_100g: 8.7,  carbs_100g: 21.0, fats_100g: 0.4,  fiber_100g: 7.4 },
  { id: 'st_soia',               name: 'Soia cotta',               brand: 'Generico', kcal_100g: 141, proteins_100g: 16.6, carbs_100g: 11.0, fats_100g: 6.4,  fiber_100g: 6.0 },
  { id: 'st_tofu',               name: 'Tofu',                     brand: 'Generico', kcal_100g: 76,  proteins_100g: 8.1,  carbs_100g: 1.9,  fats_100g: 4.2,  fiber_100g: 0.3 },
  // ── Verdure ──
  { id: 'st_pomodoro',           name: 'Pomodoro',                 brand: 'Generico', kcal_100g: 18,  proteins_100g: 0.9,  carbs_100g: 3.5,  fats_100g: 0.2,  fiber_100g: 1.2 },
  { id: 'st_zucchina',           name: 'Zucchina',                 brand: 'Generico', kcal_100g: 17,  proteins_100g: 1.3,  carbs_100g: 2.5,  fats_100g: 0.1,  fiber_100g: 1.2 },
  { id: 'st_melanzana',          name: 'Melanzana',                brand: 'Generico', kcal_100g: 24,  proteins_100g: 1.1,  carbs_100g: 4.8,  fats_100g: 0.2,  fiber_100g: 2.0 },
  { id: 'st_peperone',           name: 'Peperone',                 brand: 'Generico', kcal_100g: 31,  proteins_100g: 1.0,  carbs_100g: 6.7,  fats_100g: 0.3,  fiber_100g: 2.1 },
  { id: 'st_spinaci',            name: 'Spinaci',                  brand: 'Generico', kcal_100g: 23,  proteins_100g: 2.9,  carbs_100g: 3.6,  fats_100g: 0.4,  fiber_100g: 2.2 },
  { id: 'st_broccoli',           name: 'Broccoli',                 brand: 'Generico', kcal_100g: 34,  proteins_100g: 2.8,  carbs_100g: 6.6,  fats_100g: 0.4,  fiber_100g: 2.6 },
  { id: 'st_insalata',           name: 'Insalata / Lattuga',       brand: 'Generico', kcal_100g: 14,  proteins_100g: 1.4,  carbs_100g: 2.2,  fats_100g: 0.2,  fiber_100g: 1.5 },
  { id: 'st_carota',             name: 'Carota',                   brand: 'Generico', kcal_100g: 41,  proteins_100g: 0.9,  carbs_100g: 9.6,  fats_100g: 0.2,  fiber_100g: 2.8 },
  { id: 'st_cipolla',            name: 'Cipolla',                  brand: 'Generico', kcal_100g: 40,  proteins_100g: 1.1,  carbs_100g: 9.3,  fats_100g: 0.1,  fiber_100g: 1.7 },
  { id: 'st_aglio',              name: 'Aglio',                    brand: 'Generico', kcal_100g: 41,  proteins_100g: 1.5,  carbs_100g: 9.0,  fats_100g: 0.1,  fiber_100g: 1.0 },
  { id: 'st_funghi',             name: 'Funghi champignon',        brand: 'Generico', kcal_100g: 22,  proteins_100g: 3.1,  carbs_100g: 3.3,  fats_100g: 0.3,  fiber_100g: 1.0 },
  { id: 'st_patate',             name: 'Patate',                   brand: 'Generico', kcal_100g: 79,  proteins_100g: 2.1,  carbs_100g: 17.8, fats_100g: 0.1,  fiber_100g: 1.8 },
  { id: 'st_asparagi',           name: 'Asparagi',                 brand: 'Generico', kcal_100g: 20,  proteins_100g: 2.2,  carbs_100g: 3.9,  fats_100g: 0.1,  fiber_100g: 2.1 },
  { id: 'st_cavolfiore',         name: 'Cavolfiore',               brand: 'Generico', kcal_100g: 25,  proteins_100g: 1.9,  carbs_100g: 5.0,  fats_100g: 0.3,  fiber_100g: 2.0 },
  { id: 'st_cavolo',             name: 'Cavolo',                   brand: 'Generico', kcal_100g: 25,  proteins_100g: 1.3,  carbs_100g: 5.8,  fats_100g: 0.1,  fiber_100g: 2.5 },
  { id: 'st_cetriolo',           name: 'Cetriolo',                 brand: 'Generico', kcal_100g: 15,  proteins_100g: 0.7,  carbs_100g: 3.6,  fats_100g: 0.1,  fiber_100g: 0.5 },
  { id: 'st_sedano',             name: 'Sedano',                   brand: 'Generico', kcal_100g: 16,  proteins_100g: 0.7,  carbs_100g: 3.0,  fats_100g: 0.2,  fiber_100g: 1.8 },
  { id: 'st_piselli',            name: 'Piselli',                  brand: 'Generico', kcal_100g: 81,  proteins_100g: 5.4,  carbs_100g: 14.5, fats_100g: 0.4,  fiber_100g: 5.1 },
  { id: 'st_mais',               name: 'Mais',                     brand: 'Generico', kcal_100g: 86,  proteins_100g: 3.3,  carbs_100g: 19.0, fats_100g: 1.4,  fiber_100g: 2.7 },
  // ── Frutta ──
  { id: 'st_mela',               name: 'Mela',                     brand: 'Generico', kcal_100g: 52,  proteins_100g: 0.3,  carbs_100g: 13.8, fats_100g: 0.2,  fiber_100g: 2.4 },
  { id: 'st_pera',               name: 'Pera',                     brand: 'Generico', kcal_100g: 57,  proteins_100g: 0.4,  carbs_100g: 15.2, fats_100g: 0.1,  fiber_100g: 3.1 },
  { id: 'st_banana',             name: 'Banana',                   brand: 'Generico', kcal_100g: 89,  proteins_100g: 1.1,  carbs_100g: 22.8, fats_100g: 0.3,  fiber_100g: 2.6 },
  { id: 'st_arancia',            name: 'Arancia',                  brand: 'Generico', kcal_100g: 47,  proteins_100g: 0.9,  carbs_100g: 11.8, fats_100g: 0.1,  fiber_100g: 2.4 },
  { id: 'st_fragole',            name: 'Fragole',                  brand: 'Generico', kcal_100g: 32,  proteins_100g: 0.7,  carbs_100g: 7.7,  fats_100g: 0.3,  fiber_100g: 2.0 },
  { id: 'st_uva',                name: 'Uva',                      brand: 'Generico', kcal_100g: 69,  proteins_100g: 0.6,  carbs_100g: 18.1, fats_100g: 0.2,  fiber_100g: 0.9 },
  { id: 'st_pesche',             name: 'Pesca',                    brand: 'Generico', kcal_100g: 39,  proteins_100g: 0.9,  carbs_100g: 9.5,  fats_100g: 0.3,  fiber_100g: 1.5 },
  { id: 'st_kiwi',               name: 'Kiwi',                     brand: 'Generico', kcal_100g: 61,  proteins_100g: 1.1,  carbs_100g: 14.7, fats_100g: 0.5,  fiber_100g: 3.0 },
  { id: 'st_limone',             name: 'Limone',                   brand: 'Generico', kcal_100g: 29,  proteins_100g: 1.1,  carbs_100g: 9.3,  fats_100g: 0.3,  fiber_100g: 2.8 },
  { id: 'st_ananas',             name: 'Ananas',                   brand: 'Generico', kcal_100g: 50,  proteins_100g: 0.5,  carbs_100g: 13.1, fats_100g: 0.1,  fiber_100g: 1.4 },
  { id: 'st_anguria',            name: 'Anguria / Cocomero',       brand: 'Generico', kcal_100g: 30,  proteins_100g: 0.6,  carbs_100g: 7.5,  fats_100g: 0.2,  fiber_100g: 0.4 },
  { id: 'st_mango',              name: 'Mango',                    brand: 'Generico', kcal_100g: 60,  proteins_100g: 0.8,  carbs_100g: 15.0, fats_100g: 0.4,  fiber_100g: 1.6 },
  // ── Grassi e condimenti ──
  { id: 'st_olio_oliva',         name: 'Olio d\'oliva',            brand: 'Generico', kcal_100g: 884, proteins_100g: 0.0,  carbs_100g: 0.0,  fats_100g: 100.0, fiber_100g: 0.0 },
  { id: 'st_olio_semi',          name: 'Olio di semi',             brand: 'Generico', kcal_100g: 884, proteins_100g: 0.0,  carbs_100g: 0.0,  fats_100g: 100.0, fiber_100g: 0.0 },
  { id: 'st_passata',            name: 'Passata di pomodoro',      brand: 'Generico', kcal_100g: 27,  proteins_100g: 1.3,  carbs_100g: 5.6,  fats_100g: 0.1,  fiber_100g: 1.0 },
  // ── Frutta secca ──
  { id: 'st_mandorle',           name: 'Mandorle',                 brand: 'Generico', kcal_100g: 579, proteins_100g: 21.2, carbs_100g: 21.6, fats_100g: 49.9, fiber_100g: 12.5 },
  { id: 'st_noci',               name: 'Noci',                     brand: 'Generico', kcal_100g: 654, proteins_100g: 15.2, carbs_100g: 13.7, fats_100g: 65.2, fiber_100g: 6.7 },
  { id: 'st_nocciole',           name: 'Nocciole',                 brand: 'Generico', kcal_100g: 628, proteins_100g: 15.0, carbs_100g: 16.7, fats_100g: 60.8, fiber_100g: 9.7 },
  { id: 'st_arachidi',           name: 'Arachidi / Noccioline',    brand: 'Generico', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5 },
  { id: 'st_burro_arachidi',     name: 'Burro di arachidi',        brand: 'Generico', kcal_100g: 588, proteins_100g: 25.1, carbs_100g: 20.0, fats_100g: 49.9, fiber_100g: 6.0 },
  // ── Dolci e snack ──
  { id: 'st_cioccolato_fondente',name: 'Cioccolato fondente',      brand: 'Generico', kcal_100g: 546, proteins_100g: 4.9,  carbs_100g: 59.4, fats_100g: 31.3, fiber_100g: 7.0 },
  { id: 'st_cioccolato_latte',   name: 'Cioccolato al latte',      brand: 'Generico', kcal_100g: 535, proteins_100g: 7.7,  carbs_100g: 59.4, fats_100g: 29.7, fiber_100g: 1.5 },
  // ── Proteine in polvere ──
  { id: 'st_whey_protein',       name: 'Proteine Whey',            brand: 'Generico', kcal_100g: 380, proteins_100g: 74.0, carbs_100g: 8.0,  fats_100g: 6.0,  fiber_100g: 1.0 },
  { id: 'st_casein_protein',     name: 'Proteina Caseina',         brand: 'Generico', kcal_100g: 370, proteins_100g: 77.0, carbs_100g: 5.0,  fats_100g: 2.5,  fiber_100g: 1.0 },
]

function searchStaticFoods(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const results = STATIC_ITALIAN_FOODS.filter(f =>
    f.name.toLowerCase().includes(q)
  )
  // Sort: exact-start matches first, then partial matches
  results.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
    const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
    return aStarts - bStarts
  })
  return results.map(f => ({ ...f, source: 'static' }))
}

// Recent foods from patient's own logs (fastest, most relevant)
async function searchRecentFoods(query) {
  try {
    const { data } = await supabase
      .from('food_logs')
      .select('food_name, kcal, proteins, carbs, fats, grams, food_data')
      .ilike('food_name', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(80)
    if (!data?.length) return []
    const seen = new Map()
    for (const row of data) {
      if (seen.has(row.food_name)) continue
      const fd = row.food_data || {}
      const g = row.grams || 100
      seen.set(row.food_name, {
        id: `recent_${row.food_name}`,
        name: row.food_name,
        brand: fd.brand || '',
        kcal_100g: fd.kcal_100g ?? Math.round(row.kcal / g * 100),
        proteins_100g: fd.proteins_100g ?? Math.round(row.proteins / g * 1000) / 10,
        carbs_100g: fd.carbs_100g ?? Math.round(row.carbs / g * 1000) / 10,
        fats_100g: fd.fats_100g ?? Math.round(row.fats / g * 1000) / 10,
        fiber_100g: fd.fiber_100g || 0,
        source: 'recent',
      })
    }
    return [...seen.values()].slice(0, 6)
  } catch { return [] }
}

// Foods from dietitian's diet meals (foods in prescribed diets)
async function searchDietMealFoods(query) {
  try {
    const { data } = await supabase
      .from('diet_meals').select('foods').not('foods', 'is', null).limit(200)
    if (!data?.length) return []
    const seen = new Set()
    const results = []
    const q = query.toLowerCase()
    for (const meal of data) {
      if (!Array.isArray(meal.foods)) continue
      for (const food of meal.foods) {
        const name = food.name || food.nome || ''
        if (!name || !name.toLowerCase().includes(q) || seen.has(name)) continue
        seen.add(name)
        results.push({
          id: `diet_${name}`,
          name, brand: '🥗 Dal tuo piano',
          kcal_100g: food.kcal_100g || food.calorie || 0,
          proteins_100g: food.proteins_100g || food.proteine || 0,
          carbs_100g: food.carbs_100g || food.carboidrati || 0,
          fats_100g: food.fats_100g || food.grassi || 0,
          fiber_100g: food.fiber_100g || 0,
          source: 'diet',
        })
      }
    }
    return results.slice(0, 8)
  } catch { return [] }
}

// Recipes table
async function searchRicette(query) {
  try {
    const { data } = await supabase.from('ricette').select('*').ilike('nome', `%${query}%`).limit(8)
    if (!data?.length) return []
    return data.map(r => ({
      id: `ricetta_${r.id}`, name: r.nome || r.name || '',
      brand: '🍳 Ricetta',
      kcal_100g: r.kcal_100g || r.calorie_porzione || r.calorie || r.kcal || 0,
      proteins_100g: r.proteins_100g || r.proteine || r.proteins || 0,
      carbs_100g: r.carbs_100g || r.carboidrati || r.carbs || 0,
      fats_100g: r.fats_100g || r.grassi || r.lipidi || 0,
      fiber_100g: r.fibra || 0, source: 'recipe',
    })).filter(r => r.name)
  } catch { return [] }
}

// Custom meals (user-created meal combos)
async function searchCustomMeals(query) {
  try {
    const { data } = await supabase
      .from('custom_meals')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(6)
    if (!data?.length) return []
    return data.map(m => {
      const w = m.peso_totale_g || 100
      return {
        id: `meal_${m.id}`,
        name: m.name,
        brand: '🍽️ Pasto personalizzato',
        kcal_100g: w > 0 ? Math.round(m.kcal_total / w * 100) : 0,
        proteins_100g: w > 0 ? Math.round(m.proteins_total / w * 1000) / 10 : 0,
        carbs_100g: w > 0 ? Math.round(m.carbs_total / w * 1000) / 10 : 0,
        fats_100g: w > 0 ? Math.round(m.fats_total / w * 1000) / 10 : 0,
        fiber_100g: 0,
        source: 'custom_meal',
        meal_id: m.id,
        default_grams: w,
      }
    })
  } catch { return [] }
}

// Open Food Facts — Italian-first search with multiple endpoint fallbacks
function mapOFFProduct(p) {
  const n = p.nutriments || {}
  // Try kcal directly, then convert from kJ (1 kcal ≈ 4.184 kJ)
  const kcal = n['energy-kcal_100g']
    || (n['energy_100g'] ? Math.round(n['energy_100g'] / 4.184) : 0)
    || n['energy-kcal']
    || 0
  const name = p.product_name_it || p.product_name || p.product_name_en || ''
  return {
    id: p.code || p._id, name, brand: p.brands || '',
    kcal_100g: Math.round(kcal),
    proteins_100g: Math.round((n['proteins_100g'] || 0) * 10) / 10,
    carbs_100g: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
    fats_100g: Math.round((n['fat_100g'] || 0) * 10) / 10,
    fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
    source: 'openfoodfacts',
  }
}

function hasUsefulData(p) {
  const n = p.nutriments || {}
  const name = p.product_name_it || p.product_name || p.product_name_en || ''
  if (!name) return false
  return (
    n['energy-kcal_100g'] || n['energy_100g'] || n['energy-kcal'] ||
    n['proteins_100g'] || n['carbohydrates_100g'] || n['fat_100g']
  )
}

export async function searchOpenFoodFacts(query) {
  const fields = 'code,product_name,product_name_it,product_name_en,brands,nutriments'
  const q = encodeURIComponent(query)

  // Primary: Italian regional database — returns products sold in Italy in Italian
  try {
    const res = await fetch(
      `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&fields=${fields}&page_size=24&sort_by=unique_scans_n`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (res.ok) {
      const data = await res.json()
      const hits = (data.products || []).filter(hasUsefulData).map(mapOFFProduct).filter(p => p.name)
      if (hits.length >= 3) return hits
    }
  } catch { /* fall through */ }

  // Secondary: Meilisearch-based API with Italian language filter
  try {
    const res = await fetch(
      `https://search.openfoodfacts.org/search?q=${q}&page_size=24&fields=${fields}&langs=it`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (res.ok) {
      const data = await res.json()
      const hits = (data.hits || []).filter(hasUsefulData).map(mapOFFProduct).filter(p => p.name)
      if (hits.length >= 3) return hits
    }
  } catch { /* fall through */ }

  // Tertiary: world database filtered by Italian country tag, sorted by scans
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&fields=${fields}&page_size=24&tagtype_0=countries&tag_contains_0=contains&tag_0=italy&sort_by=unique_scans_n`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (res.ok) {
      const data = await res.json()
      const hits = (data.products || []).filter(hasUsefulData).map(mapOFFProduct).filter(p => p.name)
      if (hits.length > 0) return hits
    }
  } catch { /* fall through */ }

  // Quaternary: world database fallback (no country filter)
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&fields=${fields}&page_size=24&sort_by=unique_scans_n`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (res.ok) {
      const data = await res.json()
      return (data.products || []).filter(hasUsefulData).map(mapOFFProduct).filter(p => p.name)
    }
  } catch { /* ignore */ }

  return []
}

export async function searchFoods(query) {
  const [a, b, c, d, e, f] = await Promise.allSettled([
    Promise.resolve(searchStaticFoods(query)),
    searchRecentFoods(query),
    searchDietMealFoods(query),
    searchRicette(query),
    searchCustomMeals(query),
    searchOpenFoodFacts(query),
  ])
  const seen = new Set()
  const dedup = arr => (arr.status === 'fulfilled' ? arr.value : []).filter(food => {
    const k = (food.name || '').toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k); return true
  })
  return [...dedup(a), ...dedup(b), ...dedup(c), ...dedup(d), ...dedup(e), ...dedup(f)]
}

export async function searchDatabaseFoods(query) {
  return searchDietMealFoods(query)
}

export async function searchByBarcode(barcode) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    if (data.status !== 1 || !data.product) return null
    const p = data.product
    const n = p.nutriments || {}
    const name = p.product_name_it || p.product_name || ''
    if (!name) return null
    return {
      id: p.code || barcode,
      name,
      brand: p.brands || '',
      kcal_100g: Math.round(n['energy-kcal_100g'] || 0),
      proteins_100g: Math.round((n['proteins_100g'] || 0) * 10) / 10,
      carbs_100g: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
      fats_100g: Math.round((n['fat_100g'] || 0) * 10) / 10,
      fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
      source: 'openfoodfacts',
    }
  } catch { return null }
}
