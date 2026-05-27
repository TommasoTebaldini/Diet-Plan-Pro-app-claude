// ─── Dietitian Food Database ──────────────────────────────────────────────────
// Comprehensive Italian food database from the dietitian app (Diet-Plan-Pro).
// Values are per 100 g. This database is used as the primary/trusted source
// for generic food searches, prioritised over OpenFoodFacts results.
// ──────────────────────────────────────────────────────────────────────────────

export const DIETITIAN_FOODS = [
  // ─── Proteine ──────────────────────────────────────────────────────────────
  { id: 'dt_1',   name: 'Petto di Pollo',           category: 'Proteine',  kcal_100g: 165, proteins_100g: 31,   carbs_100g: 0,    fats_100g: 3.6,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.9  },
  { id: 'dt_2',   name: 'Salmone',                  category: 'Proteine',  kcal_100g: 208, proteins_100g: 20,   carbs_100g: 0,    fats_100g: 13,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 3.1  },
  { id: 'dt_3',   name: 'Tonno in scatola',         category: 'Proteine',  kcal_100g: 116, proteins_100g: 26,   carbs_100g: 0,    fats_100g: 1,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.3  },
  { id: 'dt_4',   name: 'Uova',                     category: 'Proteine',  kcal_100g: 155, proteins_100g: 13,   carbs_100g: 1.1,  fats_100g: 11,   fiber_100g: 0,    sugar_100g: 0.4,  fatSat_100g: 3.3,  serving_size_g: 60  },
  { id: 'dt_29',  name: 'Lenticchie',               category: 'Legumi',    kcal_100g: 116, proteins_100g: 9,    carbs_100g: 20,   fats_100g: 0.4,  fiber_100g: 7.9,  sugar_100g: 1.8,  fatSat_100g: 0.1  },
  { id: 'dt_30',  name: 'Fagioli neri',             category: 'Legumi',    kcal_100g: 132, proteins_100g: 8.9,  carbs_100g: 24,   fats_100g: 0.5,  fiber_100g: 8.7,  sugar_100g: 0.3,  fatSat_100g: 0.1  },
  { id: 'dt_31',  name: 'Manzo (fesa)',              category: 'Proteine',  kcal_100g: 158, proteins_100g: 26,   carbs_100g: 0,    fats_100g: 5.4,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 2.1  },
  { id: 'dt_32',  name: 'Tacchino (petto)',          category: 'Proteine',  kcal_100g: 135, proteins_100g: 30,   carbs_100g: 0,    fats_100g: 1,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.3  },
  { id: 'dt_33',  name: 'Gamberetti',                category: 'Proteine',  kcal_100g: 99,  proteins_100g: 24,   carbs_100g: 0.2,  fats_100g: 0.3,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.1  },
  { id: 'dt_34',  name: 'Merluzzo',                  category: 'Proteine',  kcal_100g: 82,  proteins_100g: 18,   carbs_100g: 0,    fats_100g: 0.7,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.1  },
  { id: 'dt_35',  name: 'Maiale (lonza)',            category: 'Proteine',  kcal_100g: 143, proteins_100g: 26,   carbs_100g: 0,    fats_100g: 4,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 1.4  },
  { id: 'dt_36',  name: 'Sgombro',                   category: 'Proteine',  kcal_100g: 205, proteins_100g: 19,   carbs_100g: 0,    fats_100g: 14,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 3.3  },
  { id: 'dt_37',  name: 'Sardine',                   category: 'Proteine',  kcal_100g: 208, proteins_100g: 25,   carbs_100g: 0,    fats_100g: 11,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 2.5  },
  { id: 'dt_38',  name: 'Cozze',                     category: 'Proteine',  kcal_100g: 86,  proteins_100g: 12,   carbs_100g: 3.7,  fats_100g: 2.2,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.5  },
  { id: 'dt_39',  name: 'Vongole',                   category: 'Proteine',  kcal_100g: 74,  proteins_100g: 13,   carbs_100g: 2.6,  fats_100g: 1,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.2  },
  { id: 'dt_40',  name: 'Bresaola',                  category: 'Proteine',  kcal_100g: 151, proteins_100g: 32,   carbs_100g: 0,    fats_100g: 2,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 0.5  },
  { id: 'dt_41',  name: 'Prosciutto crudo',          category: 'Proteine',  kcal_100g: 268, proteins_100g: 25,   carbs_100g: 0,    fats_100g: 18,   fiber_100g: 0,    sugar_100g: 0.3,  fatSat_100g: 6.5  },
  { id: 'dt_42',  name: 'Prosciutto cotto',          category: 'Proteine',  kcal_100g: 136, proteins_100g: 19,   carbs_100g: 1,    fats_100g: 6,    fiber_100g: 0,    sugar_100g: 0.5,  fatSat_100g: 2.1  },
  { id: 'dt_43',  name: 'Tofu',                      category: 'Proteine',  kcal_100g: 76,  proteins_100g: 8,    carbs_100g: 1.9,  fats_100g: 4.8,  fiber_100g: 0.3,  sugar_100g: 0.6,  fatSat_100g: 0.7  },
  { id: 'dt_44',  name: 'Albumi',                    category: 'Proteine',  kcal_100g: 52,  proteins_100g: 11,   carbs_100g: 0.7,  fats_100g: 0.2,  fiber_100g: 0,    sugar_100g: 0.7,  fatSat_100g: 0,    serving_size_g: 35  },
  { id: 'dt_45',  name: 'Ceci',                      category: 'Legumi',    kcal_100g: 164, proteins_100g: 8.9,  carbs_100g: 27,   fats_100g: 2.6,  fiber_100g: 7.6,  sugar_100g: 4.8,  fatSat_100g: 0.3  },
  { id: 'dt_46',  name: 'Fagioli cannellini',        category: 'Legumi',    kcal_100g: 135, proteins_100g: 9.7,  carbs_100g: 24,   fats_100g: 0.5,  fiber_100g: 7,    sugar_100g: 0.5,  fatSat_100g: 0.1  },
  { id: 'dt_47',  name: 'Piselli',                   category: 'Legumi',    kcal_100g: 81,  proteins_100g: 5.4,  carbs_100g: 14,   fats_100g: 0.4,  fiber_100g: 5.5,  sugar_100g: 5.5,  fatSat_100g: 0.1  },
  { id: 'dt_48',  name: 'Soia',                      category: 'Legumi',    kcal_100g: 173, proteins_100g: 17,   carbs_100g: 10,   fats_100g: 9,    fiber_100g: 9,    sugar_100g: 3,    fatSat_100g: 1.3  },
  { id: 'dt_49',  name: 'Pollo (coscia)',             category: 'Proteine',  kcal_100g: 174, proteins_100g: 26,   carbs_100g: 0,    fats_100g: 7.5,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 2    },
  { id: 'dt_50',  name: 'Agnello (coscia)',           category: 'Proteine',  kcal_100g: 195, proteins_100g: 28,   carbs_100g: 0,    fats_100g: 9,    fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 3.9  },

  // ─── Cereali / Grains ──────────────────────────────────────────────────────
  { id: 'dt_8',   name: 'Riso integrale',            category: 'Cereali',   kcal_100g: 216, proteins_100g: 5,    carbs_100g: 45,   fats_100g: 1.8,  fiber_100g: 3.5,  sugar_100g: 0.7,  fatSat_100g: 0.4,  serving_size_g: 80  },
  { id: 'dt_9',   name: 'Fiocchi di avena',          category: 'Cereali',   kcal_100g: 389, proteins_100g: 17,   carbs_100g: 66,   fats_100g: 7,    fiber_100g: 10.6, sugar_100g: 1,    fatSat_100g: 1.4,  serving_size_g: 50  },
  { id: 'dt_10',  name: 'Pane integrale',            category: 'Cereali',   kcal_100g: 247, proteins_100g: 13,   carbs_100g: 41,   fats_100g: 4.2,  fiber_100g: 7,    sugar_100g: 3.5,  fatSat_100g: 0.7,  serving_size_g: 50  },
  { id: 'dt_11',  name: 'Pasta (secca)',              category: 'Cereali',   kcal_100g: 371, proteins_100g: 13,   carbs_100g: 75,   fats_100g: 1.5,  fiber_100g: 3,    sugar_100g: 2.9,  fatSat_100g: 0.3,  serving_size_g: 80  },
  { id: 'dt_12',  name: 'Quinoa',                    category: 'Cereali',   kcal_100g: 368, proteins_100g: 14,   carbs_100g: 64,   fats_100g: 6,    fiber_100g: 7,    sugar_100g: 1.6,  fatSat_100g: 0.7,  serving_size_g: 80  },
  { id: 'dt_51',  name: 'Riso bianco',               category: 'Cereali',   kcal_100g: 365, proteins_100g: 7,    carbs_100g: 79,   fats_100g: 0.7,  fiber_100g: 1.3,  sugar_100g: 0,    fatSat_100g: 0.2,  serving_size_g: 80  },
  { id: 'dt_52',  name: 'Pane bianco',               category: 'Cereali',   kcal_100g: 265, proteins_100g: 9,    carbs_100g: 49,   fats_100g: 3.2,  fiber_100g: 2.7,  sugar_100g: 4.9,  fatSat_100g: 0.7,  serving_size_g: 50  },
  { id: 'dt_53',  name: 'Farro',                     category: 'Cereali',   kcal_100g: 338, proteins_100g: 15,   carbs_100g: 67,   fats_100g: 2.4,  fiber_100g: 7,    sugar_100g: 0.4,  fatSat_100g: 0.5,  serving_size_g: 80  },
  { id: 'dt_54',  name: 'Orzo perlato',              category: 'Cereali',   kcal_100g: 354, proteins_100g: 12,   carbs_100g: 73,   fats_100g: 2.3,  fiber_100g: 15.6, sugar_100g: 0.5,  fatSat_100g: 0.5,  serving_size_g: 80  },
  { id: 'dt_55',  name: 'Mais (granella)',            category: 'Cereali',   kcal_100g: 365, proteins_100g: 9,    carbs_100g: 74,   fats_100g: 4.7,  fiber_100g: 7.3,  sugar_100g: 3.2,  fatSat_100g: 0.7  },
  { id: 'dt_56',  name: 'Polenta (farina)',           category: 'Cereali',   kcal_100g: 362, proteins_100g: 8.7,  carbs_100g: 78,   fats_100g: 3.9,  fiber_100g: 3.4,  sugar_100g: 0.5,  fatSat_100g: 0.6,  serving_size_g: 80  },
  { id: 'dt_57',  name: 'Riso Basmati',              category: 'Cereali',   kcal_100g: 349, proteins_100g: 7.6,  carbs_100g: 77,   fats_100g: 0.6,  fiber_100g: 0.6,  sugar_100g: 0,    fatSat_100g: 0.2,  serving_size_g: 80  },
  { id: 'dt_58',  name: 'Pasta integrale',           category: 'Cereali',   kcal_100g: 348, proteins_100g: 13,   carbs_100g: 68,   fats_100g: 2.5,  fiber_100g: 8,    sugar_100g: 1.8,  fatSat_100g: 0.4,  serving_size_g: 80  },
  { id: 'dt_59',  name: 'Fette biscottate',          category: 'Cereali',   kcal_100g: 410, proteins_100g: 12,   carbs_100g: 74,   fats_100g: 8,    fiber_100g: 3.5,  sugar_100g: 5,    fatSat_100g: 1.5,  serving_size_g: 10  },
  { id: 'dt_60',  name: 'Grissini',                  category: 'Cereali',   kcal_100g: 415, proteins_100g: 11,   carbs_100g: 73,   fats_100g: 10,   fiber_100g: 2.9,  sugar_100g: 1.5,  fatSat_100g: 1.5,  serving_size_g: 20  },
  { id: 'dt_61',  name: 'Crackers (integrali)',       category: 'Cereali',   kcal_100g: 400, proteins_100g: 10,   carbs_100g: 65,   fats_100g: 12,   fiber_100g: 7,    sugar_100g: 1,    fatSat_100g: 1.5,  serving_size_g: 30  },
  { id: 'dt_62',  name: 'Gnocchi di patate',         category: 'Cereali',   kcal_100g: 170, proteins_100g: 3.5,  carbs_100g: 38,   fats_100g: 0.4,  fiber_100g: 2,    sugar_100g: 0.7,  fatSat_100g: 0.1,  serving_size_g: 200 },
  { id: 'dt_63',  name: 'Couscous',                  category: 'Cereali',   kcal_100g: 376, proteins_100g: 13,   carbs_100g: 77,   fats_100g: 0.6,  fiber_100g: 2.2,  sugar_100g: 0.5,  fatSat_100g: 0.1,  serving_size_g: 80  },
  { id: 'dt_64',  name: 'Amaranto',                  category: 'Cereali',   kcal_100g: 371, proteins_100g: 14,   carbs_100g: 65,   fats_100g: 7,    fiber_100g: 6.7,  sugar_100g: 2,    fatSat_100g: 1.5,  serving_size_g: 80  },

  // ─── Verdure / Vegetables ──────────────────────────────────────────────────
  { id: 'dt_13',  name: 'Patata dolce',              category: 'Verdure',   kcal_100g: 86,  proteins_100g: 1.6,  carbs_100g: 20,   fats_100g: 0.1,  fiber_100g: 3,    sugar_100g: 4.2,  fatSat_100g: 0    },
  { id: 'dt_14',  name: 'Broccoli',                  category: 'Verdure',   kcal_100g: 34,  proteins_100g: 2.8,  carbs_100g: 7,    fats_100g: 0.4,  fiber_100g: 2.6,  sugar_100g: 1.7,  fatSat_100g: 0.1  },
  { id: 'dt_15',  name: 'Spinaci',                   category: 'Verdure',   kcal_100g: 23,  proteins_100g: 2.9,  carbs_100g: 3.6,  fats_100g: 0.4,  fiber_100g: 2.2,  sugar_100g: 0.4,  fatSat_100g: 0.1  },
  { id: 'dt_16',  name: 'Carote',                    category: 'Verdure',   kcal_100g: 41,  proteins_100g: 0.9,  carbs_100g: 10,   fats_100g: 0.2,  fiber_100g: 2.8,  sugar_100g: 4.7,  fatSat_100g: 0    },
  { id: 'dt_17',  name: 'Peperone',                  category: 'Verdure',   kcal_100g: 31,  proteins_100g: 1,    carbs_100g: 6,    fats_100g: 0.3,  fiber_100g: 2.1,  sugar_100g: 4.2,  fatSat_100g: 0    },
  { id: 'dt_18',  name: 'Pomodoro',                  category: 'Verdure',   kcal_100g: 18,  proteins_100g: 0.9,  carbs_100g: 3.9,  fats_100g: 0.2,  fiber_100g: 1.2,  sugar_100g: 2.6,  fatSat_100g: 0    },
  { id: 'dt_65',  name: 'Zucchina',                  category: 'Verdure',   kcal_100g: 17,  proteins_100g: 1.2,  carbs_100g: 3.1,  fats_100g: 0.3,  fiber_100g: 1,    sugar_100g: 2.5,  fatSat_100g: 0.1  },
  { id: 'dt_66',  name: 'Melanzana',                 category: 'Verdure',   kcal_100g: 25,  proteins_100g: 1,    carbs_100g: 5.9,  fats_100g: 0.2,  fiber_100g: 3,    sugar_100g: 3.5,  fatSat_100g: 0    },
  { id: 'dt_67',  name: 'Cipolla',                   category: 'Verdure',   kcal_100g: 40,  proteins_100g: 1.1,  carbs_100g: 9.3,  fats_100g: 0.1,  fiber_100g: 1.7,  sugar_100g: 4.2,  fatSat_100g: 0    },
  { id: 'dt_68',  name: 'Aglio',                     category: 'Verdure',   kcal_100g: 149, proteins_100g: 6.4,  carbs_100g: 33,   fats_100g: 0.5,  fiber_100g: 2.1,  sugar_100g: 1,    fatSat_100g: 0.1  },
  { id: 'dt_69',  name: 'Lattuga',                   category: 'Verdure',   kcal_100g: 15,  proteins_100g: 1.4,  carbs_100g: 2.9,  fats_100g: 0.2,  fiber_100g: 1.3,  sugar_100g: 0.8,  fatSat_100g: 0    },
  { id: 'dt_70',  name: 'Cetriolo',                  category: 'Verdure',   kcal_100g: 15,  proteins_100g: 0.7,  carbs_100g: 3.6,  fats_100g: 0.1,  fiber_100g: 0.5,  sugar_100g: 1.7,  fatSat_100g: 0    },
  { id: 'dt_71',  name: 'Sedano',                    category: 'Verdure',   kcal_100g: 16,  proteins_100g: 0.7,  carbs_100g: 3,    fats_100g: 0.2,  fiber_100g: 1.6,  sugar_100g: 1.3,  fatSat_100g: 0    },
  { id: 'dt_72',  name: 'Funghi champignon',         category: 'Verdure',   kcal_100g: 22,  proteins_100g: 3.1,  carbs_100g: 3.3,  fats_100g: 0.3,  fiber_100g: 1,    sugar_100g: 1.7,  fatSat_100g: 0    },
  { id: 'dt_73',  name: 'Cavolfiore',                category: 'Verdure',   kcal_100g: 25,  proteins_100g: 1.9,  carbs_100g: 5,    fats_100g: 0.3,  fiber_100g: 2,    sugar_100g: 2.4,  fatSat_100g: 0    },
  { id: 'dt_74',  name: 'Cavolini di Bruxelles',     category: 'Verdure',   kcal_100g: 43,  proteins_100g: 3.4,  carbs_100g: 9,    fats_100g: 0.3,  fiber_100g: 3.8,  sugar_100g: 2.2,  fatSat_100g: 0.1  },
  { id: 'dt_75',  name: 'Asparagi',                  category: 'Verdure',   kcal_100g: 20,  proteins_100g: 2.2,  carbs_100g: 3.9,  fats_100g: 0.1,  fiber_100g: 2.1,  sugar_100g: 1.9,  fatSat_100g: 0    },
  { id: 'dt_76',  name: 'Carciofo',                  category: 'Verdure',   kcal_100g: 47,  proteins_100g: 3.3,  carbs_100g: 11,   fats_100g: 0.2,  fiber_100g: 5.4,  sugar_100g: 3.3,  fatSat_100g: 0    },
  { id: 'dt_77',  name: 'Radicchio',                 category: 'Verdure',   kcal_100g: 23,  proteins_100g: 1.4,  carbs_100g: 4.5,  fats_100g: 0.3,  fiber_100g: 1.6,  sugar_100g: 1.5,  fatSat_100g: 0    },
  { id: 'dt_78',  name: 'Finocchio',                 category: 'Verdure',   kcal_100g: 31,  proteins_100g: 1.2,  carbs_100g: 7.3,  fats_100g: 0.2,  fiber_100g: 3.1,  sugar_100g: 3.9,  fatSat_100g: 0    },
  { id: 'dt_79',  name: 'Rucola',                    category: 'Verdure',   kcal_100g: 25,  proteins_100g: 2.6,  carbs_100g: 3.7,  fats_100g: 0.7,  fiber_100g: 1.6,  sugar_100g: 2.1,  fatSat_100g: 0.1  },
  { id: 'dt_80',  name: 'Patate',                    category: 'Verdure',   kcal_100g: 77,  proteins_100g: 2,    carbs_100g: 17,   fats_100g: 0.1,  fiber_100g: 2.1,  sugar_100g: 0.8,  fatSat_100g: 0    },
  { id: 'dt_81',  name: 'Cavolo nero',               category: 'Verdure',   kcal_100g: 35,  proteins_100g: 2.9,  carbs_100g: 7.3,  fats_100g: 0.5,  fiber_100g: 4.1,  sugar_100g: 0.4,  fatSat_100g: 0.1  },
  { id: 'dt_82',  name: 'Porri',                     category: 'Verdure',   kcal_100g: 61,  proteins_100g: 1.5,  carbs_100g: 14,   fats_100g: 0.3,  fiber_100g: 1.8,  sugar_100g: 3.9,  fatSat_100g: 0    },
  { id: 'dt_83',  name: 'Bietola',                   category: 'Verdure',   kcal_100g: 19,  proteins_100g: 1.8,  carbs_100g: 3.8,  fats_100g: 0.1,  fiber_100g: 1.6,  sugar_100g: 1.1,  fatSat_100g: 0    },

  // ─── Frutta / Fruits ───────────────────────────────────────────────────────
  { id: 'dt_19',  name: 'Banana',                    category: 'Frutta',    kcal_100g: 89,  proteins_100g: 1.1,  carbs_100g: 23,   fats_100g: 0.3,  fiber_100g: 2.6,  sugar_100g: 12,   fatSat_100g: 0.1  },
  { id: 'dt_20',  name: 'Mela',                      category: 'Frutta',    kcal_100g: 52,  proteins_100g: 0.3,  carbs_100g: 14,   fats_100g: 0.2,  fiber_100g: 2.4,  sugar_100g: 10.4, fatSat_100g: 0    },
  { id: 'dt_21',  name: 'Mirtilli',                  category: 'Frutta',    kcal_100g: 57,  proteins_100g: 0.7,  carbs_100g: 14,   fats_100g: 0.3,  fiber_100g: 2.4,  sugar_100g: 10,   fatSat_100g: 0    },
  { id: 'dt_22',  name: 'Arancia',                   category: 'Frutta',    kcal_100g: 47,  proteins_100g: 0.9,  carbs_100g: 12,   fats_100g: 0.1,  fiber_100g: 2.4,  sugar_100g: 9.4,  fatSat_100g: 0    },
  { id: 'dt_23',  name: 'Fragole',                   category: 'Frutta',    kcal_100g: 32,  proteins_100g: 0.7,  carbs_100g: 7.7,  fats_100g: 0.3,  fiber_100g: 2,    sugar_100g: 4.9,  fatSat_100g: 0    },
  { id: 'dt_84',  name: 'Pera',                      category: 'Frutta',    kcal_100g: 57,  proteins_100g: 0.4,  carbs_100g: 15,   fats_100g: 0.1,  fiber_100g: 3.1,  sugar_100g: 10,   fatSat_100g: 0    },
  { id: 'dt_85',  name: 'Uva',                       category: 'Frutta',    kcal_100g: 67,  proteins_100g: 0.6,  carbs_100g: 17,   fats_100g: 0.4,  fiber_100g: 0.9,  sugar_100g: 15.5, fatSat_100g: 0.1  },
  { id: 'dt_86',  name: 'Mango',                     category: 'Frutta',    kcal_100g: 60,  proteins_100g: 0.8,  carbs_100g: 15,   fats_100g: 0.4,  fiber_100g: 1.6,  sugar_100g: 13.7, fatSat_100g: 0.1  },
  { id: 'dt_87',  name: 'Kiwi',                      category: 'Frutta',    kcal_100g: 61,  proteins_100g: 1.1,  carbs_100g: 15,   fats_100g: 0.5,  fiber_100g: 3,    sugar_100g: 9,    fatSat_100g: 0    },
  { id: 'dt_88',  name: 'Pesca',                     category: 'Frutta',    kcal_100g: 39,  proteins_100g: 0.9,  carbs_100g: 10,   fats_100g: 0.3,  fiber_100g: 1.5,  sugar_100g: 8.4,  fatSat_100g: 0    },
  { id: 'dt_89',  name: 'Albicocca',                 category: 'Frutta',    kcal_100g: 48,  proteins_100g: 1.4,  carbs_100g: 11,   fats_100g: 0.4,  fiber_100g: 2,    sugar_100g: 9.2,  fatSat_100g: 0    },
  { id: 'dt_90',  name: 'Lamponi',                   category: 'Frutta',    kcal_100g: 52,  proteins_100g: 1.2,  carbs_100g: 12,   fats_100g: 0.7,  fiber_100g: 6.5,  sugar_100g: 4.4,  fatSat_100g: 0    },
  { id: 'dt_91',  name: 'Ananas',                    category: 'Frutta',    kcal_100g: 50,  proteins_100g: 0.5,  carbs_100g: 13,   fats_100g: 0.1,  fiber_100g: 1.4,  sugar_100g: 9.9,  fatSat_100g: 0    },
  { id: 'dt_92',  name: 'Limone',                    category: 'Frutta',    kcal_100g: 29,  proteins_100g: 1.1,  carbs_100g: 9,    fats_100g: 0.3,  fiber_100g: 2.8,  sugar_100g: 2.5,  fatSat_100g: 0    },
  { id: 'dt_93',  name: 'Melone',                    category: 'Frutta',    kcal_100g: 34,  proteins_100g: 0.8,  carbs_100g: 8,    fats_100g: 0.2,  fiber_100g: 0.9,  sugar_100g: 7.9,  fatSat_100g: 0    },
  { id: 'dt_94',  name: 'Cocomero',                  category: 'Frutta',    kcal_100g: 30,  proteins_100g: 0.6,  carbs_100g: 7.6,  fats_100g: 0.2,  fiber_100g: 0.4,  sugar_100g: 6.2,  fatSat_100g: 0    },
  { id: 'dt_95',  name: 'Ciliegie',                  category: 'Frutta',    kcal_100g: 63,  proteins_100g: 1.1,  carbs_100g: 16,   fats_100g: 0.2,  fiber_100g: 2.1,  sugar_100g: 12.8, fatSat_100g: 0.1  },
  { id: 'dt_96',  name: 'Prugne',                    category: 'Frutta',    kcal_100g: 46,  proteins_100g: 0.7,  carbs_100g: 11,   fats_100g: 0.3,  fiber_100g: 1.4,  sugar_100g: 9.9,  fatSat_100g: 0    },
  { id: 'dt_97',  name: 'Melograno',                 category: 'Frutta',    kcal_100g: 83,  proteins_100g: 1.7,  carbs_100g: 19,   fats_100g: 1.2,  fiber_100g: 4,    sugar_100g: 13.7, fatSat_100g: 0.1  },
  { id: 'dt_98',  name: 'Fico',                      category: 'Frutta',    kcal_100g: 74,  proteins_100g: 0.8,  carbs_100g: 19,   fats_100g: 0.3,  fiber_100g: 2.9,  sugar_100g: 16.3, fatSat_100g: 0    },

  // ─── Latticini / Dairy ─────────────────────────────────────────────────────
  { id: 'dt_5',   name: 'Yogurt greco',              category: 'Latticini', kcal_100g: 59,  proteins_100g: 10,   carbs_100g: 3.6,  fats_100g: 0.4,  fiber_100g: 0,    sugar_100g: 3.2,  fatSat_100g: 0.1,  serving_size_g: 150 },
  { id: 'dt_6',   name: 'Latte intero',              category: 'Latticini', kcal_100g: 61,  proteins_100g: 3.2,  carbs_100g: 4.8,  fats_100g: 3.3,  fiber_100g: 0,    sugar_100g: 4.8,  fatSat_100g: 2,    serving_size_g: 200 },
  { id: 'dt_7',   name: 'Formaggio Cheddar',         category: 'Latticini', kcal_100g: 403, proteins_100g: 25,   carbs_100g: 1.3,  fats_100g: 33,   fiber_100g: 0,    sugar_100g: 0.5,  fatSat_100g: 21   },
  { id: 'dt_99',  name: 'Mozzarella',                category: 'Latticini', kcal_100g: 280, proteins_100g: 20,   carbs_100g: 2.2,  fats_100g: 22,   fiber_100g: 0,    sugar_100g: 1.1,  fatSat_100g: 14   },
  { id: 'dt_100', name: 'Ricotta',                   category: 'Latticini', kcal_100g: 174, proteins_100g: 11,   carbs_100g: 3,    fats_100g: 13,   fiber_100g: 0,    sugar_100g: 2.2,  fatSat_100g: 8    },
  { id: 'dt_101', name: 'Parmigiano Reggiano',       category: 'Latticini', kcal_100g: 392, proteins_100g: 33,   carbs_100g: 0,    fats_100g: 28,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 18,   serving_size_g: 30  },
  { id: 'dt_102', name: 'Grana Padano',              category: 'Latticini', kcal_100g: 384, proteins_100g: 33,   carbs_100g: 0,    fats_100g: 27,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 17,   serving_size_g: 30  },
  { id: 'dt_103', name: 'Latte scremato',            category: 'Latticini', kcal_100g: 35,  proteins_100g: 3.4,  carbs_100g: 5,    fats_100g: 0.1,  fiber_100g: 0,    sugar_100g: 5,    fatSat_100g: 0.1,  serving_size_g: 200 },
  { id: 'dt_104', name: 'Yogurt naturale',           category: 'Latticini', kcal_100g: 61,  proteins_100g: 3.5,  carbs_100g: 4.7,  fats_100g: 3.3,  fiber_100g: 0,    sugar_100g: 4.7,  fatSat_100g: 2.1,  serving_size_g: 125 },
  { id: 'dt_105', name: 'Formaggio spalmabile',      category: 'Latticini', kcal_100g: 342, proteins_100g: 7,    carbs_100g: 4.1,  fats_100g: 33,   fiber_100g: 0,    sugar_100g: 3.5,  fatSat_100g: 21   },
  { id: 'dt_106', name: 'Burrata',                   category: 'Latticini', kcal_100g: 330, proteins_100g: 15,   carbs_100g: 2,    fats_100g: 30,   fiber_100g: 0,    sugar_100g: 0.7,  fatSat_100g: 19   },
  { id: 'dt_107', name: 'Stracchino',                category: 'Latticini', kcal_100g: 300, proteins_100g: 16,   carbs_100g: 2,    fats_100g: 26,   fiber_100g: 0,    sugar_100g: 0.8,  fatSat_100g: 17   },
  { id: 'dt_108', name: 'Pecorino',                  category: 'Latticini', kcal_100g: 387, proteins_100g: 26,   carbs_100g: 0.5,  fats_100g: 31,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 20   },
  { id: 'dt_109', name: 'Kefir',                     category: 'Latticini', kcal_100g: 64,  proteins_100g: 3.3,  carbs_100g: 4.5,  fats_100g: 3.5,  fiber_100g: 0,    sugar_100g: 4.1,  fatSat_100g: 2.3  },
  { id: 'dt_110', name: 'Latte di soia',             category: 'Latticini', kcal_100g: 54,  proteins_100g: 3.6,  carbs_100g: 6.3,  fats_100g: 1.8,  fiber_100g: 0.4,  sugar_100g: 5.5,  fatSat_100g: 0.2,  serving_size_g: 200 },

  // ─── Grassi / Fats ─────────────────────────────────────────────────────────
  { id: 'dt_24',  name: 'Avocado',                   category: 'Grassi',    kcal_100g: 160, proteins_100g: 2,    carbs_100g: 9,    fats_100g: 15,   fiber_100g: 6.7,  sugar_100g: 0.7,  fatSat_100g: 2.1  },
  { id: 'dt_25',  name: 'Mandorle',                  category: 'Grassi',    kcal_100g: 579, proteins_100g: 21,   carbs_100g: 22,   fats_100g: 50,   fiber_100g: 12.5, sugar_100g: 4.4,  fatSat_100g: 3.8,  serving_size_g: 30  },
  { id: 'dt_26',  name: 'Olio extravergine',         category: 'Grassi',    kcal_100g: 884, proteins_100g: 0,    carbs_100g: 0,    fats_100g: 100,  fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 14,   serving_size_g: 10  },
  { id: 'dt_27',  name: 'Burro di arachidi',         category: 'Grassi',    kcal_100g: 588, proteins_100g: 25,   carbs_100g: 20,   fats_100g: 50,   fiber_100g: 5.9,  sugar_100g: 9,    fatSat_100g: 10,   serving_size_g: 32  },
  { id: 'dt_28',  name: 'Noci',                      category: 'Grassi',    kcal_100g: 654, proteins_100g: 15,   carbs_100g: 14,   fats_100g: 65,   fiber_100g: 6.7,  sugar_100g: 2.6,  fatSat_100g: 6,    serving_size_g: 30  },
  { id: 'dt_111', name: 'Semi di chia',              category: 'Grassi',    kcal_100g: 486, proteins_100g: 17,   carbs_100g: 42,   fats_100g: 31,   fiber_100g: 34.4, sugar_100g: 0,    fatSat_100g: 3.3,  serving_size_g: 15  },
  { id: 'dt_112', name: 'Semi di lino',              category: 'Grassi',    kcal_100g: 534, proteins_100g: 18,   carbs_100g: 29,   fats_100g: 42,   fiber_100g: 27.3, sugar_100g: 1.6,  fatSat_100g: 3.7,  serving_size_g: 15  },
  { id: 'dt_113', name: 'Semi di girasole',          category: 'Grassi',    kcal_100g: 584, proteins_100g: 21,   carbs_100g: 20,   fats_100g: 51,   fiber_100g: 8.6,  sugar_100g: 2.7,  fatSat_100g: 4.5,  serving_size_g: 30  },
  { id: 'dt_114', name: 'Semi di zucca',             category: 'Grassi',    kcal_100g: 559, proteins_100g: 30,   carbs_100g: 11,   fats_100g: 49,   fiber_100g: 6,    sugar_100g: 1.4,  fatSat_100g: 8.7,  serving_size_g: 30  },
  { id: 'dt_115', name: 'Anacardi',                  category: 'Grassi',    kcal_100g: 553, proteins_100g: 18,   carbs_100g: 30,   fats_100g: 44,   fiber_100g: 3.3,  sugar_100g: 5.9,  fatSat_100g: 7.8,  serving_size_g: 30  },
  { id: 'dt_116', name: 'Pistacchi',                 category: 'Grassi',    kcal_100g: 562, proteins_100g: 20,   carbs_100g: 28,   fats_100g: 45,   fiber_100g: 10.6, sugar_100g: 8,    fatSat_100g: 5.9,  serving_size_g: 30  },
  { id: 'dt_117', name: 'Nocciole',                  category: 'Grassi',    kcal_100g: 628, proteins_100g: 15,   carbs_100g: 17,   fats_100g: 61,   fiber_100g: 9.7,  sugar_100g: 4.3,  fatSat_100g: 4.5,  serving_size_g: 30  },
  { id: 'dt_118', name: 'Olio di cocco',             category: 'Grassi',    kcal_100g: 892, proteins_100g: 0,    carbs_100g: 0,    fats_100g: 99,   fiber_100g: 0,    sugar_100g: 0,    fatSat_100g: 87,   serving_size_g: 10  },
  { id: 'dt_119', name: 'Burro',                     category: 'Grassi',    kcal_100g: 717, proteins_100g: 0.9,  carbs_100g: 0.1,  fats_100g: 81,   fiber_100g: 0,    sugar_100g: 0.1,  fatSat_100g: 51,   serving_size_g: 10  },
  { id: 'dt_120', name: 'Tahini (pasta sesamo)',      category: 'Grassi',    kcal_100g: 595, proteins_100g: 17,   carbs_100g: 21,   fats_100g: 54,   fiber_100g: 9.3,  sugar_100g: 0.5,  fatSat_100g: 7.6,  serving_size_g: 15  },

  // ─── Proteine (aggiunte) ──────────────────────────────────────────────
  { id: 'dt_121', name: 'Coniglio', category: 'Proteine', kcal_100g: 137, proteins_100g: 20.1, carbs_100g: 0, fats_100g: 6.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.0 },
  { id: 'dt_122', name: 'Agnello', category: 'Proteine', kcal_100g: 234, proteins_100g: 20, carbs_100g: 0, fats_100g: 17, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8 },
  { id: 'dt_123', name: 'Vitello', category: 'Proteine', kcal_100g: 144, proteins_100g: 21, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.2 },
  { id: 'dt_124', name: 'Spigola', category: 'Proteine', kcal_100g: 97, proteins_100g: 18.4, carbs_100g: 0.7, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6 },
  { id: 'dt_125', name: 'Orata', category: 'Proteine', kcal_100g: 100, proteins_100g: 19, carbs_100g: 0.7, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7 },
  { id: 'dt_126', name: 'Trota', category: 'Proteine', kcal_100g: 119, proteins_100g: 20, carbs_100g: 0, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8 },
  { id: 'dt_127', name: 'Polpo', category: 'Proteine', kcal_100g: 82, proteins_100g: 15, carbs_100g: 2.2, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_128', name: 'Calamari', category: 'Proteine', kcal_100g: 92, proteins_100g: 16, carbs_100g: 3.1, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_129', name: 'Sogliola', category: 'Proteine', kcal_100g: 86, proteins_100g: 17, carbs_100g: 0, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_130', name: 'Platessa', category: 'Proteine', kcal_100g: 91, proteins_100g: 19, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_131', name: 'Acciughe', category: 'Proteine', kcal_100g: 131, proteins_100g: 20, carbs_100g: 0, fats_100g: 5.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.3 },
  { id: 'dt_132', name: 'Seppia', category: 'Proteine', kcal_100g: 79, proteins_100g: 16, carbs_100g: 0.8, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1 },
  { id: 'dt_133', name: 'Tonno fresco', category: 'Proteine', kcal_100g: 144, proteins_100g: 23, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.3 },
  { id: 'dt_134', name: 'Baccalà', category: 'Proteine', kcal_100g: 78, proteins_100g: 18, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1 },
  { id: 'dt_135', name: 'Salsiccia di pollo', category: 'Proteine', kcal_100g: 172, proteins_100g: 17, carbs_100g: 1, fats_100g: 11, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 3 },
  { id: 'dt_136', name: 'Hamburger di manzo', category: 'Proteine', kcal_100g: 254, proteins_100g: 17, carbs_100g: 0, fats_100g: 20, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8 },
  { id: 'dt_137', name: 'Fegato di bovino', category: 'Proteine', kcal_100g: 140, proteins_100g: 21, carbs_100g: 4, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5 },
  { id: 'dt_138', name: 'Petto d\'anatra', category: 'Proteine', kcal_100g: 135, proteins_100g: 24, carbs_100g: 0, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5 },
  { id: 'dt_139', name: 'Quaglia', category: 'Proteine', kcal_100g: 134, proteins_100g: 22, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4 },

  // ─── Legumi (aggiunte) ────────────────────────────────────────────────
  { id: 'dt_140', name: 'Fave', category: 'Legumi', kcal_100g: 88, proteins_100g: 7.9, carbs_100g: 13, fats_100g: 0.7, fiber_100g: 5.4, sugar_100g: 3, fatSat_100g: 0.1 },
  { id: 'dt_141', name: 'Soia secca', category: 'Legumi', kcal_100g: 446, proteins_100g: 37, carbs_100g: 30, fats_100g: 20, fiber_100g: 9.3, sugar_100g: 7, fatSat_100g: 2.9 },
  { id: 'dt_142', name: 'Lupini', category: 'Legumi', kcal_100g: 119, proteins_100g: 16, carbs_100g: 10, fats_100g: 2.9, fiber_100g: 2.8, sugar_100g: 1, fatSat_100g: 0.3 },
  { id: 'dt_143', name: 'Edamame', category: 'Legumi', kcal_100g: 122, proteins_100g: 11, carbs_100g: 9, fats_100g: 5, fiber_100g: 5, sugar_100g: 2.2, fatSat_100g: 0.6 },
  { id: 'dt_144', name: 'Fagioli borlotti', category: 'Legumi', kcal_100g: 130, proteins_100g: 9, carbs_100g: 23, fats_100g: 0.5, fiber_100g: 5, sugar_100g: 1.8, fatSat_100g: 0.1 },
  { id: 'dt_145', name: 'Fagioli rossi', category: 'Legumi', kcal_100g: 127, proteins_100g: 8.7, carbs_100g: 22, fats_100g: 0.5, fiber_100g: 6.4, sugar_100g: 0.3, fatSat_100g: 0.1 },

  // ─── Cereali (aggiunte) ───────────────────────────────────────────────
  { id: 'dt_146', name: 'Grano saraceno', category: 'Cereali', kcal_100g: 343, proteins_100g: 13, carbs_100g: 72, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_147', name: 'Miglio', category: 'Cereali', kcal_100g: 378, proteins_100g: 11, carbs_100g: 73, fats_100g: 4.2, fiber_100g: 8.5, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_148', name: 'Corn flakes', category: 'Cereali', kcal_100g: 378, proteins_100g: 7, carbs_100g: 84, fats_100g: 0.9, fiber_100g: 3.3, sugar_100g: 8, fatSat_100g: 0.2, serving_size_g: 40 },
  { id: 'dt_149', name: 'Muesli', category: 'Cereali', kcal_100g: 370, proteins_100g: 10, carbs_100g: 67, fats_100g: 7, fiber_100g: 8, sugar_100g: 20, fatSat_100g: 1.3, serving_size_g: 50 },
  { id: 'dt_150', name: 'Pasta all\'uovo', category: 'Cereali', kcal_100g: 361, proteins_100g: 13, carbs_100g: 68, fats_100g: 4, fiber_100g: 2.7, sugar_100g: 3, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_151', name: 'Pasta di legumi', category: 'Cereali', kcal_100g: 335, proteins_100g: 22, carbs_100g: 50, fats_100g: 3.5, fiber_100g: 12, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_152', name: 'Tortillas', category: 'Cereali', kcal_100g: 306, proteins_100g: 8, carbs_100g: 50, fats_100g: 8, fiber_100g: 3.5, sugar_100g: 3, fatSat_100g: 1.2, serving_size_g: 40 },

  // ─── Verdure (aggiunte) ───────────────────────────────────────────────
  { id: 'dt_153', name: 'Barbabietola', category: 'Verdure', kcal_100g: 43, proteins_100g: 1.6, carbs_100g: 10, fats_100g: 0.2, fiber_100g: 2.8, sugar_100g: 7, fatSat_100g: 0 },
  { id: 'dt_154', name: 'Cavolo verza', category: 'Verdure', kcal_100g: 27, proteins_100g: 2, carbs_100g: 6, fats_100g: 0.1, fiber_100g: 3.1, sugar_100g: 2.3, fatSat_100g: 0 },
  { id: 'dt_155', name: 'Rape', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 6, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 3.8, fatSat_100g: 0 },
  { id: 'dt_156', name: 'Scalogno', category: 'Verdure', kcal_100g: 72, proteins_100g: 2.5, carbs_100g: 17, fats_100g: 0.1, fiber_100g: 3.2, sugar_100g: 8, fatSat_100g: 0 },
  { id: 'dt_157', name: 'Mais dolce', category: 'Verdure', kcal_100g: 86, proteins_100g: 3.2, carbs_100g: 19, fats_100g: 1.2, fiber_100g: 2.7, sugar_100g: 3.2, fatSat_100g: 0.2 },
  { id: 'dt_158', name: 'Olive verdi', category: 'Verdure', kcal_100g: 145, proteins_100g: 1, carbs_100g: 3.8, fats_100g: 15.3, fiber_100g: 3.3, sugar_100g: 0.5, fatSat_100g: 2 },
  { id: 'dt_159', name: 'Olive nere', category: 'Verdure', kcal_100g: 116, proteins_100g: 0.8, carbs_100g: 6.3, fats_100g: 10.7, fiber_100g: 3.2, sugar_100g: 0, fatSat_100g: 1.4 },
  { id: 'dt_160', name: 'Funghi porcini', category: 'Verdure', kcal_100g: 27, proteins_100g: 3.1, carbs_100g: 3.3, fats_100g: 0.4, fiber_100g: 2, sugar_100g: 1.5, fatSat_100g: 0 },
  { id: 'dt_161', name: 'Germogli di soia', category: 'Verdure', kcal_100g: 31, proteins_100g: 3.2, carbs_100g: 4.2, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 0.6, fatSat_100g: 0 },
  { id: 'dt_162', name: 'Indivia', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.3, carbs_100g: 3.4, fats_100g: 0.2, fiber_100g: 3.1, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_163', name: 'Scarola', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.5, carbs_100g: 3.9, fats_100g: 0.2, fiber_100g: 3, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_164', name: 'Cetriolo sottaceto', category: 'Verdure', kcal_100g: 14, proteins_100g: 0.5, carbs_100g: 2.6, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 1.1, fatSat_100g: 0 },

  // ─── Frutta (aggiunte) ────────────────────────────────────────────────
  { id: 'dt_165', name: 'Pompelmo', category: 'Frutta', kcal_100g: 42, proteins_100g: 0.8, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 7, fatSat_100g: 0 },
  { id: 'dt_166', name: 'Mandarino', category: 'Frutta', kcal_100g: 53, proteins_100g: 0.8, carbs_100g: 13, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 11, fatSat_100g: 0 },
  { id: 'dt_167', name: 'Lime', category: 'Frutta', kcal_100g: 30, proteins_100g: 0.7, carbs_100g: 11, fats_100g: 0.2, fiber_100g: 2.8, sugar_100g: 1.7, fatSat_100g: 0 },
  { id: 'dt_168', name: 'Cocco fresco', category: 'Frutta', kcal_100g: 354, proteins_100g: 3.3, carbs_100g: 15, fats_100g: 33, fiber_100g: 9, sugar_100g: 6.2, fatSat_100g: 30 },
  { id: 'dt_169', name: 'Cocco secco', category: 'Frutta', kcal_100g: 650, proteins_100g: 6.9, carbs_100g: 24, fats_100g: 65, fiber_100g: 16, sugar_100g: 7.4, fatSat_100g: 57 },
  { id: 'dt_170', name: 'Dattero', category: 'Frutta', kcal_100g: 277, proteins_100g: 1.8, carbs_100g: 75, fats_100g: 0.2, fiber_100g: 7, sugar_100g: 63, fatSat_100g: 0 },
  { id: 'dt_171', name: 'Frutto della passione', category: 'Frutta', kcal_100g: 97, proteins_100g: 2.2, carbs_100g: 23, fats_100g: 0.7, fiber_100g: 10, sugar_100g: 11, fatSat_100g: 0 },
  { id: 'dt_172', name: 'Papaya', category: 'Frutta', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 8, fatSat_100g: 0.1 },
  { id: 'dt_173', name: 'Litchi', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.8, carbs_100g: 17, fats_100g: 0.4, fiber_100g: 1.3, sugar_100g: 15, fatSat_100g: 0.1 },
  { id: 'dt_174', name: 'Frutti di bosco', category: 'Frutta', kcal_100g: 46, proteins_100g: 0.9, carbs_100g: 11, fats_100g: 0.3, fiber_100g: 3, sugar_100g: 5, fatSat_100g: 0 },
  { id: 'dt_175', name: 'More', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 10, fats_100g: 0.5, fiber_100g: 5.3, sugar_100g: 4.9, fatSat_100g: 0 },
  { id: 'dt_176', name: 'Ribes', category: 'Frutta', kcal_100g: 56, proteins_100g: 1.4, carbs_100g: 14, fats_100g: 0.4, fiber_100g: 4.3, sugar_100g: 7.4, fatSat_100g: 0 },
  { id: 'dt_177', name: 'Uva sultanina', category: 'Frutta', kcal_100g: 299, proteins_100g: 3.1, carbs_100g: 79, fats_100g: 0.5, fiber_100g: 3.7, sugar_100g: 59, fatSat_100g: 0.1 },
  { id: 'dt_178', name: 'Albicocche secche', category: 'Frutta', kcal_100g: 241, proteins_100g: 3.4, carbs_100g: 63, fats_100g: 0.5, fiber_100g: 7.3, sugar_100g: 53, fatSat_100g: 0 },
  { id: 'dt_179', name: 'Prugne secche', category: 'Frutta', kcal_100g: 240, proteins_100g: 2.2, carbs_100g: 64, fats_100g: 0.4, fiber_100g: 7.1, sugar_100g: 38, fatSat_100g: 0 },
  { id: 'dt_180', name: 'Fichi secchi', category: 'Frutta', kcal_100g: 249, proteins_100g: 3.3, carbs_100g: 64, fats_100g: 0.9, fiber_100g: 9.8, sugar_100g: 48, fatSat_100g: 0.1 },
  { id: 'dt_181', name: 'Castagne', category: 'Frutta', kcal_100g: 196, proteins_100g: 2.4, carbs_100g: 45, fats_100g: 1.3, fiber_100g: 5.1, sugar_100g: 11, fatSat_100g: 0.2 },
  { id: 'dt_182', name: 'Nespola', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 12, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 8, fatSat_100g: 0 },
  { id: 'dt_183', name: 'Cachi', category: 'Frutta', kcal_100g: 65, proteins_100g: 0.6, carbs_100g: 18, fats_100g: 0.2, fiber_100g: 3.6, sugar_100g: 13, fatSat_100g: 0 },

  // ─── Latticini (aggiunte) ─────────────────────────────────────────────
  { id: 'dt_184', name: 'Mascarpone', category: 'Latticini', kcal_100g: 429, proteins_100g: 5, carbs_100g: 1, fats_100g: 44, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 29 },
  { id: 'dt_185', name: 'Gorgonzola', category: 'Latticini', kcal_100g: 353, proteins_100g: 19, carbs_100g: 0, fats_100g: 31, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19 },
  { id: 'dt_186', name: 'Provolone', category: 'Latticini', kcal_100g: 351, proteins_100g: 26, carbs_100g: 2.1, fats_100g: 27, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 17 },
  { id: 'dt_187', name: 'Asiago', category: 'Latticini', kcal_100g: 356, proteins_100g: 28, carbs_100g: 0, fats_100g: 27, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17 },
  { id: 'dt_188', name: 'Fontina', category: 'Latticini', kcal_100g: 389, proteins_100g: 25, carbs_100g: 1.6, fats_100g: 31, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19 },
  { id: 'dt_189', name: 'Scamorza', category: 'Latticini', kcal_100g: 300, proteins_100g: 24, carbs_100g: 1, fats_100g: 22, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14 },
  { id: 'dt_190', name: 'Fiordilatte', category: 'Latticini', kcal_100g: 270, proteins_100g: 18, carbs_100g: 2, fats_100g: 21, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 13 },
  { id: 'dt_191', name: 'Caciotta', category: 'Latticini', kcal_100g: 360, proteins_100g: 25, carbs_100g: 0.5, fats_100g: 29, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18 },
  { id: 'dt_192', name: 'Emmental', category: 'Latticini', kcal_100g: 379, proteins_100g: 29, carbs_100g: 0, fats_100g: 29, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18 },
  { id: 'dt_193', name: 'Panna da cucina', category: 'Latticini', kcal_100g: 197, proteins_100g: 2.5, carbs_100g: 3.5, fats_100g: 20, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 12 },
  { id: 'dt_194', name: 'Panna montata', category: 'Latticini', kcal_100g: 250, proteins_100g: 2.2, carbs_100g: 12, fats_100g: 22, fiber_100g: 0, sugar_100g: 12, fatSat_100g: 14 },
  { id: 'dt_195', name: 'Latte di mandorla', category: 'Latticini', kcal_100g: 24, proteins_100g: 0.5, carbs_100g: 3, fats_100g: 1.1, fiber_100g: 0.2, sugar_100g: 2.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_196', name: 'Latte di riso', category: 'Latticini', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.2, fats_100g: 1, fiber_100g: 0, sugar_100g: 5.3, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_197', name: 'Latte di avena', category: 'Latticini', kcal_100g: 44, proteins_100g: 1, carbs_100g: 7, fats_100g: 1.5, fiber_100g: 0.8, sugar_100g: 4, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_198', name: 'Latte di cocco', category: 'Latticini', kcal_100g: 20, proteins_100g: 0.2, carbs_100g: 2.7, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 2.4, fatSat_100g: 0.8, serving_size_g: 200 },
  { id: 'dt_199', name: 'Yogurt alla frutta', category: 'Latticini', kcal_100g: 81, proteins_100g: 3.8, carbs_100g: 14, fats_100g: 1, fiber_100g: 0, sugar_100g: 13, fatSat_100g: 0.6, serving_size_g: 125 },
  { id: 'dt_200', name: 'Yogurt di soia', category: 'Latticini', kcal_100g: 54, proteins_100g: 4, carbs_100g: 5, fats_100g: 2, fiber_100g: 0.5, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 125 },

  // ─── Grassi (aggiunte) ────────────────────────────────────────────────
  { id: 'dt_201', name: 'Pinoli', category: 'Grassi', kcal_100g: 673, proteins_100g: 14, carbs_100g: 13, fats_100g: 68, fiber_100g: 3.7, sugar_100g: 4, fatSat_100g: 4.9, serving_size_g: 15 },
  { id: 'dt_202', name: 'Macadamia', category: 'Grassi', kcal_100g: 718, proteins_100g: 8, carbs_100g: 14, fats_100g: 76, fiber_100g: 9, sugar_100g: 5, fatSat_100g: 12, serving_size_g: 30 },
  { id: 'dt_203', name: 'Arachidi', category: 'Grassi', kcal_100g: 567, proteins_100g: 26, carbs_100g: 16, fats_100g: 49, fiber_100g: 9, sugar_100g: 4, fatSat_100g: 7, serving_size_g: 30 },
  { id: 'dt_204', name: 'Cioccolato fondente 70%', category: 'Grassi', kcal_100g: 545, proteins_100g: 6.1, carbs_100g: 46, fats_100g: 38, fiber_100g: 10, sugar_100g: 24, fatSat_100g: 22 },
  { id: 'dt_205', name: 'Cioccolato al latte', category: 'Grassi', kcal_100g: 535, proteins_100g: 7.6, carbs_100g: 59, fats_100g: 30, fiber_100g: 2, sugar_100g: 54, fatSat_100g: 18 },
  { id: 'dt_206', name: 'Cioccolato bianco', category: 'Grassi', kcal_100g: 539, proteins_100g: 6, carbs_100g: 59, fats_100g: 32, fiber_100g: 0, sugar_100g: 59, fatSat_100g: 19 },
  { id: 'dt_207', name: 'Crema di nocciole', category: 'Grassi', kcal_100g: 547, proteins_100g: 6, carbs_100g: 58, fats_100g: 31, fiber_100g: 3, sugar_100g: 55, fatSat_100g: 11, serving_size_g: 30 },
  { id: 'dt_208', name: 'Maionese', category: 'Grassi', kcal_100g: 680, proteins_100g: 1, carbs_100g: 1.5, fats_100g: 75, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 7, serving_size_g: 15, default_grams: 15 },
  { id: 'dt_209', name: 'Margarina', category: 'Grassi', kcal_100g: 713, proteins_100g: 0.1, carbs_100g: 0.1, fats_100g: 80, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 20 },

  // ─── Dolci e Zuccheri ─────────────────────────────────────────────────
  { id: 'dt_210', name: 'Marmellata', category: 'Dolci e Zuccheri', kcal_100g: 250, proteins_100g: 0.4, carbs_100g: 63, fats_100g: 0.1, fiber_100g: 1, sugar_100g: 49, fatSat_100g: 0, serving_size_g: 25, default_grams: 25 },
  { id: 'dt_211', name: 'Marmellata senza zucchero', category: 'Dolci e Zuccheri', kcal_100g: 130, proteins_100g: 0.4, carbs_100g: 32, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 25, fatSat_100g: 0, serving_size_g: 25, default_grams: 25 },
  { id: 'dt_212', name: 'Miele', category: 'Dolci e Zuccheri', kcal_100g: 304, proteins_100g: 0.3, carbs_100g: 82, fats_100g: 0, fiber_100g: 0, sugar_100g: 82, fatSat_100g: 0, serving_size_g: 21 },
  { id: 'dt_213', name: 'Zucchero bianco', category: 'Dolci e Zuccheri', kcal_100g: 400, proteins_100g: 0, carbs_100g: 100, fats_100g: 0, fiber_100g: 0, sugar_100g: 100, fatSat_100g: 0, serving_size_g: 5 },
  { id: 'dt_214', name: 'Zucchero di canna', category: 'Dolci e Zuccheri', kcal_100g: 396, proteins_100g: 0, carbs_100g: 99, fats_100g: 0, fiber_100g: 0, sugar_100g: 99, fatSat_100g: 0 },
  { id: 'dt_215', name: 'Fruttosio', category: 'Dolci e Zuccheri', kcal_100g: 400, proteins_100g: 0, carbs_100g: 100, fats_100g: 0, fiber_100g: 0, sugar_100g: 100, fatSat_100g: 0 },
  { id: 'dt_216', name: 'Sciroppo d\'acero', category: 'Dolci e Zuccheri', kcal_100g: 260, proteins_100g: 0, carbs_100g: 67, fats_100g: 0, fiber_100g: 0, sugar_100g: 60, fatSat_100g: 0 },
  { id: 'dt_217', name: 'Nutella', category: 'Dolci e Zuccheri', kcal_100g: 539, proteins_100g: 6.3, carbs_100g: 57.5, fats_100g: 30.9, fiber_100g: 3, sugar_100g: 56.3, fatSat_100g: 10.6, serving_size_g: 15 },
  { id: 'dt_218', name: 'Crema spalmabile alle nocciole', category: 'Dolci e Zuccheri', kcal_100g: 533, proteins_100g: 5.5, carbs_100g: 59, fats_100g: 30, fiber_100g: 2, sugar_100g: 56, fatSat_100g: 10 },
  { id: 'dt_219', name: 'Biscotti frollini', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 7, carbs_100g: 68, fats_100g: 20, fiber_100g: 2, sugar_100g: 25, fatSat_100g: 10, serving_size_g: 30 },
  { id: 'dt_220', name: 'Biscotti integrali', category: 'Dolci e Zuccheri', kcal_100g: 440, proteins_100g: 8, carbs_100g: 65, fats_100g: 17, fiber_100g: 5, sugar_100g: 20, fatSat_100g: 7, serving_size_g: 30 },
  { id: 'dt_221', name: 'Biscotti al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 495, proteins_100g: 6.5, carbs_100g: 67, fats_100g: 23, fiber_100g: 3, sugar_100g: 30, fatSat_100g: 12, serving_size_g: 30 },
  { id: 'dt_222', name: 'Torta margherita', category: 'Dolci e Zuccheri', kcal_100g: 350, proteins_100g: 7, carbs_100g: 50, fats_100g: 14, fiber_100g: 0.5, sugar_100g: 28, fatSat_100g: 6 },
  { id: 'dt_223', name: 'Torta al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 5, carbs_100g: 52, fats_100g: 17, fiber_100g: 2, sugar_100g: 35, fatSat_100g: 9 },
  { id: 'dt_224', name: 'Crostata di marmellata', category: 'Dolci e Zuccheri', kcal_100g: 340, proteins_100g: 5, carbs_100g: 55, fats_100g: 12, fiber_100g: 1, sugar_100g: 25, fatSat_100g: 5 },
  { id: 'dt_225', name: 'Cornetto/Brioche', category: 'Dolci e Zuccheri', kcal_100g: 360, proteins_100g: 7, carbs_100g: 48, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 12, fatSat_100g: 9 },
  { id: 'dt_226', name: 'Croissant al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 410, proteins_100g: 6.5, carbs_100g: 48, fats_100g: 22, fiber_100g: 2, sugar_100g: 20, fatSat_100g: 11 },
  { id: 'dt_227', name: 'Pancake', category: 'Dolci e Zuccheri', kcal_100g: 227, proteins_100g: 6, carbs_100g: 33, fats_100g: 8, fiber_100g: 1, sugar_100g: 8, fatSat_100g: 2.5 },
  { id: 'dt_228', name: 'Waffle', category: 'Dolci e Zuccheri', kcal_100g: 291, proteins_100g: 7, carbs_100g: 33, fats_100g: 14, fiber_100g: 1, sugar_100g: 10, fatSat_100g: 5 },
  { id: 'dt_229', name: 'Tiramisù', category: 'Dolci e Zuccheri', kcal_100g: 283, proteins_100g: 5, carbs_100g: 27, fats_100g: 17, fiber_100g: 0.3, sugar_100g: 20, fatSat_100g: 10 },
  { id: 'dt_230', name: 'Panna cotta', category: 'Dolci e Zuccheri', kcal_100g: 220, proteins_100g: 3, carbs_100g: 25, fats_100g: 12, fiber_100g: 0, sugar_100g: 22, fatSat_100g: 7 },
  { id: 'dt_231', name: 'Gelato alla crema', category: 'Dolci e Zuccheri', kcal_100g: 201, proteins_100g: 3.5, carbs_100g: 24, fats_100g: 11, fiber_100g: 0, sugar_100g: 22, fatSat_100g: 6.5 },
  { id: 'dt_232', name: 'Gelato alla frutta', category: 'Dolci e Zuccheri', kcal_100g: 128, proteins_100g: 1.5, carbs_100g: 28, fats_100g: 1.5, fiber_100g: 0.5, sugar_100g: 24, fatSat_100g: 0.9 },
  { id: 'dt_233', name: 'Sorbetto', category: 'Dolci e Zuccheri', kcal_100g: 130, proteins_100g: 0.3, carbs_100g: 34, fats_100g: 0, fiber_100g: 0.5, sugar_100g: 28, fatSat_100g: 0 },
  { id: 'dt_234', name: 'Meringhe', category: 'Dolci e Zuccheri', kcal_100g: 390, proteins_100g: 3.6, carbs_100g: 95, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 93, fatSat_100g: 0 },
  { id: 'dt_235', name: 'Ciambella', category: 'Dolci e Zuccheri', kcal_100g: 370, proteins_100g: 6, carbs_100g: 52, fats_100g: 15, fiber_100g: 1, sugar_100g: 25, fatSat_100g: 4 },
  { id: 'dt_236', name: 'Plumcake', category: 'Dolci e Zuccheri', kcal_100g: 390, proteins_100g: 6, carbs_100g: 53, fats_100g: 18, fiber_100g: 1, sugar_100g: 28, fatSat_100g: 5 },
  { id: 'dt_237', name: 'Muffin al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 400, proteins_100g: 5, carbs_100g: 51, fats_100g: 20, fiber_100g: 2, sugar_100g: 30, fatSat_100g: 6 },
  { id: 'dt_238', name: 'Budino al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 142, proteins_100g: 3, carbs_100g: 22, fats_100g: 4.5, fiber_100g: 0.5, sugar_100g: 18, fatSat_100g: 2.5 },
  { id: 'dt_239', name: 'Crème caramel', category: 'Dolci e Zuccheri', kcal_100g: 115, proteins_100g: 3, carbs_100g: 20, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 18, fatSat_100g: 1.2 },
  { id: 'dt_240', name: 'Cannolo siciliano', category: 'Dolci e Zuccheri', kcal_100g: 340, proteins_100g: 7, carbs_100g: 38, fats_100g: 18, fiber_100g: 1, sugar_100g: 20, fatSat_100g: 8 },
  { id: 'dt_241', name: 'Pastiera napoletana', category: 'Dolci e Zuccheri', kcal_100g: 350, proteins_100g: 7, carbs_100g: 42, fats_100g: 17, fiber_100g: 1, sugar_100g: 22, fatSat_100g: 8 },
  { id: 'dt_242', name: 'Colomba pasquale', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 7.5, carbs_100g: 52, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 22, fatSat_100g: 8 },
  { id: 'dt_243', name: 'Panettone', category: 'Dolci e Zuccheri', kcal_100g: 333, proteins_100g: 6.5, carbs_100g: 52, fats_100g: 11, fiber_100g: 2, sugar_100g: 18, fatSat_100g: 6 },
  { id: 'dt_244', name: 'Pandoro', category: 'Dolci e Zuccheri', kcal_100g: 405, proteins_100g: 8, carbs_100g: 50, fats_100g: 19, fiber_100g: 1, sugar_100g: 20, fatSat_100g: 11 },
  { id: 'dt_245', name: 'Caramelle', category: 'Dolci e Zuccheri', kcal_100g: 382, proteins_100g: 0, carbs_100g: 97, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 70, fatSat_100g: 0 },
  { id: 'dt_246', name: 'Liquirizia', category: 'Dolci e Zuccheri', kcal_100g: 313, proteins_100g: 4, carbs_100g: 73, fats_100g: 1.3, fiber_100g: 2, sugar_100g: 40, fatSat_100g: 0 },
  { id: 'dt_247', name: 'Barretta di cereali', category: 'Dolci e Zuccheri', kcal_100g: 400, proteins_100g: 6, carbs_100g: 68, fats_100g: 12, fiber_100g: 4, sugar_100g: 25, fatSat_100g: 4 },
  { id: 'dt_248', name: 'Crema pasticcera', category: 'Dolci e Zuccheri', kcal_100g: 149, proteins_100g: 4.5, carbs_100g: 20, fats_100g: 5.5, fiber_100g: 0, sugar_100g: 14, fatSat_100g: 2.5 },
  { id: 'dt_249', name: 'Confettura di albicocche', category: 'Dolci e Zuccheri', kcal_100g: 240, proteins_100g: 0.4, carbs_100g: 60, fats_100g: 0.1, fiber_100g: 1, sugar_100g: 47, fatSat_100g: 0 },

  // ─── Condimenti e Salse ───────────────────────────────────────────────
  { id: 'dt_250', name: 'Sale', category: 'Condimenti e Salse', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_251', name: 'Pepe nero', category: 'Condimenti e Salse', kcal_100g: 255, proteins_100g: 10, carbs_100g: 64, fats_100g: 3.3, fiber_100g: 25, sugar_100g: 0.6, fatSat_100g: 1.4 },
  { id: 'dt_252', name: 'Aceto di vino', category: 'Condimenti e Salse', kcal_100g: 19, proteins_100g: 0, carbs_100g: 0.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 0 },
  { id: 'dt_253', name: 'Aceto balsamico', category: 'Condimenti e Salse', kcal_100g: 88, proteins_100g: 0.5, carbs_100g: 17, fats_100g: 0, fiber_100g: 0, sugar_100g: 15, fatSat_100g: 0 },
  { id: 'dt_254', name: 'Salsa di soia', category: 'Condimenti e Salse', kcal_100g: 53, proteins_100g: 8, carbs_100g: 5, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 1, fatSat_100g: 0 },
  { id: 'dt_255', name: 'Ketchup', category: 'Condimenti e Salse', kcal_100g: 97, proteins_100g: 1.2, carbs_100g: 24, fats_100g: 0.3, fiber_100g: 0.3, sugar_100g: 21, fatSat_100g: 0, serving_size_g: 17, default_grams: 17 },
  { id: 'dt_256', name: 'Senape', category: 'Condimenti e Salse', kcal_100g: 66, proteins_100g: 4, carbs_100g: 5, fats_100g: 3.3, fiber_100g: 3.3, sugar_100g: 2.2, fatSat_100g: 0.2 },
  { id: 'dt_257', name: 'Pesto alla genovese', category: 'Condimenti e Salse', kcal_100g: 469, proteins_100g: 5, carbs_100g: 4, fats_100g: 47, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 7 },
  { id: 'dt_258', name: 'Ragù di carne', category: 'Condimenti e Salse', kcal_100g: 104, proteins_100g: 7, carbs_100g: 5, fats_100g: 6, fiber_100g: 1, sugar_100g: 3, fatSat_100g: 2 },
  { id: 'dt_259', name: 'Salsa di pomodoro', category: 'Condimenti e Salse', kcal_100g: 32, proteins_100g: 1.3, carbs_100g: 5, fats_100g: 0.7, fiber_100g: 1.3, sugar_100g: 3.5, fatSat_100g: 0.1 },
  { id: 'dt_260', name: 'Besciamella', category: 'Condimenti e Salse', kcal_100g: 120, proteins_100g: 4, carbs_100g: 8, fats_100g: 8, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 5 },
  { id: 'dt_261', name: 'Dado da brodo', category: 'Condimenti e Salse', kcal_100g: 225, proteins_100g: 13, carbs_100g: 18, fats_100g: 12, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 5 },
  { id: 'dt_262', name: 'Zafferano', category: 'Condimenti e Salse', kcal_100g: 310, proteins_100g: 11, carbs_100g: 65, fats_100g: 6, fiber_100g: 4, sugar_100g: 0, fatSat_100g: 1 },
  { id: 'dt_263', name: 'Origano', category: 'Condimenti e Salse', kcal_100g: 265, proteins_100g: 9, carbs_100g: 69, fats_100g: 4.3, fiber_100g: 43, sugar_100g: 4.1, fatSat_100g: 1.6 },
  { id: 'dt_264', name: 'Basilico secco', category: 'Condimenti e Salse', kcal_100g: 233, proteins_100g: 23, carbs_100g: 48, fats_100g: 4, fiber_100g: 37, sugar_100g: 2, fatSat_100g: 1 },
  { id: 'dt_265', name: 'Rosmarino secco', category: 'Condimenti e Salse', kcal_100g: 331, proteins_100g: 5, carbs_100g: 64, fats_100g: 15, fiber_100g: 43, sugar_100g: 0, fatSat_100g: 7 },
  { id: 'dt_266', name: 'Peperoncino', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 12, carbs_100g: 50, fats_100g: 6, fiber_100g: 27, sugar_100g: 10, fatSat_100g: 1 },
  { id: 'dt_267', name: 'Capperi', category: 'Condimenti e Salse', kcal_100g: 23, proteins_100g: 2.4, carbs_100g: 5, fats_100g: 0.9, fiber_100g: 3, sugar_100g: 0.4, fatSat_100g: 0.2 },
  { id: 'dt_268', name: 'Olive in salamoia', category: 'Condimenti e Salse', kcal_100g: 145, proteins_100g: 1, carbs_100g: 3.8, fats_100g: 15, fiber_100g: 3.3, sugar_100g: 0.5, fatSat_100g: 2 },
  { id: 'dt_269', name: 'Sottaceti', category: 'Condimenti e Salse', kcal_100g: 18, proteins_100g: 0.4, carbs_100g: 3.5, fats_100g: 0.2, fiber_100g: 1.2, sugar_100g: 2, fatSat_100g: 0 },
  { id: 'dt_270', name: 'Concentrato di pomodoro', category: 'Condimenti e Salse', kcal_100g: 82, proteins_100g: 4, carbs_100g: 17, fats_100g: 0.5, fiber_100g: 4, sugar_100g: 12, fatSat_100g: 0.1 },
  { id: 'dt_271', name: 'Passata di pomodoro', category: 'Condimenti e Salse', kcal_100g: 24, proteins_100g: 1, carbs_100g: 4.5, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 0 },
  { id: 'dt_272', name: 'Hummus', category: 'Condimenti e Salse', kcal_100g: 166, proteins_100g: 8, carbs_100g: 14, fats_100g: 10, fiber_100g: 6, sugar_100g: 0.5, fatSat_100g: 1.5 },
  { id: 'dt_273', name: 'Guacamole', category: 'Condimenti e Salse', kcal_100g: 160, proteins_100g: 2, carbs_100g: 9, fats_100g: 14, fiber_100g: 7, sugar_100g: 1, fatSat_100g: 2 },
  { id: 'dt_274', name: 'Salsa tonnata', category: 'Condimenti e Salse', kcal_100g: 268, proteins_100g: 7, carbs_100g: 3, fats_100g: 26, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 4 },
  { id: 'dt_275', name: 'Tabasco', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 0.8, carbs_100g: 1.5, fats_100g: 0.4, fiber_100g: 0.5, sugar_100g: 0.8, fatSat_100g: 0 },

  // ─── Bevande ──────────────────────────────────────────────────────────
  { id: 'dt_276', name: 'Acqua', category: 'Bevande', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_277', name: 'Caffè espresso', category: 'Bevande', kcal_100g: 2, proteins_100g: 0.1, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_278', name: 'Caffè americano', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_279', name: 'Tè verde', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_280', name: 'Tè nero', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_281', name: 'Succo d\'arancia', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.7, carbs_100g: 10, fats_100g: 0.2, fiber_100g: 0.2, sugar_100g: 8.4, fatSat_100g: 0 },
  { id: 'dt_282', name: 'Succo di mela', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.1, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_283', name: 'Spremuta di pompelmo', category: 'Bevande', kcal_100g: 39, proteins_100g: 0.5, carbs_100g: 9, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 8, fatSat_100g: 0 },
  { id: 'dt_284', name: 'Coca-Cola', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 330, default_grams: 330 },
  { id: 'dt_285', name: 'Aranciata', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_286', name: 'Limonata', category: 'Bevande', kcal_100g: 40, proteins_100g: 0, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 9.5, fatSat_100g: 0 },
  { id: 'dt_287', name: 'Birra', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.3, carbs_100g: 3.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_288', name: 'Vino rosso', category: 'Bevande', kcal_100g: 83, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0 },
  { id: 'dt_289', name: 'Vino bianco', category: 'Bevande', kcal_100g: 82, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0 },
  { id: 'dt_290', name: 'Prosecco', category: 'Bevande', kcal_100g: 80, proteins_100g: 0.1, carbs_100g: 1.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0 },
  { id: 'dt_291', name: 'Bevanda di riso', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.2, fats_100g: 1, fiber_100g: 0, sugar_100g: 5.3, fatSat_100g: 0.1 },
  { id: 'dt_292', name: 'Smoothie alla frutta', category: 'Bevande', kcal_100g: 65, proteins_100g: 0.5, carbs_100g: 15, fats_100g: 0.3, fiber_100g: 1, sugar_100g: 13, fatSat_100g: 0 },
  { id: 'dt_293', name: 'Centrifugato di verdure', category: 'Bevande', kcal_100g: 25, proteins_100g: 0.8, carbs_100g: 5, fats_100g: 0.2, fiber_100g: 0.5, sugar_100g: 3, fatSat_100g: 0 },
  { id: 'dt_294', name: 'Tisana', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_295', name: 'Cioccolata calda', category: 'Bevande', kcal_100g: 77, proteins_100g: 3, carbs_100g: 10, fats_100g: 2.8, fiber_100g: 0.5, sugar_100g: 9, fatSat_100g: 1.5 },
  { id: 'dt_296', name: 'Energy drink', category: 'Bevande', kcal_100g: 45, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0 },

  // ─── Pane e Prodotti da Forno ─────────────────────────────────────────
  { id: 'dt_297', name: 'Pane di segale', category: 'Pane e Prodotti da Forno', kcal_100g: 259, proteins_100g: 8.5, carbs_100g: 48, fats_100g: 3.3, fiber_100g: 5.8, sugar_100g: 3, fatSat_100g: 0.6 },
  { id: 'dt_298', name: 'Pane di mais', category: 'Pane e Prodotti da Forno', kcal_100g: 260, proteins_100g: 6, carbs_100g: 49, fats_100g: 4.5, fiber_100g: 3, sugar_100g: 4, fatSat_100g: 0.7 },
  { id: 'dt_299', name: 'Pane ai cereali', category: 'Pane e Prodotti da Forno', kcal_100g: 265, proteins_100g: 10, carbs_100g: 46, fats_100g: 5, fiber_100g: 6, sugar_100g: 3.5, fatSat_100g: 0.8 },
  { id: 'dt_300', name: 'Pane carasau', category: 'Pane e Prodotti da Forno', kcal_100g: 360, proteins_100g: 11, carbs_100g: 68, fats_100g: 4, fiber_100g: 3.5, sugar_100g: 2, fatSat_100g: 0.7 },
  { id: 'dt_301', name: 'Pane azzimo', category: 'Pane e Prodotti da Forno', kcal_100g: 362, proteins_100g: 10, carbs_100g: 76, fats_100g: 1.5, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0.2 },
  { id: 'dt_302', name: 'Focaccia', category: 'Pane e Prodotti da Forno', kcal_100g: 271, proteins_100g: 6.5, carbs_100g: 40, fats_100g: 10, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 1.5 },
  { id: 'dt_303', name: 'Focaccia genovese', category: 'Pane e Prodotti da Forno', kcal_100g: 280, proteins_100g: 6, carbs_100g: 38, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 1.8 },
  { id: 'dt_304', name: 'Pizza margherita', category: 'Pane e Prodotti da Forno', kcal_100g: 271, proteins_100g: 11, carbs_100g: 33, fats_100g: 10, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4 },
  { id: 'dt_305', name: 'Piadina', category: 'Pane e Prodotti da Forno', kcal_100g: 310, proteins_100g: 8, carbs_100g: 46, fats_100g: 11, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_306', name: 'Taralli', category: 'Pane e Prodotti da Forno', kcal_100g: 480, proteins_100g: 9, carbs_100g: 62, fats_100g: 22, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_307', name: 'Crostini', category: 'Pane e Prodotti da Forno', kcal_100g: 410, proteins_100g: 11, carbs_100g: 72, fats_100g: 8, fiber_100g: 3, sugar_100g: 3, fatSat_100g: 1 },
  { id: 'dt_308', name: 'Bruschetta', category: 'Pane e Prodotti da Forno', kcal_100g: 280, proteins_100g: 7, carbs_100g: 43, fats_100g: 9, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 1.5 },
  { id: 'dt_309', name: 'Panino all\'olio', category: 'Pane e Prodotti da Forno', kcal_100g: 290, proteins_100g: 8, carbs_100g: 50, fats_100g: 7, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 1 },
  { id: 'dt_310', name: 'Pane tostato', category: 'Pane e Prodotti da Forno', kcal_100g: 293, proteins_100g: 9, carbs_100g: 55, fats_100g: 4, fiber_100g: 3, sugar_100g: 4, fatSat_100g: 0.8 },
  { id: 'dt_311', name: 'Gallette di riso', category: 'Pane e Prodotti da Forno', kcal_100g: 387, proteins_100g: 8, carbs_100g: 81, fats_100g: 2.8, fiber_100g: 3, sugar_100g: 0.3, fatSat_100g: 0.6 },
  { id: 'dt_312', name: 'Gallette di mais', category: 'Pane e Prodotti da Forno', kcal_100g: 384, proteins_100g: 8, carbs_100g: 81, fats_100g: 2.5, fiber_100g: 3.5, sugar_100g: 0.3, fatSat_100g: 0.4 },

  // ─── Salumi e Insaccati ───────────────────────────────────────────────
  { id: 'dt_313', name: 'Mortadella', category: 'Salumi e Insaccati', kcal_100g: 317, proteins_100g: 15, carbs_100g: 1.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10 },
  { id: 'dt_314', name: 'Salame', category: 'Salumi e Insaccati', kcal_100g: 392, proteins_100g: 22, carbs_100g: 1, fats_100g: 34, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 12 },
  { id: 'dt_315', name: 'Coppa', category: 'Salumi e Insaccati', kcal_100g: 398, proteins_100g: 23, carbs_100g: 0, fats_100g: 34, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12 },
  { id: 'dt_316', name: 'Pancetta', category: 'Salumi e Insaccati', kcal_100g: 393, proteins_100g: 11, carbs_100g: 0, fats_100g: 39, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14 },
  { id: 'dt_317', name: 'Speck', category: 'Salumi e Insaccati', kcal_100g: 300, proteins_100g: 28, carbs_100g: 0.5, fats_100g: 20, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7.5 },
  { id: 'dt_318', name: 'Guanciale', category: 'Salumi e Insaccati', kcal_100g: 600, proteins_100g: 8, carbs_100g: 0, fats_100g: 63, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 25 },
  { id: 'dt_319', name: 'Cotechino', category: 'Salumi e Insaccati', kcal_100g: 307, proteins_100g: 15, carbs_100g: 1, fats_100g: 27, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10 },
  { id: 'dt_320', name: 'Würstel', category: 'Salumi e Insaccati', kcal_100g: 270, proteins_100g: 12, carbs_100g: 2, fats_100g: 24, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 9 },
  { id: 'dt_321', name: 'Lardo', category: 'Salumi e Insaccati', kcal_100g: 891, proteins_100g: 1, carbs_100g: 0, fats_100g: 99, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 40 },
  { id: 'dt_322', name: 'Porchetta', category: 'Salumi e Insaccati', kcal_100g: 290, proteins_100g: 23, carbs_100g: 0, fats_100g: 22, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8 },

  // ─── Piatti Pronti ────────────────────────────────────────────────────
  { id: 'dt_323', name: 'Pasta al pomodoro', category: 'Piatti Pronti', kcal_100g: 150, proteins_100g: 5, carbs_100g: 25, fats_100g: 3, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 0.5 },
  { id: 'dt_324', name: 'Pasta al pesto', category: 'Piatti Pronti', kcal_100g: 190, proteins_100g: 6, carbs_100g: 24, fats_100g: 8, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 2 },
  { id: 'dt_325', name: 'Lasagna', category: 'Piatti Pronti', kcal_100g: 188, proteins_100g: 9, carbs_100g: 17, fats_100g: 9, fiber_100g: 1, sugar_100g: 3, fatSat_100g: 4 },
  { id: 'dt_326', name: 'Risotto alla parmigiana', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 4.5, carbs_100g: 22, fats_100g: 4, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 2 },
  { id: 'dt_327', name: 'Minestrone', category: 'Piatti Pronti', kcal_100g: 45, proteins_100g: 2, carbs_100g: 7, fats_100g: 1, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 0.2 },
  { id: 'dt_328', name: 'Pasta e fagioli', category: 'Piatti Pronti', kcal_100g: 120, proteins_100g: 5.5, carbs_100g: 19, fats_100g: 2.5, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.5 },
  { id: 'dt_329', name: 'Ribollita', category: 'Piatti Pronti', kcal_100g: 65, proteins_100g: 3, carbs_100g: 9, fats_100g: 2, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.3 },
  { id: 'dt_330', name: 'Pizza margherita (porzione)', category: 'Piatti Pronti', kcal_100g: 270, proteins_100g: 11, carbs_100g: 33, fats_100g: 10, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4 },
  { id: 'dt_331', name: 'Insalata caprese', category: 'Piatti Pronti', kcal_100g: 170, proteins_100g: 10, carbs_100g: 3, fats_100g: 13, fiber_100g: 0.5, sugar_100g: 2.5, fatSat_100g: 7 },
  { id: 'dt_332', name: 'Insalata di riso', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 3, carbs_100g: 22, fats_100g: 4.5, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 0.7 },
  { id: 'dt_333', name: 'Polpette al sugo', category: 'Piatti Pronti', kcal_100g: 170, proteins_100g: 12, carbs_100g: 8, fats_100g: 10, fiber_100g: 1, sugar_100g: 4, fatSat_100g: 3.5 },
  { id: 'dt_334', name: 'Frittata', category: 'Piatti Pronti', kcal_100g: 149, proteins_100g: 10, carbs_100g: 1.5, fats_100g: 11, fiber_100g: 0.2, sugar_100g: 1, fatSat_100g: 3 },
  { id: 'dt_335', name: 'Cotoletta alla milanese', category: 'Piatti Pronti', kcal_100g: 260, proteins_100g: 16, carbs_100g: 12, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 4 },
  { id: 'dt_336', name: 'Arancini', category: 'Piatti Pronti', kcal_100g: 220, proteins_100g: 6, carbs_100g: 28, fats_100g: 9, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_337', name: 'Bruschetta al pomodoro', category: 'Piatti Pronti', kcal_100g: 165, proteins_100g: 4, carbs_100g: 22, fats_100g: 7, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 1 },
  { id: 'dt_338', name: 'Supplì', category: 'Piatti Pronti', kcal_100g: 215, proteins_100g: 7, carbs_100g: 25, fats_100g: 10, fiber_100g: 0.5, sugar_100g: 2, fatSat_100g: 3.5 },

  // ─── Proteine (completamento) ─────────────────────────────────────────
  { id: 'dt_339', name: 'Pesce spada', category: 'Proteine', kcal_100g: 144, proteins_100g: 20, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.9 },
  { id: 'dt_340', name: 'Rana pescatrice (coda di rospo)', category: 'Proteine', kcal_100g: 76, proteins_100g: 15, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_341', name: 'Aringa', category: 'Proteine', kcal_100g: 158, proteins_100g: 18, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.0 },
  { id: 'dt_342', name: 'Scampi', category: 'Proteine', kcal_100g: 90, proteins_100g: 19, carbs_100g: 0.5, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_343', name: 'Astice', category: 'Proteine', kcal_100g: 89, proteins_100g: 19, carbs_100g: 0.5, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_344', name: 'Granchio', category: 'Proteine', kcal_100g: 87, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_345', name: 'Cervo', category: 'Proteine', kcal_100g: 120, proteins_100g: 24, carbs_100g: 0, fats_100g: 2.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_346', name: 'Cavallo', category: 'Proteine', kcal_100g: 133, proteins_100g: 21, carbs_100g: 0.5, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.6 },
  { id: 'dt_347', name: 'Struzzo', category: 'Proteine', kcal_100g: 111, proteins_100g: 22, carbs_100g: 0, fats_100g: 2.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8 },
  { id: 'dt_348', name: 'Faraona', category: 'Proteine', kcal_100g: 158, proteins_100g: 24, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.0 },
  { id: 'dt_349', name: 'Cappone', category: 'Proteine', kcal_100g: 229, proteins_100g: 19, carbs_100g: 0, fats_100g: 17, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.0 },
  { id: 'dt_350', name: 'Ali di pollo', category: 'Proteine', kcal_100g: 203, proteins_100g: 18, carbs_100g: 0, fats_100g: 14, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.0 },
  { id: 'dt_351', name: 'Fesa di tacchino', category: 'Proteine', kcal_100g: 111, proteins_100g: 24, carbs_100g: 1, fats_100g: 1, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0.3 },
  { id: 'dt_352', name: 'Tempeh', category: 'Proteine', kcal_100g: 192, proteins_100g: 20, carbs_100g: 8, fats_100g: 11, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5 },
  { id: 'dt_353', name: 'Seitan', category: 'Proteine', kcal_100g: 148, proteins_100g: 28, carbs_100g: 4, fats_100g: 2, fiber_100g: 0.6, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_354', name: 'Proteine del siero (whey)', category: 'Proteine', kcal_100g: 370, proteins_100g: 80, carbs_100g: 8, fats_100g: 3, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 1.5 },
  { id: 'dt_355', name: 'Salmone affumicato', category: 'Proteine', kcal_100g: 117, proteins_100g: 18, carbs_100g: 0, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_356', name: "Tonno sott'olio (sgocciolato)", category: 'Proteine', kcal_100g: 198, proteins_100g: 29, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.3 },
  { id: 'dt_357', name: 'Stoccafisso', category: 'Proteine', kcal_100g: 136, proteins_100g: 32, carbs_100g: 0, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_358', name: 'Alici marinate', category: 'Proteine', kcal_100g: 120, proteins_100g: 17, carbs_100g: 1, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2 },
  { id: 'dt_359', name: 'Dentice', category: 'Proteine', kcal_100g: 100, proteins_100g: 20, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5 },
  { id: 'dt_360', name: 'Cernia', category: 'Proteine', kcal_100g: 92, proteins_100g: 19, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_361', name: 'Rombo', category: 'Proteine', kcal_100g: 95, proteins_100g: 16, carbs_100g: 0, fats_100g: 3.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_362', name: 'Ricciola', category: 'Proteine', kcal_100g: 146, proteins_100g: 23, carbs_100g: 0, fats_100g: 5.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5 },
  { id: 'dt_363', name: 'Persico', category: 'Proteine', kcal_100g: 91, proteins_100g: 19, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_364', name: 'Luccio', category: 'Proteine', kcal_100g: 88, proteins_100g: 19, carbs_100g: 0, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_365', name: 'Anguilla', category: 'Proteine', kcal_100g: 236, proteins_100g: 18, carbs_100g: 0, fats_100g: 18, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.6 },
  { id: 'dt_366', name: 'Halibut', category: 'Proteine', kcal_100g: 91, proteins_100g: 19, carbs_100g: 0, fats_100g: 1.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_367', name: 'Surimi', category: 'Proteine', kcal_100g: 97, proteins_100g: 13, carbs_100g: 7, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0.3 },

  // ─── Verdure (completamento) ──────────────────────────────────────────
  { id: 'dt_368', name: 'Zucca', category: 'Verdure', kcal_100g: 26, proteins_100g: 1, carbs_100g: 6.5, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 2.8, fatSat_100g: 0 },
  { id: 'dt_369', name: 'Fagiolini', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.8, carbs_100g: 7, fats_100g: 0.1, fiber_100g: 3.4, sugar_100g: 1.4, fatSat_100g: 0 },
  { id: 'dt_370', name: 'Cime di rapa', category: 'Verdure', kcal_100g: 22, proteins_100g: 3.2, carbs_100g: 2, fats_100g: 0.5, fiber_100g: 2.7, sugar_100g: 0.4, fatSat_100g: 0.1 },
  { id: 'dt_371', name: 'Cicoria', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.7, carbs_100g: 4.7, fats_100g: 0.3, fiber_100g: 4, sugar_100g: 0.7, fatSat_100g: 0.1 },
  { id: 'dt_372', name: 'Catalogna', category: 'Verdure', kcal_100g: 15, proteins_100g: 1.5, carbs_100g: 2.5, fats_100g: 0.2, fiber_100g: 1.5, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_373', name: 'Topinambur', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17, fats_100g: 0, fiber_100g: 1.6, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_374', name: 'Cavolo cappuccio', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.3, carbs_100g: 6, fats_100g: 0.1, fiber_100g: 2.5, sugar_100g: 3.2, fatSat_100g: 0 },
  { id: 'dt_375', name: 'Cavolo rosso', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.4, carbs_100g: 7, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 3.8, fatSat_100g: 0 },
  { id: 'dt_376', name: 'Broccolo romanesco', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.5, carbs_100g: 4, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 0 },
  { id: 'dt_377', name: 'Ravanelli', category: 'Verdure', kcal_100g: 16, proteins_100g: 0.7, carbs_100g: 3.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 1.9, fatSat_100g: 0 },
  { id: 'dt_378', name: 'Taccole', category: 'Verdure', kcal_100g: 42, proteins_100g: 2.8, carbs_100g: 7.6, fats_100g: 0.2, fiber_100g: 2.6, sugar_100g: 4, fatSat_100g: 0 },
  { id: 'dt_379', name: 'Friggitelli', category: 'Verdure', kcal_100g: 22, proteins_100g: 1.3, carbs_100g: 4, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 2.4, fatSat_100g: 0 },
  { id: 'dt_380', name: 'Verza', category: 'Verdure', kcal_100g: 27, proteins_100g: 2, carbs_100g: 5, fats_100g: 0.1, fiber_100g: 3.1, sugar_100g: 2.3, fatSat_100g: 0 },
  { id: 'dt_381', name: 'Peperoni rossi', category: 'Verdure', kcal_100g: 31, proteins_100g: 1, carbs_100g: 6, fats_100g: 0.3, fiber_100g: 2.1, sugar_100g: 4.2, fatSat_100g: 0 },
  { id: 'dt_382', name: 'Peperoni gialli', category: 'Verdure', kcal_100g: 27, proteins_100g: 1, carbs_100g: 6.3, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 2.4, fatSat_100g: 0 },
  { id: 'dt_383', name: 'Pomodori secchi', category: 'Verdure', kcal_100g: 258, proteins_100g: 14, carbs_100g: 44, fats_100g: 3, fiber_100g: 12, sugar_100g: 38, fatSat_100g: 0.4 },
  { id: 'dt_384', name: 'Pomodorini ciliegino', category: 'Verdure', kcal_100g: 18, proteins_100g: 0.9, carbs_100g: 3.9, fats_100g: 0.2, fiber_100g: 1.2, sugar_100g: 2.6, fatSat_100g: 0 },
  { id: 'dt_385', name: 'Pomodori datterini', category: 'Verdure', kcal_100g: 20, proteins_100g: 1, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 1.3, sugar_100g: 3, fatSat_100g: 0 },
  { id: 'dt_386', name: 'Crescione', category: 'Verdure', kcal_100g: 11, proteins_100g: 2.3, carbs_100g: 1.3, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 0.2, fatSat_100g: 0 },
  { id: 'dt_387', name: 'Valerianella', category: 'Verdure', kcal_100g: 21, proteins_100g: 2, carbs_100g: 3.6, fats_100g: 0.4, fiber_100g: 1.8, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_388', name: 'Peperoni arrosto', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 5.5, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 3.5, fatSat_100g: 0 },
  { id: 'dt_389', name: "Carciofini sott'olio", category: 'Verdure', kcal_100g: 220, proteins_100g: 2, carbs_100g: 5, fats_100g: 22, fiber_100g: 3, sugar_100g: 1, fatSat_100g: 3 },
  { id: 'dt_390', name: 'Melanzane grigliate', category: 'Verdure', kcal_100g: 35, proteins_100g: 1, carbs_100g: 5, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.2 },
  { id: 'dt_391', name: 'Zucchine grigliate', category: 'Verdure', kcal_100g: 24, proteins_100g: 1.5, carbs_100g: 3, fats_100g: 0.8, fiber_100g: 1.2, sugar_100g: 2, fatSat_100g: 0.1 },
  { id: 'dt_392', name: 'Verdure miste surgelate', category: 'Verdure', kcal_100g: 40, proteins_100g: 2, carbs_100g: 7, fats_100g: 0.4, fiber_100g: 3, sugar_100g: 3, fatSat_100g: 0.1 },
  { id: 'dt_393', name: 'Spinaci surgelati', category: 'Verdure', kcal_100g: 23, proteins_100g: 2.9, carbs_100g: 3.6, fats_100g: 0.4, fiber_100g: 2.2, sugar_100g: 0.4, fatSat_100g: 0.1 },

  // ─── Frutta (completamento) ───────────────────────────────────────────
  { id: 'dt_394', name: 'Mele cotogne', category: 'Frutta', kcal_100g: 57, proteins_100g: 0.4, carbs_100g: 15, fats_100g: 0.1, fiber_100g: 1.9, sugar_100g: 12, fatSat_100g: 0 },
  { id: 'dt_395', name: 'Nettarina', category: 'Frutta', kcal_100g: 44, proteins_100g: 1.1, carbs_100g: 11, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 7.9, fatSat_100g: 0 },
  { id: 'dt_396', name: 'Susine', category: 'Frutta', kcal_100g: 42, proteins_100g: 0.6, carbs_100g: 10, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 8.5, fatSat_100g: 0 },
  { id: 'dt_397', name: 'Mirtilli rossi (cranberry)', category: 'Frutta', kcal_100g: 46, proteins_100g: 0.4, carbs_100g: 12, fats_100g: 0.1, fiber_100g: 4.6, sugar_100g: 4, fatSat_100g: 0 },
  { id: 'dt_398', name: 'Banana essiccata', category: 'Frutta', kcal_100g: 346, proteins_100g: 3.9, carbs_100g: 88, fats_100g: 1.8, fiber_100g: 9.9, sugar_100g: 47, fatSat_100g: 0.7 },
  { id: 'dt_399', name: 'Mele essiccate', category: 'Frutta', kcal_100g: 243, proteins_100g: 0.9, carbs_100g: 66, fats_100g: 0.3, fiber_100g: 8.7, sugar_100g: 57, fatSat_100g: 0 },
  { id: 'dt_400', name: 'Bacche di goji', category: 'Frutta', kcal_100g: 349, proteins_100g: 14, carbs_100g: 77, fats_100g: 0.4, fiber_100g: 13, sugar_100g: 46, fatSat_100g: 0 },
  { id: 'dt_401', name: 'Guava', category: 'Frutta', kcal_100g: 68, proteins_100g: 2.6, carbs_100g: 14, fats_100g: 1, fiber_100g: 5.4, sugar_100g: 9, fatSat_100g: 0.3 },

  // ─── Latticini (completamento) ────────────────────────────────────────
  { id: 'dt_402', name: 'Crescenza', category: 'Latticini', kcal_100g: 281, proteins_100g: 16, carbs_100g: 2, fats_100g: 23, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 15 },
  { id: 'dt_403', name: 'Taleggio', category: 'Latticini', kcal_100g: 315, proteins_100g: 19, carbs_100g: 0.7, fats_100g: 26, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16 },
  { id: 'dt_404', name: 'Brie', category: 'Latticini', kcal_100g: 334, proteins_100g: 21, carbs_100g: 0.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 17 },
  { id: 'dt_405', name: 'Camembert', category: 'Latticini', kcal_100g: 300, proteins_100g: 20, carbs_100g: 0.5, fats_100g: 24, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 15 },
  { id: 'dt_406', name: 'Feta', category: 'Latticini', kcal_100g: 264, proteins_100g: 14, carbs_100g: 4, fats_100g: 21, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 15 },
  { id: 'dt_407', name: 'Primo sale', category: 'Latticini', kcal_100g: 270, proteins_100g: 18, carbs_100g: 1, fats_100g: 22, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 14 },
  { id: 'dt_408', name: 'Squacquerone', category: 'Latticini', kcal_100g: 238, proteins_100g: 10, carbs_100g: 3, fats_100g: 21, fiber_100g: 0, sugar_100g: 2, fatSat_100g: 13 },
  { id: 'dt_409', name: 'Caprino', category: 'Latticini', kcal_100g: 252, proteins_100g: 18, carbs_100g: 1, fats_100g: 20, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 14 },
  { id: 'dt_410', name: 'Robiola', category: 'Latticini', kcal_100g: 310, proteins_100g: 15, carbs_100g: 2, fats_100g: 27, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 17 },
  { id: 'dt_411', name: 'Montasio', category: 'Latticini', kcal_100g: 364, proteins_100g: 26, carbs_100g: 0, fats_100g: 29, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18 },
  { id: 'dt_412', name: 'Castelmagno', category: 'Latticini', kcal_100g: 370, proteins_100g: 25, carbs_100g: 0, fats_100g: 30, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19 },
  { id: 'dt_413', name: 'Toma piemontese', category: 'Latticini', kcal_100g: 331, proteins_100g: 25, carbs_100g: 0.5, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16 },
  { id: 'dt_414', name: 'Mozzarella di bufala', category: 'Latticini', kcal_100g: 288, proteins_100g: 16, carbs_100g: 1, fats_100g: 24, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 15 },
  { id: 'dt_415', name: 'Ricotta di pecora', category: 'Latticini', kcal_100g: 157, proteins_100g: 9, carbs_100g: 3.5, fats_100g: 12, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 7.5 },
  { id: 'dt_416', name: 'Ricotta di bufala', category: 'Latticini', kcal_100g: 180, proteins_100g: 10, carbs_100g: 3, fats_100g: 15, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 10 },
  { id: 'dt_417', name: 'Yogurt greco 0% grassi', category: 'Latticini', kcal_100g: 52, proteins_100g: 9, carbs_100g: 3.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 0 },
  { id: 'dt_418', name: 'Yogurt greco 2% grassi', category: 'Latticini', kcal_100g: 73, proteins_100g: 9.9, carbs_100g: 3.6, fats_100g: 2, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 1.3 },
  { id: 'dt_419', name: 'Yogurt skyr', category: 'Latticini', kcal_100g: 63, proteins_100g: 11, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 0.1 },
  { id: 'dt_420', name: 'Formaggio filante (sottilette)', category: 'Latticini', kcal_100g: 305, proteins_100g: 17, carbs_100g: 6, fats_100g: 24, fiber_100g: 0, sugar_100g: 5, fatSat_100g: 15 },
  { id: 'dt_421', name: 'Quark', category: 'Latticini', kcal_100g: 68, proteins_100g: 12, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 3.8, fatSat_100g: 0.1 },
  { id: 'dt_422', name: 'Fiocchi di latte', category: 'Latticini', kcal_100g: 98, proteins_100g: 11, carbs_100g: 3.4, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 2.7, fatSat_100g: 1.7 },

  // ─── Cereali (completamento) ──────────────────────────────────────────
  { id: 'dt_423', name: 'Riso Venere (nero)', category: 'Cereali', kcal_100g: 355, proteins_100g: 9, carbs_100g: 72, fats_100g: 2.8, fiber_100g: 4, sugar_100g: 0.5, fatSat_100g: 0.6 },
  { id: 'dt_424', name: 'Bulgur', category: 'Cereali', kcal_100g: 342, proteins_100g: 12, carbs_100g: 76, fats_100g: 1.3, fiber_100g: 18, sugar_100g: 0.4, fatSat_100g: 0.2 },
  { id: 'dt_425', name: 'Kamut', category: 'Cereali', kcal_100g: 337, proteins_100g: 15, carbs_100g: 68, fats_100g: 2, fiber_100g: 9, sugar_100g: 4, fatSat_100g: 0.3 },
  { id: 'dt_426', name: 'Avena (chicchi)', category: 'Cereali', kcal_100g: 389, proteins_100g: 17, carbs_100g: 66, fats_100g: 7, fiber_100g: 10.6, sugar_100g: 1, fatSat_100g: 1.2 },
  { id: 'dt_427', name: 'Pasta di riso', category: 'Cereali', kcal_100g: 360, proteins_100g: 7, carbs_100g: 80, fats_100g: 0.6, fiber_100g: 1, sugar_100g: 0.2, fatSat_100g: 0.2 },
  { id: 'dt_428', name: 'Noodles di soia', category: 'Cereali', kcal_100g: 330, proteins_100g: 0.1, carbs_100g: 83, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_429', name: 'Pane senza glutine', category: 'Cereali', kcal_100g: 250, proteins_100g: 4, carbs_100g: 45, fats_100g: 6, fiber_100g: 3, sugar_100g: 5, fatSat_100g: 0.8 },
  { id: 'dt_430', name: 'Pasta senza glutine', category: 'Cereali', kcal_100g: 356, proteins_100g: 8, carbs_100g: 78, fats_100g: 1, fiber_100g: 2.5, sugar_100g: 0.5, fatSat_100g: 0.2 },
  { id: 'dt_431', name: 'Riso per sushi', category: 'Cereali', kcal_100g: 360, proteins_100g: 6.7, carbs_100g: 79, fats_100g: 0.5, fiber_100g: 0.4, sugar_100g: 0, fatSat_100g: 0.1 },
  { id: 'dt_432', name: 'Crusca di frumento', category: 'Cereali', kcal_100g: 216, proteins_100g: 15, carbs_100g: 65, fats_100g: 4.3, fiber_100g: 42, sugar_100g: 0.4, fatSat_100g: 0.7 },
  { id: 'dt_433', name: 'Germe di grano', category: 'Cereali', kcal_100g: 360, proteins_100g: 23, carbs_100g: 52, fats_100g: 10, fiber_100g: 13, sugar_100g: 5, fatSat_100g: 1.7 },
  { id: 'dt_434', name: 'Semolino', category: 'Cereali', kcal_100g: 360, proteins_100g: 13, carbs_100g: 73, fats_100g: 1.1, fiber_100g: 3.9, sugar_100g: 0.7, fatSat_100g: 0.2 },
  { id: 'dt_435', name: 'Farina 00', category: 'Cereali', kcal_100g: 340, proteins_100g: 11, carbs_100g: 73, fats_100g: 1, fiber_100g: 2.7, sugar_100g: 0.3, fatSat_100g: 0.2 },
  { id: 'dt_436', name: 'Farina integrale', category: 'Cereali', kcal_100g: 340, proteins_100g: 13, carbs_100g: 72, fats_100g: 2, fiber_100g: 11, sugar_100g: 0.4, fatSat_100g: 0.3 },
  { id: 'dt_437', name: 'Farina di mandorle', category: 'Cereali', kcal_100g: 571, proteins_100g: 21, carbs_100g: 20, fats_100g: 50, fiber_100g: 10, sugar_100g: 4.8, fatSat_100g: 3.9 },
  { id: 'dt_438', name: 'Fecola di patate', category: 'Cereali', kcal_100g: 357, proteins_100g: 0.1, carbs_100g: 88, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_439', name: 'Amido di mais (maizena)', category: 'Cereali', kcal_100g: 381, proteins_100g: 0.3, carbs_100g: 91, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_440', name: 'Porridge (cotto)', category: 'Cereali', kcal_100g: 71, proteins_100g: 2.5, carbs_100g: 12, fats_100g: 1.5, fiber_100g: 1.7, sugar_100g: 0.2, fatSat_100g: 0.3 },

  // ─── Grassi (completamento) ───────────────────────────────────────────
  { id: 'dt_441', name: 'Noci pecan', category: 'Grassi', kcal_100g: 691, proteins_100g: 9.2, carbs_100g: 14, fats_100g: 72, fiber_100g: 9.6, sugar_100g: 4, fatSat_100g: 6.2 },
  { id: 'dt_442', name: 'Noci del Brasile', category: 'Grassi', kcal_100g: 659, proteins_100g: 14, carbs_100g: 12, fats_100g: 67, fiber_100g: 7.5, sugar_100g: 2.3, fatSat_100g: 15 },
  { id: 'dt_443', name: 'Olio di semi di girasole', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10 },
  { id: 'dt_444', name: 'Olio di arachidi', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17 },
  { id: 'dt_445', name: 'Olio di semi di lino', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9 },
  { id: 'dt_446', name: 'Olio di sesamo', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14 },
  { id: 'dt_447', name: 'Olio di colza/canola', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7 },
  { id: 'dt_448', name: 'Burro di mandorle', category: 'Grassi', kcal_100g: 614, proteins_100g: 21, carbs_100g: 19, fats_100g: 56, fiber_100g: 10, sugar_100g: 4, fatSat_100g: 4.3 },
  { id: 'dt_449', name: 'Burro di anacardi', category: 'Grassi', kcal_100g: 587, proteins_100g: 18, carbs_100g: 27, fats_100g: 49, fiber_100g: 2, sugar_100g: 5.5, fatSat_100g: 8.5 },
  { id: 'dt_450', name: 'Ghee (burro chiarificato)', category: 'Grassi', kcal_100g: 876, proteins_100g: 0, carbs_100g: 0, fats_100g: 99, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 62 },

  // ─── Condimenti e Salse (completamento) ───────────────────────────────
  { id: 'dt_451', name: 'Curcuma', category: 'Condimenti e Salse', kcal_100g: 312, proteins_100g: 10, carbs_100g: 67, fats_100g: 3.3, fiber_100g: 23, sugar_100g: 3.2, fatSat_100g: 1 },
  { id: 'dt_452', name: 'Zenzero fresco', category: 'Condimenti e Salse', kcal_100g: 80, proteins_100g: 1.8, carbs_100g: 18, fats_100g: 0.8, fiber_100g: 2, sugar_100g: 1.7, fatSat_100g: 0.2 },
  { id: 'dt_453', name: 'Zenzero in polvere', category: 'Condimenti e Salse', kcal_100g: 335, proteins_100g: 9, carbs_100g: 72, fats_100g: 4.2, fiber_100g: 14, sugar_100g: 3.4, fatSat_100g: 1.5 },
  { id: 'dt_454', name: 'Cannella', category: 'Condimenti e Salse', kcal_100g: 247, proteins_100g: 4, carbs_100g: 81, fats_100g: 1.2, fiber_100g: 53, sugar_100g: 2.2, fatSat_100g: 0.3 },
  { id: 'dt_455', name: 'Curry', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 14, carbs_100g: 55, fats_100g: 14, fiber_100g: 33, sugar_100g: 2.8, fatSat_100g: 2.2 },
  { id: 'dt_456', name: 'Paprika', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 14, carbs_100g: 54, fats_100g: 13, fiber_100g: 35, sugar_100g: 10, fatSat_100g: 2 },
  { id: 'dt_457', name: 'Noce moscata', category: 'Condimenti e Salse', kcal_100g: 525, proteins_100g: 6, carbs_100g: 49, fats_100g: 36, fiber_100g: 21, sugar_100g: 2.9, fatSat_100g: 26 },
  { id: 'dt_458', name: 'Prezzemolo fresco', category: 'Condimenti e Salse', kcal_100g: 36, proteins_100g: 3, carbs_100g: 6.3, fats_100g: 0.8, fiber_100g: 3.3, sugar_100g: 0.9, fatSat_100g: 0.1 },
  { id: 'dt_459', name: 'Basilico fresco', category: 'Condimenti e Salse', kcal_100g: 23, proteins_100g: 3.2, carbs_100g: 2.7, fats_100g: 0.6, fiber_100g: 1.6, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_460', name: 'Menta fresca', category: 'Condimenti e Salse', kcal_100g: 44, proteins_100g: 3.3, carbs_100g: 8, fats_100g: 0.7, fiber_100g: 6.8, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_461', name: 'Salvia', category: 'Condimenti e Salse', kcal_100g: 315, proteins_100g: 11, carbs_100g: 61, fats_100g: 13, fiber_100g: 40, sugar_100g: 1.7, fatSat_100g: 7 },
  { id: 'dt_462', name: 'Timo', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 5.6, carbs_100g: 24, fats_100g: 1.7, fiber_100g: 14, sugar_100g: 0, fatSat_100g: 0.5 },
  { id: 'dt_463', name: 'Alloro', category: 'Condimenti e Salse', kcal_100g: 313, proteins_100g: 8, carbs_100g: 75, fats_100g: 8, fiber_100g: 26, sugar_100g: 0, fatSat_100g: 2 },
  { id: 'dt_464', name: 'Chiodi di garofano', category: 'Condimenti e Salse', kcal_100g: 274, proteins_100g: 6, carbs_100g: 65, fats_100g: 13, fiber_100g: 34, sugar_100g: 2.4, fatSat_100g: 3.4 },
  { id: 'dt_465', name: 'Salsa Worcester', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 0.9, carbs_100g: 18, fats_100g: 0, fiber_100g: 0, sugar_100g: 13, fatSat_100g: 0 },
  { id: 'dt_466', name: 'Salsa barbecue', category: 'Condimenti e Salse', kcal_100g: 150, proteins_100g: 0.8, carbs_100g: 35, fats_100g: 0.6, fiber_100g: 0.5, sugar_100g: 30, fatSat_100g: 0.1 },
  { id: 'dt_467', name: 'Pesto rosso', category: 'Condimenti e Salse', kcal_100g: 300, proteins_100g: 4, carbs_100g: 8, fats_100g: 29, fiber_100g: 2, sugar_100g: 5, fatSat_100g: 4 },
  { id: 'dt_468', name: 'Salsa agrodolce', category: 'Condimenti e Salse', kcal_100g: 130, proteins_100g: 0.3, carbs_100g: 32, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 28, fatSat_100g: 0 },
  { id: 'dt_469', name: 'Maionese leggera', category: 'Condimenti e Salse', kcal_100g: 324, proteins_100g: 1, carbs_100g: 4, fats_100g: 34, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 3 },
  { id: 'dt_470', name: 'Lievito di birra', category: 'Condimenti e Salse', kcal_100g: 105, proteins_100g: 12, carbs_100g: 13, fats_100g: 2, fiber_100g: 8, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_471', name: 'Lievito alimentare in scaglie', category: 'Condimenti e Salse', kcal_100g: 290, proteins_100g: 40, carbs_100g: 36, fats_100g: 4, fiber_100g: 23, sugar_100g: 0, fatSat_100g: 0.5 },

  // ─── Bevande (completamento) ──────────────────────────────────────────
  { id: 'dt_472', name: 'Caffè macchiato', category: 'Bevande', kcal_100g: 10, proteins_100g: 0.4, carbs_100g: 0.7, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 0.7, fatSat_100g: 0.3 },
  { id: 'dt_473', name: 'Cappuccino', category: 'Bevande', kcal_100g: 42, proteins_100g: 2.5, carbs_100g: 3.8, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 1.1 },
  { id: 'dt_474', name: "Caffè d'orzo", category: 'Bevande', kcal_100g: 10, proteins_100g: 0.1, carbs_100g: 2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0 },
  { id: 'dt_475', name: 'Caffè al ginseng', category: 'Bevande', kcal_100g: 58, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 1 },
  { id: 'dt_476', name: 'Acqua tonica', category: 'Bevande', kcal_100g: 34, proteins_100g: 0, carbs_100g: 9, fats_100g: 0, fiber_100g: 0, sugar_100g: 9, fatSat_100g: 0 },
  { id: 'dt_477', name: 'Ginger ale', category: 'Bevande', kcal_100g: 34, proteins_100g: 0, carbs_100g: 9, fats_100g: 0, fiber_100g: 0, sugar_100g: 8.5, fatSat_100g: 0 },
  { id: 'dt_478', name: 'Kombucha', category: 'Bevande', kcal_100g: 20, proteins_100g: 0, carbs_100g: 5, fats_100g: 0, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 0 },
  { id: 'dt_479', name: 'Succo di pomodoro', category: 'Bevande', kcal_100g: 17, proteins_100g: 0.8, carbs_100g: 3.5, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 3, fatSat_100g: 0 },
  { id: 'dt_480', name: 'Succo di pera', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.2, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_481', name: 'Succo ACE', category: 'Bevande', kcal_100g: 44, proteins_100g: 0.3, carbs_100g: 10, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 9.5, fatSat_100g: 0 },
  { id: 'dt_482', name: 'Latte macchiato', category: 'Bevande', kcal_100g: 46, proteins_100g: 2.4, carbs_100g: 3.5, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 1.5 },
  { id: 'dt_483', name: 'Tè freddo al limone', category: 'Bevande', kcal_100g: 32, proteins_100g: 0, carbs_100g: 8, fats_100g: 0, fiber_100g: 0, sugar_100g: 7.5, fatSat_100g: 0 },
  { id: 'dt_484', name: 'Tè freddo alla pesca', category: 'Bevande', kcal_100g: 30, proteins_100g: 0, carbs_100g: 7.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 7, fatSat_100g: 0 },
  { id: 'dt_485', name: 'Acqua di cocco', category: 'Bevande', kcal_100g: 19, proteins_100g: 0.7, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 2.6, fatSat_100g: 0.2 },
  { id: 'dt_486', name: "Spremuta d'arancia fresca", category: 'Bevande', kcal_100g: 45, proteins_100g: 0.7, carbs_100g: 10.4, fats_100g: 0.2, fiber_100g: 0.2, sugar_100g: 8.4, fatSat_100g: 0 },
  { id: 'dt_487', name: 'Chinotto', category: 'Bevande', kcal_100g: 40, proteins_100g: 0, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_488', name: 'Cedrata', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0 },
  { id: 'dt_489', name: 'Spumante', category: 'Bevande', kcal_100g: 78, proteins_100g: 0.1, carbs_100g: 1.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 1.2, fatSat_100g: 0 },

  // ─── Pane e Prodotti da Forno (completamento) ─────────────────────────
  { id: 'dt_490', name: 'Ciabatta', category: 'Pane e Prodotti da Forno', kcal_100g: 271, proteins_100g: 9, carbs_100g: 50, fats_100g: 3.8, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 0.6 },
  { id: 'dt_491', name: 'Rosetta / Michetta', category: 'Pane e Prodotti da Forno', kcal_100g: 275, proteins_100g: 9, carbs_100g: 52, fats_100g: 3.5, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 0.5 },
  { id: 'dt_492', name: 'Baguette', category: 'Pane e Prodotti da Forno', kcal_100g: 274, proteins_100g: 10, carbs_100g: 51, fats_100g: 3.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.7 },
  { id: 'dt_493', name: 'Tigelle / Crescentine', category: 'Pane e Prodotti da Forno', kcal_100g: 290, proteins_100g: 7.5, carbs_100g: 43, fats_100g: 10, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 2.5 },
  { id: 'dt_494', name: 'Gnocco fritto', category: 'Pane e Prodotti da Forno', kcal_100g: 350, proteins_100g: 6, carbs_100g: 38, fats_100g: 20, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_495', name: 'Pane pugliese', category: 'Pane e Prodotti da Forno', kcal_100g: 265, proteins_100g: 8.5, carbs_100g: 50, fats_100g: 3, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.5 },
  { id: 'dt_496', name: 'Pane di Altamura', category: 'Pane e Prodotti da Forno', kcal_100g: 262, proteins_100g: 8, carbs_100g: 49, fats_100g: 3.2, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.5 },
  { id: 'dt_497', name: 'Pane ai 5 cereali', category: 'Pane e Prodotti da Forno', kcal_100g: 260, proteins_100g: 10, carbs_100g: 46, fats_100g: 4.5, fiber_100g: 5, sugar_100g: 3, fatSat_100g: 0.7 },
  { id: 'dt_498', name: 'Pane di kamut', category: 'Pane e Prodotti da Forno', kcal_100g: 265, proteins_100g: 11, carbs_100g: 48, fats_100g: 3.5, fiber_100g: 4, sugar_100g: 3, fatSat_100g: 0.5 },
  { id: 'dt_499', name: 'Panini al latte', category: 'Pane e Prodotti da Forno', kcal_100g: 312, proteins_100g: 9, carbs_100g: 54, fats_100g: 7, fiber_100g: 2, sugar_100g: 8, fatSat_100g: 3 },
  { id: 'dt_500', name: 'Wrap di mais', category: 'Pane e Prodotti da Forno', kcal_100g: 310, proteins_100g: 7, carbs_100g: 52, fats_100g: 8, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 1 },
  { id: 'dt_501', name: 'Pane arabo', category: 'Pane e Prodotti da Forno', kcal_100g: 275, proteins_100g: 9, carbs_100g: 55, fats_100g: 1.2, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 0.2 },
  { id: 'dt_502', name: 'Sfogliatine', category: 'Pane e Prodotti da Forno', kcal_100g: 510, proteins_100g: 6, carbs_100g: 50, fats_100g: 32, fiber_100g: 1, sugar_100g: 18, fatSat_100g: 16 },

  // ─── Salumi e Insaccati (completamento) ───────────────────────────────
  { id: 'dt_503', name: 'Culatello', category: 'Salumi e Insaccati', kcal_100g: 213, proteins_100g: 27, carbs_100g: 0, fats_100g: 12, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.5 },
  { id: 'dt_504', name: 'Fiocco di prosciutto', category: 'Salumi e Insaccati', kcal_100g: 195, proteins_100g: 28, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5 },
  { id: 'dt_505', name: 'Lonza stagionata', category: 'Salumi e Insaccati', kcal_100g: 240, proteins_100g: 30, carbs_100g: 0, fats_100g: 13, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5 },
  { id: 'dt_506', name: 'Soppressata', category: 'Salumi e Insaccati', kcal_100g: 405, proteins_100g: 20, carbs_100g: 0.5, fats_100g: 36, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13 },
  { id: 'dt_507', name: "N'duja", category: 'Salumi e Insaccati', kcal_100g: 380, proteins_100g: 13, carbs_100g: 3, fats_100g: 36, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 13 },
  { id: 'dt_508', name: 'Salame di cinghiale', category: 'Salumi e Insaccati', kcal_100g: 350, proteins_100g: 24, carbs_100g: 0, fats_100g: 28, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10 },
  { id: 'dt_509', name: 'Prosciutto di Parma', category: 'Salumi e Insaccati', kcal_100g: 271, proteins_100g: 26, carbs_100g: 0, fats_100g: 18, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 6.5 },
  { id: 'dt_510', name: 'Prosciutto San Daniele', category: 'Salumi e Insaccati', kcal_100g: 268, proteins_100g: 25, carbs_100g: 0, fats_100g: 18, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 6.5 },
  { id: 'dt_511', name: 'Salame Milano', category: 'Salumi e Insaccati', kcal_100g: 384, proteins_100g: 22, carbs_100g: 0.5, fats_100g: 33, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12 },
  { id: 'dt_512', name: 'Salame ungherese', category: 'Salumi e Insaccati', kcal_100g: 390, proteins_100g: 22, carbs_100g: 1, fats_100g: 34, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 12 },
  { id: 'dt_513', name: 'Tacchino arrosto (affettato)', category: 'Salumi e Insaccati', kcal_100g: 115, proteins_100g: 22, carbs_100g: 2, fats_100g: 2, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0.6 },
  { id: 'dt_514', name: 'Pollo arrosto (affettato)', category: 'Salumi e Insaccati', kcal_100g: 120, proteins_100g: 21, carbs_100g: 2, fats_100g: 3, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0.8 },

  // ─── Piatti Pronti (completamento) ────────────────────────────────────
  { id: 'dt_515', name: 'Pasta alla carbonara', category: 'Piatti Pronti', kcal_100g: 205, proteins_100g: 9, carbs_100g: 22, fats_100g: 9, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 4 },
  { id: 'dt_516', name: 'Pasta cacio e pepe', category: 'Piatti Pronti', kcal_100g: 210, proteins_100g: 9, carbs_100g: 24, fats_100g: 9, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 5 },
  { id: 'dt_517', name: "Pasta all'amatriciana", category: 'Piatti Pronti', kcal_100g: 185, proteins_100g: 7, carbs_100g: 23, fats_100g: 7, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 2.5 },
  { id: 'dt_518', name: 'Pasta alla norma', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 6, carbs_100g: 24, fats_100g: 6, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 2 },
  { id: 'dt_519', name: 'Risotto ai funghi', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 4, carbs_100g: 22, fats_100g: 4, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 2 },
  { id: 'dt_520', name: 'Risotto allo zafferano', category: 'Piatti Pronti', kcal_100g: 155, proteins_100g: 4, carbs_100g: 24, fats_100g: 5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 3 },
  { id: 'dt_521', name: 'Parmigiana di melanzane', category: 'Piatti Pronti', kcal_100g: 165, proteins_100g: 8, carbs_100g: 10, fats_100g: 11, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 5 },
  { id: 'dt_522', name: 'Scaloppine al limone', category: 'Piatti Pronti', kcal_100g: 160, proteins_100g: 22, carbs_100g: 5, fats_100g: 6, fiber_100g: 0.2, sugar_100g: 1, fatSat_100g: 2 },
  { id: 'dt_523', name: 'Saltimbocca alla romana', category: 'Piatti Pronti', kcal_100g: 190, proteins_100g: 22, carbs_100g: 2, fats_100g: 10, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 4 },
  { id: 'dt_524', name: 'Ossobuco', category: 'Piatti Pronti', kcal_100g: 185, proteins_100g: 21, carbs_100g: 5, fats_100g: 9, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_525', name: 'Vitello tonnato', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 18, carbs_100g: 2, fats_100g: 10, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 2.5 },
  { id: 'dt_526', name: 'Polenta con sugo', category: 'Piatti Pronti', kcal_100g: 110, proteins_100g: 4, carbs_100g: 16, fats_100g: 3.5, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 0.8 },
  { id: 'dt_527', name: 'Grigliata di verdure', category: 'Piatti Pronti', kcal_100g: 55, proteins_100g: 2, carbs_100g: 6, fats_100g: 2.5, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 0.4 },
  { id: 'dt_528', name: 'Pollo alla parmigiana', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 20, carbs_100g: 8, fats_100g: 9, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3.5 },
  { id: 'dt_529', name: 'Pasta e ceci', category: 'Piatti Pronti', kcal_100g: 125, proteins_100g: 5.5, carbs_100g: 20, fats_100g: 2.5, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.4 },
  { id: 'dt_530', name: 'Pasta e lenticchie', category: 'Piatti Pronti', kcal_100g: 120, proteins_100g: 6, carbs_100g: 19, fats_100g: 2.5, fiber_100g: 3.5, sugar_100g: 2, fatSat_100g: 0.4 },
  { id: 'dt_531', name: 'Zuppa di farro', category: 'Piatti Pronti', kcal_100g: 80, proteins_100g: 3.5, carbs_100g: 14, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 0.3 },
  { id: 'dt_532', name: 'Zuppa di orzo', category: 'Piatti Pronti', kcal_100g: 75, proteins_100g: 3, carbs_100g: 13, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 0.3 },
  { id: 'dt_533', name: 'Passato di verdure', category: 'Piatti Pronti', kcal_100g: 35, proteins_100g: 1.5, carbs_100g: 5, fats_100g: 1, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 0.2 },
  { id: 'dt_534', name: 'Crema di zucca', category: 'Piatti Pronti', kcal_100g: 45, proteins_100g: 1.5, carbs_100g: 7, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 3, fatSat_100g: 0.5 },
  { id: 'dt_535', name: 'Vellutata di piselli', category: 'Piatti Pronti', kcal_100g: 55, proteins_100g: 3, carbs_100g: 8, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.5 },
  { id: 'dt_536', name: 'Orecchiette con cime di rapa', category: 'Piatti Pronti', kcal_100g: 155, proteins_100g: 6, carbs_100g: 22, fats_100g: 5, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 0.7 },
  { id: 'dt_537', name: 'Risotto al radicchio', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 4, carbs_100g: 22, fats_100g: 4.5, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 2 },
  { id: 'dt_538', name: "Pasta al ragù", category: 'Piatti Pronti', kcal_100g: 170, proteins_100g: 8, carbs_100g: 22, fats_100g: 6, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 2 },
  { id: 'dt_539', name: 'Gnocchi al pesto', category: 'Piatti Pronti', kcal_100g: 160, proteins_100g: 4, carbs_100g: 22, fats_100g: 6.5, fiber_100g: 1.5, sugar_100g: 1, fatSat_100g: 1.5 },
  { id: 'dt_540', name: 'Tortellini in brodo', category: 'Piatti Pronti', kcal_100g: 90, proteins_100g: 5, carbs_100g: 12, fats_100g: 2.5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 1 },
  { id: 'dt_541', name: 'Ravioli ricotta e spinaci', category: 'Piatti Pronti', kcal_100g: 180, proteins_100g: 8, carbs_100g: 24, fats_100g: 6, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 3 },
  { id: 'dt_542', name: 'Cannelloni ripieni', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 9, carbs_100g: 18, fats_100g: 7, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3.5 },
  { id: 'dt_543', name: 'Involtini di carne', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 18, carbs_100g: 5, fats_100g: 11, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 4 },
  { id: 'dt_544', name: 'Pollo al curry', category: 'Piatti Pronti', kcal_100g: 160, proteins_100g: 20, carbs_100g: 5, fats_100g: 7, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 2 },
  { id: 'dt_545', name: 'Filetto di pesce al forno', category: 'Piatti Pronti', kcal_100g: 110, proteins_100g: 20, carbs_100g: 2, fats_100g: 3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0.6 },
  { id: 'dt_546', name: 'Pesce alla griglia', category: 'Piatti Pronti', kcal_100g: 120, proteins_100g: 22, carbs_100g: 0, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7 },
  { id: 'dt_547', name: 'Caponata siciliana', category: 'Piatti Pronti', kcal_100g: 85, proteins_100g: 1.5, carbs_100g: 10, fats_100g: 5, fiber_100g: 2.5, sugar_100g: 6, fatSat_100g: 0.7 },
  { id: 'dt_548', name: 'Peperonata', category: 'Piatti Pronti', kcal_100g: 55, proteins_100g: 1, carbs_100g: 7, fats_100g: 2.5, fiber_100g: 1.5, sugar_100g: 5, fatSat_100g: 0.3 },
  { id: 'dt_549', name: 'Ratatouille', category: 'Piatti Pronti', kcal_100g: 50, proteins_100g: 1.2, carbs_100g: 6, fats_100g: 2.5, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 0.3 },
  { id: 'dt_550', name: 'Sushi maki', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 5, carbs_100g: 24, fats_100g: 2, fiber_100g: 1, sugar_100g: 4, fatSat_100g: 0.3 },
  { id: 'dt_551', name: 'Sushi nigiri (salmone)', category: 'Piatti Pronti', kcal_100g: 165, proteins_100g: 9, carbs_100g: 20, fats_100g: 5, fiber_100g: 0.5, sugar_100g: 3, fatSat_100g: 1 },
  { id: 'dt_552', name: 'Poke bowl', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 10, carbs_100g: 18, fats_100g: 3.5, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 0.7 },
  { id: 'dt_553', name: 'Insalata di farro', category: 'Piatti Pronti', kcal_100g: 130, proteins_100g: 4.5, carbs_100g: 20, fats_100g: 4, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.5 },
  { id: 'dt_554', name: 'Cous cous con verdure', category: 'Piatti Pronti', kcal_100g: 125, proteins_100g: 4, carbs_100g: 20, fats_100g: 3, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 0.4 },
  { id: 'dt_555', name: 'Burger vegetale', category: 'Piatti Pronti', kcal_100g: 170, proteins_100g: 12, carbs_100g: 15, fats_100g: 7, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 1 },
  { id: 'dt_556', name: 'Falafel', category: 'Piatti Pronti', kcal_100g: 333, proteins_100g: 13, carbs_100g: 32, fats_100g: 18, fiber_100g: 5, sugar_100g: 3, fatSat_100g: 2.4 },
  { id: 'dt_557', name: 'Quiche lorraine', category: 'Piatti Pronti', kcal_100g: 250, proteins_100g: 9, carbs_100g: 16, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 2, fatSat_100g: 8 },
  { id: 'dt_558', name: 'Sformato di verdure', category: 'Piatti Pronti', kcal_100g: 130, proteins_100g: 6, carbs_100g: 10, fats_100g: 7, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 3 },
  { id: 'dt_559', name: 'Torta salata spinaci e ricotta', category: 'Piatti Pronti', kcal_100g: 200, proteins_100g: 8, carbs_100g: 18, fats_100g: 11, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 5 },

  // ─── Dolci e Zuccheri (completamento) ─────────────────────────────────
  { id: 'dt_560', name: 'Sfogliatella', category: 'Dolci e Zuccheri', kcal_100g: 350, proteins_100g: 5.5, carbs_100g: 40, fats_100g: 19, fiber_100g: 1, sugar_100g: 18, fatSat_100g: 10 },
  { id: 'dt_561', name: "Babà al rum", category: 'Dolci e Zuccheri', kcal_100g: 268, proteins_100g: 5, carbs_100g: 42, fats_100g: 8, fiber_100g: 0.5, sugar_100g: 22, fatSat_100g: 4 },
  { id: 'dt_562', name: 'Zeppole', category: 'Dolci e Zuccheri', kcal_100g: 330, proteins_100g: 5, carbs_100g: 35, fats_100g: 19, fiber_100g: 0.5, sugar_100g: 15, fatSat_100g: 8 },
  { id: 'dt_563', name: 'Cassata siciliana', category: 'Dolci e Zuccheri', kcal_100g: 310, proteins_100g: 6, carbs_100g: 42, fats_100g: 13, fiber_100g: 0.5, sugar_100g: 32, fatSat_100g: 7 },
  { id: 'dt_564', name: 'Profiteroles', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 6, carbs_100g: 28, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 18, fatSat_100g: 10 },
  { id: 'dt_565', name: 'Crostoli / Chiacchiere', category: 'Dolci e Zuccheri', kcal_100g: 440, proteins_100g: 6, carbs_100g: 52, fats_100g: 24, fiber_100g: 1, sugar_100g: 15, fatSat_100g: 5 },
  { id: 'dt_566', name: 'Strudel di mele', category: 'Dolci e Zuccheri', kcal_100g: 230, proteins_100g: 3.5, carbs_100g: 30, fats_100g: 11, fiber_100g: 2, sugar_100g: 16, fatSat_100g: 5 },
  { id: 'dt_567', name: 'Amaretti', category: 'Dolci e Zuccheri', kcal_100g: 440, proteins_100g: 8, carbs_100g: 72, fats_100g: 13, fiber_100g: 3, sugar_100g: 58, fatSat_100g: 1 },
  { id: 'dt_568', name: 'Savoiardi', category: 'Dolci e Zuccheri', kcal_100g: 375, proteins_100g: 10, carbs_100g: 68, fats_100g: 6, fiber_100g: 0.5, sugar_100g: 42, fatSat_100g: 2 },
  { id: 'dt_569', name: 'Granita', category: 'Dolci e Zuccheri', kcal_100g: 95, proteins_100g: 0, carbs_100g: 24, fats_100g: 0, fiber_100g: 0, sugar_100g: 22, fatSat_100g: 0 },
  { id: 'dt_570', name: 'Torrone', category: 'Dolci e Zuccheri', kcal_100g: 479, proteins_100g: 9, carbs_100g: 56, fats_100g: 25, fiber_100g: 3, sugar_100g: 40, fatSat_100g: 4 },
  { id: 'dt_571', name: 'Confetti', category: 'Dolci e Zuccheri', kcal_100g: 450, proteins_100g: 5, carbs_100g: 80, fats_100g: 12, fiber_100g: 1, sugar_100g: 60, fatSat_100g: 5 },
  { id: 'dt_572', name: 'Frutta candita', category: 'Dolci e Zuccheri', kcal_100g: 322, proteins_100g: 0.3, carbs_100g: 83, fats_100g: 0, fiber_100g: 2, sugar_100g: 75, fatSat_100g: 0 },
  { id: 'dt_573', name: 'Cioccolatini assortiti', category: 'Dolci e Zuccheri', kcal_100g: 525, proteins_100g: 5, carbs_100g: 55, fats_100g: 32, fiber_100g: 2, sugar_100g: 50, fatSat_100g: 19 },
  { id: 'dt_574', name: 'Mousse al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 235, proteins_100g: 4.5, carbs_100g: 20, fats_100g: 15, fiber_100g: 1.5, sugar_100g: 16, fatSat_100g: 9 },
  { id: 'dt_575', name: 'Cheesecake', category: 'Dolci e Zuccheri', kcal_100g: 321, proteins_100g: 6, carbs_100g: 26, fats_100g: 22, fiber_100g: 0.5, sugar_100g: 20, fatSat_100g: 13 },

  // ─── Snack e Ultra-Processati ──────────────────────────────────────────
  { id: 'dt_600', name: 'Kit Kat (barretta)', category: 'Snack e Ultra-Processati', kcal_100g: 515, proteins_100g: 6.3, carbs_100g: 63, fats_100g: 26, fiber_100g: 1.5, sugar_100g: 53, fatSat_100g: 16, serving_size_g: 41, default_grams: 41 },
  { id: 'dt_601', name: 'Snickers', category: 'Snack e Ultra-Processati', kcal_100g: 488, proteins_100g: 8, carbs_100g: 58, fats_100g: 25, fiber_100g: 1.5, sugar_100g: 48, fatSat_100g: 10, serving_size_g: 52, default_grams: 52 },
  { id: 'dt_602', name: 'Mars', category: 'Snack e Ultra-Processati', kcal_100g: 449, proteins_100g: 3.7, carbs_100g: 70, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 62, fatSat_100g: 8, serving_size_g: 51, default_grams: 51 },
  { id: 'dt_603', name: 'Twix', category: 'Snack e Ultra-Processati', kcal_100g: 493, proteins_100g: 4.5, carbs_100g: 64, fats_100g: 25, fiber_100g: 1, sugar_100g: 46, fatSat_100g: 12, serving_size_g: 50, default_grams: 50 },
  { id: 'dt_604', name: 'Kinder Bueno', category: 'Snack e Ultra-Processati', kcal_100g: 566, proteins_100g: 8.2, carbs_100g: 53, fats_100g: 36, fiber_100g: 1, sugar_100g: 44, fatSat_100g: 15, serving_size_g: 43, default_grams: 43 },
  { id: 'dt_605', name: 'Kinder Cioccolato', category: 'Snack e Ultra-Processati', kcal_100g: 558, proteins_100g: 9.2, carbs_100g: 57, fats_100g: 34, fiber_100g: 0, sugar_100g: 52, fatSat_100g: 19, serving_size_g: 21, default_grams: 21 },
  { id: 'dt_606', name: 'Pringles Original', category: 'Snack e Ultra-Processati', kcal_100g: 536, proteins_100g: 5, carbs_100g: 53, fats_100g: 34, fiber_100g: 3.5, sugar_100g: 1.2, fatSat_100g: 10, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_607', name: 'Lay\'s Classiche', category: 'Snack e Ultra-Processati', kcal_100g: 536, proteins_100g: 6, carbs_100g: 51, fats_100g: 35, fiber_100g: 4, sugar_100g: 0.5, fatSat_100g: 11, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_608', name: 'Doritos Nacho Cheese', category: 'Snack e Ultra-Processati', kcal_100g: 497, proteins_100g: 7, carbs_100g: 61, fats_100g: 25, fiber_100g: 3, sugar_100g: 2.5, fatSat_100g: 7, serving_size_g: 28, default_grams: 28 },
  { id: 'dt_609', name: 'Popcorn microonde (burro)', category: 'Snack e Ultra-Processati', kcal_100g: 389, proteins_100g: 8, carbs_100g: 57, fats_100g: 16, fiber_100g: 9, sugar_100g: 0.5, fatSat_100g: 5, serving_size_g: 50, default_grams: 50 },
  { id: 'dt_610', name: 'Oreo (biscotti)', category: 'Snack e Ultra-Processati', kcal_100g: 471, proteins_100g: 5, carbs_100g: 68, fats_100g: 20, fiber_100g: 2, sugar_100g: 37, fatSat_100g: 6, serving_size_g: 34, default_grams: 34 },
  { id: 'dt_611', name: 'Ritz Crackers', category: 'Snack e Ultra-Processati', kcal_100g: 500, proteins_100g: 7, carbs_100g: 65, fats_100g: 24, fiber_100g: 2, sugar_100g: 7, fatSat_100g: 5, serving_size_g: 28, default_grams: 28 },
  { id: 'dt_612', name: 'Pan di Stelle', category: 'Snack e Ultra-Processati', kcal_100g: 476, proteins_100g: 7, carbs_100g: 66, fats_100g: 21, fiber_100g: 2.5, sugar_100g: 30, fatSat_100g: 9, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_613', name: 'Wafer alla vaniglia', category: 'Snack e Ultra-Processati', kcal_100g: 490, proteins_100g: 6, carbs_100g: 67, fats_100g: 23, fiber_100g: 1, sugar_100g: 35, fatSat_100g: 12, serving_size_g: 35, default_grams: 35 },
  { id: 'dt_614', name: 'Fanta (lattina)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 330, default_grams: 330 },
  { id: 'dt_615', name: 'Sprite (lattina)', category: 'Bevande', kcal_100g: 40, proteins_100g: 0, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 330, default_grams: 330 },
  { id: 'dt_616', name: 'Red Bull (lattina)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.4, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 250, default_grams: 250 },
  { id: 'dt_617', name: 'Monster Energy', category: 'Bevande', kcal_100g: 44, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 500, default_grams: 500 },
  { id: 'dt_618', name: 'Succo di frutta brick (ACE)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.4, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 200, default_grams: 200 },
  { id: 'dt_619', name: 'Coca-Cola Zero', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 330, default_grams: 330 },
  { id: 'dt_620', name: 'Salsa barbecue', category: 'Condimenti e Salse', kcal_100g: 171, proteins_100g: 1.3, carbs_100g: 40, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 34, fatSat_100g: 0.1, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_621', name: 'Senape', category: 'Condimenti e Salse', kcal_100g: 67, proteins_100g: 4.4, carbs_100g: 5.3, fats_100g: 3.3, fiber_100g: 3, sugar_100g: 2.3, fatSat_100g: 0.2, serving_size_g: 10, default_grams: 10 },
  { id: 'dt_622', name: 'Salsa ranch', category: 'Condimenti e Salse', kcal_100g: 490, proteins_100g: 1, carbs_100g: 6, fats_100g: 51, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 8, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_623', name: 'Wurstel suino', category: 'Salumi e Insaccati', kcal_100g: 290, proteins_100g: 12, carbs_100g: 2, fats_100g: 26, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 9, serving_size_g: 60, default_grams: 60 },
  { id: 'dt_624', name: 'Hamburger McDonald\'s (solo burger)', category: 'Snack e Ultra-Processati', kcal_100g: 250, proteins_100g: 12, carbs_100g: 30, fats_100g: 9, fiber_100g: 1, sugar_100g: 7, fatSat_100g: 3.5, serving_size_g: 100, default_grams: 100 },
  { id: 'dt_625', name: 'Pizza surgelata (margherita)', category: 'Snack e Ultra-Processati', kcal_100g: 230, proteins_100g: 9, carbs_100g: 30, fats_100g: 8, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4, serving_size_g: 350, default_grams: 350 },
  { id: 'dt_626', name: 'Patatine fritte (fast food)', category: 'Snack e Ultra-Processati', kcal_100g: 312, proteins_100g: 3.4, carbs_100g: 41, fats_100g: 15, fiber_100g: 3.8, sugar_100g: 0.3, fatSat_100g: 2.2, serving_size_g: 114, default_grams: 114 },
  { id: 'dt_627', name: 'Gelato Magnum Classic', category: 'Snack e Ultra-Processati', kcal_100g: 310, proteins_100g: 3.5, carbs_100g: 28, fats_100g: 21, fiber_100g: 0.5, sugar_100g: 24, fatSat_100g: 14, serving_size_g: 86, default_grams: 86 },
  { id: 'dt_628', name: 'Cornetto Algida (classico)', category: 'Snack e Ultra-Processati', kcal_100g: 289, proteins_100g: 4.5, carbs_100g: 34, fats_100g: 15, fiber_100g: 1, sugar_100g: 24, fatSat_100g: 9, serving_size_g: 75, default_grams: 75 },
  { id: 'dt_629', name: 'Budino al cioccolato (monoporzione)', category: 'Dolci e Zuccheri', kcal_100g: 115, proteins_100g: 3.5, carbs_100g: 17, fats_100g: 4, fiber_100g: 0.5, sugar_100g: 13, fatSat_100g: 2.5, serving_size_g: 100, default_grams: 100 },
  { id: 'dt_630', name: 'Merendina (tipo Mulino Bianco Crostatine)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 5, carbs_100g: 58, fats_100g: 14, fiber_100g: 2, sugar_100g: 28, fatSat_100g: 5, serving_size_g: 40, default_grams: 40 },
  { id: 'dt_631', name: 'Brioche confezionata', category: 'Snack e Ultra-Processati', kcal_100g: 395, proteins_100g: 7, carbs_100g: 54, fats_100g: 17, fiber_100g: 1, sugar_100g: 22, fatSat_100g: 6, serving_size_g: 55, default_grams: 55 },
  { id: 'dt_632', name: 'Caramelle gommose', category: 'Dolci e Zuccheri', kcal_100g: 330, proteins_100g: 6, carbs_100g: 77, fats_100g: 0, fiber_100g: 0, sugar_100g: 56, fatSat_100g: 0, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_633', name: 'Chupa Chups', category: 'Dolci e Zuccheri', kcal_100g: 405, proteins_100g: 0, carbs_100g: 101, fats_100g: 0, fiber_100g: 0, sugar_100g: 86, fatSat_100g: 0, serving_size_g: 12, default_grams: 12 },
  { id: 'dt_634', name: 'Pretzels salati', category: 'Snack e Ultra-Processati', kcal_100g: 381, proteins_100g: 10, carbs_100g: 79, fats_100g: 3, fiber_100g: 2.6, sugar_100g: 2, fatSat_100g: 0.8, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_635', name: 'Cheetos', category: 'Snack e Ultra-Processati', kcal_100g: 558, proteins_100g: 6, carbs_100g: 56, fats_100g: 35, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 8, serving_size_g: 28, default_grams: 28 },
  { id: 'dt_636', name: 'Tortillas chips (Nachos)', category: 'Snack e Ultra-Processati', kcal_100g: 490, proteins_100g: 7, carbs_100g: 62, fats_100g: 24, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 4, serving_size_g: 28, default_grams: 28 },
  { id: 'dt_637', name: 'Yogurt greco zuccherato', category: 'Latticini', kcal_100g: 110, proteins_100g: 7, carbs_100g: 12, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 12, fatSat_100g: 2.2, serving_size_g: 150, default_grams: 150 },
  { id: 'dt_638', name: 'Yogurt Müller alla frutta', category: 'Latticini', kcal_100g: 90, proteins_100g: 4, carbs_100g: 14, fats_100g: 2, fiber_100g: 0, sugar_100g: 13, fatSat_100g: 1.3, serving_size_g: 175, default_grams: 175 },
  { id: 'dt_639', name: 'Frappuccino Starbucks', category: 'Bevande', kcal_100g: 90, proteins_100g: 2, carbs_100g: 15, fats_100g: 3, fiber_100g: 0, sugar_100g: 14, fatSat_100g: 1.8, serving_size_g: 250, default_grams: 250 },
  { id: 'dt_640', name: 'Salumi tipo Negroni (spalmabile)', category: 'Salumi e Insaccati', kcal_100g: 337, proteins_100g: 13, carbs_100g: 5, fats_100g: 30, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 11, serving_size_g: 40, default_grams: 40 },
  { id: 'dt_641', name: 'Crackers salati non integrali', category: 'Cereali', kcal_100g: 448, proteins_100g: 9.5, carbs_100g: 67, fats_100g: 16, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 3.5, serving_size_g: 25, default_grams: 25 },
  { id: 'dt_642', name: 'Cioccolata calda (busta)', category: 'Bevande', kcal_100g: 360, proteins_100g: 7, carbs_100g: 68, fats_100g: 8, fiber_100g: 4, sugar_100g: 56, fatSat_100g: 5, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_643', name: 'Acqua tonica', category: 'Bevande', kcal_100g: 34, proteins_100g: 0, carbs_100g: 8.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 8.8, fatSat_100g: 0, serving_size_g: 200, default_grams: 200 },
  { id: 'dt_644', name: 'Cappuccino bar (con latte intero)', category: 'Bevande', kcal_100g: 38, proteins_100g: 2, carbs_100g: 4, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 1, serving_size_g: 180, default_grams: 180 },
  { id: 'dt_645', name: 'Cornetto bar (vuoto)', category: 'Dolci e Zuccheri', kcal_100g: 420, proteins_100g: 8, carbs_100g: 60, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 18, fatSat_100g: 8, serving_size_g: 70, default_grams: 70 },
  { id: 'dt_646', name: 'Panino hamburger (solo pane)', category: 'Cereali', kcal_100g: 265, proteins_100g: 9, carbs_100g: 48, fats_100g: 4, fiber_100g: 2, sugar_100g: 6, fatSat_100g: 1, serving_size_g: 50, default_grams: 50 },
  { id: 'dt_647', name: 'Hot dog (wurstel + panino)', category: 'Snack e Ultra-Processati', kcal_100g: 280, proteins_100g: 10, carbs_100g: 26, fats_100g: 16, fiber_100g: 1, sugar_100g: 4, fatSat_100g: 6, serving_size_g: 130, default_grams: 130 },
  { id: 'dt_648', name: 'Patatine (Lays Ketchup)', category: 'Snack e Ultra-Processati', kcal_100g: 510, proteins_100g: 5.5, carbs_100g: 56, fats_100g: 30, fiber_100g: 3.5, sugar_100g: 8, fatSat_100g: 8, serving_size_g: 30, default_grams: 30 },
  { id: 'dt_649', name: 'Biscotti al burro', category: 'Dolci e Zuccheri', kcal_100g: 470, proteins_100g: 6, carbs_100g: 65, fats_100g: 21, fiber_100g: 1, sugar_100g: 25, fatSat_100g: 13, serving_size_g: 25, default_grams: 25 },
  { id: 'dt_650', name: 'Coca-Cola Lattina 330ml', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 330, default_grams: 330 },

  // ─── Legumi (completamento) ───────────────────────────────────────────
  { id: 'dt_576', name: 'Cicerchie', category: 'Legumi', kcal_100g: 310, proteins_100g: 26, carbs_100g: 51, fats_100g: 3, fiber_100g: 14, sugar_100g: 4, fatSat_100g: 0.4 },
  { id: 'dt_577', name: 'Lenticchie rosse', category: 'Legumi', kcal_100g: 120, proteins_100g: 9, carbs_100g: 21, fats_100g: 0.4, fiber_100g: 5, sugar_100g: 1.5, fatSat_100g: 0.1 },
  { id: 'dt_578', name: 'Lenticchie verdi', category: 'Legumi', kcal_100g: 116, proteins_100g: 9, carbs_100g: 20, fats_100g: 0.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.1 },
  { id: 'dt_579', name: 'Fagioli di Lima', category: 'Legumi', kcal_100g: 115, proteins_100g: 7.8, carbs_100g: 21, fats_100g: 0.4, fiber_100g: 7, sugar_100g: 1, fatSat_100g: 0.1 },
  { id: 'dt_580', name: 'Azuki', category: 'Legumi', kcal_100g: 128, proteins_100g: 8, carbs_100g: 25, fats_100g: 0.1, fiber_100g: 7.3, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_581', name: 'Soia edamame', category: 'Legumi', kcal_100g: 122, proteins_100g: 11, carbs_100g: 9, fats_100g: 5, fiber_100g: 4, sugar_100g: 2.2, fatSat_100g: 0.6 },

  // ─── Cereali (completamento CREA) ────────────────────────────────────
  { id: 'dt_582', name: 'Spelta integrale', category: 'Cereali', kcal_100g: 329, proteins_100g: 14.7, carbs_100g: 64, fats_100g: 2.4, fiber_100g: 10.7, sugar_100g: 0.5, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_583', name: 'Segale', category: 'Cereali', kcal_100g: 335, proteins_100g: 10, carbs_100g: 69.8, fats_100g: 1.6, fiber_100g: 15.1, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Verdure (completamento CREA) ────────────────────────────────────
  { id: 'dt_584', name: 'Scorzonera', category: 'Verdure', kcal_100g: 60, proteins_100g: 1.3, carbs_100g: 14, fats_100g: 0.1, fiber_100g: 3.1, sugar_100g: 6, fatSat_100g: 0 },
  { id: 'dt_585', name: 'Cavolrapa', category: 'Verdure', kcal_100g: 27, proteins_100g: 1.7, carbs_100g: 6.3, fats_100g: 0.1, fiber_100g: 3.6, sugar_100g: 2.6, fatSat_100g: 0 },

  // ─── Latticini (CREA/BDA aggiunte) ───────────────────────────────────
  { id: 'dt_651', name: 'Latte parzialmente scremato', category: 'Latticini', kcal_100g: 46, proteins_100g: 3.3, carbs_100g: 4.8, fats_100g: 1.6, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 1.0, serving_size_g: 200 },
  { id: 'dt_652', name: 'Latte di capra', category: 'Latticini', kcal_100g: 70, proteins_100g: 3.6, carbs_100g: 4.5, fats_100g: 4.1, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 2.7, serving_size_g: 200 },
  { id: 'dt_653', name: 'Mozzarella per pizza', category: 'Latticini', kcal_100g: 233, proteins_100g: 22, carbs_100g: 2.2, fats_100g: 15, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 9.5 },
  { id: 'dt_654', name: 'Pecorino romano', category: 'Latticini', kcal_100g: 388, proteins_100g: 26, carbs_100g: 0.5, fats_100g: 32, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 21, serving_size_g: 30 },

  // ─── Cereali (CREA/BDA aggiunte) ─────────────────────────────────────
  { id: 'dt_655', name: 'Riso parboiled', category: 'Cereali', kcal_100g: 355, proteins_100g: 7.3, carbs_100g: 77, fats_100g: 0.6, fiber_100g: 1.5, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_656', name: 'Pasta fresca (tagliatelle)', category: 'Cereali', kcal_100g: 194, proteins_100g: 7, carbs_100g: 37, fats_100g: 2, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_657', name: 'Farina di riso', category: 'Cereali', kcal_100g: 366, proteins_100g: 6, carbs_100g: 80, fats_100g: 1.4, fiber_100g: 2.4, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_658', name: 'Farina di ceci', category: 'Cereali', kcal_100g: 387, proteins_100g: 22, carbs_100g: 57, fats_100g: 6, fiber_100g: 11, sugar_100g: 10, fatSat_100g: 0.6 },

  // ─── Legumi (CREA/BDA aggiunte) ───────────────────────────────────────
  { id: 'dt_659', name: 'Fagioli dall\'occhio', category: 'Legumi', kcal_100g: 109, proteins_100g: 7.6, carbs_100g: 19, fats_100g: 0.5, fiber_100g: 6.2, sugar_100g: 1.5, fatSat_100g: 0.1 },

  // ─── Proteine (CREA/BDA aggiunte) ────────────────────────────────────
  { id: 'dt_660', name: 'Manzo macinato', category: 'Proteine', kcal_100g: 200, proteins_100g: 19, carbs_100g: 0, fats_100g: 13.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.3 },
  { id: 'dt_661', name: 'Trippa', category: 'Proteine', kcal_100g: 119, proteins_100g: 17, carbs_100g: 1, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5 },
  { id: 'dt_662', name: 'Fegatini di pollo', category: 'Proteine', kcal_100g: 130, proteins_100g: 19, carbs_100g: 1, fats_100g: 5.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.7 },
  { id: 'dt_663', name: 'Fegato di maiale', category: 'Proteine', kcal_100g: 165, proteins_100g: 20, carbs_100g: 3, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.3 },
  { id: 'dt_664', name: 'Rognone di bovino', category: 'Proteine', kcal_100g: 99, proteins_100g: 17, carbs_100g: 0.8, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_665', name: 'Lingua di bovino', category: 'Proteine', kcal_100g: 230, proteins_100g: 16, carbs_100g: 0, fats_100g: 18, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7 },
  { id: 'dt_666', name: 'Salsiccia fresca di maiale', category: 'Proteine', kcal_100g: 301, proteins_100g: 14, carbs_100g: 1, fats_100g: 27, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10 },
  { id: 'dt_667', name: 'Costine di maiale', category: 'Proteine', kcal_100g: 292, proteins_100g: 15, carbs_100g: 0, fats_100g: 26, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.5 },
  { id: 'dt_668', name: 'Spalla di maiale', category: 'Proteine', kcal_100g: 200, proteins_100g: 19, carbs_100g: 0, fats_100g: 14, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5 },

  // ─── Grassi (CREA/BDA aggiunte) ──────────────────────────────────────
  { id: 'dt_669', name: 'Strutto', category: 'Grassi', kcal_100g: 892, proteins_100g: 0, carbs_100g: 0, fats_100g: 99, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 40, serving_size_g: 10 },
  { id: 'dt_670', name: 'Semi di sesamo', category: 'Grassi', kcal_100g: 573, proteins_100g: 18, carbs_100g: 23, fats_100g: 50, fiber_100g: 11.8, sugar_100g: 0.3, fatSat_100g: 7, serving_size_g: 15 },
  { id: 'dt_671', name: 'Semi di papavero', category: 'Grassi', kcal_100g: 525, proteins_100g: 18, carbs_100g: 28, fats_100g: 42, fiber_100g: 19, sugar_100g: 3.6, fatSat_100g: 4.5, serving_size_g: 10 },

  // ─── Verdure (CREA/BDA aggiunte) ─────────────────────────────────────
  { id: 'dt_672', name: 'Fiori di zucca', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.6, carbs_100g: 2.7, fats_100g: 0.4, fiber_100g: 1.4, sugar_100g: 0.9, fatSat_100g: 0.1 },

  // ─── Condimenti e Salse (CREA/BDA aggiunte) ──────────────────────────
  { id: 'dt_673', name: 'Erba cipollina', category: 'Condimenti e Salse', kcal_100g: 30, proteins_100g: 3.3, carbs_100g: 4.4, fats_100g: 0.7, fiber_100g: 2.5, sugar_100g: 1.9, fatSat_100g: 0.1 },
  { id: 'dt_674', name: 'Maggiorana', category: 'Condimenti e Salse', kcal_100g: 271, proteins_100g: 12, carbs_100g: 61, fats_100g: 7, fiber_100g: 40, sugar_100g: 4, fatSat_100g: 1.7 },
  { id: 'dt_675', name: 'Aneto', category: 'Condimenti e Salse', kcal_100g: 43, proteins_100g: 3.5, carbs_100g: 7, fats_100g: 1.1, fiber_100g: 2.1, sugar_100g: 0, fatSat_100g: 0.1 },
  { id: 'dt_676', name: 'Brodo vegetale', category: 'Condimenti e Salse', kcal_100g: 5, proteins_100g: 0.1, carbs_100g: 1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 250 },
  { id: 'dt_677', name: 'Brodo di carne', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 1.5, carbs_100g: 0.5, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 250 },
  { id: 'dt_678', name: 'Brodo di pollo', category: 'Condimenti e Salse', kcal_100g: 10, proteins_100g: 1.2, carbs_100g: 0.5, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0.2, fatSat_100g: 0.1, serving_size_g: 250 },

  // ─── Dolci e Zuccheri (CREA/BDA aggiunte) ────────────────────────────
  { id: 'dt_679', name: 'Cantucci', category: 'Dolci e Zuccheri', kcal_100g: 440, proteins_100g: 10, carbs_100g: 66, fats_100g: 15, fiber_100g: 3, sugar_100g: 26, fatSat_100g: 2, serving_size_g: 25 },
  { id: 'dt_680', name: 'Pandispagna', category: 'Dolci e Zuccheri', kcal_100g: 280, proteins_100g: 8, carbs_100g: 50, fats_100g: 6, fiber_100g: 0.5, sugar_100g: 30, fatSat_100g: 2 },

  // ─── Frutta (completamento) ───────────────────────────────────────────
  { id: 'dt_681', name: 'Mango', category: 'Frutta', kcal_100g: 60, proteins_100g: 0.8, carbs_100g: 15, fats_100g: 0.4, fiber_100g: 1.6, sugar_100g: 13.7, fatSat_100g: 0.1 },
  { id: 'dt_682', name: 'Papaya', category: 'Frutta', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 7.8, fatSat_100g: 0.1 },
  { id: 'dt_683', name: 'Ananas fresco', category: 'Frutta', kcal_100g: 50, proteins_100g: 0.5, carbs_100g: 13, fats_100g: 0.1, fiber_100g: 1.4, sugar_100g: 9.9, fatSat_100g: 0 },
  { id: 'dt_684', name: 'Cocco fresco (polpa)', category: 'Frutta', kcal_100g: 354, proteins_100g: 3.3, carbs_100g: 15, fats_100g: 33, fiber_100g: 9, sugar_100g: 6.2, fatSat_100g: 29 },
  { id: 'dt_685', name: 'Datteri freschi', category: 'Frutta', kcal_100g: 277, proteins_100g: 1.8, carbs_100g: 75, fats_100g: 0.2, fiber_100g: 6.7, sugar_100g: 63.4, fatSat_100g: 0 },
  { id: 'dt_686', name: 'Fichi freschi', category: 'Frutta', kcal_100g: 74, proteins_100g: 0.75, carbs_100g: 19, fats_100g: 0.3, fiber_100g: 2.9, sugar_100g: 16.3, fatSat_100g: 0.1 },
  { id: 'dt_687', name: 'Fichi secchi', category: 'Frutta', kcal_100g: 249, proteins_100g: 3.3, carbs_100g: 64, fats_100g: 0.9, fiber_100g: 9.8, sugar_100g: 48, fatSat_100g: 0.2 },
  { id: 'dt_688', name: 'Melograno (chicchi)', category: 'Frutta', kcal_100g: 83, proteins_100g: 1.7, carbs_100g: 19, fats_100g: 1.2, fiber_100g: 4, sugar_100g: 13.7, fatSat_100g: 0.1 },
  { id: 'dt_689', name: 'Ciliegie', category: 'Frutta', kcal_100g: 50, proteins_100g: 1, carbs_100g: 12, fats_100g: 0.3, fiber_100g: 1.6, sugar_100g: 8.5, fatSat_100g: 0.1 },
  { id: 'dt_690', name: 'Prugne fresche', category: 'Frutta', kcal_100g: 46, proteins_100g: 0.7, carbs_100g: 11.4, fats_100g: 0.3, fiber_100g: 1.4, sugar_100g: 9.9, fatSat_100g: 0 },
  { id: 'dt_691', name: 'Prugne secche', category: 'Frutta', kcal_100g: 240, proteins_100g: 2.2, carbs_100g: 64, fats_100g: 0.4, fiber_100g: 7.1, sugar_100g: 38, fatSat_100g: 0 },
  { id: 'dt_692', name: 'Uva bianca', category: 'Frutta', kcal_100g: 67, proteins_100g: 0.6, carbs_100g: 17.2, fats_100g: 0.4, fiber_100g: 0.9, sugar_100g: 16.3, fatSat_100g: 0.1 },
  { id: 'dt_693', name: 'Uva rossa', category: 'Frutta', kcal_100g: 69, proteins_100g: 0.7, carbs_100g: 18, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 15.5, fatSat_100g: 0.1 },
  { id: 'dt_694', name: 'Mirtilli', category: 'Frutta', kcal_100g: 57, proteins_100g: 0.7, carbs_100g: 14.5, fats_100g: 0.3, fiber_100g: 2.4, sugar_100g: 9.9, fatSat_100g: 0 },
  { id: 'dt_695', name: 'Lamponi', category: 'Frutta', kcal_100g: 52, proteins_100g: 1.2, carbs_100g: 12, fats_100g: 0.7, fiber_100g: 6.5, sugar_100g: 4.4, fatSat_100g: 0 },
  { id: 'dt_696', name: 'More', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 5.3, sugar_100g: 4.9, fatSat_100g: 0 },
  { id: 'dt_697', name: 'Ribes rosso', category: 'Frutta', kcal_100g: 56, proteins_100g: 1.4, carbs_100g: 13.8, fats_100g: 0.2, fiber_100g: 4.3, sugar_100g: 7.4, fatSat_100g: 0 },
  { id: 'dt_698', name: 'Anguria', category: 'Frutta', kcal_100g: 30, proteins_100g: 0.6, carbs_100g: 7.6, fats_100g: 0.2, fiber_100g: 0.4, sugar_100g: 6.2, fatSat_100g: 0 },
  { id: 'dt_699', name: 'Melone giallo', category: 'Frutta', kcal_100g: 34, proteins_100g: 0.8, carbs_100g: 8.2, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 7.9, fatSat_100g: 0 },
  { id: 'dt_700', name: 'Melone retato', category: 'Frutta', kcal_100g: 36, proteins_100g: 0.9, carbs_100g: 8.5, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 7.3, fatSat_100g: 0 },
  { id: 'dt_701', name: 'Albicocche', category: 'Frutta', kcal_100g: 48, proteins_100g: 1.4, carbs_100g: 11, fats_100g: 0.4, fiber_100g: 2, sugar_100g: 9.2, fatSat_100g: 0 },
  { id: 'dt_702', name: 'Pesche', category: 'Frutta', kcal_100g: 39, proteins_100g: 0.9, carbs_100g: 9.5, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 8.4, fatSat_100g: 0 },
  { id: 'dt_703', name: 'Nespole', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 12, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 8.6, fatSat_100g: 0 },
  { id: 'dt_704', name: 'Mandarini', category: 'Frutta', kcal_100g: 53, proteins_100g: 0.8, carbs_100g: 13.3, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 10.6, fatSat_100g: 0 },
  { id: 'dt_705', name: 'Limone (succo)', category: 'Frutta', kcal_100g: 22, proteins_100g: 0.4, carbs_100g: 6.9, fats_100g: 0.2, fiber_100g: 0.3, sugar_100g: 2.5, fatSat_100g: 0 },
  { id: 'dt_706', name: 'Pompelmo', category: 'Frutta', kcal_100g: 42, proteins_100g: 0.8, carbs_100g: 10.7, fats_100g: 0.1, fiber_100g: 1.1, sugar_100g: 7, fatSat_100g: 0 },
  { id: 'dt_707', name: 'Melograno (succo)', category: 'Frutta', kcal_100g: 54, proteins_100g: 0.2, carbs_100g: 13.1, fats_100g: 0.3, fiber_100g: 0.1, sugar_100g: 12.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_708', name: 'Frutto della passione', category: 'Frutta', kcal_100g: 97, proteins_100g: 2.2, carbs_100g: 23.4, fats_100g: 0.7, fiber_100g: 10.4, sugar_100g: 11.2, fatSat_100g: 0 },
  { id: 'dt_709', name: 'Lychee', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.8, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 1.3, sugar_100g: 15.2, fatSat_100g: 0.1 },
  { id: 'dt_710', name: 'Jackfruit (polpa)', category: 'Frutta', kcal_100g: 95, proteins_100g: 1.7, carbs_100g: 23.2, fats_100g: 0.6, fiber_100g: 1.5, sugar_100g: 19.1, fatSat_100g: 0.2 },

  // ─── Verdure (completamento) ──────────────────────────────────────────
  { id: 'dt_711', name: 'Carciofo', category: 'Verdure', kcal_100g: 47, proteins_100g: 3.3, carbs_100g: 11, fats_100g: 0.2, fiber_100g: 5.4, sugar_100g: 1, fatSat_100g: 0 },
  { id: 'dt_712', name: 'Barbabietola rossa', category: 'Verdure', kcal_100g: 43, proteins_100g: 1.6, carbs_100g: 9.6, fats_100g: 0.2, fiber_100g: 2.8, sugar_100g: 6.8, fatSat_100g: 0 },
  { id: 'dt_713', name: 'Cavolo cappuccio', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.3, carbs_100g: 5.8, fats_100g: 0.1, fiber_100g: 2.5, sugar_100g: 3.2, fatSat_100g: 0 },
  { id: 'dt_714', name: 'Cavolo rosso', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.4, carbs_100g: 7.4, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 3.8, fatSat_100g: 0 },
  { id: 'dt_715', name: 'Cavoletti di Bruxelles', category: 'Verdure', kcal_100g: 43, proteins_100g: 3.4, carbs_100g: 8.9, fats_100g: 0.3, fiber_100g: 3.8, sugar_100g: 2.2, fatSat_100g: 0.1 },
  { id: 'dt_716', name: 'Cavolfiore', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.9, carbs_100g: 5, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 1.9, fatSat_100g: 0.1 },
  { id: 'dt_717', name: 'Porro', category: 'Verdure', kcal_100g: 61, proteins_100g: 1.5, carbs_100g: 14, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 3.9, fatSat_100g: 0.1 },
  { id: 'dt_718', name: 'Rapa', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 6.4, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 3.8, fatSat_100g: 0 },
  { id: 'dt_719', name: 'Sedano rapa', category: 'Verdure', kcal_100g: 42, proteins_100g: 1.5, carbs_100g: 9.2, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 1.6, fatSat_100g: 0.1 },
  { id: 'dt_720', name: 'Radicchio', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.4, carbs_100g: 4.5, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 0.6, fatSat_100g: 0.1 },
  { id: 'dt_721', name: 'Rucola', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.6, carbs_100g: 3.7, fats_100g: 0.7, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0.1 },
  { id: 'dt_722', name: 'Bietola da coste', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.8, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.6, sugar_100g: 1.1, fatSat_100g: 0 },
  { id: 'dt_723', name: 'Carciofo surgelato', category: 'Verdure', kcal_100g: 44, proteins_100g: 3, carbs_100g: 9, fats_100g: 0.2, fiber_100g: 5, sugar_100g: 0.9, fatSat_100g: 0 },
  { id: 'dt_724', name: 'Topinambur', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 9.6, fatSat_100g: 0 },
  { id: 'dt_725', name: 'Indivia belga', category: 'Verdure', kcal_100g: 17, proteins_100g: 0.9, carbs_100g: 3.1, fats_100g: 0.1, fiber_100g: 3.1, sugar_100g: 0.1, fatSat_100g: 0 },
  { id: 'dt_726', name: 'Cipolla rossa', category: 'Verdure', kcal_100g: 40, proteins_100g: 1.1, carbs_100g: 9.3, fats_100g: 0.1, fiber_100g: 1.7, sugar_100g: 4.2, fatSat_100g: 0 },
  { id: 'dt_727', name: 'Porro', category: 'Verdure', kcal_100g: 61, proteins_100g: 1.5, carbs_100g: 14, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 3.9, fatSat_100g: 0.1 },
  { id: 'dt_728', name: 'Germogli di soia', category: 'Verdure', kcal_100g: 30, proteins_100g: 3.1, carbs_100g: 5.9, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 0, fatSat_100g: 0 },
  { id: 'dt_729', name: 'Germogli di alfa alfa', category: 'Verdure', kcal_100g: 23, proteins_100g: 4, carbs_100g: 2.1, fats_100g: 0.7, fiber_100g: 1.9, sugar_100g: 0.2, fatSat_100g: 0.1 },
  { id: 'dt_730', name: 'Okra', category: 'Verdure', kcal_100g: 33, proteins_100g: 1.9, carbs_100g: 7.5, fats_100g: 0.2, fiber_100g: 3.2, sugar_100g: 1.5, fatSat_100g: 0 },
  { id: 'dt_731', name: 'Pak choi (bok choy)', category: 'Verdure', kcal_100g: 13, proteins_100g: 1.5, carbs_100g: 2.2, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 1.2, fatSat_100g: 0 },

  // ─── Pesce (completamento) ────────────────────────────────────────────
  { id: 'dt_732', name: 'Orata', category: 'Proteine', kcal_100g: 96, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6 },
  { id: 'dt_733', name: 'Trota salmonata', category: 'Proteine', kcal_100g: 168, proteins_100g: 20, carbs_100g: 0, fats_100g: 9.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.1 },
  { id: 'dt_734', name: 'Trota iridea', category: 'Proteine', kcal_100g: 141, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 6.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.7 },
  { id: 'dt_735', name: 'Acciughe (alici) fresche', category: 'Proteine', kcal_100g: 131, proteins_100g: 20.1, carbs_100g: 0, fats_100g: 5.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2 },
  { id: 'dt_736', name: 'Acciughe sott\'olio', category: 'Proteine', kcal_100g: 210, proteins_100g: 29, carbs_100g: 0, fats_100g: 10.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.3 },
  { id: 'dt_737', name: 'Sardine fresche', category: 'Proteine', kcal_100g: 208, proteins_100g: 25, carbs_100g: 0, fats_100g: 11, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5 },
  { id: 'dt_738', name: 'Sardine sott\'olio', category: 'Proteine', kcal_100g: 208, proteins_100g: 24, carbs_100g: 0, fats_100g: 12, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.8 },
  { id: 'dt_739', name: 'Polpo', category: 'Proteine', kcal_100g: 82, proteins_100g: 14.9, carbs_100g: 2.2, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_740', name: 'Calamaro', category: 'Proteine', kcal_100g: 92, proteins_100g: 15.6, carbs_100g: 3.1, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_741', name: 'Seppia', category: 'Proteine', kcal_100g: 79, proteins_100g: 16.1, carbs_100g: 0.8, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_742', name: 'Baccalà (stoccafisso ammollato)', category: 'Proteine', kcal_100g: 106, proteins_100g: 25, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1 },
  { id: 'dt_743', name: 'Anguilla', category: 'Proteine', kcal_100g: 236, proteins_100g: 18, carbs_100g: 0, fats_100g: 18.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.7 },
  { id: 'dt_744', name: 'Palombo', category: 'Proteine', kcal_100g: 89, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4 },
  { id: 'dt_745', name: 'Pesce spada', category: 'Proteine', kcal_100g: 144, proteins_100g: 21.7, carbs_100g: 0, fats_100g: 6.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.8 },
  { id: 'dt_746', name: 'Dentice', category: 'Proteine', kcal_100g: 90, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5 },
  { id: 'dt_747', name: 'Rombo', category: 'Proteine', kcal_100g: 86, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5 },
  { id: 'dt_748', name: 'Aringa affumicata', category: 'Proteine', kcal_100g: 217, proteins_100g: 24, carbs_100g: 0, fats_100g: 13, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3 },
  { id: 'dt_749', name: 'Salmone affumicato', category: 'Proteine', kcal_100g: 117, proteins_100g: 18.3, carbs_100g: 0, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_750', name: 'Tonno fresco', category: 'Proteine', kcal_100g: 184, proteins_100g: 29.9, carbs_100g: 0, fats_100g: 6.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.6 },
  { id: 'dt_751', name: 'Astice', category: 'Proteine', kcal_100g: 89, proteins_100g: 18.8, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_752', name: 'Aragosta', category: 'Proteine', kcal_100g: 97, proteins_100g: 20.5, carbs_100g: 0.5, fats_100g: 1.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_753', name: 'Capesante', category: 'Proteine', kcal_100g: 88, proteins_100g: 16.8, carbs_100g: 3.2, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2 },
  { id: 'dt_754', name: 'Ostrica fresca', category: 'Proteine', kcal_100g: 68, proteins_100g: 7.1, carbs_100g: 3.9, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6 },

  // ─── Carni (completamento) ────────────────────────────────────────────
  { id: 'dt_755', name: 'Agnello (coscia)', category: 'Proteine', kcal_100g: 195, proteins_100g: 28, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.9 },
  { id: 'dt_756', name: 'Agnello (costolette)', category: 'Proteine', kcal_100g: 294, proteins_100g: 25, carbs_100g: 0, fats_100g: 21, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.4 },
  { id: 'dt_757', name: 'Anatra (petto senza pelle)', category: 'Proteine', kcal_100g: 140, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 4.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4 },
  { id: 'dt_758', name: 'Cinghiale', category: 'Proteine', kcal_100g: 122, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2 },
  { id: 'dt_759', name: 'Capretto (cosciotto)', category: 'Proteine', kcal_100g: 107, proteins_100g: 20.8, carbs_100g: 0, fats_100g: 2.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9 },
  { id: 'dt_760', name: 'Cavallo (fettina)', category: 'Proteine', kcal_100g: 133, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4 },
  { id: 'dt_761', name: 'Vitello (braciola)', category: 'Proteine', kcal_100g: 150, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 7.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.9 },
  { id: 'dt_762', name: 'Pollo (intero con pelle)', category: 'Proteine', kcal_100g: 215, proteins_100g: 18.6, carbs_100g: 0, fats_100g: 15.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.3 },
  { id: 'dt_763', name: 'Faraona (petto)', category: 'Proteine', kcal_100g: 112, proteins_100g: 23, carbs_100g: 0, fats_100g: 2.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7 },
  { id: 'dt_764', name: 'Quaglia', category: 'Proteine', kcal_100g: 192, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 11.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.1 },
  { id: 'dt_765', name: 'Piccione', category: 'Proteine', kcal_100g: 187, proteins_100g: 24, carbs_100g: 0, fats_100g: 9.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.6 },
  { id: 'dt_766', name: 'Cervo', category: 'Proteine', kcal_100g: 120, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1 },

  // ─── Salumi e affettati ───────────────────────────────────────────────
  { id: 'dt_767', name: 'Mortadella', category: 'Salumi e Insaccati', kcal_100g: 311, proteins_100g: 14.7, carbs_100g: 0.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10.5 },
  { id: 'dt_768', name: 'Salame Milano', category: 'Salumi e Insaccati', kcal_100g: 414, proteins_100g: 20, carbs_100g: 0, fats_100g: 37, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14 },
  { id: 'dt_769', name: 'Speck', category: 'Salumi e Insaccati', kcal_100g: 258, proteins_100g: 27.5, carbs_100g: 0, fats_100g: 16.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.7 },
  { id: 'dt_770', name: 'Pancetta affumicata', category: 'Salumi e Insaccati', kcal_100g: 665, proteins_100g: 10.6, carbs_100g: 0, fats_100g: 70, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 26 },
  { id: 'dt_771', name: 'Coppa di testa', category: 'Salumi e Insaccati', kcal_100g: 284, proteins_100g: 15, carbs_100g: 1, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8.5 },
  { id: 'dt_772', name: 'Nduja', category: 'Salumi e Insaccati', kcal_100g: 540, proteins_100g: 13, carbs_100g: 0, fats_100g: 54, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 21 },
  { id: 'dt_773', name: 'Capicola (coppa)', category: 'Salumi e Insaccati', kcal_100g: 290, proteins_100g: 23, carbs_100g: 0, fats_100g: 22, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8 },
  { id: 'dt_774', name: 'Wurstel (maiale+manzo)', category: 'Salumi e Insaccati', kcal_100g: 250, proteins_100g: 11, carbs_100g: 2, fats_100g: 22, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 8.5 },
  { id: 'dt_775', name: 'Salsiccia (secca, salamella)', category: 'Salumi e Insaccati', kcal_100g: 398, proteins_100g: 18, carbs_100g: 2, fats_100g: 35, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 13 },

  // ─── Formaggi (completamento) ─────────────────────────────────────────
  { id: 'dt_776', name: 'Brie', category: 'Latticini', kcal_100g: 334, proteins_100g: 20.8, carbs_100g: 0.5, fats_100g: 27.7, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 17.4 },
  { id: 'dt_777', name: 'Camembert', category: 'Latticini', kcal_100g: 300, proteins_100g: 19.8, carbs_100g: 0.5, fats_100g: 24.3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 15.2 },
  { id: 'dt_778', name: 'Emmental', category: 'Latticini', kcal_100g: 380, proteins_100g: 28.4, carbs_100g: 0.5, fats_100g: 29.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 19 },
  { id: 'dt_779', name: 'Gruviera', category: 'Latticini', kcal_100g: 413, proteins_100g: 29.8, carbs_100g: 0.4, fats_100g: 32.3, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 20.3 },
  { id: 'dt_780', name: 'Fontina', category: 'Latticini', kcal_100g: 367, proteins_100g: 25.6, carbs_100g: 1.6, fats_100g: 28.8, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 18.6 },
  { id: 'dt_781', name: 'Montasio', category: 'Latticini', kcal_100g: 368, proteins_100g: 25.5, carbs_100g: 0, fats_100g: 30, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19.4 },
  { id: 'dt_782', name: 'Crescenza', category: 'Latticini', kcal_100g: 234, proteins_100g: 14, carbs_100g: 3, fats_100g: 18.9, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 12.1 },
  { id: 'dt_783', name: 'Stracchino', category: 'Latticini', kcal_100g: 256, proteins_100g: 14.6, carbs_100g: 3.2, fats_100g: 21, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 13.4 },
  { id: 'dt_784', name: 'Robiola', category: 'Latticini', kcal_100g: 280, proteins_100g: 11, carbs_100g: 3, fats_100g: 24.6, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 15.7 },
  { id: 'dt_785', name: 'Quartirolo', category: 'Latticini', kcal_100g: 254, proteins_100g: 16.6, carbs_100g: 3, fats_100g: 19.6, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 12.5 },
  { id: 'dt_786', name: 'Mozzarella di bufala', category: 'Latticini', kcal_100g: 263, proteins_100g: 14.5, carbs_100g: 2.7, fats_100g: 22, fiber_100g: 0, sugar_100g: 2.7, fatSat_100g: 14.3 },
  { id: 'dt_787', name: 'Scamorza (bianca)', category: 'Latticini', kcal_100g: 334, proteins_100g: 26.9, carbs_100g: 0, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16.1 },
  { id: 'dt_788', name: 'Caciocavallo', category: 'Latticini', kcal_100g: 439, proteins_100g: 31.1, carbs_100g: 0.5, fats_100g: 35.2, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 22.7 },
  { id: 'dt_789', name: 'Fiore Sardo', category: 'Latticini', kcal_100g: 450, proteins_100g: 28, carbs_100g: 0, fats_100g: 37, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 23.8 },
  { id: 'dt_790', name: 'Squacquerone', category: 'Latticini', kcal_100g: 180, proteins_100g: 10, carbs_100g: 3.5, fats_100g: 14.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 9.2 },
  { id: 'dt_791', name: 'Mascarpone', category: 'Latticini', kcal_100g: 429, proteins_100g: 6.2, carbs_100g: 3.6, fats_100g: 44, fiber_100g: 0, sugar_100g: 3.6, fatSat_100g: 28.3 },

  // ─── Latticini e derivati ─────────────────────────────────────────────
  { id: 'dt_792', name: 'Kefir di latte intero', category: 'Latticini', kcal_100g: 61, proteins_100g: 3.4, carbs_100g: 4.7, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 4.7, fatSat_100g: 2, serving_size_g: 200 },
  { id: 'dt_793', name: 'Yogurt di soia', category: 'Latticini', kcal_100g: 65, proteins_100g: 3.5, carbs_100g: 6.6, fats_100g: 2.3, fiber_100g: 0.2, sugar_100g: 5.2, fatSat_100g: 0.3, serving_size_g: 125 },
  { id: 'dt_794', name: 'Yogurt intero alla frutta', category: 'Latticini', kcal_100g: 102, proteins_100g: 3.4, carbs_100g: 18, fats_100g: 1.9, fiber_100g: 0.3, sugar_100g: 14, fatSat_100g: 1.1, serving_size_g: 125 },
  { id: 'dt_795', name: 'Fiocchi di latte (cottage)', category: 'Latticini', kcal_100g: 98, proteins_100g: 11.1, carbs_100g: 3.4, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 2.7, fatSat_100g: 1.8, serving_size_g: 100 },
  { id: 'dt_796', name: 'Panna da cucina (UHT)', category: 'Latticini', kcal_100g: 292, proteins_100g: 2.3, carbs_100g: 3.4, fats_100g: 30.5, fiber_100g: 0, sugar_100g: 3.4, fatSat_100g: 19.3, serving_size_g: 30 },
  { id: 'dt_797', name: 'Latte di mandorla (non zuccherato)', category: 'Bevande', kcal_100g: 15, proteins_100g: 0.5, carbs_100g: 0.5, fats_100g: 1.1, fiber_100g: 0.3, sugar_100g: 0.1, fatSat_100g: 0.1, serving_size_g: 250 },
  { id: 'dt_798', name: 'Latte di avena (non zuccherato)', category: 'Bevande', kcal_100g: 47, proteins_100g: 1, carbs_100g: 9, fats_100g: 1, fiber_100g: 0.5, sugar_100g: 3.6, fatSat_100g: 0.2, serving_size_g: 250 },
  { id: 'dt_799', name: 'Latte di riso (non zuccherato)', category: 'Bevande', kcal_100g: 54, proteins_100g: 0.3, carbs_100g: 12, fats_100g: 0.8, fiber_100g: 0.1, sugar_100g: 4.2, fatSat_100g: 0.1, serving_size_g: 250 },
  { id: 'dt_800', name: 'Latte di cocco (da lattina)', category: 'Bevande', kcal_100g: 197, proteins_100g: 2, carbs_100g: 2.8, fats_100g: 21, fiber_100g: 0.2, sugar_100g: 2.8, fatSat_100g: 18.5, serving_size_g: 100 },

  // ─── Cereali e derivati (completamento) ──────────────────────────────
  { id: 'dt_801', name: 'Miglio decorticato', category: 'Cereali', kcal_100g: 378, proteins_100g: 11, carbs_100g: 73, fats_100g: 4.2, fiber_100g: 8.5, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_802', name: 'Grano saraceno', category: 'Cereali', kcal_100g: 343, proteins_100g: 13.3, carbs_100g: 71.5, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_803', name: 'Teff', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_804', name: 'Bulgur', category: 'Cereali', kcal_100g: 342, proteins_100g: 12, carbs_100g: 76, fats_100g: 1.3, fiber_100g: 18.3, sugar_100g: 0.4, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_805', name: 'Riso Venere (integrale nero)', category: 'Cereali', kcal_100g: 355, proteins_100g: 8.9, carbs_100g: 75, fats_100g: 2.2, fiber_100g: 4.3, sugar_100g: 0.3, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_806', name: 'Pasta di grano duro fresca', category: 'Cereali', kcal_100g: 131, proteins_100g: 5.4, carbs_100g: 26, fats_100g: 0.8, fiber_100g: 1.7, sugar_100g: 1.4, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_807', name: 'Pasta all\'uovo fresca', category: 'Cereali', kcal_100g: 161, proteins_100g: 6.7, carbs_100g: 29.5, fats_100g: 2.2, fiber_100g: 1.3, sugar_100g: 1.4, fatSat_100g: 0.6, serving_size_g: 100 },
  { id: 'dt_808', name: 'Gnocchi di patate confezionati', category: 'Cereali', kcal_100g: 100, proteins_100g: 2.6, carbs_100g: 21.5, fats_100g: 0.5, fiber_100g: 1.2, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_809', name: 'Farina di grano tenero 00', category: 'Cereali', kcal_100g: 364, proteins_100g: 10.5, carbs_100g: 77, fats_100g: 1, fiber_100g: 2.7, sugar_100g: 0.4, fatSat_100g: 0.2 },
  { id: 'dt_810', name: 'Farina integrale', category: 'Cereali', kcal_100g: 339, proteins_100g: 13.2, carbs_100g: 72, fats_100g: 2.5, fiber_100g: 10.7, sugar_100g: 0.4, fatSat_100g: 0.4 },
  { id: 'dt_811', name: 'Pane di Altamura (DOP)', category: 'Cereali', kcal_100g: 289, proteins_100g: 9.8, carbs_100g: 60, fats_100g: 2, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_812', name: 'Pane di grano saraceno (senza glutine)', category: 'Cereali', kcal_100g: 225, proteins_100g: 5, carbs_100g: 48, fats_100g: 2, fiber_100g: 3.5, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 50 },
  { id: 'dt_813', name: 'Tortillas di mais', category: 'Cereali', kcal_100g: 218, proteins_100g: 5.7, carbs_100g: 44, fats_100g: 2.5, fiber_100g: 4.3, sugar_100g: 0.4, fatSat_100g: 0.4, serving_size_g: 50 },
  { id: 'dt_814', name: 'Piadina (classica)', category: 'Cereali', kcal_100g: 331, proteins_100g: 8.2, carbs_100g: 52, fats_100g: 10.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 80 },

  // ─── Legumi (completamento) ───────────────────────────────────────────
  { id: 'dt_815', name: 'Lupini', category: 'Legumi', kcal_100g: 119, proteins_100g: 15.6, carbs_100g: 9.9, fats_100g: 2.9, fiber_100g: 4.6, sugar_100g: 0.5, fatSat_100g: 0.4, serving_size_g: 100 },
  { id: 'dt_816', name: 'Fagioli borlotti in scatola', category: 'Legumi', kcal_100g: 84, proteins_100g: 5.3, carbs_100g: 13.9, fats_100g: 0.5, fiber_100g: 4.8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_817', name: 'Ceci in scatola', category: 'Legumi', kcal_100g: 120, proteins_100g: 6.6, carbs_100g: 19.4, fats_100g: 2.1, fiber_100g: 6.7, sugar_100g: 3.4, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_818', name: 'Lenticchie in scatola', category: 'Legumi', kcal_100g: 102, proteins_100g: 8.5, carbs_100g: 14.6, fats_100g: 0.5, fiber_100g: 7.5, sugar_100g: 1.8, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_819', name: 'Piselli in scatola', category: 'Legumi', kcal_100g: 70, proteins_100g: 4.4, carbs_100g: 12, fats_100g: 0.4, fiber_100g: 4.2, sugar_100g: 4.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_820', name: 'Tempeh', category: 'Legumi', kcal_100g: 193, proteins_100g: 20.3, carbs_100g: 7.6, fats_100g: 10.8, fiber_100g: 5.5, sugar_100g: 0, fatSat_100g: 2.2 },
  { id: 'dt_821', name: 'Natto', category: 'Legumi', kcal_100g: 211, proteins_100g: 17.7, carbs_100g: 14.4, fats_100g: 11, fiber_100g: 5.4, sugar_100g: 3.1, fatSat_100g: 1.6 },
  { id: 'dt_822', name: 'Hummus', category: 'Legumi', kcal_100g: 177, proteins_100g: 7.9, carbs_100g: 14.3, fats_100g: 9.6, fiber_100g: 6, sugar_100g: 0.6, fatSat_100g: 1.4, serving_size_g: 50 },

  // ─── Frutta secca e semi ──────────────────────────────────────────────
  { id: 'dt_823', name: 'Anacardi', category: 'Frutta secca', kcal_100g: 553, proteins_100g: 18.2, carbs_100g: 30.2, fats_100g: 43.9, fiber_100g: 3.3, sugar_100g: 5.9, fatSat_100g: 7.8, serving_size_g: 30 },
  { id: 'dt_824', name: 'Nocciole', category: 'Frutta secca', kcal_100g: 628, proteins_100g: 15, carbs_100g: 17, fats_100g: 60.8, fiber_100g: 9.7, sugar_100g: 4.3, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_825', name: 'Pistacchi', category: 'Frutta secca', kcal_100g: 562, proteins_100g: 20.2, carbs_100g: 27.5, fats_100g: 45.4, fiber_100g: 10.3, sugar_100g: 7.7, fatSat_100g: 5.6, serving_size_g: 30 },
  { id: 'dt_826', name: 'Noci Pecan', category: 'Frutta secca', kcal_100g: 691, proteins_100g: 9.2, carbs_100g: 13.9, fats_100g: 72, fiber_100g: 9.6, sugar_100g: 3.97, fatSat_100g: 6.2, serving_size_g: 30 },
  { id: 'dt_827', name: 'Noci del Brasile', category: 'Frutta secca', kcal_100g: 656, proteins_100g: 14.3, carbs_100g: 12.3, fats_100g: 66.4, fiber_100g: 7.5, sugar_100g: 2.3, fatSat_100g: 15.1, serving_size_g: 30 },
  { id: 'dt_828', name: 'Noci di Macadamia', category: 'Frutta secca', kcal_100g: 718, proteins_100g: 7.9, carbs_100g: 13.8, fats_100g: 75.8, fiber_100g: 8.6, sugar_100g: 4.6, fatSat_100g: 12, serving_size_g: 30 },
  { id: 'dt_829', name: 'Semi di zucca', category: 'Frutta secca', kcal_100g: 559, proteins_100g: 30.2, carbs_100g: 10.7, fats_100g: 49, fiber_100g: 6, sugar_100g: 1.4, fatSat_100g: 8.7, serving_size_g: 30 },
  { id: 'dt_830', name: 'Semi di girasole', category: 'Frutta secca', kcal_100g: 584, proteins_100g: 20.8, carbs_100g: 20, fats_100g: 51.5, fiber_100g: 8.6, sugar_100g: 2.6, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_831', name: 'Semi di lino', category: 'Frutta secca', kcal_100g: 534, proteins_100g: 18.3, carbs_100g: 28.9, fats_100g: 42.2, fiber_100g: 27.3, sugar_100g: 1.6, fatSat_100g: 3.7, serving_size_g: 15 },
  { id: 'dt_832', name: 'Semi di canapa', category: 'Frutta secca', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.8, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 4.6, serving_size_g: 30 },
  { id: 'dt_833', name: 'Pinoli', category: 'Frutta secca', kcal_100g: 673, proteins_100g: 13.7, carbs_100g: 13.1, fats_100g: 68.4, fiber_100g: 3.7, sugar_100g: 3.6, fatSat_100g: 4.9, serving_size_g: 20 },
  { id: 'dt_834', name: 'Arachidi', category: 'Frutta secca', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 4, fatSat_100g: 6.8, serving_size_g: 30 },
  { id: 'dt_835', name: 'Uvetta sultanina', category: 'Frutta secca', kcal_100g: 299, proteins_100g: 3.1, carbs_100g: 79.2, fats_100g: 0.5, fiber_100g: 3.7, sugar_100g: 59.2, fatSat_100g: 0.2, serving_size_g: 30 },
  { id: 'dt_836', name: 'Albicocche secche', category: 'Frutta secca', kcal_100g: 241, proteins_100g: 3.4, carbs_100g: 62.6, fats_100g: 0.5, fiber_100g: 7.3, sugar_100g: 53, fatSat_100g: 0, serving_size_g: 30 },
  { id: 'dt_837', name: 'Cranberry secchi (zuccherati)', category: 'Frutta secca', kcal_100g: 308, proteins_100g: 0.1, carbs_100g: 82, fats_100g: 1.4, fiber_100g: 5.3, sugar_100g: 65, fatSat_100g: 0.1, serving_size_g: 30 },

  // ─── Oli e grassi ────────────────────────────────────────────────────
  { id: 'dt_838', name: 'Olio di semi di girasole', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10, serving_size_g: 10 },
  { id: 'dt_839', name: 'Olio di semi di mais', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13, serving_size_g: 10 },
  { id: 'dt_840', name: 'Olio di cocco', category: 'Grassi', kcal_100g: 862, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 86, serving_size_g: 10 },
  { id: 'dt_841', name: 'Olio di lino', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9, serving_size_g: 10 },
  { id: 'dt_842', name: 'Olio di sesamo', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14, serving_size_g: 10 },
  { id: 'dt_843', name: 'Olio di avocado', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12, serving_size_g: 10 },
  { id: 'dt_844', name: 'Margarina (vegetale)', category: 'Grassi', kcal_100g: 720, proteins_100g: 0.5, carbs_100g: 0.5, fats_100g: 80, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 25, serving_size_g: 15 },
  { id: 'dt_845', name: 'Tahin (crema di sesamo)', category: 'Grassi', kcal_100g: 595, proteins_100g: 17.7, carbs_100g: 26.2, fats_100g: 50, fiber_100g: 9.3, sugar_100g: 0.5, fatSat_100g: 7, serving_size_g: 30 },

  // ─── Bevande ─────────────────────────────────────────────────────────
  { id: 'dt_846', name: 'Tè verde (infuso)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.2, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 250 },
  { id: 'dt_847', name: 'Tè nero (infuso)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 250 },
  { id: 'dt_848', name: 'Tisana di camomilla', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 250 },
  { id: 'dt_849', name: 'Succo di arancia (100%, senza zucchero)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.7, carbs_100g: 10.4, fats_100g: 0.2, fiber_100g: 0.2, sugar_100g: 8.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_850', name: 'Succo di mela (100%)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.1, carbs_100g: 11.4, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 9.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_851', name: 'Energy drink (Red Bull 250ml)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 250 },
  { id: 'dt_852', name: 'Bevanda sportiva (isotonica)', category: 'Bevande', kcal_100g: 26, proteins_100g: 0, carbs_100g: 6.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 5.5, fatSat_100g: 0, serving_size_g: 500 },
  { id: 'dt_853', name: 'Vino rosso', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_854', name: 'Vino bianco secco', category: 'Bevande', kcal_100g: 82, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_855', name: 'Vino prosecco DOC', category: 'Bevande', kcal_100g: 75, proteins_100g: 0.3, carbs_100g: 2.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_856', name: 'Liquore (gin 40%)', category: 'Bevande', kcal_100g: 263, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 40 },
  { id: 'dt_857', name: 'Cocktail Aperol Spritz (media)', category: 'Bevande', kcal_100g: 60, proteins_100g: 0, carbs_100g: 8, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 300 },
  { id: 'dt_858', name: 'Acqua frizzante', category: 'Bevande', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 250 },

  // ─── Condimenti e salse ───────────────────────────────────────────────
  { id: 'dt_859', name: 'Salsa di soia (tamari)', category: 'Condimenti e Salse', kcal_100g: 60, proteins_100g: 10.5, carbs_100g: 5.6, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 1.7, fatSat_100g: 0, serving_size_g: 15 },
  { id: 'dt_860', name: 'Aceto balsamico di Modena', category: 'Condimenti e Salse', kcal_100g: 88, proteins_100g: 0.5, carbs_100g: 17.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 15.6, fatSat_100g: 0, serving_size_g: 15 },
  { id: 'dt_861', name: 'Senape (gialla)', category: 'Condimenti e Salse', kcal_100g: 66, proteins_100g: 4.4, carbs_100g: 8.7, fats_100g: 3.3, fiber_100g: 3.2, sugar_100g: 2.8, fatSat_100g: 0.2, serving_size_g: 15 },
  { id: 'dt_862', name: 'Ketchup', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 1.8, carbs_100g: 25, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 21, fatSat_100g: 0, serving_size_g: 30 },
  { id: 'dt_863', name: 'Maionese (classica)', category: 'Condimenti e Salse', kcal_100g: 680, proteins_100g: 1.5, carbs_100g: 2.9, fats_100g: 74, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 11.5, serving_size_g: 20 },
  { id: 'dt_864', name: 'Maionese light', category: 'Condimenti e Salse', kcal_100g: 290, proteins_100g: 1.9, carbs_100g: 11.8, fats_100g: 25.6, fiber_100g: 0, sugar_100g: 2, fatSat_100g: 3.8, serving_size_g: 20 },
  { id: 'dt_865', name: 'Pesto genovese (classico)', category: 'Condimenti e Salse', kcal_100g: 449, proteins_100g: 6.4, carbs_100g: 4.3, fats_100g: 46, fiber_100g: 1.5, sugar_100g: 1.6, fatSat_100g: 8.8, serving_size_g: 30 },
  { id: 'dt_866', name: 'Salsa di pomodoro (passata)', category: 'Condimenti e Salse', kcal_100g: 32, proteins_100g: 1.3, carbs_100g: 6.8, fats_100g: 0.2, fiber_100g: 1.4, sugar_100g: 4.2, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_867', name: 'Concentrato di pomodoro', category: 'Condimenti e Salse', kcal_100g: 71, proteins_100g: 3.8, carbs_100g: 14.3, fats_100g: 0.3, fiber_100g: 2.9, sugar_100g: 9.6, fatSat_100g: 0.1, serving_size_g: 30 },
  { id: 'dt_868', name: 'Salsa Worcestershire', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 1.1, carbs_100g: 18.7, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 18.3, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_869', name: 'Salsa Tabasco (piccante)', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 0.6, carbs_100g: 2.6, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 1.6, fatSat_100g: 0, serving_size_g: 5 },
  { id: 'dt_870', name: 'Dado vegetale (granulare)', category: 'Condimenti e Salse', kcal_100g: 290, proteins_100g: 9, carbs_100g: 53, fats_100g: 5.7, fiber_100g: 1, sugar_100g: 7, fatSat_100g: 1.5, serving_size_g: 5 },
  { id: 'dt_871', name: 'Lievito alimentare in scaglie', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 46, carbs_100g: 35, fats_100g: 4.5, fiber_100g: 14.6, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 10 },
  { id: 'dt_872', name: 'Aceto di mele', category: 'Condimenti e Salse', kcal_100g: 21, proteins_100g: 0, carbs_100g: 0.9, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 15 },

  // ─── Dolci e prodotti da forno ────────────────────────────────────────
  { id: 'dt_873', name: 'Brioche (plain)', category: 'Dolci e Zuccheri', kcal_100g: 381, proteins_100g: 9.1, carbs_100g: 47.4, fats_100g: 17.2, fiber_100g: 1.8, sugar_100g: 14.5, fatSat_100g: 10.5, serving_size_g: 60 },
  { id: 'dt_874', name: 'Cornetto (vuoto)', category: 'Dolci e Zuccheri', kcal_100g: 398, proteins_100g: 7.8, carbs_100g: 53, fats_100g: 17.5, fiber_100g: 1.8, sugar_100g: 14, fatSat_100g: 10, serving_size_g: 60 },
  { id: 'dt_875', name: 'Croissant al burro', category: 'Dolci e Zuccheri', kcal_100g: 406, proteins_100g: 8.2, carbs_100g: 46, fats_100g: 21.2, fiber_100g: 2.1, sugar_100g: 12, fatSat_100g: 12.5, serving_size_g: 60 },
  { id: 'dt_876', name: 'Torta di mele (homemade)', category: 'Dolci e Zuccheri', kcal_100g: 241, proteins_100g: 4.2, carbs_100g: 36, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 18, fatSat_100g: 3.2, serving_size_g: 100 },
  { id: 'dt_877', name: 'Tiramisù', category: 'Dolci e Zuccheri', kcal_100g: 303, proteins_100g: 6.8, carbs_100g: 28, fats_100g: 18.5, fiber_100g: 0.1, sugar_100g: 24, fatSat_100g: 10.5, serving_size_g: 150 },
  { id: 'dt_878', name: 'Gelato alla crema (artigianale)', category: 'Dolci e Zuccheri', kcal_100g: 207, proteins_100g: 3.9, carbs_100g: 24.8, fats_100g: 10.3, fiber_100g: 0, sugar_100g: 22, fatSat_100g: 5.6, serving_size_g: 100 },
  { id: 'dt_879', name: 'Gelato al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 216, proteins_100g: 3.8, carbs_100g: 28, fats_100g: 10.5, fiber_100g: 0.5, sugar_100g: 25, fatSat_100g: 6.5, serving_size_g: 100 },
  { id: 'dt_880', name: 'Sorbetto al limone', category: 'Dolci e Zuccheri', kcal_100g: 118, proteins_100g: 0.2, carbs_100g: 30, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 28, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_881', name: 'Budino di latte (confezionato)', category: 'Dolci e Zuccheri', kcal_100g: 119, proteins_100g: 3.8, carbs_100g: 19.7, fats_100g: 3.1, fiber_100g: 0, sugar_100g: 14.5, fatSat_100g: 1.6, serving_size_g: 100 },
  { id: 'dt_882', name: 'Nutella', category: 'Dolci e Zuccheri', kcal_100g: 539, proteins_100g: 6.3, carbs_100g: 57.5, fats_100g: 30.9, fiber_100g: 3.4, sugar_100g: 56.3, fatSat_100g: 10.6, serving_size_g: 20 },
  { id: 'dt_883', name: 'Crema di nocciole alternativa (light)', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 8, carbs_100g: 50, fats_100g: 27, fiber_100g: 5, sugar_100g: 40, fatSat_100g: 4.5, serving_size_g: 20 },
  { id: 'dt_884', name: 'Biscotti secchi (tipo oro saiwa)', category: 'Dolci e Zuccheri', kcal_100g: 428, proteins_100g: 7.5, carbs_100g: 72, fats_100g: 12.7, fiber_100g: 2, sugar_100g: 18.5, fatSat_100g: 6, serving_size_g: 30 },
  { id: 'dt_885', name: 'Wafer (al cioccolato)', category: 'Dolci e Zuccheri', kcal_100g: 524, proteins_100g: 7.3, carbs_100g: 61, fats_100g: 28, fiber_100g: 2, sugar_100g: 30, fatSat_100g: 14, serving_size_g: 30 },

  // ─── Snack salati e prodotti confezionati ─────────────────────────────
  { id: 'dt_886', name: 'Patatine fritte (chips, classiche)', category: 'Snack e Ultra-Processati', kcal_100g: 536, proteins_100g: 7, carbs_100g: 53, fats_100g: 34, fiber_100g: 4.5, sugar_100g: 0.5, fatSat_100g: 3.3, serving_size_g: 30 },
  { id: 'dt_887', name: 'Popcorn (salato, confezionato)', category: 'Snack e Ultra-Processati', kcal_100g: 387, proteins_100g: 11, carbs_100g: 74, fats_100g: 5, fiber_100g: 14.5, sugar_100g: 0.8, fatSat_100g: 1, serving_size_g: 30 },
  { id: 'dt_888', name: 'Nachos / Tortilla chips', category: 'Snack e Ultra-Processati', kcal_100g: 490, proteins_100g: 7.5, carbs_100g: 61, fats_100g: 24, fiber_100g: 4, sugar_100g: 0.8, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_889', name: 'Pretzel (classici)', category: 'Snack e Ultra-Processati', kcal_100g: 383, proteins_100g: 9.4, carbs_100g: 79, fats_100g: 2.5, fiber_100g: 3, sugar_100g: 2.9, fatSat_100g: 0.5, serving_size_g: 30 },
  { id: 'dt_890', name: 'Cracker di mais (senza glutine)', category: 'Snack e Ultra-Processati', kcal_100g: 385, proteins_100g: 6, carbs_100g: 79, fats_100g: 4.3, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 30 },
  { id: 'dt_891', name: 'Rice cakes (gallette riso scondite)', category: 'Snack e Ultra-Processati', kcal_100g: 387, proteins_100g: 7.5, carbs_100g: 82, fats_100g: 2.9, fiber_100g: 3.8, sugar_100g: 0.5, fatSat_100g: 0.6, serving_size_g: 10 },
  { id: 'dt_892', name: 'Merendina (Pan di stelle)', category: 'Snack e Ultra-Processati', kcal_100g: 469, proteins_100g: 7.9, carbs_100g: 62, fats_100g: 21.1, fiber_100g: 2.1, sugar_100g: 27.7, fatSat_100g: 7.4, serving_size_g: 23 },
  { id: 'dt_893', name: 'Merendina (Kinder Fetta al Latte)', category: 'Snack e Ultra-Processati', kcal_100g: 371, proteins_100g: 9.8, carbs_100g: 44.8, fats_100g: 17.4, fiber_100g: 0, sugar_100g: 39.6, fatSat_100g: 10.3, serving_size_g: 28 },
  { id: 'dt_894', name: 'Barretta ai cereali (tipo Müsli bar)', category: 'Snack e Ultra-Processati', kcal_100g: 394, proteins_100g: 7, carbs_100g: 65, fats_100g: 12.5, fiber_100g: 4, sugar_100g: 28, fatSat_100g: 2.5, serving_size_g: 40 },
  { id: 'dt_895', name: 'Barretta proteica (whey, media)', category: 'Snack e Ultra-Processati', kcal_100g: 385, proteins_100g: 32, carbs_100g: 38, fats_100g: 11, fiber_100g: 4, sugar_100g: 10, fatSat_100g: 4, serving_size_g: 60 },

  // ─── Piatti pronti e cibi preparati ──────────────────────────────────
  { id: 'dt_896', name: 'Pizza Margherita (artigianale)', category: 'Piatti Pronti', kcal_100g: 250, proteins_100g: 10, carbs_100g: 35, fats_100g: 7.5, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_897', name: 'Pizza surgelata (margherita)', category: 'Piatti Pronti', kcal_100g: 229, proteins_100g: 9.4, carbs_100g: 31, fats_100g: 7.5, fiber_100g: 2.2, sugar_100g: 3.8, fatSat_100g: 3.7, serving_size_g: 350 },
  { id: 'dt_898', name: 'Lasagne al ragù (pronte surgelate)', category: 'Piatti Pronti', kcal_100g: 130, proteins_100g: 6.5, carbs_100g: 14, fats_100g: 5.5, fiber_100g: 1, sugar_100g: 2.5, fatSat_100g: 2.5, serving_size_g: 400 },
  { id: 'dt_899', name: 'Risotto ai funghi (pronto)', category: 'Piatti Pronti', kcal_100g: 115, proteins_100g: 3.5, carbs_100g: 21, fats_100g: 2.5, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 0.8, serving_size_g: 300 },
  { id: 'dt_900', name: 'Minestrone (pronto in busta)', category: 'Piatti Pronti', kcal_100g: 42, proteins_100g: 2.2, carbs_100g: 7.8, fats_100g: 0.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 0.1, serving_size_g: 400 },
  { id: 'dt_901', name: 'Insalata mista in busta', category: 'Piatti Pronti', kcal_100g: 18, proteins_100g: 1.4, carbs_100g: 2.6, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 1.6, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_902', name: 'Burger vegetale (Beyond/Impossible)', category: 'Piatti Pronti', kcal_100g: 250, proteins_100g: 19, carbs_100g: 9, fats_100g: 16, fiber_100g: 3.5, sugar_100g: 0, fatSat_100g: 5.5, serving_size_g: 113 },
  { id: 'dt_903', name: 'Salmone affumicato confezionato', category: 'Piatti Pronti', kcal_100g: 117, proteins_100g: 18.3, carbs_100g: 0, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 50 },

  // ─── Spezie e aromi ───────────────────────────────────────────────────
  { id: 'dt_904', name: 'Curcuma (polvere)', category: 'Condimenti e Salse', kcal_100g: 312, proteins_100g: 9.7, carbs_100g: 67.1, fats_100g: 3.3, fiber_100g: 21.1, sugar_100g: 3.2, fatSat_100g: 1.1, serving_size_g: 3 },
  { id: 'dt_905', name: 'Zenzero fresco', category: 'Condimenti e Salse', kcal_100g: 80, proteins_100g: 1.8, carbs_100g: 17.8, fats_100g: 0.8, fiber_100g: 2, sugar_100g: 1.7, fatSat_100g: 0.2, serving_size_g: 10 },
  { id: 'dt_906', name: 'Cannella (polvere)', category: 'Condimenti e Salse', kcal_100g: 247, proteins_100g: 4, carbs_100g: 80.6, fats_100g: 1.2, fiber_100g: 53.1, sugar_100g: 2.2, fatSat_100g: 0.3, serving_size_g: 3 },
  { id: 'dt_907', name: 'Paprica dolce', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 14.1, carbs_100g: 53.1, fats_100g: 12.9, fiber_100g: 34.9, sugar_100g: 10, fatSat_100g: 2.4, serving_size_g: 3 },
  { id: 'dt_908', name: 'Pepe nero (macinato)', category: 'Condimenti e Salse', kcal_100g: 255, proteins_100g: 10.4, carbs_100g: 63.9, fats_100g: 3.3, fiber_100g: 25.3, sugar_100g: 0.6, fatSat_100g: 1, serving_size_g: 2 },
  { id: 'dt_909', name: 'Origano secco', category: 'Condimenti e Salse', kcal_100g: 265, proteins_100g: 9, carbs_100g: 68.9, fats_100g: 4.3, fiber_100g: 42.5, sugar_100g: 4.1, fatSat_100g: 1.6, serving_size_g: 2 },
  { id: 'dt_910', name: 'Basilico fresco', category: 'Condimenti e Salse', kcal_100g: 23, proteins_100g: 3.2, carbs_100g: 2.7, fats_100g: 0.6, fiber_100g: 1.6, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 5 },
  { id: 'dt_911', name: 'Prezzemolo fresco', category: 'Condimenti e Salse', kcal_100g: 36, proteins_100g: 3, carbs_100g: 6.3, fats_100g: 0.8, fiber_100g: 3.3, sugar_100g: 0.9, fatSat_100g: 0.1, serving_size_g: 5 },
  { id: 'dt_912', name: 'Rosmarino fresco', category: 'Condimenti e Salse', kcal_100g: 131, proteins_100g: 3.3, carbs_100g: 20.7, fats_100g: 5.9, fiber_100g: 14.1, sugar_100g: 0.1, fatSat_100g: 2.8, serving_size_g: 5 },

  // ─── Prodotti per sportivi e integratori alimentari ───────────────────
  { id: 'dt_913', name: 'Whey protein (polvere, vaniglia)', category: 'Integratori', kcal_100g: 370, proteins_100g: 75, carbs_100g: 8, fats_100g: 4, fiber_100g: 0.5, sugar_100g: 5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_914', name: 'Proteine del pisello (polvere)', category: 'Integratori', kcal_100g: 355, proteins_100g: 80, carbs_100g: 4, fats_100g: 2, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 30 },
  { id: 'dt_915', name: 'Creatina monoidrato', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 5 },
  { id: 'dt_916', name: 'Amido di mais (per glucosio sportivo)', category: 'Integratori', kcal_100g: 381, proteins_100g: 0.3, carbs_100g: 91, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 40 },
  { id: 'dt_917', name: 'ONS - integratore nutrizionale standard (Ensure/Meritene)', category: 'Integratori', kcal_100g: 100, proteins_100g: 4, carbs_100g: 13.8, fats_100g: 3.4, fiber_100g: 0, sugar_100g: 12.5, fatSat_100g: 0.5, serving_size_g: 220 },

  // ─── Alimenti per diete speciali ──────────────────────────────────────
  { id: 'dt_918', name: 'Pasta senza glutine (riso+mais)', category: 'Cereali', kcal_100g: 356, proteins_100g: 3.5, carbs_100g: 80, fats_100g: 1.1, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_919', name: 'Pane senza glutine (confezionato)', category: 'Cereali', kcal_100g: 237, proteins_100g: 3, carbs_100g: 49, fats_100g: 3.5, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 0.5, serving_size_g: 50 },
  { id: 'dt_920', name: 'Crackers senza glutine', category: 'Cereali', kcal_100g: 382, proteins_100g: 4, carbs_100g: 75, fats_100g: 8, fiber_100g: 3.5, sugar_100g: 2, fatSat_100g: 0.8, serving_size_g: 25 },
  { id: 'dt_921', name: 'Biscotti senza glutine', category: 'Dolci e Zuccheri', kcal_100g: 445, proteins_100g: 4.5, carbs_100g: 64, fats_100g: 19, fiber_100g: 3, sugar_100g: 20, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_922', name: 'Latte senza lattosio (intero)', category: 'Latticini', kcal_100g: 62, proteins_100g: 3.2, carbs_100g: 4.7, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 4.7, fatSat_100g: 2, serving_size_g: 200 },
  { id: 'dt_923', name: 'Yogurt senza lattosio', category: 'Latticini', kcal_100g: 65, proteins_100g: 4, carbs_100g: 4.8, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 2, serving_size_g: 125 },
  { id: 'dt_924', name: 'Tofu affumicato', category: 'Legumi', kcal_100g: 155, proteins_100g: 15, carbs_100g: 3, fats_100g: 9, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 1.3 },
  { id: 'dt_925', name: 'Seitan', category: 'Legumi', kcal_100g: 142, proteins_100g: 25, carbs_100g: 6.9, fats_100g: 1.9, fiber_100g: 0.6, sugar_100g: 0, fatSat_100g: 0.3 },
  { id: 'dt_926', name: 'Skyr (islandese)', category: 'Latticini', kcal_100g: 63, proteins_100g: 11, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Alimenti etnici e internazionali ─────────────────────────────────
  { id: 'dt_927', name: 'Ramen (noodle secchi)', category: 'Cereali', kcal_100g: 436, proteins_100g: 10.5, carbs_100g: 85.5, fats_100g: 5.5, fiber_100g: 3.7, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 85 },
  { id: 'dt_928', name: 'Noodle di riso (secchi)', category: 'Cereali', kcal_100g: 361, proteins_100g: 6.2, carbs_100g: 80, fats_100g: 0.4, fiber_100g: 1.8, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_929', name: 'Miso bianco (shiro)', category: 'Condimenti e Salse', kcal_100g: 199, proteins_100g: 12, carbs_100g: 26, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 6.2, fatSat_100g: 1.2, serving_size_g: 20 },
  { id: 'dt_930', name: 'Kimchi', category: 'Verdure', kcal_100g: 15, proteins_100g: 1.1, carbs_100g: 2.4, fats_100g: 0.5, fiber_100g: 1.6, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_931', name: 'Tofu silken (morbido)', category: 'Legumi', kcal_100g: 55, proteins_100g: 5.3, carbs_100g: 1.7, fats_100g: 2.7, fiber_100g: 0.2, sugar_100g: 1, fatSat_100g: 0.4 },
  { id: 'dt_932', name: 'Falafel (fritti)', category: 'Piatti Pronti', kcal_100g: 333, proteins_100g: 13.3, carbs_100g: 31.8, fats_100g: 17.8, fiber_100g: 6, sugar_100g: 3, fatSat_100g: 2.3, serving_size_g: 100 },
  { id: 'dt_933', name: 'Kebab (carne mista, senza pane)', category: 'Piatti Pronti', kcal_100g: 265, proteins_100g: 18, carbs_100g: 4, fats_100g: 20, fiber_100g: 0.5, sugar_100g: 2, fatSat_100g: 8, serving_size_g: 200 },

  // ─── Alimenti per neonati e bambini ──────────────────────────────────
  { id: 'dt_934', name: 'Latte formula 1 (0-6 mesi)', category: 'Alimenti infanzia', kcal_100g: 67, proteins_100g: 1.4, carbs_100g: 7.4, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 7.4, fatSat_100g: 1.6, serving_size_g: 150 },
  { id: 'dt_935', name: 'Latte formula 2 (6-12 mesi)', category: 'Alimenti infanzia', kcal_100g: 65, proteins_100g: 1.7, carbs_100g: 7.2, fats_100g: 3.3, fiber_100g: 0, sugar_100g: 7.2, fatSat_100g: 1.4, serving_size_g: 200 },
  { id: 'dt_936', name: 'Crema di riso per neonati', category: 'Alimenti infanzia', kcal_100g: 375, proteins_100g: 7, carbs_100g: 82, fats_100g: 1, fiber_100g: 1.5, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 30 },
  { id: 'dt_937', name: 'Merenda al latte per bambini (brick)', category: 'Alimenti infanzia', kcal_100g: 75, proteins_100g: 3, carbs_100g: 11.5, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 11.5, fatSat_100g: 1, serving_size_g: 200 },

  // ─── Biscotti italiani di marca (UPF) ────────────────────────────────
  { id: 'dt_938', name: 'Ringo al cioccolato (Pavesi)', category: 'Dolci e Zuccheri', kcal_100g: 490, proteins_100g: 6.0, carbs_100g: 67.0, fats_100g: 22.0, fiber_100g: 1.5, sugar_100g: 41.0, fatSat_100g: 9.0, serving_size_g: 14 },
  { id: 'dt_939', name: 'Abbracci Mulino Bianco', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 7.5, carbs_100g: 68.5, fats_100g: 18.5, fiber_100g: 2.5, sugar_100g: 28.0, fatSat_100g: 6.5, serving_size_g: 12 },
  { id: 'dt_940', name: 'Baiocchi Mulino Bianco', category: 'Dolci e Zuccheri', kcal_100g: 502, proteins_100g: 7.0, carbs_100g: 64.5, fats_100g: 24.5, fiber_100g: 2.0, sugar_100g: 31.0, fatSat_100g: 7.5, serving_size_g: 12 },
  { id: 'dt_941', name: 'Macine Mulino Bianco', category: 'Dolci e Zuccheri', kcal_100g: 445, proteins_100g: 8.0, carbs_100g: 69.0, fats_100g: 14.0, fiber_100g: 3.5, sugar_100g: 24.0, fatSat_100g: 3.5, serving_size_g: 12 },
  { id: 'dt_942', name: 'TUC crackers salati (Lu)', category: 'Pane e Prodotti da Forno', kcal_100g: 475, proteins_100g: 8.0, carbs_100g: 63.5, fats_100g: 19.0, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 4.5, serving_size_g: 25 },
  { id: 'dt_943', name: 'Plasmon biscotti prima infanzia', category: 'Alimenti infanzia', kcal_100g: 405, proteins_100g: 10.5, carbs_100g: 72.0, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 23.0, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_944', name: 'Ciocorì (Kinder)', category: 'Dolci e Zuccheri', kcal_100g: 540, proteins_100g: 7.5, carbs_100g: 61.5, fats_100g: 30.5, fiber_100g: 1.5, sugar_100g: 54.5, fatSat_100g: 11.5, serving_size_g: 20 },
  { id: 'dt_945', name: 'Fruttolo Danone (yogurt da bere frutta)', category: 'Latticini', kcal_100g: 75, proteins_100g: 3.5, carbs_100g: 12.5, fats_100g: 1.5, fiber_100g: 0.3, sugar_100g: 11.5, fatSat_100g: 0.8, serving_size_g: 100 },

  // ─── Gelati italiani di marca ─────────────────────────────────────────
  { id: 'dt_946', name: 'Magnum Classic (Algida)', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 3.5, carbs_100g: 33.0, fats_100g: 18.5, fiber_100g: 0.5, sugar_100g: 29.0, fatSat_100g: 15.5, serving_size_g: 100 },
  { id: 'dt_947', name: 'Cornetto Algida classico', category: 'Dolci e Zuccheri', kcal_100g: 275, proteins_100g: 4.0, carbs_100g: 37.0, fats_100g: 13.5, fiber_100g: 1.0, sugar_100g: 30.0, fatSat_100g: 9.5, serving_size_g: 90 },
  { id: 'dt_948', name: 'Calippo limone (Algida)', category: 'Dolci e Zuccheri', kcal_100g: 70, proteins_100g: 0.2, carbs_100g: 16.8, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 16.5, fatSat_100g: 0, serving_size_g: 105 },
  { id: 'dt_949', name: 'Twister Algida fragola', category: 'Dolci e Zuccheri', kcal_100g: 82, proteins_100g: 1.0, carbs_100g: 15.0, fats_100g: 2.0, fiber_100g: 0.2, sugar_100g: 14.5, fatSat_100g: 1.0, serving_size_g: 80 },
  { id: 'dt_950', name: 'Häagen-Dazs Vanilla', category: 'Dolci e Zuccheri', kcal_100g: 271, proteins_100g: 4.0, carbs_100g: 26.5, fats_100g: 17.5, fiber_100g: 0, sugar_100g: 23.5, fatSat_100g: 11.5, serving_size_g: 100 },
  { id: 'dt_951', name: 'Solero al mango (Algida)', category: 'Dolci e Zuccheri', kcal_100g: 78, proteins_100g: 1.0, carbs_100g: 16.0, fats_100g: 1.5, fiber_100g: 0.5, sugar_100g: 15.0, fatSat_100g: 0.5, serving_size_g: 90 },

  // ─── Bibite e bevande aggiuntive ─────────────────────────────────────
  { id: 'dt_952', name: 'Lemonsoda (San Pellegrino)', category: 'Bevande', kcal_100g: 38, proteins_100g: 0, carbs_100g: 9.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 8.8, fatSat_100g: 0, serving_size_g: 330 },
  { id: 'dt_953', name: 'Pepsi Cola', category: 'Bevande', kcal_100g: 43, proteins_100g: 0, carbs_100g: 10.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 330 },
  { id: 'dt_954', name: 'San Benedetto Ice Tea pesca', category: 'Bevande', kcal_100g: 19, proteins_100g: 0, carbs_100g: 4.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 500 },
  { id: 'dt_955', name: 'Succo ACE arancia-carota-limone (brick)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.5, carbs_100g: 11.0, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_956', name: 'Coca-Cola Zero Sugar', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 330 },
  { id: 'dt_957', name: 'Limoncello', category: 'Bevande', kcal_100g: 230, proteins_100g: 0, carbs_100g: 28.0, fats_100g: 0, fiber_100g: 0, sugar_100g: 28.0, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_958', name: 'Grappa', category: 'Bevande', kcal_100g: 225, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 40 },
  { id: 'dt_959', name: 'Birra artigianale IPA (6-7%)', category: 'Bevande', kcal_100g: 58, proteins_100g: 0.5, carbs_100g: 4.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 330 },

  // ─── Pasta fresca e piatti pronti refrigerati ─────────────────────────
  { id: 'dt_960', name: 'Tortellini ricotta spinaci Giovanni Rana', category: 'Piatti Pronti', kcal_100g: 265, proteins_100g: 11.5, carbs_100g: 37.0, fats_100g: 8.5, fiber_100g: 1.5, sugar_100g: 3.0, fatSat_100g: 3.5, serving_size_g: 250 },
  { id: 'dt_961', name: 'Ravioli di carne Giovanni Rana', category: 'Piatti Pronti', kcal_100g: 250, proteins_100g: 11.0, carbs_100g: 34.5, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 3.0, serving_size_g: 250 },
  { id: 'dt_962', name: 'Buitoni tortelloni ricotta (fresco)', category: 'Piatti Pronti', kcal_100g: 248, proteins_100g: 10.0, carbs_100g: 34.5, fats_100g: 8.0, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 250 },
  { id: 'dt_963', name: 'Findus 4 Salti in Padella pollo e verdure', category: 'Piatti Pronti', kcal_100g: 105, proteins_100g: 7.5, carbs_100g: 11.5, fats_100g: 3.5, fiber_100g: 3.0, sugar_100g: 2.0, fatSat_100g: 1.0, serving_size_g: 300 },
  { id: 'dt_964', name: 'Findus 4 Salti in Padella carbonara', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 6.5, carbs_100g: 19.5, fats_100g: 8.5, fiber_100g: 1.5, sugar_100g: 3.0, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_965', name: 'Wok surgelato misto asiatico', category: 'Piatti Pronti', kcal_100g: 95, proteins_100g: 5.0, carbs_100g: 12.5, fats_100g: 2.5, fiber_100g: 3.5, sugar_100g: 5.0, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_966', name: 'Polpette di carne surgelate', category: 'Piatti Pronti', kcal_100g: 240, proteins_100g: 14.5, carbs_100g: 10.5, fats_100g: 16.0, fiber_100g: 1.0, sugar_100g: 2.5, fatSat_100g: 4.0, serving_size_g: 150 },
  { id: 'dt_967', name: 'Cordon bleu di pollo surgelato', category: 'Piatti Pronti', kcal_100g: 225, proteins_100g: 14.0, carbs_100g: 16.0, fats_100g: 12.0, fiber_100g: 1.0, sugar_100g: 1.5, fatSat_100g: 4.5, serving_size_g: 130 },
  { id: 'dt_968', name: 'Sofficini al formaggio Findus', category: 'Piatti Pronti', kcal_100g: 215, proteins_100g: 7.5, carbs_100g: 25.5, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 3.0, fatSat_100g: 4.5, serving_size_g: 100 },

  // ─── Condimenti e salse industriali ──────────────────────────────────
  { id: 'dt_969', name: 'Salsa BBQ (barbecue)', category: 'Condimenti e Salse', kcal_100g: 106, proteins_100g: 1.0, carbs_100g: 25.0, fats_100g: 0.4, fiber_100g: 0.5, sugar_100g: 23.0, fatSat_100g: 0, serving_size_g: 30 },
  { id: 'dt_970', name: 'Salsa ranch', category: 'Condimenti e Salse', kcal_100g: 310, proteins_100g: 1.5, carbs_100g: 5.0, fats_100g: 31.0, fiber_100g: 0.2, sugar_100g: 3.5, fatSat_100g: 4.0, serving_size_g: 30 },
  { id: 'dt_971', name: 'Salsa teriyaki', category: 'Condimenti e Salse', kcal_100g: 87, proteins_100g: 5.0, carbs_100g: 18.5, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 15.5, fatSat_100g: 0, serving_size_g: 30 },
  { id: 'dt_972', name: 'Salsa Worcestershire', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 1.2, carbs_100g: 18.4, fats_100g: 0.1, fiber_100g: 0.4, sugar_100g: 16.0, fatSat_100g: 0, serving_size_g: 15 },
  { id: 'dt_973', name: 'Tabasco (salsa piccante)', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 0.5, carbs_100g: 1.0, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 5 },
  { id: 'dt_974', name: 'Confettura di fragole (industriale)', category: 'Condimenti e Salse', kcal_100g: 250, proteins_100g: 0.5, carbs_100g: 65.0, fats_100g: 0.1, fiber_100g: 1.2, sugar_100g: 55.0, fatSat_100g: 0, serving_size_g: 30 },
  { id: 'dt_975', name: 'Nutella Biscuits', category: 'Dolci e Zuccheri', kcal_100g: 510, proteins_100g: 6.5, carbs_100g: 64.5, fats_100g: 25.0, fiber_100g: 1.5, sugar_100g: 38.0, fatSat_100g: 7.0, serving_size_g: 22 },

  // ─── Alimenti prima infanzia aggiuntivi ──────────────────────────────
  { id: 'dt_976', name: 'Plasmon omogeneizzato frutta (mela-pera)', category: 'Alimenti infanzia', kcal_100g: 54, proteins_100g: 0.4, carbs_100g: 12.8, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 11.5, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_977', name: 'Plasmon omogeneizzato carne manzo', category: 'Alimenti infanzia', kcal_100g: 70, proteins_100g: 10.0, carbs_100g: 3.5, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_978', name: 'Plasmon omogeneizzato tacchino', category: 'Alimenti infanzia', kcal_100g: 65, proteins_100g: 9.5, carbs_100g: 3.0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_979', name: 'Plasmon crema verdure liofilizzata', category: 'Alimenti infanzia', kcal_100g: 352, proteins_100g: 15.0, carbs_100g: 65.0, fats_100g: 3.0, fiber_100g: 8.0, sugar_100g: 8.0, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_980', name: 'Latte formula 3 crescita (1-3 anni, polvere)', category: 'Alimenti infanzia', kcal_100g: 485, proteins_100g: 15.0, carbs_100g: 58.5, fats_100g: 23.0, fiber_100g: 3.0, sugar_100g: 47.5, fatSat_100g: 8.5, serving_size_g: 220 },
  { id: 'dt_981', name: 'Liofilizzato banana Heinz/Hipp (polvere)', category: 'Alimenti infanzia', kcal_100g: 360, proteins_100g: 4.5, carbs_100g: 85.0, fats_100g: 0.8, fiber_100g: 8.5, sugar_100g: 62.0, fatSat_100g: 0.2, serving_size_g: 10 },
  { id: 'dt_982', name: 'Pastina stelline per bambini (Barilla)', category: 'Alimenti infanzia', kcal_100g: 353, proteins_100g: 12.5, carbs_100g: 70.0, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 3.0, fatSat_100g: 0.2, serving_size_g: 50 },

  // ─── Integratori sportivi aggiuntivi ──────────────────────────────────
  { id: 'dt_983', name: 'Pre-workout polvere (caffeina+beta-alanina)', category: 'Integratori', kcal_100g: 240, proteins_100g: 12.0, carbs_100g: 48.0, fats_100g: 1.0, fiber_100g: 0, sugar_100g: 40.0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_984', name: 'Maltodestrine (polvere)', category: 'Integratori', kcal_100g: 385, proteins_100g: 0, carbs_100g: 96.0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 40 },
  { id: 'dt_985', name: 'Glutammina (polvere)', category: 'Integratori', kcal_100g: 210, proteins_100g: 53.0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 5 },

  // ─── Pane e prodotti da forno industriali aggiuntivi ─────────────────
  { id: 'dt_986', name: 'Pancarré industriale tipo Bauletto', category: 'Pane e Prodotti da Forno', kcal_100g: 265, proteins_100g: 8.5, carbs_100g: 47.5, fats_100g: 4.5, fiber_100g: 2.5, sugar_100g: 5.0, fatSat_100g: 0.8, serving_size_g: 30 },
  { id: 'dt_987', name: 'Fette biscottate classiche (Mulino Bianco)', category: 'Pane e Prodotti da Forno', kcal_100g: 405, proteins_100g: 12.0, carbs_100g: 73.5, fats_100g: 5.5, fiber_100g: 3.5, sugar_100g: 7.5, fatSat_100g: 1.5, serving_size_g: 10 },
  { id: 'dt_988', name: 'Fette biscottate integrali', category: 'Pane e Prodotti da Forno', kcal_100g: 390, proteins_100g: 12.5, carbs_100g: 68.0, fats_100g: 5.0, fiber_100g: 8.5, sugar_100g: 5.0, fatSat_100g: 1.0, serving_size_g: 10 },
  { id: 'dt_989', name: 'Crackers integrali tipo Wasa', category: 'Pane e Prodotti da Forno', kcal_100g: 350, proteins_100g: 10.0, carbs_100g: 70.0, fats_100g: 3.0, fiber_100g: 11.0, sugar_100g: 2.0, fatSat_100g: 0.5, serving_size_g: 16 },
  { id: 'dt_990', name: 'Grissini al rosmarino (industriali)', category: 'Pane e Prodotti da Forno', kcal_100g: 420, proteins_100g: 10.5, carbs_100g: 68.5, fats_100g: 10.5, fiber_100g: 3.0, sugar_100g: 2.5, fatSat_100g: 1.0, serving_size_g: 30 },
  { id: 'dt_991', name: 'Piadina romagnola IGP', category: 'Pane e Prodotti da Forno', kcal_100g: 298, proteins_100g: 8.5, carbs_100g: 44.0, fats_100g: 10.0, fiber_100g: 2.0, sugar_100g: 4.5, fatSat_100g: 4.0, serving_size_g: 100 },
  { id: 'dt_992', name: 'Focaccia ligure (industriale)', category: 'Pane e Prodotti da Forno', kcal_100g: 270, proteins_100g: 7.5, carbs_100g: 40.0, fats_100g: 8.5, fiber_100g: 2.0, sugar_100g: 2.0, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Salumi italiani tipici aggiuntivi ───────────────────────────────
  { id: 'dt_993', name: 'Salame Felino IGP', category: 'Salumi e Insaccati', kcal_100g: 400, proteins_100g: 27.0, carbs_100g: 1.0, fats_100g: 31.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 12.5, serving_size_g: 50 },

  // ─── Prodotti senza glutine specifici ────────────────────────────────
  { id: 'dt_994', name: 'Fette biscottate senza glutine', category: 'Cereali', kcal_100g: 388, proteins_100g: 5.5, carbs_100g: 78.5, fats_100g: 5.0, fiber_100g: 3.0, sugar_100g: 5.0, fatSat_100g: 0.5, serving_size_g: 10 },
  { id: 'dt_995', name: 'Pizza base senza glutine surgelata', category: 'Cereali', kcal_100g: 265, proteins_100g: 3.5, carbs_100g: 52.0, fats_100g: 4.0, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 1.0, serving_size_g: 200 },

  // ─── Snack salati e dolci alternativi ────────────────────────────────
  { id: 'dt_996', name: 'Chips di lenticchie (snack proteico)', category: 'Snack e Ultra-Processati', kcal_100g: 415, proteins_100g: 16.0, carbs_100g: 60.5, fats_100g: 12.5, fiber_100g: 8.5, sugar_100g: 3.0, fatSat_100g: 2.0, serving_size_g: 30 },
  { id: 'dt_997', name: 'Chips di barbabietola (snack)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 5.5, carbs_100g: 55.0, fats_100g: 14.5, fiber_100g: 5.5, sugar_100g: 22.0, fatSat_100g: 3.0, serving_size_g: 30 },
  { id: 'dt_998', name: 'Popcorn caramellati', category: 'Snack e Ultra-Processati', kcal_100g: 420, proteins_100g: 4.5, carbs_100g: 80.0, fats_100g: 8.5, fiber_100g: 4.0, sugar_100g: 52.0, fatSat_100g: 1.5, serving_size_g: 30 },
  { id: 'dt_999', name: 'Rice cakes al cioccolato fondente', category: 'Snack e Ultra-Processati', kcal_100g: 400, proteins_100g: 5.5, carbs_100g: 67.5, fats_100g: 11.5, fiber_100g: 4.0, sugar_100g: 35.0, fatSat_100g: 5.5, serving_size_g: 30 },
  { id: 'dt_1000', name: 'Schiacciatine al sesamo (grissini)', category: 'Pane e Prodotti da Forno', kcal_100g: 435, proteins_100g: 10.5, carbs_100g: 68.5, fats_100g: 12.5, fiber_100g: 4.5, sugar_100g: 2.5, fatSat_100g: 2.0, serving_size_g: 30 },


  // ─── Bevande ───
  { id: 'dt_1001', name: 'Acqua minerale naturale', category: 'Bevande', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1002', name: 'Birra analcolica', category: 'Bevande', kcal_100g: 18, proteins_100g: 0.5, carbs_100g: 3.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1003', name: 'Birra normale (4-5%)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.3, carbs_100g: 3.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1004', name: 'Latte parz. scremato UHT', category: 'Bevande', kcal_100g: 46, proteins_100g: 3.5, carbs_100g: 5, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 0.9, serving_size_g: 200 },
  { id: 'dt_1005', name: 'Latte intero fresco', category: 'Bevande', kcal_100g: 61, proteins_100g: 3.2, carbs_100g: 4.8, fats_100g: 3.3, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 1.9, serving_size_g: 200 },
  { id: 'dt_1006', name: 'Succo di arancia', category: 'Bevande', kcal_100g: 38, proteins_100g: 0.7, carbs_100g: 8.8, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 8.6, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1007', name: 'Crackers salati', category: 'Pane e Prodotti da Forno', kcal_100g: 432, proteins_100g: 9.2, carbs_100g: 69, fats_100g: 11.5, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 3.1, serving_size_g: 30 },

  // ─── Carni bianche ───
  { id: 'dt_1008', name: 'Pollo petto (senza pelle)', category: 'Proteine', kcal_100g: 100, proteins_100g: 23.3, carbs_100g: 0, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_1009', name: 'Tacchino petto', category: 'Proteine', kcal_100g: 107, proteins_100g: 24, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1010', name: 'Manzo magro', category: 'Proteine', kcal_100g: 133, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.2, serving_size_g: 100 },
  { id: 'dt_1011', name: 'Vitello fettina', category: 'Proteine', kcal_100g: 107, proteins_100g: 20.7, carbs_100g: 0, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },
  { id: 'dt_1012', name: 'Maiale lonza', category: 'Proteine', kcal_100g: 146, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Cereali da colazione ───
  { id: 'dt_1013', name: 'Fiocchi d\'avena', category: 'Cereali', kcal_100g: 369, proteins_100g: 12.5, carbs_100g: 62, fats_100g: 6.5, fiber_100g: 9, sugar_100g: 1, fatSat_100g: 1.2, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_1014', name: 'Pasta di semola cruda', category: 'Cereali', kcal_100g: 353, proteins_100g: 10.9, carbs_100g: 72.7, fats_100g: 1.4, fiber_100g: 2.7, sugar_100g: 3, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1015', name: 'Pasta integrale cruda', category: 'Cereali', kcal_100g: 335, proteins_100g: 13, carbs_100g: 63, fats_100g: 2.5, fiber_100g: 8, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1016', name: 'Riso bianco crudo', category: 'Cereali', kcal_100g: 362, proteins_100g: 6.7, carbs_100g: 80, fats_100g: 0.4, fiber_100g: 1, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1017', name: 'Riso integrale crudo', category: 'Cereali', kcal_100g: 341, proteins_100g: 7.5, carbs_100g: 77.4, fats_100g: 1.9, fiber_100g: 1.9, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1018', name: 'Farro perlato crudo', category: 'Cereali', kcal_100g: 353, proteins_100g: 14.6, carbs_100g: 69.3, fats_100g: 2.4, fiber_100g: 6.5, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1019', name: 'Quinoa cruda', category: 'Cereali', kcal_100g: 368, proteins_100g: 14.1, carbs_100g: 64, fats_100g: 6.1, fiber_100g: 7, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_1020', name: 'Orzo perlato crudo', category: 'Cereali', kcal_100g: 352, proteins_100g: 9.9, carbs_100g: 71, fats_100g: 1.8, fiber_100g: 9, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Crostacei ───
  { id: 'dt_1021', name: 'Gamberi', category: 'Proteine', kcal_100g: 71, proteins_100g: 13.6, carbs_100g: 0.6, fats_100g: 0.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Dolci ───
  { id: 'dt_1022', name: 'Cioccolato fondente (>70%)', category: 'Dolci e Zuccheri', kcal_100g: 549, proteins_100g: 6, carbs_100g: 50, fats_100g: 35, fiber_100g: 10, sugar_100g: 36, fatSat_100g: 18, serving_size_g: 50 },
  { id: 'dt_1023', name: 'Marmellata / confettura', category: 'Dolci e Zuccheri', kcal_100g: 240, proteins_100g: 0.5, carbs_100g: 55, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 50, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1024', name: 'Miele millefiori', category: 'Dolci e Zuccheri', kcal_100g: 304, proteins_100g: 0.3, carbs_100g: 80, fats_100g: 0, fiber_100g: 0, sugar_100g: 78, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Formaggi ───
  { id: 'dt_1025', name: 'Mozzarella vaccina', category: 'Latticini', kcal_100g: 253, proteins_100g: 18.7, carbs_100g: 0.7, fats_100g: 19.5, fiber_100g: 0, sugar_100g: 0.7, fatSat_100g: 12.5, serving_size_g: 125 },
  { id: 'dt_1026', name: 'Ricotta vaccina', category: 'Latticini', kcal_100g: 146, proteins_100g: 8.8, carbs_100g: 3.5, fats_100g: 10.9, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 6.8, serving_size_g: 125 },

  // ─── Frutta fresca ───
  { id: 'dt_1027', name: 'Fragola', category: 'Frutta', kcal_100g: 27, proteins_100g: 0.9, carbs_100g: 5.3, fats_100g: 0.4, fiber_100g: 1.6, sugar_100g: 5.3, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1028', name: 'Mandorle dolci secche', category: 'Frutta', kcal_100g: 603, proteins_100g: 22, carbs_100g: 4.6, fats_100g: 55.3, fiber_100g: 12.7, sugar_100g: 3.7, fatSat_100g: 4.6, serving_size_g: 150 },

  // ─── Grassi ───
  { id: 'dt_1029', name: 'Olio extra vergine di oliva', category: 'Grassi', kcal_100g: 899, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14.5, serving_size_g: 10 },

  // ─── Latte e derivati ───
  { id: 'dt_1030', name: 'Yogurt intero bianco', category: 'Latticini', kcal_100g: 66, proteins_100g: 3.8, carbs_100g: 4.3, fats_100g: 3.9, fiber_100g: 0, sugar_100g: 4.3, fatSat_100g: 2.1, serving_size_g: 125 },

  // ─── Legumi ───
  { id: 'dt_1031', name: 'Ceci secchi', category: 'Legumi', kcal_100g: 316, proteins_100g: 20.9, carbs_100g: 46.9, fats_100g: 6.3, fiber_100g: 13.6, sugar_100g: 3.7, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_1032', name: 'Lenticchie secche', category: 'Legumi', kcal_100g: 291, proteins_100g: 22.7, carbs_100g: 50.5, fats_100g: 1.3, fiber_100g: 11.5, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1033', name: 'Fagioli borlotti secchi', category: 'Legumi', kcal_100g: 312, proteins_100g: 20.2, carbs_100g: 47.7, fats_100g: 2, fiber_100g: 17.3, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1034', name: 'Tofu naturale', category: 'Legumi', kcal_100g: 70, proteins_100g: 8, carbs_100g: 1.9, fats_100g: 4.3, fiber_100g: 0.3, sugar_100g: 0.4, fatSat_100g: 0.8, serving_size_g: 80 },

  // ─── Pesce ───
  { id: 'dt_1035', name: 'Salmone atlantico', category: 'Proteine', kcal_100g: 185, proteins_100g: 20, carbs_100g: 0, fats_100g: 12, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 150 },
  { id: 'dt_1036', name: 'Tonno in scatola al naturale', category: 'Proteine', kcal_100g: 103, proteins_100g: 25.4, carbs_100g: 0, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1037', name: 'Branzino (spigola)', category: 'Proteine', kcal_100g: 97, proteins_100g: 18.4, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },

  // ─── Uova ───
  { id: 'dt_1038', name: 'Uovo di gallina intero crudo', category: 'Proteine', kcal_100g: 128, proteins_100g: 12.4, carbs_100g: 0.5, fats_100g: 8.7, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 3.2, serving_size_g: 100 },
  { id: 'dt_1039', name: 'Albume d\'uovo', category: 'Proteine', kcal_100g: 43, proteins_100g: 10.9, carbs_100g: 0.7, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Verdure ───
  { id: 'dt_1040', name: 'Carota', category: 'Verdure', kcal_100g: 35, proteins_100g: 1.1, carbs_100g: 7.6, fats_100g: 0.2, fiber_100g: 3.1, sugar_100g: 7.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1041', name: 'Pomodoro rosso', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.2, carbs_100g: 3.5, fats_100g: 0.2, fiber_100g: 1.2, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1042', name: 'Spinaci crudi', category: 'Verdure', kcal_100g: 35, proteins_100g: 3.4, carbs_100g: 2.9, fats_100g: 0.7, fiber_100g: 1.9, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1043', name: 'Patata', category: 'Verdure', kcal_100g: 85, proteins_100g: 2.1, carbs_100g: 18, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1044', name: 'Peperone rosso', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 6.7, fats_100g: 0.3, fiber_100g: 2.1, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Formaggi ───
  { id: 'dt_1045', name: 'Provolone dolce', category: 'Latticini', kcal_100g: 351, proteins_100g: 25.6, carbs_100g: 0.5, fats_100g: 26.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 13.5, serving_size_g: 125 },
  { id: 'dt_1046', name: 'Asiago fresco', category: 'Latticini', kcal_100g: 345, proteins_100g: 23.8, carbs_100g: 0.6, fats_100g: 26.4, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 13, serving_size_g: 125 },

  // ─── Latte e derivati ───
  { id: 'dt_1047', name: 'Kefir intero', category: 'Latticini', kcal_100g: 61, proteins_100g: 3.4, carbs_100g: 4.7, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 4.7, fatSat_100g: 1.5, serving_size_g: 125 },
  { id: 'dt_1048', name: 'Latte di soia non zuccherato', category: 'Latticini', kcal_100g: 33, proteins_100g: 3.3, carbs_100g: 0.5, fats_100g: 1.8, fiber_100g: 0.2, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 125 },
  { id: 'dt_1049', name: 'Latte di mandorla non zuccherato', category: 'Latticini', kcal_100g: 24, proteins_100g: 0.8, carbs_100g: 0.3, fats_100g: 1.5, fiber_100g: 0.1, sugar_100g: 0.2, fatSat_100g: 0.1, serving_size_g: 125 },

  // ─── Carni rosse ───
  { id: 'dt_1050', name: 'Agnello coscia', category: 'Proteine', kcal_100g: 102, proteins_100g: 20, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1051', name: 'Anatra petto (senza pelle)', category: 'Proteine', kcal_100g: 135, proteins_100g: 19, carbs_100g: 0, fats_100g: 6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1052', name: 'Fegato di vitello', category: 'Proteine', kcal_100g: 155, proteins_100g: 19.5, carbs_100g: 4, fats_100g: 7.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1053', name: 'Fegato di pollo', category: 'Proteine', kcal_100g: 136, proteins_100g: 19, carbs_100g: 0.9, fats_100g: 5.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1054', name: 'Sgombro fresco', category: 'Proteine', kcal_100g: 170, proteins_100g: 17, carbs_100g: 0.5, fats_100g: 11.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.6, serving_size_g: 150 },
  { id: 'dt_1055', name: 'Acciughe sott\'olio', category: 'Proteine', kcal_100g: 210, proteins_100g: 20, carbs_100g: 0, fats_100g: 14.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 150 },

  // ─── Frutta fresca ───
  { id: 'dt_1056', name: 'Anguria / cocomero', category: 'Frutta', kcal_100g: 30, proteins_100g: 0.6, carbs_100g: 7.6, fats_100g: 0.2, fiber_100g: 0.4, sugar_100g: 6.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1057', name: 'Prugne / susine', category: 'Frutta', kcal_100g: 39, proteins_100g: 0.7, carbs_100g: 9.6, fats_100g: 0.3, fiber_100g: 1.4, sugar_100g: 7.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1058', name: 'Albicocche fresche', category: 'Frutta', kcal_100g: 48, proteins_100g: 1.4, carbs_100g: 11.1, fats_100g: 0.4, fiber_100g: 2, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1059', name: 'Uva nera', category: 'Frutta', kcal_100g: 65, proteins_100g: 0.7, carbs_100g: 16, fats_100g: 0.3, fiber_100g: 1, sugar_100g: 15.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1060', name: 'Melograno / melagrana', category: 'Frutta', kcal_100g: 68, proteins_100g: 1, carbs_100g: 17.2, fats_100g: 1.2, fiber_100g: 4, sugar_100g: 13.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1061', name: 'Mirtilli freschi', category: 'Frutta', kcal_100g: 57, proteins_100g: 0.7, carbs_100g: 14.5, fats_100g: 0.3, fiber_100g: 2.4, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1062', name: 'Zucca gialla', category: 'Verdure', kcal_100g: 26, proteins_100g: 1, carbs_100g: 6.5, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 2.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1063', name: 'Indivia / belga', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.8, carbs_100g: 3.1, fats_100g: 0.2, fiber_100g: 3.1, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e pasta ───
  { id: 'dt_1064', name: 'Couscous crudo', category: 'Cereali', kcal_100g: 376, proteins_100g: 12.8, carbs_100g: 72.4, fats_100g: 0.6, fiber_100g: 5, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1065', name: 'Bulgur crudo', category: 'Cereali', kcal_100g: 342, proteins_100g: 12.3, carbs_100g: 75.9, fats_100g: 1.3, fiber_100g: 18.3, sugar_100g: 0.4, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_1066', name: 'Aceto di vino rosso', category: 'Condimenti e Salse', kcal_100g: 19, proteins_100g: 0.1, carbs_100g: 0.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Grassi ───
  { id: 'dt_1067', name: 'Olio di girasole', category: 'Grassi', kcal_100g: 899, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12.5, serving_size_g: 10 },

  // ─── Bevande ───
  { id: 'dt_1068', name: 'Tè verde infuso', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1069', name: 'Tè nero infuso', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1070', name: 'Caffè americano filtro', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1071', name: 'Caffè d\'orzo', category: 'Bevande', kcal_100g: 5, proteins_100g: 0.2, carbs_100g: 0.9, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 0.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1072', name: 'Succo di mela 100%', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.1, carbs_100g: 11.3, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_1073', name: 'Latte di cocco non conservato', category: 'Latticini', kcal_100g: 230, proteins_100g: 2.3, carbs_100g: 5.5, fats_100g: 23.8, fiber_100g: 2.2, sugar_100g: 3.3, fatSat_100g: 19.7, serving_size_g: 125 },

  // ─── Alcolici ───
  { id: 'dt_1074', name: 'Vino rosso da tavola', category: 'Bevande', kcal_100g: 76, proteins_100g: 0.3, carbs_100g: 2.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_1075', name: 'Vino bianco da tavola', category: 'Bevande', kcal_100g: 73, proteins_100g: 0.1, carbs_100g: 1.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Cereali e pasta ───
  { id: 'dt_1076', name: 'Riso bianco cotto', category: 'Cereali', kcal_100g: 130, proteins_100g: 2.7, carbs_100g: 28, fats_100g: 0.3, fiber_100g: 0.4, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1077', name: 'Pasta di semola cotta', category: 'Cereali', kcal_100g: 157, proteins_100g: 5.7, carbs_100g: 30.8, fats_100g: 0.9, fiber_100g: 1.8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1078', name: 'Pasta di ceci cruda', category: 'Cereali', kcal_100g: 352, proteins_100g: 21, carbs_100g: 54, fats_100g: 6.3, fiber_100g: 11, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1079', name: 'Pasta di lenticchie cruda', category: 'Cereali', kcal_100g: 344, proteins_100g: 24, carbs_100g: 55, fats_100g: 2.3, fiber_100g: 11, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1080', name: 'Riso Arborio crudo', category: 'Cereali', kcal_100g: 350, proteins_100g: 7, carbs_100g: 78, fats_100g: 0.5, fiber_100g: 1, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1081', name: 'Riso Venere crudo', category: 'Cereali', kcal_100g: 350, proteins_100g: 8.5, carbs_100g: 72, fats_100g: 3, fiber_100g: 4.3, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1082', name: 'Polenta taragna cruda', category: 'Cereali', kcal_100g: 350, proteins_100g: 11, carbs_100g: 68, fats_100g: 3.5, fiber_100g: 3, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1083', name: 'Pasta di kamut cruda', category: 'Cereali', kcal_100g: 348, proteins_100g: 14, carbs_100g: 68.5, fats_100g: 2.4, fiber_100g: 4.5, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Carni bianche ───
  { id: 'dt_1084', name: 'Pollo coscia senza pelle', category: 'Proteine', kcal_100g: 155, proteins_100g: 19, carbs_100g: 0, fats_100g: 8.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 100 },
  { id: 'dt_1085', name: 'Pollo ala', category: 'Proteine', kcal_100g: 197, proteins_100g: 18.3, carbs_100g: 0, fats_100g: 13.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 100 },
  { id: 'dt_1086', name: 'Tacchino coscia senza pelle', category: 'Proteine', kcal_100g: 165, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 8.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 100 },
  { id: 'dt_1087', name: 'Oca petto senza pelle', category: 'Proteine', kcal_100g: 161, proteins_100g: 22.8, carbs_100g: 0, fats_100g: 7.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1088', name: 'Cinghiale coscia', category: 'Proteine', kcal_100g: 122, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 100 },
  { id: 'dt_1089', name: 'Maiale pancetta cruda', category: 'Proteine', kcal_100g: 500, proteins_100g: 8.1, carbs_100g: 0, fats_100g: 50, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18, serving_size_g: 100 },
  { id: 'dt_1090', name: 'Agnello bistecca coscia', category: 'Proteine', kcal_100g: 170, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 9.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 100 },
  { id: 'dt_1091', name: 'Cavallo filetto', category: 'Proteine', kcal_100g: 133, proteins_100g: 21, carbs_100g: 0, fats_100g: 4.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1092', name: 'Nasello', category: 'Proteine', kcal_100g: 74, proteins_100g: 16.3, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Molluschi ───
  { id: 'dt_1093', name: 'Totano', category: 'Proteine', kcal_100g: 65, proteins_100g: 13.5, carbs_100g: 0.5, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_1094', name: 'Capasanta', category: 'Proteine', kcal_100g: 76, proteins_100g: 14.8, carbs_100g: 2.4, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1095', name: 'Aringa fresca', category: 'Proteine', kcal_100g: 158, proteins_100g: 17.8, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1096', name: 'Baccalà dissalato', category: 'Proteine', kcal_100g: 82, proteins_100g: 18.9, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1097', name: 'Trota arcobaleno', category: 'Proteine', kcal_100g: 119, proteins_100g: 19, carbs_100g: 0, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1098', name: 'Alici fresche', category: 'Proteine', kcal_100g: 96, proteins_100g: 16.8, carbs_100g: 1.5, fats_100g: 2.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1099', name: 'Mais dolce chicchi freschi', category: 'Verdure', kcal_100g: 86, proteins_100g: 3.2, carbs_100g: 18.7, fats_100g: 1.2, fiber_100g: 2.7, sugar_100g: 3.2, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1100', name: 'Mais dolce in scatola', category: 'Verdure', kcal_100g: 86, proteins_100g: 3, carbs_100g: 19, fats_100g: 1.2, fiber_100g: 2.4, sugar_100g: 3.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1101', name: 'Tarassaco', category: 'Verdure', kcal_100g: 45, proteins_100g: 2.7, carbs_100g: 9.2, fats_100g: 0.7, fiber_100g: 3.5, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1102', name: 'Pak choi', category: 'Verdure', kcal_100g: 13, proteins_100g: 1.5, carbs_100g: 2.2, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1103', name: 'Cavolo viola', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.4, carbs_100g: 7.4, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1104', name: 'Funghi Shiitake', category: 'Verdure', kcal_100g: 34, proteins_100g: 2.2, carbs_100g: 6.8, fats_100g: 0.5, fiber_100g: 2.5, sugar_100g: 1.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1105', name: 'Funghi Portobello', category: 'Verdure', kcal_100g: 22, proteins_100g: 2.1, carbs_100g: 3.9, fats_100g: 0.3, fiber_100g: 1.3, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1106', name: 'Broccoletti cime di rapa', category: 'Verdure', kcal_100g: 22, proteins_100g: 3.2, carbs_100g: 2.9, fats_100g: 0.5, fiber_100g: 2.6, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1107', name: 'Mango fresco', category: 'Frutta', kcal_100g: 60, proteins_100g: 0.8, carbs_100g: 15, fats_100g: 0.4, fiber_100g: 1.6, sugar_100g: 13.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1108', name: 'Papaya fresca', category: 'Frutta', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 10.8, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 7.8, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1109', name: 'Ribes nero', category: 'Frutta', kcal_100g: 63, proteins_100g: 1.4, carbs_100g: 15.4, fats_100g: 0.4, fiber_100g: 5.3, sugar_100g: 6.8, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1110', name: 'Fico d\'india', category: 'Frutta', kcal_100g: 41, proteins_100g: 0.7, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 3.6, sugar_100g: 7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1111', name: 'Dattero fresco', category: 'Frutta', kcal_100g: 277, proteins_100g: 1.8, carbs_100g: 75, fats_100g: 0.2, fiber_100g: 6.7, sugar_100g: 63, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1112', name: 'Uva passa', category: 'Frutta', kcal_100g: 299, proteins_100g: 3.1, carbs_100g: 79, fats_100g: 0.5, fiber_100g: 4.5, sugar_100g: 59, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Formaggi ───
  { id: 'dt_1113', name: 'Scamorza affumicata', category: 'Latticini', kcal_100g: 334, proteins_100g: 25.8, carbs_100g: 0, fats_100g: 25.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12, serving_size_g: 125 },
  { id: 'dt_1114', name: 'Gruyère', category: 'Latticini', kcal_100g: 413, proteins_100g: 29.8, carbs_100g: 0.4, fats_100g: 32.3, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 17.5, serving_size_g: 125 },
  { id: 'dt_1115', name: 'Caprino fresco', category: 'Latticini', kcal_100g: 268, proteins_100g: 18.5, carbs_100g: 0.2, fats_100g: 21.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 11.5, serving_size_g: 125 },

  // ─── Legumi ───
  { id: 'dt_1116', name: 'Fagioli cannellini secchi', category: 'Legumi', kcal_100g: 316, proteins_100g: 23.4, carbs_100g: 55.7, fats_100g: 1.5, fiber_100g: 17, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1117', name: 'Fagioli neri secchi', category: 'Legumi', kcal_100g: 341, proteins_100g: 21.6, carbs_100g: 62.4, fats_100g: 1.4, fiber_100g: 15.2, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1118', name: 'Fagioli azuki secchi', category: 'Legumi', kcal_100g: 329, proteins_100g: 19.9, carbs_100g: 62.9, fats_100g: 0.5, fiber_100g: 12.7, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1119', name: 'Cicerchie secche', category: 'Legumi', kcal_100g: 334, proteins_100g: 26.8, carbs_100g: 58.7, fats_100g: 1.3, fiber_100g: 14.5, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1120', name: 'Fagioli di Spagna secchi', category: 'Legumi', kcal_100g: 289, proteins_100g: 21, carbs_100g: 54, fats_100g: 0.8, fiber_100g: 15, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_1121', name: 'Castagne fresche', category: 'Frutta', kcal_100g: 174, proteins_100g: 2.9, carbs_100g: 36.7, fats_100g: 1.7, fiber_100g: 4.7, sugar_100g: 8.9, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1122', name: 'Castagne secche', category: 'Frutta', kcal_100g: 324, proteins_100g: 3.7, carbs_100g: 72, fats_100g: 2.4, fiber_100g: 14, sugar_100g: 17, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1123', name: 'Cocco secco rapè', category: 'Frutta', kcal_100g: 660, proteins_100g: 6.9, carbs_100g: 23.7, fats_100g: 64.5, fiber_100g: 16.3, sugar_100g: 6.2, fatSat_100g: 59, serving_size_g: 150 },
  { id: 'dt_1124', name: 'Nocciole crude', category: 'Frutta', kcal_100g: 628, proteins_100g: 14.9, carbs_100g: 16.7, fats_100g: 60.8, fiber_100g: 9.7, sugar_100g: 4.3, fatSat_100g: 5.7, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1125', name: 'Salsa di pomodoro fresca', category: 'Condimenti e Salse', kcal_100g: 35, proteins_100g: 1.5, carbs_100g: 6, fats_100g: 0.4, fiber_100g: 1.5, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1126', name: 'Besciamella fatta in casa', category: 'Condimenti e Salse', kcal_100g: 128, proteins_100g: 4, carbs_100g: 10.5, fats_100g: 8.2, fiber_100g: 0.2, sugar_100g: 5.5, fatSat_100g: 5, serving_size_g: 20 },
  { id: 'dt_1127', name: 'Hummus fatto in casa', category: 'Condimenti e Salse', kcal_100g: 180, proteins_100g: 7.9, carbs_100g: 17.4, fats_100g: 9.6, fiber_100g: 6, sugar_100g: 0.6, fatSat_100g: 1.4, serving_size_g: 20 },
  { id: 'dt_1128', name: 'Guacamole fatto in casa', category: 'Condimenti e Salse', kcal_100g: 140, proteins_100g: 2, carbs_100g: 7.6, fats_100g: 12.9, fiber_100g: 5.5, sugar_100g: 0.4, fatSat_100g: 2.4, serving_size_g: 20 },
  { id: 'dt_1129', name: 'Pepe nero macinato', category: 'Condimenti e Salse', kcal_100g: 251, proteins_100g: 10.4, carbs_100g: 63.9, fats_100g: 3.3, fiber_100g: 25.3, sugar_100g: 0.6, fatSat_100g: 1.4, serving_size_g: 20 },
  { id: 'dt_1130', name: 'Peperoncino secco', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 12, carbs_100g: 49.7, fats_100g: 6.2, fiber_100g: 27.2, sugar_100g: 5.3, fatSat_100g: 1.5, serving_size_g: 20 },
  { id: 'dt_1131', name: 'Cannella in polvere', category: 'Condimenti e Salse', kcal_100g: 247, proteins_100g: 4, carbs_100g: 80.6, fats_100g: 1.2, fiber_100g: 53.1, sugar_100g: 2.2, fatSat_100g: 0.3, serving_size_g: 20 },
  { id: 'dt_1132', name: 'Curcuma in polvere', category: 'Condimenti e Salse', kcal_100g: 312, proteins_100g: 9.7, carbs_100g: 67.1, fats_100g: 3.3, fiber_100g: 21.1, sugar_100g: 3.2, fatSat_100g: 1.5, serving_size_g: 20 },
  { id: 'dt_1133', name: 'Origano essiccato', category: 'Condimenti e Salse', kcal_100g: 265, proteins_100g: 9, carbs_100g: 68.9, fats_100g: 4.3, fiber_100g: 42.5, sugar_100g: 4.1, fatSat_100g: 2.4, serving_size_g: 20 },

  // ─── Latte e derivati ───
  { id: 'dt_1134', name: 'Panna da cucina 18%', category: 'Latticini', kcal_100g: 190, proteins_100g: 2.6, carbs_100g: 3.8, fats_100g: 19.1, fiber_100g: 0, sugar_100g: 3.7, fatSat_100g: 12, serving_size_g: 125 },
  { id: 'dt_1135', name: 'Latte condensato zuccherato', category: 'Latticini', kcal_100g: 321, proteins_100g: 8.1, carbs_100g: 56.3, fats_100g: 8.7, fiber_100g: 0, sugar_100g: 55, fatSat_100g: 5.6, serving_size_g: 125 },
  { id: 'dt_1136', name: 'Yogurt soia naturale', category: 'Latticini', kcal_100g: 57, proteins_100g: 4.2, carbs_100g: 3.5, fats_100g: 2.9, fiber_100g: 0.3, sugar_100g: 2.2, fatSat_100g: 0.4, serving_size_g: 125 },

  // ─── Uova ───
  { id: 'dt_1137', name: 'Uova di quaglia', category: 'Proteine', kcal_100g: 158, proteins_100g: 13.1, carbs_100g: 0.4, fats_100g: 11.1, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 3.5, serving_size_g: 100 },
  { id: 'dt_1138', name: 'Tuorlo d\'uovo', category: 'Proteine', kcal_100g: 322, proteins_100g: 16.4, carbs_100g: 3.6, fats_100g: 26.5, fiber_100g: 0, sugar_100g: 3.6, fatSat_100g: 9.5, serving_size_g: 100 },

  // ─── Frutta secca ───
  { id: 'dt_1139', name: 'Semi di sesamo crudi', category: 'Frutta', kcal_100g: 573, proteins_100g: 17.7, carbs_100g: 23.4, fats_100g: 49.7, fiber_100g: 11.8, sugar_100g: 0.3, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1140', name: 'Arachidi crude (non tostate)', category: 'Frutta', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 3.6, fatSat_100g: 6.9, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1141', name: 'Spirulina in polvere', category: 'Verdure', kcal_100g: 290, proteins_100g: 57.5, carbs_100g: 23.9, fats_100g: 7.7, fiber_100g: 3.6, sugar_100g: 2.4, fatSat_100g: 0.7, serving_size_g: 200 },

  // ─── Frutta secca ───
  { id: 'dt_1142', name: 'Bacche di goji secche', category: 'Frutta', kcal_100g: 349, proteins_100g: 14.3, carbs_100g: 77.1, fats_100g: 0.4, fiber_100g: 13, sugar_100g: 45.6, fatSat_100g: 0.3, serving_size_g: 150 },

  // ─── Frutta fresca ───
  { id: 'dt_1143', name: 'Pitaya / Dragon fruit (polpa)', category: 'Frutta', kcal_100g: 50, proteins_100g: 1.1, carbs_100g: 13, fats_100g: 0.4, fiber_100g: 3, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1144', name: 'Pomelo fresco', category: 'Frutta', kcal_100g: 38, proteins_100g: 0.8, carbs_100g: 9.6, fats_100g: 0.1, fiber_100g: 1, sugar_100g: 6.7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta lipidica ───
  { id: 'dt_1145', name: 'Noce di cocco fresca (polpa)', category: 'Frutta', kcal_100g: 354, proteins_100g: 3.3, carbs_100g: 15.2, fats_100g: 33.5, fiber_100g: 9, sugar_100g: 6.2, fatSat_100g: 29.7, serving_size_g: 150 },

  // ─── Frutta fresca ───
  { id: 'dt_1146', name: 'Durian fresco', category: 'Frutta', kcal_100g: 147, proteins_100g: 1.5, carbs_100g: 27.1, fats_100g: 5.3, fiber_100g: 3.8, sugar_100g: 16.1, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1147', name: 'Guava fresca', category: 'Frutta', kcal_100g: 68, proteins_100g: 2.6, carbs_100g: 14.3, fats_100g: 1, fiber_100g: 5.4, sugar_100g: 8.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1148', name: 'Litchi fresco', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.8, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 1.3, sugar_100g: 15.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1149', name: 'Melograno / Melagrana (arilli)', category: 'Frutta', kcal_100g: 83, proteins_100g: 1.7, carbs_100g: 18.7, fats_100g: 1.2, fiber_100g: 4, sugar_100g: 13.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1150', name: 'Giuggiole fresche', category: 'Frutta', kcal_100g: 79, proteins_100g: 1.2, carbs_100g: 20.2, fats_100g: 0.2, fiber_100g: 0.6, sugar_100g: 17.4, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1151', name: 'Rucola selvatica', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.6, carbs_100g: 3.7, fats_100g: 0.7, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1152', name: 'Crescione d\'acqua', category: 'Verdure', kcal_100g: 11, proteins_100g: 2.3, carbs_100g: 1.3, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1153', name: 'Puntarelle (cicoria catalogna)', category: 'Verdure', kcal_100g: 15, proteins_100g: 1.7, carbs_100g: 2.4, fats_100g: 0.2, fiber_100g: 2.6, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1154', name: 'Friarielli (cime di rapa napoletane)', category: 'Verdure', kcal_100g: 22, proteins_100g: 2.9, carbs_100g: 3.2, fats_100g: 0.3, fiber_100g: 2.8, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1155', name: 'Cavolo nero toscano', category: 'Verdure', kcal_100g: 35, proteins_100g: 3.3, carbs_100g: 6.7, fats_100g: 0.6, fiber_100g: 3.6, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1156', name: 'Carciofo crudo', category: 'Verdure', kcal_100g: 47, proteins_100g: 3.3, carbs_100g: 10.5, fats_100g: 0.1, fiber_100g: 8.6, sugar_100g: 2.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1157', name: 'Acetosella (Rumex acetosa)', category: 'Verdure', kcal_100g: 22, proteins_100g: 2, carbs_100g: 3.2, fats_100g: 0.8, fiber_100g: 2.9, sugar_100g: 1.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1158', name: 'Erbette (bietola da coste lessata)', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.8, carbs_100g: 3.3, fats_100g: 0.3, fiber_100g: 2.1, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali ───
  { id: 'dt_1159', name: 'Grano saraceno crudo', category: 'Cereali', kcal_100g: 343, proteins_100g: 13.3, carbs_100g: 71.5, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 2.6, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1160', name: 'Quinoa rossa cruda', category: 'Cereali', kcal_100g: 368, proteins_100g: 14.1, carbs_100g: 64.2, fats_100g: 6.1, fiber_100g: 7, sugar_100g: 4.8, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1161', name: 'Quinoa nera cruda', category: 'Cereali', kcal_100g: 368, proteins_100g: 14.1, carbs_100g: 64.2, fats_100g: 6.1, fiber_100g: 7, sugar_100g: 4.8, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1162', name: 'Kamut (frumento khorasan) crudo', category: 'Cereali', kcal_100g: 337, proteins_100g: 14.7, carbs_100g: 70.2, fats_100g: 2.6, fiber_100g: 9.1, sugar_100g: 1.8, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1163', name: 'Spelta (farro grande) cruda', category: 'Cereali', kcal_100g: 338, proteins_100g: 15, carbs_100g: 70.2, fats_100g: 2.4, fiber_100g: 10.9, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1164', name: 'Farro monococco crudo', category: 'Cereali', kcal_100g: 340, proteins_100g: 17.6, carbs_100g: 66.9, fats_100g: 2.5, fiber_100g: 8.4, sugar_100g: 1.5, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1165', name: 'Riso venere (riso nero) crudo', category: 'Cereali', kcal_100g: 357, proteins_100g: 8.8, carbs_100g: 75.5, fats_100g: 2.7, fiber_100g: 4.9, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1166', name: 'Orzo integrale crudo', category: 'Cereali', kcal_100g: 354, proteins_100g: 12.5, carbs_100g: 73.5, fats_100g: 2.3, fiber_100g: 17.3, sugar_100g: 1.6, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1167', name: 'Segale in chicchi cruda', category: 'Cereali', kcal_100g: 335, proteins_100g: 14.8, carbs_100g: 69.8, fats_100g: 2.5, fiber_100g: 15.1, sugar_100g: 1.4, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Legumi ───
  { id: 'dt_1168', name: 'Ceci neri secchi', category: 'Legumi', kcal_100g: 364, proteins_100g: 20.6, carbs_100g: 61, fats_100g: 6, fiber_100g: 15, sugar_100g: 2.5, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1169', name: 'Fagiolini di soia (edamame secchi)', category: 'Legumi', kcal_100g: 471, proteins_100g: 36.5, carbs_100g: 30.2, fats_100g: 20.6, fiber_100g: 20.6, sugar_100g: 9.5, fatSat_100g: 5.7, serving_size_g: 80 },
  { id: 'dt_1170', name: 'Fagioli rossi kidney cotti', category: 'Legumi', kcal_100g: 127, proteins_100g: 8.7, carbs_100g: 22.8, fats_100g: 0.5, fiber_100g: 6.4, sugar_100g: 0.4, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1171', name: 'Vigna dall\'occhio (Black-eyed peas) secchi', category: 'Legumi', kcal_100g: 336, proteins_100g: 23.5, carbs_100g: 60, fats_100g: 1.3, fiber_100g: 10.5, sugar_100g: 1.7, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1172', name: 'Mungo secco (fagiolo verde mungo)', category: 'Legumi', kcal_100g: 347, proteins_100g: 23.9, carbs_100g: 62.6, fats_100g: 1.2, fiber_100g: 16.3, sugar_100g: 6.6, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Latte e derivati ───
  { id: 'dt_1173', name: 'Kefir (latte fermentato)', category: 'Latticini', kcal_100g: 61, proteins_100g: 3.3, carbs_100g: 4.5, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 4.2, fatSat_100g: 2.5, serving_size_g: 125 },
  { id: 'dt_1174', name: 'Lassi naturale (bevanda yogurt)', category: 'Latticini', kcal_100g: 60, proteins_100g: 3.5, carbs_100g: 7, fats_100g: 3, fiber_100g: 0, sugar_100g: 6.8, fatSat_100g: 1.8, serving_size_g: 125 },
  { id: 'dt_1175', name: 'Burrata fresca', category: 'Latticini', kcal_100g: 300, proteins_100g: 14.5, carbs_100g: 1.5, fats_100g: 26, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 18, serving_size_g: 125 },
  { id: 'dt_1176', name: 'Quark (fiocchi magri tedeschi)', category: 'Latticini', kcal_100g: 65, proteins_100g: 12, carbs_100g: 4.1, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 4.1, fatSat_100g: 0.3, serving_size_g: 125 },
  { id: 'dt_1177', name: 'Labneh (yogurt scolato medio-oriente)', category: 'Latticini', kcal_100g: 195, proteins_100g: 12.5, carbs_100g: 3.3, fats_100g: 15.8, fiber_100g: 0, sugar_100g: 3.3, fatSat_100g: 9, serving_size_g: 125 },

  // ─── Carni e derivati ───
  { id: 'dt_1178', name: 'Vitello (macinato magro)', category: 'Proteine', kcal_100g: 119, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 150 },
  { id: 'dt_1179', name: 'Maiale magro (filetto)', category: 'Proteine', kcal_100g: 143, proteins_100g: 22, carbs_100g: 0, fats_100g: 5.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 150 },
  { id: 'dt_1180', name: 'Agnello (coscia magra)', category: 'Proteine', kcal_100g: 162, proteins_100g: 22.3, carbs_100g: 0, fats_100g: 7.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.3, serving_size_g: 150 },
  { id: 'dt_1181', name: 'Struzzo (filetto)', category: 'Proteine', kcal_100g: 105, proteins_100g: 22.4, carbs_100g: 0, fats_100g: 1.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1182', name: 'Bufalo (macinato)', category: 'Proteine', kcal_100g: 130, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 5.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1183', name: 'Orata fresca', category: 'Proteine', kcal_100g: 96, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 150 },
  { id: 'dt_1184', name: 'Rombo (sogliola piatta)', category: 'Proteine', kcal_100g: 86, proteins_100g: 18.2, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1185', name: 'Cernia fresca', category: 'Proteine', kcal_100g: 92, proteins_100g: 19.2, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1186', name: 'Calamaro fresco', category: 'Proteine', kcal_100g: 92, proteins_100g: 15.6, carbs_100g: 3.1, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 3.1, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1187', name: 'Polpo cotto', category: 'Proteine', kcal_100g: 82, proteins_100g: 14.9, carbs_100g: 2.2, fats_100g: 1, fiber_100g: 0, sugar_100g: 2.2, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1188', name: 'Riccio di mare (polpa)', category: 'Proteine', kcal_100g: 99, proteins_100g: 12.8, carbs_100g: 6.6, fats_100g: 3.3, fiber_100g: 0, sugar_100g: 3.7, fatSat_100g: 0.7, serving_size_g: 150 },

  // ─── Bevande ───
  { id: 'dt_1189', name: 'Succo di melograno 100%', category: 'Bevande', kcal_100g: 54, proteins_100g: 0.2, carbs_100g: 13.4, fats_100g: 0.3, fiber_100g: 0.1, sugar_100g: 12.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1190', name: 'Tè verde infuso (non zuccherato)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.2, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1191', name: 'Tè nero infuso (non zuccherato)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1192', name: 'Tisana camomilla (infuso)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1193', name: 'Acqua di riso (bevanda)', category: 'Bevande', kcal_100g: 10, proteins_100g: 0.1, carbs_100g: 2.5, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 2.4, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e derivati ───
  { id: 'dt_1194', name: 'Farina di riso bianca', category: 'Cereali', kcal_100g: 366, proteins_100g: 6.9, carbs_100g: 80.1, fats_100g: 1.4, fiber_100g: 2.4, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1195', name: 'Farina di mais (polenta)', category: 'Cereali', kcal_100g: 362, proteins_100g: 8.7, carbs_100g: 76.8, fats_100g: 3.5, fiber_100g: 4.4, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1196', name: 'Farina di grano saraceno', category: 'Cereali', kcal_100g: 335, proteins_100g: 12.6, carbs_100g: 70.6, fats_100g: 3.1, fiber_100g: 10, sugar_100g: 2.4, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1197', name: 'Amido di tapioca', category: 'Cereali', kcal_100g: 357, proteins_100g: 0.2, carbs_100g: 85.7, fats_100g: 0, fiber_100g: 0.9, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1198', name: 'Farina di cocco', category: 'Cereali', kcal_100g: 424, proteins_100g: 6.1, carbs_100g: 57.3, fats_100g: 24.4, fiber_100g: 38.5, sugar_100g: 5.4, fatSat_100g: 23.7, serving_size_g: 80 },
  { id: 'dt_1199', name: 'Farina di avena', category: 'Cereali', kcal_100g: 379, proteins_100g: 13.2, carbs_100g: 65.7, fats_100g: 7, fiber_100g: 10.1, sugar_100g: 1, fatSat_100g: 1.1, serving_size_g: 80 },

  // ─── Grassi e oli ───
  { id: 'dt_1200', name: 'Olio di lino (flaxseed)', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.4, serving_size_g: 10 },

  // ─── Cereali e pane ───
  { id: 'dt_1201', name: 'Pane di segale integrale', category: 'Cereali', kcal_100g: 259, proteins_100g: 8.5, carbs_100g: 48.3, fats_100g: 1.7, fiber_100g: 6.2, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_1202', name: 'Pane con noci', category: 'Cereali', kcal_100g: 290, proteins_100g: 9, carbs_100g: 50, fats_100g: 6, fiber_100g: 4, sugar_100g: 2, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_1203', name: 'Pane di farro integrale', category: 'Cereali', kcal_100g: 248, proteins_100g: 9.2, carbs_100g: 46.5, fats_100g: 1.5, fiber_100g: 5.8, sugar_100g: 1.8, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_1204', name: 'Pane multicereali', category: 'Cereali', kcal_100g: 260, proteins_100g: 9.5, carbs_100g: 47.5, fats_100g: 2.5, fiber_100g: 5.5, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 100 },

  // ─── Cereali e pasta ───
  { id: 'dt_1205', name: 'Riso parboiled crudo', category: 'Cereali', kcal_100g: 349, proteins_100g: 7.2, carbs_100g: 78.5, fats_100g: 1.2, fiber_100g: 1.4, sugar_100g: 0.2, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1206', name: 'Pasta di farro cruda', category: 'Cereali', kcal_100g: 343, proteins_100g: 14, carbs_100g: 65.5, fats_100g: 2.5, fiber_100g: 6.5, sugar_100g: 3.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1207', name: 'Cardo', category: 'Verdure', kcal_100g: 17, proteins_100g: 0.7, carbs_100g: 3.5, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1208', name: 'Fave fresche sgranate', category: 'Verdure', kcal_100g: 66, proteins_100g: 5.6, carbs_100g: 9.9, fats_100g: 0.4, fiber_100g: 4.9, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1209', name: 'Lattuga romana', category: 'Verdure', kcal_100g: 15, proteins_100g: 1.2, carbs_100g: 2.9, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1210', name: 'Cicoria di campo', category: 'Verdure', kcal_100g: 22, proteins_100g: 1.8, carbs_100g: 3.1, fats_100g: 0.3, fiber_100g: 4, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1211', name: 'Kohlrabi (cavolo rapa)', category: 'Verdure', kcal_100g: 27, proteins_100g: 1.7, carbs_100g: 6.2, fats_100g: 0.1, fiber_100g: 3.6, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1212', name: 'Germogli di lenticchie', category: 'Verdure', kcal_100g: 106, proteins_100g: 9, carbs_100g: 22, fats_100g: 0.5, fiber_100g: 4.5, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1213', name: 'Okra / Gombo', category: 'Verdure', kcal_100g: 33, proteins_100g: 1.9, carbs_100g: 7.5, fats_100g: 0.2, fiber_100g: 3.2, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1214', name: 'Melanzana lunga asiatica', category: 'Verdure', kcal_100g: 25, proteins_100g: 0.8, carbs_100g: 5.9, fats_100g: 0.2, fiber_100g: 3, sugar_100g: 2.9, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1215', name: 'Kumquat fresco', category: 'Frutta', kcal_100g: 71, proteins_100g: 1.9, carbs_100g: 15.9, fats_100g: 0.9, fiber_100g: 6.5, sugar_100g: 9.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1216', name: 'Tamarindo (polpa fresca)', category: 'Frutta', kcal_100g: 239, proteins_100g: 2.8, carbs_100g: 62.5, fats_100g: 0.6, fiber_100g: 5.1, sugar_100g: 12.5, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1217', name: 'Jackfruit (frutto del pane) fresco', category: 'Frutta', kcal_100g: 95, proteins_100g: 1.7, carbs_100g: 23.2, fats_100g: 0.6, fiber_100g: 1.5, sugar_100g: 19.1, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Formaggi ───
  { id: 'dt_1218', name: 'Stracciatella di bufala', category: 'Latticini', kcal_100g: 310, proteins_100g: 13.5, carbs_100g: 3, fats_100g: 26.5, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 18.5, serving_size_g: 125 },

  // ─── Salumi ───
  { id: 'dt_1219', name: 'Bresaola della Valtellina IGP', category: 'Salumi e Insaccati', kcal_100g: 151, proteins_100g: 32.5, carbs_100g: 0, fats_100g: 2.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 100 },
  { id: 'dt_1220', name: 'Coppa / Capocollo', category: 'Salumi e Insaccati', kcal_100g: 341, proteins_100g: 18, carbs_100g: 0.5, fats_100g: 29, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 9, serving_size_g: 100 },
  { id: 'dt_1221', name: 'Lardo stagionato', category: 'Salumi e Insaccati', kcal_100g: 760, proteins_100g: 2.5, carbs_100g: 0, fats_100g: 77, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 29, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1222', name: 'Faraona petto senza pelle', category: 'Proteine', kcal_100g: 119, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 3.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_1223', name: 'Quaglia intera eviscerata', category: 'Proteine', kcal_100g: 192, proteins_100g: 22.6, carbs_100g: 0, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1224', name: 'Cervo filetto', category: 'Proteine', kcal_100g: 120, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 2.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_1225', name: 'Capriolo coscia', category: 'Proteine', kcal_100g: 113, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1226', name: 'Cefalo muggine', category: 'Proteine', kcal_100g: 117, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 4.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_1227', name: 'Pagello', category: 'Proteine', kcal_100g: 84, proteins_100g: 17.8, carbs_100g: 0, fats_100g: 1.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1228', name: 'Anguilla affumicata', category: 'Proteine', kcal_100g: 289, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 23.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.5, serving_size_g: 150 },
  { id: 'dt_1229', name: 'Caviale (uova di storione)', category: 'Proteine', kcal_100g: 264, proteins_100g: 25, carbs_100g: 4, fats_100g: 17.9, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 4, serving_size_g: 150 },

  // ─── Crostacei ───
  { id: 'dt_1230', name: 'Astice (aragosta) fresco', category: 'Proteine', kcal_100g: 90, proteins_100g: 18.8, carbs_100g: 0.5, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_1231', name: 'Granchio fresco', category: 'Proteine', kcal_100g: 72, proteins_100g: 16, carbs_100g: 0, fats_100g: 0.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 100 },

  // ─── Molluschi ───
  { id: 'dt_1232', name: 'Ostriche fresche', category: 'Proteine', kcal_100g: 69, proteins_100g: 9, carbs_100g: 4.9, fats_100g: 2, fiber_100g: 0, sugar_100g: 4.3, fatSat_100g: 0.5, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1233', name: 'Spigola al sale (branzino) cotto', category: 'Proteine', kcal_100g: 125, proteins_100g: 23, carbs_100g: 0, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },

  // ─── Legumi ───
  { id: 'dt_1234', name: 'Lenticchie beluga secche (nere)', category: 'Legumi', kcal_100g: 338, proteins_100g: 26, carbs_100g: 57.5, fats_100g: 1, fiber_100g: 10.9, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1235', name: 'Lupini secchi', category: 'Legumi', kcal_100g: 370, proteins_100g: 40, carbs_100g: 40, fats_100g: 9.5, fiber_100g: 22, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 80 },
  { id: 'dt_1236', name: 'Edamame (soia immatura)', category: 'Legumi', kcal_100g: 121, proteins_100g: 11.9, carbs_100g: 8.9, fats_100g: 5.2, fiber_100g: 5.2, sugar_100g: 2.2, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_1237', name: 'Fagioli mung secchi', category: 'Legumi', kcal_100g: 347, proteins_100g: 23.9, carbs_100g: 62.6, fats_100g: 1.2, fiber_100g: 16.3, sugar_100g: 6.6, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_1238', name: 'Arachidi crude con pellicola', category: 'Frutta', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 4.7, fatSat_100g: 6.8, serving_size_g: 150 },
  { id: 'dt_1239', name: 'Burro di sesamo (tahini)', category: 'Frutta', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9.3, sugar_100g: 0.5, fatSat_100g: 7.8, serving_size_g: 150 },

  // ─── Semi oleosi ───
  { id: 'dt_1240', name: 'Semi di canapa sgusciati', category: 'Frutta secca', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.8, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 4.7, serving_size_g: 100 },

  // ─── Frutta secca ───
  { id: 'dt_1241', name: 'Pistacchi tostati salati', category: 'Frutta', kcal_100g: 573, proteins_100g: 21.4, carbs_100g: 27.2, fats_100g: 45.4, fiber_100g: 10.6, sugar_100g: 7, fatSat_100g: 5.9, serving_size_g: 150 },

  // ─── Grassi ───
  { id: 'dt_1242', name: 'Olio di cocco vergine', category: 'Grassi', kcal_100g: 862, proteins_100g: 0, carbs_100g: 0, fats_100g: 99, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 82.5, serving_size_g: 10 },
  { id: 'dt_1243', name: 'Olio di noce', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.1, serving_size_g: 10 },
  { id: 'dt_1244', name: 'Margarina vegetale 70% grassi', category: 'Grassi', kcal_100g: 630, proteins_100g: 0.5, carbs_100g: 0.3, fats_100g: 70, fiber_100g: 0, sugar_100g: 0.1, fatSat_100g: 20, serving_size_g: 10 },

  // ─── Dolcificanti ───
  { id: 'dt_1245', name: 'Sciroppo d\'acero puro', category: 'Dolci e Zuccheri', kcal_100g: 260, proteins_100g: 0, carbs_100g: 67, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 60.5, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1246', name: 'Sciroppo di agave', category: 'Dolci e Zuccheri', kcal_100g: 310, proteins_100g: 0.1, carbs_100g: 76, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 70, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1247', name: 'Stevia (foglie essiccate)', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 13.5, carbs_100g: 62.5, fats_100g: 4, fiber_100g: 18, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Spezie ───
  { id: 'dt_1248', name: 'Cardamomo macinato', category: 'Condimenti e Salse', kcal_100g: 311, proteins_100g: 10.8, carbs_100g: 68.5, fats_100g: 6.7, fiber_100g: 28, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 20 },
  { id: 'dt_1249', name: 'Peperoncino piccante in polvere', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 13.5, carbs_100g: 49.7, fats_100g: 14.3, fiber_100g: 27.2, sugar_100g: 10.3, fatSat_100g: 1.1, serving_size_g: 20 },

  // ─── Bevande ───
  { id: 'dt_1250', name: 'Kombucha (bevanda fermentata tè)', category: 'Bevande', kcal_100g: 9, proteins_100g: 0.2, carbs_100g: 2.5, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1251', name: 'Kefir d\'acqua probiotico', category: 'Bevande', kcal_100g: 15, proteins_100g: 0.5, carbs_100g: 3.5, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Alcolici ───
  { id: 'dt_1252', name: 'Birra artigianale chiara (330mL)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 3.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_1253', name: 'Sidro di mele secco (100mL)', category: 'Bevande', kcal_100g: 38, proteins_100g: 0, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Verdure ───
  { id: 'dt_1254', name: 'Kimchi (cavolo fermentato coreano)', category: 'Verdure', kcal_100g: 15, proteins_100g: 1.1, carbs_100g: 2.4, fats_100g: 0.5, fiber_100g: 1.6, sugar_100g: 1.3, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1255', name: 'Crauti (cavolo fermentato)', category: 'Verdure', kcal_100g: 19, proteins_100g: 0.9, carbs_100g: 4.3, fats_100g: 0.1, fiber_100g: 2.9, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Condimenti ───
  { id: 'dt_1256', name: 'Miso bianco (shiro miso)', category: 'Condimenti e Salse', kcal_100g: 198, proteins_100g: 11.7, carbs_100g: 26.2, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 4.8, fatSat_100g: 0.5, serving_size_g: 20 },

  // ─── Legumi ───
  { id: 'dt_1257', name: 'Natto (soia fermentata)', category: 'Legumi', kcal_100g: 212, proteins_100g: 17.7, carbs_100g: 14.4, fats_100g: 11, fiber_100g: 5.4, sugar_100g: 4.7, fatSat_100g: 2.7, serving_size_g: 80 },
  { id: 'dt_1258', name: 'Tofu compatto (silken)', category: 'Legumi', kcal_100g: 53, proteins_100g: 4.9, carbs_100g: 2, fats_100g: 2.7, fiber_100g: 0.3, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1259', name: 'Tofu solido (firm tofu)', category: 'Legumi', kcal_100g: 76, proteins_100g: 8, carbs_100g: 2, fats_100g: 4.5, fiber_100g: 0.3, sugar_100g: 0.9, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_1260', name: 'Crema di grano (semolino cotto)', category: 'Cereali', kcal_100g: 65, proteins_100g: 2.1, carbs_100g: 13.6, fats_100g: 0.3, fiber_100g: 0.5, sugar_100g: 0.1, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1261', name: 'Crema di verdure (passato)', category: 'Verdure', kcal_100g: 35, proteins_100g: 1, carbs_100g: 5, fats_100g: 1, fiber_100g: 1.5, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_1262', name: 'Panna fresca da cucina (35% grassi)', category: 'Latticini', kcal_100g: 336, proteins_100g: 2.1, carbs_100g: 3.2, fats_100g: 35, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 19.8, serving_size_g: 125 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1263', name: 'Biscotti secchi (tipo petit beurre)', category: 'Pane e Prodotti da Forno', kcal_100g: 430, proteins_100g: 8, carbs_100g: 72, fats_100g: 14, fiber_100g: 2, sugar_100g: 20, fatSat_100g: 5, serving_size_g: 30 },

  // ─── Cereali e derivati ───
  { id: 'dt_1264', name: 'Pane di semola (rimacinata)', category: 'Cereali', kcal_100g: 268, proteins_100g: 8.5, carbs_100g: 54, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1265', name: 'Purea di patate (pronta)', category: 'Verdure', kcal_100g: 85, proteins_100g: 2, carbs_100g: 15, fats_100g: 2, fiber_100g: 1.5, sugar_100g: 0.2, fatSat_100g: 0.5, serving_size_g: 200 },
  { id: 'dt_1266', name: 'Funghi porcini freschi', category: 'Verdure', kcal_100g: 22, proteins_100g: 3.9, carbs_100g: 1.5, fats_100g: 0.5, fiber_100g: 2, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1267', name: 'Funghi porcini secchi', category: 'Verdure', kcal_100g: 265, proteins_100g: 28, carbs_100g: 25, fats_100g: 4, fiber_100g: 28, sugar_100g: 4, fatSat_100g: 1.2, serving_size_g: 200 },
  { id: 'dt_1268', name: 'Finferli / Galletti freschi', category: 'Verdure', kcal_100g: 20, proteins_100g: 1.5, carbs_100g: 1.5, fats_100g: 0.5, fiber_100g: 3, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1269', name: 'Pleurotus / Funghi ostrica freschi', category: 'Verdure', kcal_100g: 33, proteins_100g: 3.3, carbs_100g: 6, fats_100g: 0.4, fiber_100g: 2.3, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1270', name: 'Cardoncelli / Funghi reale secchi', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.7, carbs_100g: 4.5, fats_100g: 0.4, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1271', name: 'Tartufo nero (Tuber melanosporum)', category: 'Verdure', kcal_100g: 31, proteins_100g: 6, carbs_100g: 1.7, fats_100g: 0.5, fiber_100g: 2, sugar_100g: 0.5, fatSat_100g: 0.4, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1272', name: 'Fichi d\'India (fico d\'India) freschi', category: 'Frutta', kcal_100g: 41, proteins_100g: 0.7, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 3.6, sugar_100g: 9, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1273', name: 'Carruba (polpa essiccata)', category: 'Frutta', kcal_100g: 222, proteins_100g: 4.6, carbs_100g: 49, fats_100g: 0.7, fiber_100g: 40, sugar_100g: 48, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1274', name: 'Pitaya / Dragon fruit rosso', category: 'Frutta', kcal_100g: 60, proteins_100g: 1.2, carbs_100g: 13, fats_100g: 0.4, fiber_100g: 3, sugar_100g: 13, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1275', name: 'Açaí in polvere disidratata', category: 'Frutta', kcal_100g: 534, proteins_100g: 8.1, carbs_100g: 33, fats_100g: 32, fiber_100g: 44, sugar_100g: 10, fatSat_100g: 4, serving_size_g: 150 },
  { id: 'dt_1276', name: 'Mirto (bacche fresche)', category: 'Frutta', kcal_100g: 62, proteins_100g: 0.6, carbs_100g: 12, fats_100g: 0.4, fiber_100g: 3.5, sugar_100g: 12, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1277', name: 'Corbezzolo fresco', category: 'Frutta', kcal_100g: 60, proteins_100g: 0.5, carbs_100g: 14, fats_100g: 0.3, fiber_100g: 3, sugar_100g: 13, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1278', name: 'Olivello spinoso (bacche fresche)', category: 'Frutta', kcal_100g: 82, proteins_100g: 1.4, carbs_100g: 6, fats_100g: 7, fiber_100g: 3.6, sugar_100g: 4.5, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1279', name: 'Banana plantain / Platano verde crudo', category: 'Frutta', kcal_100g: 122, proteins_100g: 1.3, carbs_100g: 32, fats_100g: 0.4, fiber_100g: 2.3, sugar_100g: 14, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1280', name: 'Mangostano fresco', category: 'Frutta', kcal_100g: 73, proteins_100g: 0.4, carbs_100g: 17, fats_100g: 0.6, fiber_100g: 1.8, sugar_100g: 16, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1281', name: 'Durian fresco (polpa)', category: 'Frutta', kcal_100g: 147, proteins_100g: 1.5, carbs_100g: 27, fats_100g: 5.3, fiber_100g: 3.8, sugar_100g: 27, fatSat_100g: 1.1, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1282', name: 'Pastinaca fresca', category: 'Verdure', kcal_100g: 75, proteins_100g: 1.2, carbs_100g: 18, fats_100g: 0.3, fiber_100g: 4.6, sugar_100g: 4.8, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1283', name: 'Navone / Rapa svedese fresca', category: 'Verdure', kcal_100g: 36, proteins_100g: 1.1, carbs_100g: 8.7, fats_100g: 0.2, fiber_100g: 2.3, sugar_100g: 6.2, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1284', name: 'Catalogna (cicoria) cruda', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.7, carbs_100g: 3.5, fats_100g: 0.3, fiber_100g: 3, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1285', name: 'Lampascioni / Muscari (cipolletti selvatici)', category: 'Verdure', kcal_100g: 57, proteins_100g: 2, carbs_100g: 13, fats_100g: 0.3, fiber_100g: 1.6, sugar_100g: 8.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1286', name: 'Borragine fresca', category: 'Verdure', kcal_100g: 21, proteins_100g: 1.8, carbs_100g: 3.1, fats_100g: 0.7, fiber_100g: 1.5, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1287', name: 'Agretti / Barba di frate cruda', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.8, carbs_100g: 1.3, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1288', name: 'Crescione d\'acqua fresco', category: 'Verdure', kcal_100g: 11, proteins_100g: 2.3, carbs_100g: 1.3, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1289', name: 'Rucola selvatica fresca', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.6, carbs_100g: 3.6, fats_100g: 0.7, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1290', name: 'Coltivato / Songino / Valerianella fresca', category: 'Verdure', kcal_100g: 25, proteins_100g: 2, carbs_100g: 3.6, fats_100g: 0.4, fiber_100g: 2.2, sugar_100g: 1.6, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1291', name: 'Trevigiano (radicchio di Treviso) fresco', category: 'Verdure', kcal_100g: 20, proteins_100g: 1.4, carbs_100g: 3.6, fats_100g: 0.2, fiber_100g: 3, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_1292', name: 'Bottarga di muggine (uova di cefalo essiccate)', category: 'Proteine', kcal_100g: 315, proteins_100g: 42, carbs_100g: 0.8, fats_100g: 19, fiber_100g: 0, sugar_100g: 0.8, fatSat_100g: 7.8, serving_size_g: 150 },

  // ─── Salumi ───
  { id: 'dt_1293', name: '\'Nduja calabrese (insaccato spalmabile)', category: 'Salumi e Insaccati', kcal_100g: 450, proteins_100g: 22, carbs_100g: 0.5, fats_100g: 38, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 16, serving_size_g: 100 },
  { id: 'dt_1294', name: 'Guanciale stagionato', category: 'Salumi e Insaccati', kcal_100g: 655, proteins_100g: 11, carbs_100g: 0, fats_100g: 70, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 35, serving_size_g: 100 },
  { id: 'dt_1295', name: 'Ciccioli di maiale', category: 'Salumi e Insaccati', kcal_100g: 560, proteins_100g: 28, carbs_100g: 0.5, fats_100g: 48, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 20, serving_size_g: 100 },

  // ─── Carni e derivati ───
  { id: 'dt_1296', name: 'Salsiccia luganega fresca cruda', category: 'Proteine', kcal_100g: 330, proteins_100g: 15, carbs_100g: 2, fats_100g: 28, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 12, serving_size_g: 150 },
  { id: 'dt_1297', name: 'Salsiccia piccante meridionale', category: 'Proteine', kcal_100g: 380, proteins_100g: 16, carbs_100g: 2.5, fats_100g: 33, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 14, serving_size_g: 150 },
  { id: 'dt_1298', name: 'Trippa di vitello bollita', category: 'Proteine', kcal_100g: 100, proteins_100g: 17, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },

  // ─── Cereali e derivati ───
  { id: 'dt_1299', name: 'Piadina romagnola artigianale', category: 'Cereali', kcal_100g: 340, proteins_100g: 8.5, carbs_100g: 47, fats_100g: 14, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 6, serving_size_g: 80 },
  { id: 'dt_1300', name: 'Focaccia al rosmarino artigianale', category: 'Cereali', kcal_100g: 280, proteins_100g: 7.5, carbs_100g: 43, fats_100g: 9, fiber_100g: 1.8, sugar_100g: 2, fatSat_100g: 2, serving_size_g: 80 },
  { id: 'dt_1301', name: 'Focaccia barese (con pomodorini)', category: 'Cereali', kcal_100g: 260, proteins_100g: 7, carbs_100g: 40, fats_100g: 8.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 2, serving_size_g: 80 },
  { id: 'dt_1302', name: 'Schiacciata toscana all\'olio', category: 'Cereali', kcal_100g: 290, proteins_100g: 7.5, carbs_100g: 44, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 2, serving_size_g: 80 },
  { id: 'dt_1303', name: 'Tigella emiliana (crescentina)', category: 'Cereali', kcal_100g: 310, proteins_100g: 8.5, carbs_100g: 47, fats_100g: 10, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 3, serving_size_g: 80 },
  { id: 'dt_1304', name: 'Pane carasau sardo (carta da musica)', category: 'Cereali', kcal_100g: 386, proteins_100g: 9.5, carbs_100g: 77, fats_100g: 3, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1305', name: 'Grissini artigianali al sesamo', category: 'Cereali', kcal_100g: 420, proteins_100g: 11, carbs_100g: 67, fats_100g: 12, fiber_100g: 3, sugar_100g: 3.5, fatSat_100g: 1.2, serving_size_g: 80 },

  // ─── Spezie ───
  { id: 'dt_1306', name: 'Moringa in polvere (Moringa oleifera)', category: 'Condimenti e Salse', kcal_100g: 329, proteins_100g: 27, carbs_100g: 38, fats_100g: 6, fiber_100g: 20, sugar_100g: 18, fatSat_100g: 1.4, serving_size_g: 20 },
  { id: 'dt_1307', name: 'Spirulina in polvere (Arthrospira platensis)', category: 'Condimenti e Salse', kcal_100g: 290, proteins_100g: 57, carbs_100g: 24, fats_100g: 7.7, fiber_100g: 3.6, sugar_100g: 3, fatSat_100g: 1, serving_size_g: 20 },
  { id: 'dt_1308', name: 'Chlorella in polvere', category: 'Condimenti e Salse', kcal_100g: 290, proteins_100g: 58, carbs_100g: 23, fats_100g: 9, fiber_100g: 2.5, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_1309', name: 'Erba di grano (wheatgrass) in polvere', category: 'Condimenti e Salse', kcal_100g: 279, proteins_100g: 21, carbs_100g: 41, fats_100g: 3, fiber_100g: 36, sugar_100g: 30, fatSat_100g: 0.4, serving_size_g: 20 },
  { id: 'dt_1310', name: 'Alga Klamath (AFA) in polvere', category: 'Condimenti e Salse', kcal_100g: 330, proteins_100g: 60, carbs_100g: 25, fats_100g: 5, fiber_100g: 0.5, sugar_100g: 3.5, fatSat_100g: 0.8, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_1311', name: 'Aceto balsamico di Modena IGP', category: 'Condimenti e Salse', kcal_100g: 88, proteins_100g: 0.5, carbs_100g: 17, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 17, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1312', name: 'Worcestershire sauce (salsa inglese)', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 1, carbs_100g: 19, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 17, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1313', name: 'Tabasco (salsa piccante al peperoncino)', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 0.4, carbs_100g: 1, fats_100g: 0.2, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1314', name: 'Miso rosso (akamiso, pasta fermentata)', category: 'Condimenti e Salse', kcal_100g: 197, proteins_100g: 11, carbs_100g: 26, fats_100g: 5.5, fiber_100g: 5, sugar_100g: 10, fatSat_100g: 0.8, serving_size_g: 20 },
  { id: 'dt_1315', name: 'Tamari (salsa di soia senza glutine)', category: 'Condimenti e Salse', kcal_100g: 60, proteins_100g: 10, carbs_100g: 5.5, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1316', name: 'Salsa sriracha industriale', category: 'Condimenti e Salse', kcal_100g: 82, proteins_100g: 1.3, carbs_100g: 17, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 14, fatSat_100g: 0.3, serving_size_g: 20 },

  // ─── Spezie ───
  { id: 'dt_1317', name: 'Za\'atar (mix spezie mediorientali)', category: 'Condimenti e Salse', kcal_100g: 300, proteins_100g: 10, carbs_100g: 41, fats_100g: 7.5, fiber_100g: 16, sugar_100g: 25, fatSat_100g: 0.8, serving_size_g: 20 },
  { id: 'dt_1318', name: 'Ras el hanout (miscela spezie nordafricane)', category: 'Condimenti e Salse', kcal_100g: 300, proteins_100g: 8, carbs_100g: 43, fats_100g: 10, fiber_100g: 12, sugar_100g: 30, fatSat_100g: 2, serving_size_g: 20 },
  { id: 'dt_1319', name: 'Berbere (miscela spezie etiope)', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 12, carbs_100g: 42, fats_100g: 14, fiber_100g: 15, sugar_100g: 28, fatSat_100g: 3.5, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_1320', name: 'Gommasio (sesamo tostato e sale)', category: 'Condimenti e Salse', kcal_100g: 580, proteins_100g: 18, carbs_100g: 22, fats_100g: 50, fiber_100g: 12, sugar_100g: 2, fatSat_100g: 7, serving_size_g: 20 },
  { id: 'dt_1321', name: 'Fleur de sel (sale marino grezzo)', category: 'Condimenti e Salse', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Carni e derivati ───
  { id: 'dt_1322', name: 'Farina di grillo (Acheta domesticus)', category: 'Proteine', kcal_100g: 430, proteins_100g: 65, carbs_100g: 9.5, fats_100g: 13, fiber_100g: 5, sugar_100g: 4, fatSat_100g: 4.5, serving_size_g: 150 },

  // ─── Bevande ───
  { id: 'dt_1323', name: 'Succo di aloe vera puro', category: 'Bevande', kcal_100g: 10, proteins_100g: 0.1, carbs_100g: 2.2, fats_100g: 0, fiber_100g: 0.2, sugar_100g: 2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1324', name: 'Acqua di cocco naturale (senza zuccheri aggiunti)', category: 'Bevande', kcal_100g: 19, proteins_100g: 0.7, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 3.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1325', name: 'Succo di ginger fresco (zenzero)', category: 'Bevande', kcal_100g: 60, proteins_100g: 1.6, carbs_100g: 13, fats_100g: 0.9, fiber_100g: 2, sugar_100g: 12, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1326', name: 'Succo di curcuma fresco', category: 'Bevande', kcal_100g: 50, proteins_100g: 1.5, carbs_100g: 9.5, fats_100g: 1.5, fiber_100g: 2, sugar_100g: 8, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1327', name: 'Cold brew tè verde (senza zucchero)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1328', name: 'Matcha in polvere (cerimonia)', category: 'Bevande', kcal_100g: 305, proteins_100g: 24, carbs_100g: 39, fats_100g: 5.3, fiber_100g: 37, sugar_100g: 32, fatSat_100g: 0.7, serving_size_g: 200 },

  // ─── Cereali e derivati ───
  { id: 'dt_1329', name: 'Shirataki / Noodles di konjac (cotti)', category: 'Cereali', kcal_100g: 9, proteins_100g: 0.2, carbs_100g: 3, fats_100g: 0.1, fiber_100g: 3, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1330', name: 'Farina di konjac / glucomannano', category: 'Cereali', kcal_100g: 286, proteins_100g: 6, carbs_100g: 76, fats_100g: 0.5, fiber_100g: 76, sugar_100g: 75, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Frutta fresca ───
  { id: 'dt_1331', name: 'Jackfruit (frutto del pane) in salamoia sgocciolato', category: 'Frutta', kcal_100g: 35, proteins_100g: 1.7, carbs_100g: 7.5, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 7.2, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Latte e derivati ───
  { id: 'dt_1332', name: 'Labneh (yogurt colato mediorientale)', category: 'Latticini', kcal_100g: 195, proteins_100g: 8, carbs_100g: 4.5, fats_100g: 13, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 7.5, serving_size_g: 125 },

  // ─── Formaggi ───
  { id: 'dt_1333', name: 'Halloumi (formaggio cipriota grigliabile)', category: 'Latticini', kcal_100g: 321, proteins_100g: 21, carbs_100g: 1.5, fats_100g: 24, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_1334', name: 'Feta di capra (formaggio greco DOP) al 100%', category: 'Latticini', kcal_100g: 264, proteins_100g: 14, carbs_100g: 4, fats_100g: 22, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 12, serving_size_g: 125 },
  { id: 'dt_1335', name: 'Pecorino di Pienza stagionato', category: 'Latticini', kcal_100g: 420, proteins_100g: 27, carbs_100g: 1, fats_100g: 33, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 125 },
  { id: 'dt_1336', name: 'Castelmagno DOP', category: 'Latticini', kcal_100g: 360, proteins_100g: 22, carbs_100g: 1.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14, serving_size_g: 125 },

  // ─── Cereali e derivati ───
  { id: 'dt_1337', name: 'Farro integrale in chicchi crudo', category: 'Cereali', kcal_100g: 338, proteins_100g: 14, carbs_100g: 68, fats_100g: 2.4, fiber_100g: 11, sugar_100g: 5, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_1338', name: 'Kamut (Khorasan) chicchi crudi', category: 'Cereali', kcal_100g: 338, proteins_100g: 17, carbs_100g: 65, fats_100g: 2.6, fiber_100g: 11, sugar_100g: 4.5, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_1339', name: 'Freekeh (grano verde tostato)', category: 'Cereali', kcal_100g: 340, proteins_100g: 12, carbs_100g: 72, fats_100g: 2.5, fiber_100g: 16, sugar_100g: 6, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1340', name: 'Bulgur di farro crudo', category: 'Cereali', kcal_100g: 340, proteins_100g: 14, carbs_100g: 68, fats_100g: 2.5, fiber_100g: 12, sugar_100g: 4, fatSat_100g: 0.8, serving_size_g: 80 },

  // ─── Legumi ───
  { id: 'dt_1341', name: 'Fagioli Zolfini del Pratomagno secchi', category: 'Legumi', kcal_100g: 314, proteins_100g: 22, carbs_100g: 56, fats_100g: 1.5, fiber_100g: 11, sugar_100g: 4, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1342', name: 'Roveja (pisello selvatico umbro) secca', category: 'Legumi', kcal_100g: 320, proteins_100g: 22, carbs_100g: 57, fats_100g: 1.5, fiber_100g: 10, sugar_100g: 6, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1343', name: 'Ceci neri / Cicerchie nere secche', category: 'Legumi', kcal_100g: 318, proteins_100g: 21, carbs_100g: 56, fats_100g: 1.8, fiber_100g: 11, sugar_100g: 6, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Uova ───
  { id: 'dt_1344', name: 'Uovo sodo intero', category: 'Proteine', kcal_100g: 130, proteins_100g: 12.6, carbs_100g: 0.6, fats_100g: 9.5, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 3.8, serving_size_g: 100 },

  // ─── Verdure ───
  { id: 'dt_1345', name: 'Verdure miste', category: 'Verdure', kcal_100g: 30, proteins_100g: 2, carbs_100g: 5, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 0.1, serving_size_g: 200 },

  // ─── Pane ───
  { id: 'dt_1346', name: 'Pane comune', category: 'Pane e Prodotti da Forno', kcal_100g: 267, proteins_100g: 8.5, carbs_100g: 56.8, fats_100g: 0.5, fiber_100g: 2.9, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 100 },
  { id: 'dt_1347', name: 'Pancarrè / Pane in cassetta', category: 'Pane e Prodotti da Forno', kcal_100g: 281, proteins_100g: 8.4, carbs_100g: 50.3, fats_100g: 4.7, fiber_100g: 2.5, sugar_100g: 5.5, fatSat_100g: 1.1, serving_size_g: 100 },
  { id: 'dt_1348', name: 'Taralli classici', category: 'Pane e Prodotti da Forno', kcal_100g: 430, proteins_100g: 11, carbs_100g: 65, fats_100g: 13.5, fiber_100g: 2.8, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1349', name: 'Crackers integrali', category: 'Pane e Prodotti da Forno', kcal_100g: 411, proteins_100g: 10.5, carbs_100g: 68.5, fats_100g: 7.5, fiber_100g: 7.5, sugar_100g: 1, fatSat_100g: 0.8, serving_size_g: 30 },

  // ─── Pane ───
  { id: 'dt_1350', name: 'Pane azzimo (matza)', category: 'Pane e Prodotti da Forno', kcal_100g: 395, proteins_100g: 10, carbs_100g: 83, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 100 },

  // ─── Latte e derivati ───
  { id: 'dt_1351', name: 'Yogurt magro bianco', category: 'Latticini', kcal_100g: 36, proteins_100g: 3.5, carbs_100g: 4.8, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 0.1, serving_size_g: 125 },
  { id: 'dt_1352', name: 'Yogurt greco intero (10% grassi)', category: 'Latticini', kcal_100g: 133, proteins_100g: 5.7, carbs_100g: 4.5, fats_100g: 9, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 5, serving_size_g: 125 },
  { id: 'dt_1353', name: 'Yogurt greco magro (0% grassi)', category: 'Latticini', kcal_100g: 59, proteins_100g: 10.2, carbs_100g: 4, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 3.6, fatSat_100g: 0.1, serving_size_g: 125 },

  // ─── Formaggi ───
  { id: 'dt_1354', name: 'Formaggio spalmabile tipo Philadelphia', category: 'Latticini', kcal_100g: 267, proteins_100g: 6.5, carbs_100g: 3.7, fats_100g: 25.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 17.5, serving_size_g: 125 },
  { id: 'dt_1355', name: 'Ricotta di capra', category: 'Latticini', kcal_100g: 140, proteins_100g: 9.5, carbs_100g: 3.5, fats_100g: 9.5, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 6, serving_size_g: 125 },

  // ─── Piatti pronti ───
  { id: 'dt_1356', name: 'Pasta cotta con pomodoro (piatto pronto)', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 4.8, carbs_100g: 26.5, fats_100g: 3, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_1357', name: 'Minestrone (zuppa di verdure cotto)', category: 'Piatti Pronti', kcal_100g: 42, proteins_100g: 2.2, carbs_100g: 6.5, fats_100g: 1, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 0.2, serving_size_g: 300 },
  { id: 'dt_1358', name: 'Risotto al pomodoro (cotto)', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 3.5, carbs_100g: 27, fats_100g: 2.5, fiber_100g: 0.8, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_1359', name: 'Polpette di carne al sugo', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 12, carbs_100g: 8.5, fats_100g: 10.5, fiber_100g: 0.5, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 300 },

  // ─── Latte e derivati ───
  { id: 'dt_1360', name: 'Kefir di latte magro', category: 'Latticini', kcal_100g: 36, proteins_100g: 3.4, carbs_100g: 4.6, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 3.8, fatSat_100g: 0.1, serving_size_g: 125 },

  // ─── Bevande ───
  { id: 'dt_1361', name: 'Kombucha (bevanda fermentata da tè)', category: 'Bevande', kcal_100g: 17, proteins_100g: 0.1, carbs_100g: 4, fats_100g: 0, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Legumi ───
  { id: 'dt_1362', name: 'Tempeh di soia al naturale', category: 'Legumi', kcal_100g: 193, proteins_100g: 20.3, carbs_100g: 7.6, fats_100g: 10.8, fiber_100g: 4.1, sugar_100g: 0, fatSat_100g: 2.2, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_1363', name: 'Miso (pasta di soia fermentata)', category: 'Condimenti e Salse', kcal_100g: 199, proteins_100g: 11.7, carbs_100g: 26.5, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 10, fatSat_100g: 1.5, serving_size_g: 20 },

  // ─── Legumi ───
  { id: 'dt_1364', name: 'Natto (soia fermentata giapponese)', category: 'Legumi', kcal_100g: 211, proteins_100g: 17.7, carbs_100g: 12.7, fats_100g: 11, fiber_100g: 5.4, sugar_100g: 4.8, fatSat_100g: 2.3, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1365', name: 'Crauti (cavolo capuccio fermentato)', category: 'Verdure', kcal_100g: 19, proteins_100g: 1, carbs_100g: 3.4, fats_100g: 0.1, fiber_100g: 2.9, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Formaggi ───
  { id: 'dt_1366', name: 'Caciocavallo stagionato', category: 'Latticini', kcal_100g: 432, proteins_100g: 37, carbs_100g: 0.5, fats_100g: 31, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 125 },
  { id: 'dt_1367', name: 'Provolone piccante', category: 'Latticini', kcal_100g: 376, proteins_100g: 28, carbs_100g: 0.4, fats_100g: 28, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16, serving_size_g: 125 },
  { id: 'dt_1368', name: 'Asiago pressato (DOP)', category: 'Latticini', kcal_100g: 352, proteins_100g: 30.8, carbs_100g: 0.3, fats_100g: 25.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12.5, serving_size_g: 125 },
  { id: 'dt_1369', name: 'Taleggio DOP', category: 'Latticini', kcal_100g: 315, proteins_100g: 21, carbs_100g: 0.5, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12.5, serving_size_g: 125 },
  { id: 'dt_1370', name: 'Fontina DOP', category: 'Latticini', kcal_100g: 343, proteins_100g: 25, carbs_100g: 0.3, fats_100g: 26, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14.5, serving_size_g: 125 },
  { id: 'dt_1371', name: 'Montasio (DOP, fresco)', category: 'Latticini', kcal_100g: 330, proteins_100g: 26.5, carbs_100g: 0.5, fats_100g: 24.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 11, serving_size_g: 125 },
  { id: 'dt_1372', name: 'Squacquerone di Romagna DOP', category: 'Latticini', kcal_100g: 210, proteins_100g: 11, carbs_100g: 0.5, fats_100g: 18, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8, serving_size_g: 125 },

  // ─── Cereali e derivati ───
  { id: 'dt_1373', name: 'Farro perlato cotto', category: 'Cereali', kcal_100g: 130, proteins_100g: 5, carbs_100g: 26.5, fats_100g: 0.9, fiber_100g: 3.5, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1374', name: 'Farro integrale crudo', category: 'Cereali', kcal_100g: 330, proteins_100g: 14.7, carbs_100g: 65, fats_100g: 2.7, fiber_100g: 11, sugar_100g: 3.5, fatSat_100g: 0.6, serving_size_g: 80 },
  { id: 'dt_1375', name: 'Grano saraceno decorticato crudo', category: 'Cereali', kcal_100g: 343, proteins_100g: 13.3, carbs_100g: 71.5, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1376', name: 'Grano saraceno cotto', category: 'Cereali', kcal_100g: 130, proteins_100g: 5, carbs_100g: 26.5, fats_100g: 1.3, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1377', name: 'Amaranto crudo', category: 'Cereali', kcal_100g: 371, proteins_100g: 13.6, carbs_100g: 65.3, fats_100g: 7, fiber_100g: 6.7, sugar_100g: 5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1378', name: 'Amaranto cotto', category: 'Cereali', kcal_100g: 102, proteins_100g: 3.8, carbs_100g: 18.7, fats_100g: 1.6, fiber_100g: 2.1, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1379', name: 'Miglio decorticato crudo', category: 'Cereali', kcal_100g: 378, proteins_100g: 11, carbs_100g: 72.8, fats_100g: 4.2, fiber_100g: 8.5, sugar_100g: 1.8, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1380', name: 'Miglio cotto', category: 'Cereali', kcal_100g: 119, proteins_100g: 3.5, carbs_100g: 23.7, fats_100g: 1, fiber_100g: 1.3, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1381', name: 'Teff crudo (cereale etiope)', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73.1, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1382', name: 'Agretti (barba di frate) crudi', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.8, carbs_100g: 1.5, fats_100g: 0.2, fiber_100g: 1.5, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1383', name: 'Cime di rapa cotte', category: 'Verdure', kcal_100g: 22, proteins_100g: 3, carbs_100g: 1.7, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1384', name: 'Friarielli/Broccoli di rapa saltati', category: 'Verdure', kcal_100g: 55, proteins_100g: 3.5, carbs_100g: 2.5, fats_100g: 4, fiber_100g: 2.8, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 200 },
  { id: 'dt_1385', name: 'Catalogna (cicoria asparago) cruda', category: 'Verdure', kcal_100g: 22, proteins_100g: 1.7, carbs_100g: 3.5, fats_100g: 0.2, fiber_100g: 2.2, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1386', name: 'Puntarelle crude (cicoria di catalogna)', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.8, carbs_100g: 3.5, fats_100g: 0.3, fiber_100g: 2.3, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1387', name: 'Topinambur crudo', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1388', name: 'Radicchio rosso di Treviso crudo', category: 'Verdure', kcal_100g: 20, proteins_100g: 1.4, carbs_100g: 3.6, fats_100g: 0.2, fiber_100g: 1.5, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1389', name: 'Cavolo nero (toscano) crudo', category: 'Verdure', kcal_100g: 32, proteins_100g: 4.3, carbs_100g: 3.3, fats_100g: 0.7, fiber_100g: 4.1, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1390', name: 'Borragine (foglie crude)', category: 'Verdure', kcal_100g: 21, proteins_100g: 1.8, carbs_100g: 3.1, fats_100g: 0.7, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1391', name: 'Lampascioni (cipollacci)/muscari crudi', category: 'Verdure', kcal_100g: 55, proteins_100g: 2.3, carbs_100g: 12, fats_100g: 0.3, fiber_100g: 4.5, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta ───
  { id: 'dt_1392', name: 'Fichi d\'india (fichidindia) freschi', category: 'Frutta', kcal_100g: 55, proteins_100g: 0.7, carbs_100g: 13.7, fats_100g: 0.1, fiber_100g: 3.6, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1393', name: 'Cachi (kaki) maturi', category: 'Frutta', kcal_100g: 70, proteins_100g: 0.6, carbs_100g: 18.6, fats_100g: 0.2, fiber_100g: 2.5, sugar_100g: 14.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1394', name: 'Corbezzole (corbezzolo) fresche', category: 'Frutta', kcal_100g: 55, proteins_100g: 0.5, carbs_100g: 14.5, fats_100g: 0.3, fiber_100g: 4.4, sugar_100g: 9.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1395', name: 'Bergamotto (frutto fresco)', category: 'Frutta', kcal_100g: 27, proteins_100g: 0.7, carbs_100g: 6.5, fats_100g: 0.3, fiber_100g: 3.6, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1396', name: 'Sambuco (bacche di) fresche', category: 'Frutta', kcal_100g: 73, proteins_100g: 0.7, carbs_100g: 18.4, fats_100g: 0.5, fiber_100g: 7, sugar_100g: 11.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1397', name: 'Azzeruole fresche', category: 'Frutta', kcal_100g: 58, proteins_100g: 0.4, carbs_100g: 15.6, fats_100g: 0.2, fiber_100g: 3, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1398', name: 'Sgombro sott\'olio (conserva)', category: 'Proteine', kcal_100g: 208, proteins_100g: 20, carbs_100g: 0, fats_100g: 14, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 150 },
  { id: 'dt_1399', name: 'Acciughe/alici sott\'olio (conserva)', category: 'Proteine', kcal_100g: 210, proteins_100g: 24, carbs_100g: 0, fats_100g: 12.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4, serving_size_g: 150 },
  { id: 'dt_1400', name: 'Totano al naturale crudo', category: 'Proteine', kcal_100g: 68, proteins_100g: 15.2, carbs_100g: 0.6, fats_100g: 0.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1401', name: 'Grongo (anguilla di mare) crudo', category: 'Proteine', kcal_100g: 103, proteins_100g: 17.2, carbs_100g: 0, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1402', name: 'Razza (pesce) cruda', category: 'Proteine', kcal_100g: 83, proteins_100g: 19, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1403', name: 'Cannolicchi (mollusco) al naturale', category: 'Proteine', kcal_100g: 60, proteins_100g: 11.5, carbs_100g: 1.8, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1404', name: 'Fasolari (mollusco) al naturale', category: 'Proteine', kcal_100g: 74, proteins_100g: 13, carbs_100g: 2.8, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1405', name: 'Pesce spada al vapore', category: 'Proteine', kcal_100g: 122, proteins_100g: 22, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 150 },
  { id: 'dt_1406', name: 'Branzino (spigola) al forno', category: 'Proteine', kcal_100g: 105, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1407', name: 'Orata al cartoccio', category: 'Proteine', kcal_100g: 109, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Carni e derivati ───
  { id: 'dt_1408', name: 'Guanciale di maiale stagionato', category: 'Proteine', kcal_100g: 655, proteins_100g: 11.5, carbs_100g: 0, fats_100g: 65, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 42.5, serving_size_g: 150 },
  { id: 'dt_1409', name: 'Lardo di Colonnata (stagionato)', category: 'Proteine', kcal_100g: 750, proteins_100g: 4, carbs_100g: 0, fats_100g: 76.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 43, serving_size_g: 150 },
  { id: 'dt_1410', name: 'Coppa/capocollo stagionata', category: 'Proteine', kcal_100g: 340, proteins_100g: 24.5, carbs_100g: 0.3, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10.5, serving_size_g: 150 },
  { id: 'dt_1411', name: 'Bresaola della Valtellina', category: 'Proteine', kcal_100g: 151, proteins_100g: 32, carbs_100g: 0.3, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1412', name: 'Stracotto di manzo (brasato cotto)', category: 'Proteine', kcal_100g: 188, proteins_100g: 26, carbs_100g: 3, fats_100g: 8.5, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 3.5, serving_size_g: 150 },
  { id: 'dt_1413', name: 'Anatra arrosto (con pelle)', category: 'Proteine', kcal_100g: 337, proteins_100g: 27, carbs_100g: 0, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 6, serving_size_g: 150 },
  { id: 'dt_1414', name: 'Coniglio al forno', category: 'Proteine', kcal_100g: 180, proteins_100g: 29.5, carbs_100g: 0.3, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_1415', name: 'Faraona arrosto', category: 'Proteine', kcal_100g: 148, proteins_100g: 28, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },

  // ─── Cereali e derivati ───
  { id: 'dt_1416', name: 'Orecchiette fresche (pasta di semola)', category: 'Cereali', kcal_100g: 295, proteins_100g: 10, carbs_100g: 60.5, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1417', name: 'Trofie fresche (pasta ligure)', category: 'Cereali', kcal_100g: 290, proteins_100g: 9.5, carbs_100g: 59.5, fats_100g: 1.4, fiber_100g: 2.4, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1418', name: 'Bigoli (pasta integrale veneta)', category: 'Cereali', kcal_100g: 344, proteins_100g: 13.5, carbs_100g: 68.5, fats_100g: 2.5, fiber_100g: 5.5, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1419', name: 'Pici (pasta toscana grossa)', category: 'Cereali', kcal_100g: 350, proteins_100g: 11.5, carbs_100g: 72.5, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1420', name: 'Maltagliati all\'uovo freschi', category: 'Cereali', kcal_100g: 285, proteins_100g: 11, carbs_100g: 55, fats_100g: 4, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 1.2, serving_size_g: 80 },

  // ─── Legumi ───
  { id: 'dt_1421', name: 'Fave secche (decorticate)', category: 'Legumi', kcal_100g: 341, proteins_100g: 26.5, carbs_100g: 57.5, fats_100g: 2, fiber_100g: 13, sugar_100g: 5.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1422', name: 'Lupini sgusciati conservati (sotto sale)', category: 'Legumi', kcal_100g: 119, proteins_100g: 15.6, carbs_100g: 9.5, fats_100g: 6.8, fiber_100g: 4.6, sugar_100g: 2.5, fatSat_100g: 1.3, serving_size_g: 80 },

  // ─── Formaggi ───
  { id: 'dt_1423', name: 'Asiago stagionato', category: 'Latticini', kcal_100g: 385, proteins_100g: 30, carbs_100g: 0, fats_100g: 29, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19, serving_size_g: 125 },

  // ─── Pesce ───
  { id: 'dt_1424', name: 'Anguilla fresca', category: 'Proteine', kcal_100g: 233, proteins_100g: 18.4, carbs_100g: 0, fats_100g: 15.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.7, serving_size_g: 150 },
  { id: 'dt_1425', name: 'Cozze (muscoli)', category: 'Proteine', kcal_100g: 84, proteins_100g: 11.7, carbs_100g: 3.7, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 150 },
  { id: 'dt_1426', name: 'Cefalo (muggine)', category: 'Proteine', kcal_100g: 100, proteins_100g: 19, carbs_100g: 0, fats_100g: 2.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1427', name: 'Catalogna (cicoria)', category: 'Verdure', kcal_100g: 18, proteins_100g: 1.5, carbs_100g: 3.5, fats_100g: 0.1, fiber_100g: 2.3, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1428', name: 'Bieta da coste', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.8, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.6, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1429', name: 'Radicchio di Treviso', category: 'Verdure', kcal_100g: 13, proteins_100g: 1.4, carbs_100g: 2.7, fats_100g: 0.1, fiber_100g: 3, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1430', name: 'Indivia belga (witloof)', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.7, carbs_100g: 4, fats_100g: 0.1, fiber_100g: 3, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1431', name: 'Melograno (arilli)', category: 'Frutta', kcal_100g: 83, proteins_100g: 1.7, carbs_100g: 18.7, fats_100g: 1.2, fiber_100g: 4, sugar_100g: 13.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1432', name: 'Cachi (loto)', category: 'Frutta', kcal_100g: 70, proteins_100g: 0.6, carbs_100g: 18.6, fats_100g: 0.2, fiber_100g: 3.6, sugar_100g: 12.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1433', name: 'Clementine', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.9, carbs_100g: 12, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1434', name: 'Uva sultanina secca', category: 'Frutta', kcal_100g: 299, proteins_100g: 3.1, carbs_100g: 79, fats_100g: 0.5, fiber_100g: 3.7, sugar_100g: 59.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1435', name: 'Datteri secchi', category: 'Frutta', kcal_100g: 282, proteins_100g: 2.5, carbs_100g: 75, fats_100g: 0.4, fiber_100g: 8, sugar_100g: 63.4, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Legumi ───
  { id: 'dt_1436', name: 'Azuki (fagioli rossi) secchi', category: 'Legumi', kcal_100g: 329, proteins_100g: 19.9, carbs_100g: 62.9, fats_100g: 0.5, fiber_100g: 12.7, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1437', name: 'Piselli surgelati', category: 'Legumi', kcal_100g: 73, proteins_100g: 5.6, carbs_100g: 11.4, fats_100g: 0.5, fiber_100g: 6.4, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1438', name: 'Edamame (soia verde)', category: 'Legumi', kcal_100g: 121, proteins_100g: 11.9, carbs_100g: 8.9, fats_100g: 5.2, fiber_100g: 5.2, sugar_100g: 1.1, fatSat_100g: 1.2, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_1439', name: 'Semi di lino macinati', category: 'Frutta', kcal_100g: 534, proteins_100g: 18.3, carbs_100g: 28.9, fats_100g: 42.2, fiber_100g: 27.3, sugar_100g: 1.6, fatSat_100g: 3.7, serving_size_g: 150 },
  { id: 'dt_1440', name: 'Pistacchi (senza guscio)', category: 'Frutta', kcal_100g: 557, proteins_100g: 20.9, carbs_100g: 27.2, fats_100g: 45, fiber_100g: 10.6, sugar_100g: 7.6, fatSat_100g: 5.4, serving_size_g: 150 },

  // ─── Cereali e pasta ───
  { id: 'dt_1441', name: 'Farina di mais (polenta) cruda', category: 'Cereali', kcal_100g: 366, proteins_100g: 8, carbs_100g: 76.8, fats_100g: 3, fiber_100g: 7.3, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Salumi ───
  { id: 'dt_1442', name: 'Mortadella Bologna', category: 'Salumi e Insaccati', kcal_100g: 311, proteins_100g: 16.1, carbs_100g: 1.7, fats_100g: 26.6, fiber_100g: 0, sugar_100g: 0.9, fatSat_100g: 13, serving_size_g: 100 },
  { id: 'dt_1443', name: 'Nduja calabrese', category: 'Salumi e Insaccati', kcal_100g: 402, proteins_100g: 17, carbs_100g: 0, fats_100g: 36, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18, serving_size_g: 100 },
  { id: 'dt_1444', name: 'Speck dell\'Alto Adige', category: 'Salumi e Insaccati', kcal_100g: 267, proteins_100g: 26.5, carbs_100g: 0, fats_100g: 17.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 6, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_1445', name: 'Pesto alla genovese (artigianale)', category: 'Condimenti e Salse', kcal_100g: 454, proteins_100g: 7, carbs_100g: 3.4, fats_100g: 44.6, fiber_100g: 1.2, sugar_100g: 1, fatSat_100g: 7, serving_size_g: 20 },

  // ─── Verdure ───
  { id: 'dt_1446', name: 'Alga Kelp (Laminaria) essiccata', category: 'Verdure', kcal_100g: 43, proteins_100g: 1.7, carbs_100g: 9.6, fats_100g: 0.6, fiber_100g: 1.3, sugar_100g: 0.6, fatSat_100g: 0.3, serving_size_g: 200 },
  { id: 'dt_1447', name: 'Alga Dulse essiccata', category: 'Verdure', kcal_100g: 264, proteins_100g: 21.7, carbs_100g: 46, fats_100g: 3.2, fiber_100g: 32, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 200 },
  { id: 'dt_1448', name: 'Agar-agar (essiccato)', category: 'Verdure', kcal_100g: 306, proteins_100g: 0.5, carbs_100g: 80, fats_100g: 0.2, fiber_100g: 7, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1449', name: 'Ortica fresca', category: 'Verdure', kcal_100g: 37, proteins_100g: 5.5, carbs_100g: 1.3, fats_100g: 0.8, fiber_100g: 6.9, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1450', name: 'Malva fresca', category: 'Verdure', kcal_100g: 28, proteins_100g: 3.2, carbs_100g: 2.5, fats_100g: 0.6, fiber_100g: 1.6, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1451', name: 'Silene (erba) fresca', category: 'Verdure', kcal_100g: 26, proteins_100g: 2.8, carbs_100g: 2, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta secca ───
  { id: 'dt_1452', name: 'Mirtilli essiccati', category: 'Frutta', kcal_100g: 303, proteins_100g: 0.4, carbs_100g: 75, fats_100g: 1.3, fiber_100g: 3.4, sugar_100g: 47, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Latte e derivati ───
  { id: 'dt_1453', name: 'Latte di riso commerciale', category: 'Latticini', kcal_100g: 40, proteins_100g: 0.3, carbs_100g: 8, fats_100g: 1, fiber_100g: 0.1, sugar_100g: 5.5, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Grassi ───
  { id: 'dt_1454', name: 'Olio di germe di grano', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18.8, serving_size_g: 10 },

  // ─── Verdure ───
  { id: 'dt_1455', name: 'Conserva di pomodoro (passata)', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.3, carbs_100g: 6, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e pasta ───
  { id: 'dt_1456', name: 'Koji di riso', category: 'Cereali', kcal_100g: 189, proteins_100g: 13, carbs_100g: 38, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1457', name: 'Pasta frolla cruda', category: 'Cereali', kcal_100g: 468, proteins_100g: 7, carbs_100g: 55, fats_100g: 25, fiber_100g: 1.5, sugar_100g: 20, fatSat_100g: 12, serving_size_g: 80 },

  // ─── Uova ───
  { id: 'dt_1458', name: 'Uovo fritto (olio EVO)', category: 'Proteine', kcal_100g: 184, proteins_100g: 13.6, carbs_100g: 0.4, fats_100g: 14.2, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 3.5, serving_size_g: 100 },

  // ─── Dolci ───
  { id: 'dt_1459', name: 'Torta margherita (crostata base)', category: 'Dolci e Zuccheri', kcal_100g: 340, proteins_100g: 6, carbs_100g: 52, fats_100g: 12.5, fiber_100g: 0.8, sugar_100g: 30, fatSat_100g: 3, serving_size_g: 50 },

  // ─── Piatti pronti ───
  { id: 'dt_1460', name: 'Lasagne al forno (artigianale, ragù e besciamella)', category: 'Piatti Pronti', kcal_100g: 188, proteins_100g: 10.5, carbs_100g: 18.5, fats_100g: 8.5, fiber_100g: 1, sugar_100g: 2.5, fatSat_100g: 4, serving_size_g: 300 },

  // ─── Cereali e pasta ───
  { id: 'dt_1461', name: 'Crespelle / crepes (pasta, latte, uova)', category: 'Cereali', kcal_100g: 207, proteins_100g: 6.5, carbs_100g: 27, fats_100g: 8, fiber_100g: 0.8, sugar_100g: 5, fatSat_100g: 2.5, serving_size_g: 80 },

  // ─── Carni rosse ───
  { id: 'dt_1462', name: 'Manzo macinato (bovino, magro 10% grassi)', category: 'Proteine', kcal_100g: 175, proteins_100g: 19.8, carbs_100g: 0, fats_100g: 10, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.1, serving_size_g: 100 },
  { id: 'dt_1463', name: 'Maiale macinato', category: 'Proteine', kcal_100g: 263, proteins_100g: 16.8, carbs_100g: 0, fats_100g: 21.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8.5, serving_size_g: 100 },

  // ─── Latte e derivati ───
  { id: 'dt_1464', name: 'Latte intero UHT', category: 'Latticini', kcal_100g: 64, proteins_100g: 3.2, carbs_100g: 4.8, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 2, serving_size_g: 125 },

  // ─── Grassi e oli ───
  { id: 'dt_1465', name: 'Olio di colza (canola)', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7.4, serving_size_g: 10 },
  { id: 'dt_1466', name: 'Olio di vinacciolo', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.6, serving_size_g: 10 },

  // ─── Verdure ───
  { id: 'dt_1467', name: 'Polpa di pomodoro a pezzi (in scatola)', category: 'Verdure', kcal_100g: 20, proteins_100g: 1, carbs_100g: 3.8, fats_100g: 0.2, fiber_100g: 1.4, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1468', name: 'Pomodori datterini freschi', category: 'Verdure', kcal_100g: 18, proteins_100g: 0.9, carbs_100g: 3.5, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 2.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1469', name: 'Peperone verde fresco', category: 'Verdure', kcal_100g: 20, proteins_100g: 0.9, carbs_100g: 4.6, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 2.6, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_1470', name: 'Sardine sott\'olio sgocciolate', category: 'Proteine', kcal_100g: 208, proteins_100g: 24.6, carbs_100g: 0, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1471', name: 'Salmone cotto al forno', category: 'Proteine', kcal_100g: 196, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1472', name: 'Brodo di pesce (fumetto)', category: 'Condimenti e Salse', kcal_100g: 14, proteins_100g: 1.8, carbs_100g: 0.5, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Carni rosse ───
  { id: 'dt_1473', name: 'Filetto di manzo', category: 'Proteine', kcal_100g: 120, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1474', name: 'Pollo lessato (bollito, senza pelle)', category: 'Proteine', kcal_100g: 175, proteins_100g: 26, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 100 },

  // ─── Dolci ───
  { id: 'dt_1475', name: 'Sorbetto alla frutta', category: 'Dolci e Zuccheri', kcal_100g: 109, proteins_100g: 0.4, carbs_100g: 27.5, fats_100g: 0.2, fiber_100g: 0.5, sugar_100g: 23.5, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Cereali e derivati ───
  { id: 'dt_1476', name: 'Polenta bianca cotta', category: 'Cereali', kcal_100g: 65, proteins_100g: 1.5, carbs_100g: 14, fats_100g: 0.3, fiber_100g: 0.6, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Carni rosse ───
  { id: 'dt_1477', name: 'Vitello (spalla) crudo', category: 'Proteine', kcal_100g: 118, proteins_100g: 20, carbs_100g: 0, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 100 },
  { id: 'dt_1478', name: 'Vitello fesa', category: 'Proteine', kcal_100g: 105, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 2.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 100 },
  { id: 'dt_1479', name: 'Vitello girello', category: 'Proteine', kcal_100g: 110, proteins_100g: 22, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_1480', name: 'Vitello scaloppina', category: 'Proteine', kcal_100g: 107, proteins_100g: 20.7, carbs_100g: 0, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },
  { id: 'dt_1481', name: 'Vitello scamone', category: 'Proteine', kcal_100g: 112, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 2.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },
  { id: 'dt_1482', name: 'Bovino adulto fesa', category: 'Proteine', kcal_100g: 108, proteins_100g: 21.6, carbs_100g: 0, fats_100g: 2.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_1483', name: 'Bovino adulto girello', category: 'Proteine', kcal_100g: 121, proteins_100g: 22, carbs_100g: 0, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },
  { id: 'dt_1484', name: 'Bovino adulto scamone', category: 'Proteine', kcal_100g: 131, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 100 },
  { id: 'dt_1485', name: 'Maiale spalla', category: 'Proteine', kcal_100g: 175, proteins_100g: 17.5, carbs_100g: 0, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.8, serving_size_g: 100 },
  { id: 'dt_1486', name: 'Agnello costolette crude', category: 'Proteine', kcal_100g: 288, proteins_100g: 16, carbs_100g: 0, fats_100g: 24.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 11.8, serving_size_g: 100 },
  { id: 'dt_1487', name: 'Agnello macinato crudo', category: 'Proteine', kcal_100g: 235, proteins_100g: 17, carbs_100g: 0, fats_100g: 18, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 6, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1488', name: 'Tacchino fesa', category: 'Proteine', kcal_100g: 101, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1489', name: 'Gallinella di mare', category: 'Proteine', kcal_100g: 78, proteins_100g: 18, carbs_100g: 0, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1490', name: 'Sarago', category: 'Proteine', kcal_100g: 96, proteins_100g: 20, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1491', name: 'Pagello', category: 'Proteine', kcal_100g: 88, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1492', name: 'Rabarbaro crudo', category: 'Verdure', kcal_100g: 13, proteins_100g: 0.6, carbs_100g: 2.4, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 1.1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e pasta ───
  { id: 'dt_1493', name: 'Farina Manitoba (tipo 0 proteica)', category: 'Cereali', kcal_100g: 349, proteins_100g: 14, carbs_100g: 72, fats_100g: 1.2, fiber_100g: 2.2, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1494', name: 'Farina di grano tenero tipo 2', category: 'Cereali', kcal_100g: 339, proteins_100g: 11, carbs_100g: 68.5, fats_100g: 1.8, fiber_100g: 4.5, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_1495', name: 'Sugo all\'amatriciana artigianale', category: 'Condimenti e Salse', kcal_100g: 156, proteins_100g: 5, carbs_100g: 6, fats_100g: 12, fiber_100g: 1.2, sugar_100g: 3, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_1496', name: 'Sugo alla carbonara (salsa)', category: 'Condimenti e Salse', kcal_100g: 285, proteins_100g: 9, carbs_100g: 3, fats_100g: 24, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 12, serving_size_g: 20 },
  { id: 'dt_1497', name: 'Lievito di birra fresco', category: 'Condimenti e Salse', kcal_100g: 43, proteins_100g: 8, carbs_100g: 1, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_1498', name: 'Lievito alimentare (nutrizionale) in scaglie', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 52, carbs_100g: 18, fats_100g: 7, fiber_100g: 26, sugar_100g: 3, fatSat_100g: 0.8, serving_size_g: 20 },

  // ─── Pesce ───
  { id: 'dt_1499', name: 'Alice fresca (acciuga)', category: 'Proteine', kcal_100g: 96, proteins_100g: 16.8, carbs_100g: 0.5, fats_100g: 2.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },
  { id: 'dt_1500', name: 'Sardina fresca', category: 'Proteine', kcal_100g: 129, proteins_100g: 20.9, carbs_100g: 0.6, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_1501', name: 'Pesce spada alla griglia', category: 'Proteine', kcal_100g: 142, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 4.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Carni rosse ───
  { id: 'dt_1502', name: 'Cuore bovino', category: 'Proteine', kcal_100g: 114, proteins_100g: 19, carbs_100g: 0.3, fats_100g: 3.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Verdure ───
  { id: 'dt_1503', name: 'Piselli freschi lessi', category: 'Verdure', kcal_100g: 68, proteins_100g: 5.4, carbs_100g: 10.8, fats_100g: 0.3, fiber_100g: 5.7, sugar_100g: 4.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e pasta ───
  { id: 'dt_1504', name: 'Crema di riso', category: 'Cereali', kcal_100g: 356, proteins_100g: 7.2, carbs_100g: 79, fats_100g: 1.1, fiber_100g: 1.5, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1505', name: 'Crema di mais', category: 'Cereali', kcal_100g: 356, proteins_100g: 8.7, carbs_100g: 74, fats_100g: 3.5, fiber_100g: 5, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Pane ───
  { id: 'dt_1506', name: 'Rosetta (panino all\'acqua)', category: 'Pane e Prodotti da Forno', kcal_100g: 268, proteins_100g: 8.5, carbs_100g: 57, fats_100g: 1, fiber_100g: 2.8, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1507', name: 'Tarallo pugliese', category: 'Pane e Prodotti da Forno', kcal_100g: 394, proteins_100g: 11, carbs_100g: 62, fats_100g: 12.5, fiber_100g: 4, sugar_100g: 1, fatSat_100g: 2.5, serving_size_g: 30 },

  // ─── Bevande ───
  { id: 'dt_1508', name: 'Tè deteinato', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_1509', name: 'Capesante crude', category: 'Proteine', kcal_100g: 88, proteins_100g: 16.8, carbs_100g: 3.4, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1510', name: 'Ostriche crude', category: 'Proteine', kcal_100g: 59, proteins_100g: 9, carbs_100g: 3.7, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1511', name: 'Scorfano rosso crudo', category: 'Proteine', kcal_100g: 83, proteins_100g: 18.8, carbs_100g: 0, fats_100g: 0.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1512', name: 'Palamita fresca', category: 'Proteine', kcal_100g: 144, proteins_100g: 23.2, carbs_100g: 0, fats_100g: 5.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.6, serving_size_g: 150 },
  { id: 'dt_1513', name: 'Sgombro sott\'olio sgocciolato', category: 'Proteine', kcal_100g: 193, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 12.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 150 },
  { id: 'dt_1514', name: 'Cozze bollite', category: 'Proteine', kcal_100g: 84, proteins_100g: 12, carbs_100g: 3.7, fats_100g: 2.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1515', name: 'Gambero rosa bollito', category: 'Proteine', kcal_100g: 87, proteins_100g: 17.6, carbs_100g: 0.5, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1516', name: 'Pesce spada affumicato', category: 'Proteine', kcal_100g: 147, proteins_100g: 20.8, carbs_100g: 0, fats_100g: 7.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_1517', name: 'Baccalà secco salato', category: 'Proteine', kcal_100g: 290, proteins_100g: 67.2, carbs_100g: 0, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1518', name: 'Sogliola cruda', category: 'Proteine', kcal_100g: 83, proteins_100g: 17.1, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_1519', name: 'Merlano (nasello) crudo', category: 'Proteine', kcal_100g: 72, proteins_100g: 16, carbs_100g: 0, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1520', name: 'Persico crudo', category: 'Proteine', kcal_100g: 90, proteins_100g: 19.6, carbs_100g: 0, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },

  // ─── Carni ───
  { id: 'dt_1521', name: 'Piccione crudo', category: 'Proteine', kcal_100g: 142, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 7.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.1, serving_size_g: 100 },

  // ─── Cereali e derivati ───
  { id: 'dt_1522', name: 'Farro spelta crudo', category: 'Cereali', kcal_100g: 338, proteins_100g: 14.5, carbs_100g: 65, fats_100g: 2.7, fiber_100g: 7.5, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1523', name: 'Riso carnaroli crudo', category: 'Cereali', kcal_100g: 358, proteins_100g: 7.1, carbs_100g: 82, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1524', name: 'Mais dolce in scatola sgocciolato', category: 'Verdure', kcal_100g: 86, proteins_100g: 2.7, carbs_100g: 16.8, fats_100g: 1.2, fiber_100g: 1.8, sugar_100g: 4.5, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1525', name: 'Cavolo romano crudo', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.5, carbs_100g: 3.2, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 1.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1526', name: 'Cipolla rossa cruda', category: 'Verdure', kcal_100g: 40, proteins_100g: 1.1, carbs_100g: 9, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 4.7, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Legumi ───
  { id: 'dt_1527', name: 'Fave fresche crude', category: 'Legumi', kcal_100g: 76, proteins_100g: 8, carbs_100g: 10.2, fats_100g: 0.4, fiber_100g: 4, sugar_100g: 0.9, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1528', name: 'Valerianella cruda', category: 'Verdure', kcal_100g: 21, proteins_100g: 2, carbs_100g: 2.4, fats_100g: 0.4, fiber_100g: 2.1, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1529', name: 'Peperone arrosto in vasetto', category: 'Verdure', kcal_100g: 32, proteins_100g: 1.1, carbs_100g: 5.6, fats_100g: 0.5, fiber_100g: 2.1, sugar_100g: 3.8, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1530', name: 'Cardo crudo', category: 'Verdure', kcal_100g: 17, proteins_100g: 0.7, carbs_100g: 3.5, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta ───
  { id: 'dt_1531', name: 'Fico d\'India fresco', category: 'Frutta', kcal_100g: 41, proteins_100g: 0.7, carbs_100g: 9.6, fats_100g: 0.1, fiber_100g: 3.6, sugar_100g: 9.6, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1532', name: 'Papaia fresca', category: 'Frutta', kcal_100g: 39, proteins_100g: 0.6, carbs_100g: 9.4, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 5.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1533', name: 'Pitahaya (Dragon Fruit) fresca', category: 'Frutta', kcal_100g: 50, proteins_100g: 1.1, carbs_100g: 11, fats_100g: 0.4, fiber_100g: 2.9, sugar_100g: 7.7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1534', name: 'Prugne secche denocciolate', category: 'Frutta', kcal_100g: 239, proteins_100g: 2.6, carbs_100g: 63.9, fats_100g: 0.4, fiber_100g: 7.1, sugar_100g: 38.1, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta ───
  { id: 'dt_1535', name: 'Maracuja (Frutto della Passione) fresco', category: 'Frutta', kcal_100g: 97, proteins_100g: 2.2, carbs_100g: 23.4, fats_100g: 0.7, fiber_100g: 10.4, sugar_100g: 11.2, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1536', name: 'Semi di girasole tostati', category: 'Frutta', kcal_100g: 584, proteins_100g: 20.8, carbs_100g: 20, fats_100g: 51.5, fiber_100g: 8.6, sugar_100g: 2.6, fatSat_100g: 4.5, serving_size_g: 150 },
  { id: 'dt_1537', name: 'Noci del Brasile (Paranoci)', category: 'Frutta', kcal_100g: 659, proteins_100g: 14.3, carbs_100g: 11.7, fats_100g: 67.1, fiber_100g: 7.5, sugar_100g: 2.3, fatSat_100g: 16.1, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1538', name: 'Wasabi in pasta', category: 'Condimenti e Salse', kcal_100g: 109, proteins_100g: 4.8, carbs_100g: 23, fats_100g: 0.6, fiber_100g: 7.8, sugar_100g: 4.1, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Alimenti vari ───
  { id: 'dt_1539', name: 'Lievito di birra in scaglie', category: 'Proteine', kcal_100g: 320, proteins_100g: 44, carbs_100g: 38, fats_100g: 3, fiber_100g: 8, sugar_100g: 6, fatSat_100g: 0.6, serving_size_g: 100 },

  // ─── Cereali e derivati ───
  { id: 'dt_1540', name: 'Farro perlato cotto', category: 'Cereali', kcal_100g: 129, proteins_100g: 4.2, carbs_100g: 27.4, fats_100g: 0.6, fiber_100g: 3.2, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1541', name: 'Farro perlato crudo', category: 'Cereali', kcal_100g: 338, proteins_100g: 13, carbs_100g: 66.8, fats_100g: 2.4, fiber_100g: 7.8, sugar_100g: 1.8, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1542', name: 'Miglio decorticato crudo', category: 'Cereali', kcal_100g: 378, proteins_100g: 10.6, carbs_100g: 72.9, fats_100g: 4.7, fiber_100g: 8.5, sugar_100g: 1.5, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_1543', name: 'Quinoa cotta', category: 'Cereali', kcal_100g: 120, proteins_100g: 4.4, carbs_100g: 21.3, fats_100g: 1.9, fiber_100g: 2.8, sugar_100g: 0.9, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1544', name: 'Bulgur cotto', category: 'Cereali', kcal_100g: 83, proteins_100g: 3.1, carbs_100g: 18.6, fats_100g: 0.2, fiber_100g: 4.5, sugar_100g: 0.1, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1545', name: 'Orzo perlato cotto', category: 'Cereali', kcal_100g: 123, proteins_100g: 2.3, carbs_100g: 28.2, fats_100g: 0.4, fiber_100g: 3.8, sugar_100g: 0.4, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1546', name: 'Cous cous cotto', category: 'Cereali', kcal_100g: 112, proteins_100g: 3.8, carbs_100g: 23.2, fats_100g: 0.2, fiber_100g: 1.4, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1547', name: 'Grano saraceno crudo', category: 'Cereali', kcal_100g: 343, proteins_100g: 13.2, carbs_100g: 71.5, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 2.4, fatSat_100g: 0.7, serving_size_g: 80 },

  // ─── Legumi ───
  { id: 'dt_1548', name: 'Edamame (soia verde) lessato', category: 'Legumi', kcal_100g: 122, proteins_100g: 11.9, carbs_100g: 8.9, fats_100g: 5.2, fiber_100g: 5.2, sugar_100g: 2.2, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1549', name: 'Lupini in salamoia sgocciolati', category: 'Legumi', kcal_100g: 116, proteins_100g: 15.6, carbs_100g: 6.5, fats_100g: 3.2, fiber_100g: 4.8, sugar_100g: 0.8, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1550', name: 'Fave fresche sgusciate crude', category: 'Legumi', kcal_100g: 66, proteins_100g: 5.6, carbs_100g: 11.7, fats_100g: 0.4, fiber_100g: 4.2, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1551', name: 'Piselli freschi sgusciati crudi', category: 'Legumi', kcal_100g: 80, proteins_100g: 5.4, carbs_100g: 14.5, fats_100g: 0.4, fiber_100g: 5.1, sugar_100g: 5.7, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1552', name: 'Tofu sodo (extra firm)', category: 'Legumi', kcal_100g: 70, proteins_100g: 8, carbs_100g: 1.9, fats_100g: 4.2, fiber_100g: 0.3, sugar_100g: 0.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1553', name: 'Tempeh di soia', category: 'Legumi', kcal_100g: 192, proteins_100g: 20.3, carbs_100g: 7.6, fats_100g: 10.8, fiber_100g: 4.1, sugar_100g: 0, fatSat_100g: 2.9, serving_size_g: 80 },
  { id: 'dt_1554', name: 'Seitan (glutine di grano)', category: 'Legumi', kcal_100g: 128, proteins_100g: 25, carbs_100g: 1.2, fats_100g: 2.4, fiber_100g: 0.6, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1555', name: 'Carciofo crudo', category: 'Verdure', kcal_100g: 47, proteins_100g: 3.3, carbs_100g: 10.5, fats_100g: 0.2, fiber_100g: 5.4, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1556', name: 'Topinambur crudo', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1557', name: 'Rucola cruda', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.6, carbs_100g: 3.7, fats_100g: 0.7, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1558', name: 'Cavolo nero crudo', category: 'Verdure', kcal_100g: 49, proteins_100g: 4.3, carbs_100g: 8.8, fats_100g: 0.9, fiber_100g: 3.6, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1559', name: 'Cavolini di Bruxelles crudi', category: 'Verdure', kcal_100g: 43, proteins_100g: 3.4, carbs_100g: 9, fats_100g: 0.3, fiber_100g: 3.8, sugar_100g: 2.2, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1560', name: 'Ravanelli crudi', category: 'Verdure', kcal_100g: 16, proteins_100g: 0.7, carbs_100g: 3.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 1.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1561', name: 'Daikon crudo', category: 'Verdure', kcal_100g: 18, proteins_100g: 0.6, carbs_100g: 4.1, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1562', name: 'Cipollotti freschi crudi', category: 'Verdure', kcal_100g: 32, proteins_100g: 1.8, carbs_100g: 7.3, fats_100g: 0.2, fiber_100g: 2.6, sugar_100g: 2.3, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta ───
  { id: 'dt_1563', name: 'Mango fresco', category: 'Frutta', kcal_100g: 65, proteins_100g: 0.5, carbs_100g: 17, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 14, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1564', name: 'Litchi fresco', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.8, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 1.3, sugar_100g: 15.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1565', name: 'Lamponi freschi', category: 'Frutta', kcal_100g: 52, proteins_100g: 1.2, carbs_100g: 11.9, fats_100g: 0.7, fiber_100g: 6.5, sugar_100g: 4.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1566', name: 'Mirtilli freschi', category: 'Frutta', kcal_100g: 57, proteins_100g: 0.7, carbs_100g: 14.5, fats_100g: 0.3, fiber_100g: 2.4, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1567', name: 'Ribes rosso fresco', category: 'Frutta', kcal_100g: 56, proteins_100g: 1.4, carbs_100g: 13.8, fats_100g: 0.2, fiber_100g: 4.3, sugar_100g: 7.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1568', name: 'Melograno (arilli) fresco', category: 'Frutta', kcal_100g: 83, proteins_100g: 1.7, carbs_100g: 18.7, fats_100g: 1.2, fiber_100g: 4, sugar_100g: 13.7, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1569', name: 'Chia semi crudi', category: 'Frutta', kcal_100g: 486, proteins_100g: 16.5, carbs_100g: 42.1, fats_100g: 30.7, fiber_100g: 34.4, sugar_100g: 0, fatSat_100g: 3.3, serving_size_g: 150 },
  { id: 'dt_1570', name: 'Semi di lino crudi', category: 'Frutta', kcal_100g: 534, proteins_100g: 18.3, carbs_100g: 28.9, fats_100g: 42.2, fiber_100g: 27.3, sugar_100g: 1.5, fatSat_100g: 3.7, serving_size_g: 150 },
  { id: 'dt_1571', name: 'Semi di canapa sgusciati', category: 'Frutta', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.8, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 3.3, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1572', name: 'Tahina (pasta di sesamo)', category: 'Condimenti e Salse', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9.3, sugar_100g: 0.5, fatSat_100g: 5.5, serving_size_g: 20 },
  { id: 'dt_1573', name: 'Miso di soia (pasta)', category: 'Condimenti e Salse', kcal_100g: 199, proteins_100g: 11.7, carbs_100g: 26.5, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 6.2, fatSat_100g: 1, serving_size_g: 20 },

  // ─── Bevande ───
  { id: 'dt_1574', name: 'Latte di mandorla non zuccherato', category: 'Bevande', kcal_100g: 13, proteins_100g: 0.4, carbs_100g: 0.3, fats_100g: 1.1, fiber_100g: 0.2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1575', name: 'Latte di soia non zuccherato', category: 'Bevande', kcal_100g: 33, proteins_100g: 3.3, carbs_100g: 1.7, fats_100g: 1.8, fiber_100g: 0.6, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 200 },
  { id: 'dt_1576', name: 'Latte di avena non zuccherato', category: 'Bevande', kcal_100g: 44, proteins_100g: 1, carbs_100g: 8.1, fats_100g: 0.5, fiber_100g: 0.8, sugar_100g: 4, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1577', name: 'Tè verde in infuso', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.2, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Spezie e aromi ───
  { id: 'dt_1578', name: 'Curcuma in polvere', category: 'Condimenti e Salse', kcal_100g: 354, proteins_100g: 7.8, carbs_100g: 64.9, fats_100g: 9.9, fiber_100g: 21.1, sugar_100g: 3.2, fatSat_100g: 3.1, serving_size_g: 20 },
  { id: 'dt_1579', name: 'Cannella in polvere', category: 'Condimenti e Salse', kcal_100g: 247, proteins_100g: 4, carbs_100g: 80.6, fats_100g: 1.2, fiber_100g: 53.1, sugar_100g: 2.2, fatSat_100g: 0.3, serving_size_g: 20 },
  { id: 'dt_1580', name: 'Aglio fresco crudo', category: 'Condimenti e Salse', kcal_100g: 149, proteins_100g: 6.4, carbs_100g: 33.1, fats_100g: 0.5, fiber_100g: 2.1, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_1581', name: 'Sale da cucina', category: 'Condimenti e Salse', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Cereali e derivati ───
  { id: 'dt_1582', name: 'Germe di grano (frumento)', category: 'Cereali', kcal_100g: 360, proteins_100g: 26.6, carbs_100g: 51.8, fats_100g: 9.7, fiber_100g: 13.2, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1583', name: 'Lattuga iceberg', category: 'Verdure', kcal_100g: 13, proteins_100g: 0.9, carbs_100g: 2, fats_100g: 0.1, fiber_100g: 1.2, sugar_100g: 1.9, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali da colazione ───
  { id: 'dt_1584', name: 'Fiocchi di frumento integrali', category: 'Cereali', kcal_100g: 340, proteins_100g: 12, carbs_100g: 68.5, fats_100g: 2.2, fiber_100g: 7.5, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_1585', name: 'Castagne lesse (bollite)', category: 'Frutta', kcal_100g: 130, proteins_100g: 2.4, carbs_100g: 28.5, fats_100g: 0.8, fiber_100g: 6.8, sugar_100g: 15.4, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Cereali da colazione ───
  { id: 'dt_1586', name: 'Frumento soffiato', category: 'Cereali', kcal_100g: 356, proteins_100g: 11, carbs_100g: 76, fats_100g: 1.5, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Grassi ───
  { id: 'dt_1587', name: 'Olio di oliva vergine', category: 'Grassi', kcal_100g: 899, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13.8, serving_size_g: 10 },
  { id: 'dt_1588', name: 'Olio di sansa di oliva', category: 'Grassi', kcal_100g: 899, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14.1, serving_size_g: 10 },

  // ─── Spezie e aromi ───
  { id: 'dt_1589', name: 'Cumino (semi macinati)', category: 'Condimenti e Salse', kcal_100g: 375, proteins_100g: 17.8, carbs_100g: 44.2, fats_100g: 22.3, fiber_100g: 10.5, sugar_100g: 2.3, fatSat_100g: 1.5, serving_size_g: 20 },
  { id: 'dt_1590', name: 'Semi di anice', category: 'Condimenti e Salse', kcal_100g: 337, proteins_100g: 17.6, carbs_100g: 50, fats_100g: 15.9, fiber_100g: 14.6, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 20 },
  { id: 'dt_1591', name: 'Coriandolo in semi (polvere)', category: 'Condimenti e Salse', kcal_100g: 298, proteins_100g: 12.4, carbs_100g: 54.9, fats_100g: 17.8, fiber_100g: 41.9, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 20 },
  { id: 'dt_1592', name: 'Fieno greco (semi)', category: 'Condimenti e Salse', kcal_100g: 323, proteins_100g: 23, carbs_100g: 58.4, fats_100g: 6.4, fiber_100g: 24.6, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 20 },
  { id: 'dt_1593', name: 'Pepe bianco macinato', category: 'Condimenti e Salse', kcal_100g: 296, proteins_100g: 10.4, carbs_100g: 68.6, fats_100g: 2.1, fiber_100g: 26.2, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 20 },

  // ─── Verdure ───
  { id: 'dt_1594', name: 'Rafano fresco (radice, cren)', category: 'Verdure', kcal_100g: 48, proteins_100g: 1.2, carbs_100g: 11.3, fats_100g: 0.5, fiber_100g: 3.3, sugar_100g: 7.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e derivati ───
  { id: 'dt_1595', name: 'Crusca d\'avena', category: 'Cereali', kcal_100g: 246, proteins_100g: 17.3, carbs_100g: 55.7, fats_100g: 7, fiber_100g: 15.4, sugar_100g: 1.2, fatSat_100g: 1.3, serving_size_g: 80 },

  // ─── Spezie e aromi ───
  { id: 'dt_1596', name: 'Vaniglia (baccello intero)', category: 'Condimenti e Salse', kcal_100g: 288, proteins_100g: 12.7, carbs_100g: 62.4, fats_100g: 6.2, fiber_100g: 34.5, sugar_100g: 12.7, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1597', name: 'Macis (mace, spezia)', category: 'Condimenti e Salse', kcal_100g: 475, proteins_100g: 6.7, carbs_100g: 50.5, fats_100g: 32.4, fiber_100g: 20.2, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_1598', name: 'Pepe verde in salamoia', category: 'Condimenti e Salse', kcal_100g: 93, proteins_100g: 3.1, carbs_100g: 14.4, fats_100g: 3.3, fiber_100g: 7.4, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_1599', name: 'Capperi sotto sale (dissalati)', category: 'Condimenti e Salse', kcal_100g: 23, proteins_100g: 2.4, carbs_100g: 4.9, fats_100g: 0.9, fiber_100g: 3.2, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Frutta secca ───
  { id: 'dt_1600', name: 'Semi di sesamo tostati', category: 'Frutta', kcal_100g: 573, proteins_100g: 17.7, carbs_100g: 23.5, fats_100g: 49.7, fiber_100g: 11.8, sugar_100g: 0.5, fatSat_100g: 5.6, serving_size_g: 150 },
  { id: 'dt_1601', name: 'Sesamo nero (semi crudi)', category: 'Frutta', kcal_100g: 573, proteins_100g: 17, carbs_100g: 23.5, fats_100g: 49.7, fiber_100g: 11.8, sugar_100g: 0.3, fatSat_100g: 5, serving_size_g: 150 },

  // ─── Frutta fresca ───
  { id: 'dt_1602', name: 'Mango fresco', category: 'Frutta', kcal_100g: 60, proteins_100g: 0.8, carbs_100g: 15, fats_100g: 0.4, fiber_100g: 1.6, sugar_100g: 13.7, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1603', name: 'Papaya fresca', category: 'Frutta', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 7.8, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1604', name: 'Ciliegie fresche', category: 'Frutta', kcal_100g: 50, proteins_100g: 1, carbs_100g: 12, fats_100g: 0.3, fiber_100g: 1.6, sugar_100g: 8.5, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1605', name: 'Melone giallo Cantalupo', category: 'Frutta', kcal_100g: 34, proteins_100g: 0.8, carbs_100g: 8.2, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 7.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1606', name: 'Uva nera', category: 'Frutta', kcal_100g: 69, proteins_100g: 0.7, carbs_100g: 18, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 15.5, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1607', name: 'Lamponi freschi', category: 'Frutta', kcal_100g: 52, proteins_100g: 1.2, carbs_100g: 12, fats_100g: 0.7, fiber_100g: 6.5, sugar_100g: 4.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1608', name: 'More fresche', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 5.3, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1609', name: 'Pesche fresche', category: 'Frutta', kcal_100g: 39, proteins_100g: 0.9, carbs_100g: 9.5, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 8.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1610', name: 'Albicocche fresche', category: 'Frutta', kcal_100g: 48, proteins_100g: 1.4, carbs_100g: 11, fats_100g: 0.4, fiber_100g: 2, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1611', name: 'Nespole fresche', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 12, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 8.6, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1612', name: 'Pompelmo rosa', category: 'Frutta', kcal_100g: 33, proteins_100g: 0.8, carbs_100g: 8.4, fats_100g: 0.1, fiber_100g: 1.1, sugar_100g: 7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1613', name: 'Datteri secchi', category: 'Frutta', kcal_100g: 277, proteins_100g: 1.8, carbs_100g: 75, fats_100g: 0.2, fiber_100g: 6.7, sugar_100g: 63.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1614', name: 'Uvetta di Corinto', category: 'Frutta', kcal_100g: 283, proteins_100g: 2.7, carbs_100g: 74.9, fats_100g: 0.3, fiber_100g: 3.5, sugar_100g: 58.3, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1615', name: 'Anacardi tostati non salati', category: 'Frutta', kcal_100g: 553, proteins_100g: 18.2, carbs_100g: 30.2, fats_100g: 43.9, fiber_100g: 3.3, sugar_100g: 5.9, fatSat_100g: 7.8, serving_size_g: 150 },
  { id: 'dt_1616', name: 'Nocciole tostate', category: 'Frutta', kcal_100g: 628, proteins_100g: 15, carbs_100g: 17, fats_100g: 60.8, fiber_100g: 9.7, sugar_100g: 4.3, fatSat_100g: 4.5, serving_size_g: 150 },
  { id: 'dt_1617', name: 'Pistacchi tostati non salati', category: 'Frutta', kcal_100g: 562, proteins_100g: 20.2, carbs_100g: 27.5, fats_100g: 45.4, fiber_100g: 10.3, sugar_100g: 7.7, fatSat_100g: 5.6, serving_size_g: 150 },
  { id: 'dt_1618', name: 'Pinoli crudi', category: 'Frutta', kcal_100g: 673, proteins_100g: 13.7, carbs_100g: 13.1, fats_100g: 68.4, fiber_100g: 3.7, sugar_100g: 3.6, fatSat_100g: 4.9, serving_size_g: 150 },
  { id: 'dt_1619', name: 'Arachidi tostare non salate', category: 'Frutta', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 4, fatSat_100g: 6.8, serving_size_g: 150 },
  { id: 'dt_1620', name: 'Semi di zucca crudi', category: 'Frutta', kcal_100g: 559, proteins_100g: 30.2, carbs_100g: 10.7, fats_100g: 49, fiber_100g: 6, sugar_100g: 1.4, fatSat_100g: 8.7, serving_size_g: 150 },
  { id: 'dt_1621', name: 'Semi di girasole crudi', category: 'Frutta', kcal_100g: 584, proteins_100g: 20.8, carbs_100g: 20, fats_100g: 51.5, fiber_100g: 8.6, sugar_100g: 2.6, fatSat_100g: 4.5, serving_size_g: 150 },
  { id: 'dt_1622', name: 'Semi di lino crudi', category: 'Frutta', kcal_100g: 534, proteins_100g: 18.3, carbs_100g: 28.9, fats_100g: 42.2, fiber_100g: 27.3, sugar_100g: 1.6, fatSat_100g: 3.7, serving_size_g: 150 },
  { id: 'dt_1623', name: 'Semi di canapa sgusciati', category: 'Frutta', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.8, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 4.6, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1624', name: 'Carciofo crudo', category: 'Verdure', kcal_100g: 47, proteins_100g: 3.3, carbs_100g: 11, fats_100g: 0.2, fiber_100g: 5.4, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1625', name: 'Barbabietola rossa cruda', category: 'Verdure', kcal_100g: 43, proteins_100g: 1.6, carbs_100g: 9.6, fats_100g: 0.2, fiber_100g: 2.8, sugar_100g: 6.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1626', name: 'Cavolo cappuccio crudo', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.3, carbs_100g: 5.8, fats_100g: 0.1, fiber_100g: 2.5, sugar_100g: 3.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1627', name: 'Cavolo rosso crudo', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.4, carbs_100g: 7.4, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1628', name: 'Cavoletti di Bruxelles crudi', category: 'Verdure', kcal_100g: 43, proteins_100g: 3.4, carbs_100g: 8.9, fats_100g: 0.3, fiber_100g: 3.8, sugar_100g: 2.2, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1629', name: 'Cavolfiore crudo', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.9, carbs_100g: 5, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 1.9, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1630', name: 'Porro crudo', category: 'Verdure', kcal_100g: 61, proteins_100g: 1.5, carbs_100g: 14, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 3.9, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1631', name: 'Rapa cruda', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 6.4, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1632', name: 'Sedano rapa crudo', category: 'Verdure', kcal_100g: 42, proteins_100g: 1.5, carbs_100g: 9.2, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 1.6, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1633', name: 'Radicchio rosso', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.4, carbs_100g: 4.5, fats_100g: 0.3, fiber_100g: 1.5, sugar_100g: 0.6, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1634', name: 'Rucola cruda', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.6, carbs_100g: 3.7, fats_100g: 0.7, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1635', name: 'Bietola da coste cruda', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.8, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.6, sugar_100g: 1.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1636', name: 'Topinambur crudo', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 9.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1637', name: 'Cipolla rossa cruda', category: 'Verdure', kcal_100g: 40, proteins_100g: 1.1, carbs_100g: 9.3, fats_100g: 0.1, fiber_100g: 1.7, sugar_100g: 4.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1638', name: 'Germogli di soia crudi', category: 'Verdure', kcal_100g: 30, proteins_100g: 3.1, carbs_100g: 5.9, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1639', name: 'Okra (gombo) crudo', category: 'Verdure', kcal_100g: 33, proteins_100g: 1.9, carbs_100g: 7.5, fats_100g: 0.2, fiber_100g: 3.2, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1640', name: 'Pak choi crudo', category: 'Verdure', kcal_100g: 13, proteins_100g: 1.5, carbs_100g: 2.2, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1641', name: 'Cavolo nero (foglie)', category: 'Verdure', kcal_100g: 49, proteins_100g: 4.3, carbs_100g: 8.8, fats_100g: 0.9, fiber_100g: 3.6, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1642', name: 'Broccoletti (cime di rapa)', category: 'Verdure', kcal_100g: 21, proteins_100g: 2.8, carbs_100g: 3.5, fats_100g: 0.3, fiber_100g: 2.6, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1643', name: 'Cicoria cruda', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.7, carbs_100g: 4.7, fats_100g: 0.3, fiber_100g: 4.1, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1644', name: 'Catalogna (puntarelle)', category: 'Verdure', kcal_100g: 22, proteins_100g: 1.9, carbs_100g: 4.5, fats_100g: 0.3, fiber_100g: 4.2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1645', name: 'Verza (cavolo verza)', category: 'Verdure', kcal_100g: 27, proteins_100g: 1.9, carbs_100g: 5.4, fats_100g: 0.3, fiber_100g: 3.4, sugar_100g: 1.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1646', name: 'Daikon (ravanello bianco giapponese)', category: 'Verdure', kcal_100g: 18, proteins_100g: 0.6, carbs_100g: 4.1, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1647', name: 'Yam (igname)', category: 'Verdure', kcal_100g: 118, proteins_100g: 1.5, carbs_100g: 27.9, fats_100g: 0.2, fiber_100g: 4.1, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1648', name: 'Zucca gialla (polpa)', category: 'Verdure', kcal_100g: 26, proteins_100g: 1, carbs_100g: 6.5, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 2.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1649', name: 'Mais dolce crudo', category: 'Verdure', kcal_100g: 86, proteins_100g: 3.2, carbs_100g: 19, fats_100g: 1.2, fiber_100g: 2.7, sugar_100g: 3.2, fatSat_100g: 0.2, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_1650', name: 'Orata fresca', category: 'Proteine', kcal_100g: 96, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 150 },
  { id: 'dt_1651', name: 'Trota iridea (fario)', category: 'Proteine', kcal_100g: 141, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 6.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.7, serving_size_g: 150 },
  { id: 'dt_1652', name: 'Polpo cotto', category: 'Proteine', kcal_100g: 82, proteins_100g: 14.9, carbs_100g: 2.2, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1653', name: 'Calamaro crudo', category: 'Proteine', kcal_100g: 92, proteins_100g: 15.6, carbs_100g: 3.1, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1654', name: 'Seppia cruda', category: 'Proteine', kcal_100g: 79, proteins_100g: 16.1, carbs_100g: 0.8, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1655', name: 'Baccalà sotto sale (dissalato)', category: 'Proteine', kcal_100g: 106, proteins_100g: 25, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1656', name: 'Pesce spada fresco', category: 'Proteine', kcal_100g: 144, proteins_100g: 21.7, carbs_100g: 0, fats_100g: 6.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 150 },
  { id: 'dt_1657', name: 'Dentice fresco', category: 'Proteine', kcal_100g: 90, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1658', name: 'Rombo liscio', category: 'Proteine', kcal_100g: 86, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1659', name: 'Anguilla fresca', category: 'Proteine', kcal_100g: 236, proteins_100g: 18, carbs_100g: 0, fats_100g: 18.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.7, serving_size_g: 150 },
  { id: 'dt_1660', name: 'Palombo fresco', category: 'Proteine', kcal_100g: 89, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1661', name: 'Capesante fresche', category: 'Proteine', kcal_100g: 88, proteins_100g: 16.8, carbs_100g: 3.2, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_1662', name: 'Tonno fresco (pinna gialla)', category: 'Proteine', kcal_100g: 184, proteins_100g: 29.9, carbs_100g: 0, fats_100g: 6.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.6, serving_size_g: 150 },

  // ─── Crostacei ───
  { id: 'dt_1663', name: 'Astice (aragosta americana)', category: 'Proteine', kcal_100g: 89, proteins_100g: 18.8, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Molluschi ───
  { id: 'dt_1664', name: 'Ricci di mare (corallo)', category: 'Proteine', kcal_100g: 119, proteins_100g: 13, carbs_100g: 2.5, fats_100g: 6.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1665', name: 'Agnello coscia (magra)', category: 'Proteine', kcal_100g: 195, proteins_100g: 28, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.9, serving_size_g: 100 },
  { id: 'dt_1666', name: 'Agnello costolette', category: 'Proteine', kcal_100g: 294, proteins_100g: 25, carbs_100g: 0, fats_100g: 21, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.4, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1667', name: 'Anatra petto (senza pelle)', category: 'Proteine', kcal_100g: 140, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 4.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1668', name: 'Cavallo fettina', category: 'Proteine', kcal_100g: 133, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 100 },
  { id: 'dt_1669', name: 'Cinghiale (coscia)', category: 'Proteine', kcal_100g: 122, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 100 },
  { id: 'dt_1670', name: 'Cervo (coscia)', category: 'Proteine', kcal_100g: 120, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1671', name: 'Quaglia intera', category: 'Proteine', kcal_100g: 192, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 11.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.1, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1672', name: 'Fegato di vitello', category: 'Proteine', kcal_100g: 140, proteins_100g: 20.4, carbs_100g: 7.1, fats_100g: 4.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.1, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1673', name: 'Fegato di pollo', category: 'Proteine', kcal_100g: 130, proteins_100g: 19, carbs_100g: 1, fats_100g: 5.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.7, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1674', name: 'Rognone (rene bovino)', category: 'Proteine', kcal_100g: 99, proteins_100g: 17, carbs_100g: 0.8, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1675', name: 'Pollo intero (con pelle)', category: 'Proteine', kcal_100g: 215, proteins_100g: 18.6, carbs_100g: 0, fats_100g: 15.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4.3, serving_size_g: 100 },
  { id: 'dt_1676', name: 'Pollo coscia (con pelle)', category: 'Proteine', kcal_100g: 174, proteins_100g: 26, carbs_100g: 0, fats_100g: 7.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 100 },

  // ─── Salumi ───
  { id: 'dt_1677', name: 'Mortadella Bologna IGP', category: 'Salumi e Insaccati', kcal_100g: 311, proteins_100g: 14.7, carbs_100g: 0.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10.5, serving_size_g: 100 },
  { id: 'dt_1678', name: 'Speck Alto Adige IGP', category: 'Salumi e Insaccati', kcal_100g: 258, proteins_100g: 27.5, carbs_100g: 0, fats_100g: 16.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.7, serving_size_g: 100 },

  // ─── Salumi processati ───
  { id: 'dt_1679', name: 'Nduja di Spilinga', category: 'Salumi e Insaccati', kcal_100g: 540, proteins_100g: 13, carbs_100g: 0, fats_100g: 54, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 21, serving_size_g: 100 },

  // ─── Salumi ───
  { id: 'dt_1680', name: 'Capicola (coppa di testa)', category: 'Salumi e Insaccati', kcal_100g: 290, proteins_100g: 23, carbs_100g: 0, fats_100g: 22, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8, serving_size_g: 100 },

  // ─── Salumi processati ───
  { id: 'dt_1681', name: 'Wurstel (classici)', category: 'Salumi e Insaccati', kcal_100g: 250, proteins_100g: 11, carbs_100g: 2, fats_100g: 22, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 8.5, serving_size_g: 100 },

  // ─── Formaggi ───
  { id: 'dt_1682', name: 'Brie francese', category: 'Latticini', kcal_100g: 334, proteins_100g: 20.8, carbs_100g: 0.5, fats_100g: 27.7, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 17.4, serving_size_g: 125 },
  { id: 'dt_1683', name: 'Camembert de Normandie', category: 'Latticini', kcal_100g: 300, proteins_100g: 19.8, carbs_100g: 0.5, fats_100g: 24.3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 15.2, serving_size_g: 125 },
  { id: 'dt_1684', name: 'Emmental svizzero', category: 'Latticini', kcal_100g: 380, proteins_100g: 28.4, carbs_100g: 0.5, fats_100g: 29.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 19, serving_size_g: 125 },
  { id: 'dt_1685', name: 'Fontina DOP', category: 'Latticini', kcal_100g: 367, proteins_100g: 25.6, carbs_100g: 1.6, fats_100g: 28.8, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 18.6, serving_size_g: 125 },
  { id: 'dt_1686', name: 'Mozzarella di bufala Campana DOP', category: 'Latticini', kcal_100g: 263, proteins_100g: 14.5, carbs_100g: 2.7, fats_100g: 22, fiber_100g: 0, sugar_100g: 2.7, fatSat_100g: 14.3, serving_size_g: 125 },
  { id: 'dt_1687', name: 'Caciocavallo stagionato', category: 'Latticini', kcal_100g: 439, proteins_100g: 31.1, carbs_100g: 0.5, fats_100g: 35.2, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 22.7, serving_size_g: 125 },
  { id: 'dt_1688', name: 'Robiola fresca', category: 'Latticini', kcal_100g: 280, proteins_100g: 11, carbs_100g: 3, fats_100g: 24.6, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 15.7, serving_size_g: 125 },
  { id: 'dt_1689', name: 'Squacquerone di Romagna DOP', category: 'Latticini', kcal_100g: 180, proteins_100g: 10, carbs_100g: 3.5, fats_100g: 14.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 9.2, serving_size_g: 125 },
  { id: 'dt_1690', name: 'Scamorza bianca', category: 'Latticini', kcal_100g: 334, proteins_100g: 26.9, carbs_100g: 0, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16.1, serving_size_g: 125 },
  { id: 'dt_1691', name: 'Fiore Sardo DOP', category: 'Latticini', kcal_100g: 450, proteins_100g: 28, carbs_100g: 0, fats_100g: 37, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 23.8, serving_size_g: 125 },

  // ─── Latte e derivati ───
  { id: 'dt_1692', name: 'Skyr naturale (islandese)', category: 'Latticini', kcal_100g: 63, proteins_100g: 11, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0.1, serving_size_g: 125 },
  { id: 'dt_1693', name: 'Yogurt greco proteico 2%', category: 'Latticini', kcal_100g: 73, proteins_100g: 9, carbs_100g: 3.5, fats_100g: 2, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 1.2, serving_size_g: 125 },
  { id: 'dt_1694', name: 'Fiocchi di latte (cottage cheese)', category: 'Latticini', kcal_100g: 98, proteins_100g: 11.1, carbs_100g: 3.4, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 2.7, fatSat_100g: 1.8, serving_size_g: 125 },
  { id: 'dt_1695', name: 'Latte di capra intero', category: 'Latticini', kcal_100g: 70, proteins_100g: 3.6, carbs_100g: 4.5, fats_100g: 4.1, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 2.7, serving_size_g: 125 },
  { id: 'dt_1696', name: 'Panna da cucina (UHT 18%)', category: 'Latticini', kcal_100g: 177, proteins_100g: 2.8, carbs_100g: 3.9, fats_100g: 17.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 11.5, serving_size_g: 125 },
  { id: 'dt_1697', name: 'Panna montata (light 25%)', category: 'Latticini', kcal_100g: 257, proteins_100g: 2.3, carbs_100g: 3.2, fats_100g: 25, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 16, serving_size_g: 125 },

  // ─── Cereali e pasta ───
  { id: 'dt_1698', name: 'Grano saraceno integrale', category: 'Cereali', kcal_100g: 343, proteins_100g: 13.3, carbs_100g: 71.5, fats_100g: 3.4, fiber_100g: 10, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_1699', name: 'Teff (miglio di Etiopia)', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1700', name: 'Bulgur crudo', category: 'Cereali', kcal_100g: 342, proteins_100g: 12, carbs_100g: 76, fats_100g: 1.3, fiber_100g: 18.3, sugar_100g: 0.4, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Pane ───
  { id: 'dt_1701', name: 'Piadina romagnola', category: 'Pane e Prodotti da Forno', kcal_100g: 331, proteins_100g: 8.2, carbs_100g: 52, fats_100g: 10.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 100 },
  { id: 'dt_1702', name: 'Focaccia (classica genovese)', category: 'Pane e Prodotti da Forno', kcal_100g: 310, proteins_100g: 7.5, carbs_100g: 46, fats_100g: 11.5, fiber_100g: 2, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1703', name: 'Grissini (classici)', category: 'Pane e Prodotti da Forno', kcal_100g: 415, proteins_100g: 11, carbs_100g: 73, fats_100g: 10, fiber_100g: 2.9, sugar_100g: 1.5, fatSat_100g: 1.5, serving_size_g: 30 },

  // ─── Legumi ───
  { id: 'dt_1704', name: 'Lupini cotti', category: 'Legumi', kcal_100g: 119, proteins_100g: 15.6, carbs_100g: 9.9, fats_100g: 2.9, fiber_100g: 4.6, sugar_100g: 0.5, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1705', name: 'Piselli freschi', category: 'Legumi', kcal_100g: 81, proteins_100g: 5.4, carbs_100g: 14, fats_100g: 0.4, fiber_100g: 5.5, sugar_100g: 5.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1706', name: 'Fave fresche', category: 'Legumi', kcal_100g: 57, proteins_100g: 7.6, carbs_100g: 7.6, fats_100g: 0.4, fiber_100g: 6, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1707', name: 'Fave secche', category: 'Legumi', kcal_100g: 341, proteins_100g: 26, carbs_100g: 55, fats_100g: 1.5, fiber_100g: 25, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1708', name: 'Fagioli cannellini cotti', category: 'Legumi', kcal_100g: 92, proteins_100g: 6.3, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 6.3, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1709', name: 'Fagioli neri secchi', category: 'Legumi', kcal_100g: 341, proteins_100g: 21.6, carbs_100g: 62, fats_100g: 1.4, fiber_100g: 16.6, sugar_100g: 2.2, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1710', name: 'Edamame (soia verde)', category: 'Legumi', kcal_100g: 122, proteins_100g: 11, carbs_100g: 9, fats_100g: 5, fiber_100g: 4, sugar_100g: 2.2, fatSat_100g: 0.6, serving_size_g: 80 },

  // ─── Grassi ───
  { id: 'dt_1711', name: 'Olio di girasole', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10, serving_size_g: 10 },
  { id: 'dt_1712', name: 'Olio di mais', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13, serving_size_g: 10 },
  { id: 'dt_1713', name: 'Olio di cocco vergine', category: 'Grassi', kcal_100g: 862, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 86, serving_size_g: 10 },
  { id: 'dt_1714', name: 'Tahini (crema di sesamo)', category: 'Grassi', kcal_100g: 595, proteins_100g: 17.7, carbs_100g: 26.2, fats_100g: 50, fiber_100g: 9.3, sugar_100g: 0.5, fatSat_100g: 7, serving_size_g: 10 },
  { id: 'dt_1715', name: 'Margarina vegetale', category: 'Grassi', kcal_100g: 720, proteins_100g: 0.5, carbs_100g: 0.5, fats_100g: 80, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 25, serving_size_g: 10 },

  // ─── Dolci ───
  { id: 'dt_1716', name: 'Crostata con marmellata (torta casalinga)', category: 'Dolci e Zuccheri', kcal_100g: 338, proteins_100g: 5.5, carbs_100g: 48, fats_100g: 14, fiber_100g: 2, sugar_100g: 25, fatSat_100g: 4, serving_size_g: 50 },
  { id: 'dt_1717', name: 'Torta di mele (casalinga)', category: 'Dolci e Zuccheri', kcal_100g: 241, proteins_100g: 4.2, carbs_100g: 36, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 18, fatSat_100g: 3.2, serving_size_g: 50 },
  { id: 'dt_1718', name: 'Budino di riso casalingo', category: 'Dolci e Zuccheri', kcal_100g: 160, proteins_100g: 4, carbs_100g: 26.5, fats_100g: 4.5, fiber_100g: 0.5, sugar_100g: 12, fatSat_100g: 2, serving_size_g: 50 },

  // ─── Piatti pronti ───
  { id: 'dt_1719', name: 'Canederli (Knödel) al pane', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 6.5, carbs_100g: 27, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 2.5, serving_size_g: 300 },

  // ─── Condimenti ───
  { id: 'dt_1720', name: 'Aceto di vino rosso', category: 'Condimenti e Salse', kcal_100g: 20, proteins_100g: 0, carbs_100g: 0.9, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1721', name: 'Aceto balsamico di Modena IGP', category: 'Condimenti e Salse', kcal_100g: 88, proteins_100g: 0.5, carbs_100g: 17.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 15.6, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1722', name: 'Salsa di soia (normale)', category: 'Condimenti e Salse', kcal_100g: 60, proteins_100g: 10.5, carbs_100g: 5.6, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 1.7, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1723', name: 'Salsa di soia tamari (GF)', category: 'Condimenti e Salse', kcal_100g: 61, proteins_100g: 10.5, carbs_100g: 6.2, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 2.9, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1724', name: 'Ketchup Heinz', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 1.8, carbs_100g: 25, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 21, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1725', name: 'Maionese classica', category: 'Condimenti e Salse', kcal_100g: 680, proteins_100g: 1.5, carbs_100g: 2.9, fats_100g: 74, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 11.5, serving_size_g: 20 },
  { id: 'dt_1726', name: 'Senape gialla', category: 'Condimenti e Salse', kcal_100g: 66, proteins_100g: 4.4, carbs_100g: 8.7, fats_100g: 3.3, fiber_100g: 3.2, sugar_100g: 2.8, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_1727', name: 'Miso bianco (shiro miso)', category: 'Condimenti e Salse', kcal_100g: 199, proteins_100g: 12, carbs_100g: 26, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 6.2, fatSat_100g: 1.2, serving_size_g: 20 },
  { id: 'dt_1728', name: 'Pesto genovese (basilico)', category: 'Condimenti e Salse', kcal_100g: 449, proteins_100g: 6.4, carbs_100g: 4.3, fats_100g: 46, fiber_100g: 1.5, sugar_100g: 1.6, fatSat_100g: 8.8, serving_size_g: 20 },

  // ─── Bevande ───
  { id: 'dt_1729', name: 'Tisana camomilla', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1730', name: 'Vino rosso (12% vol)', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1731', name: 'Succo di arancia 100%', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.7, carbs_100g: 10.4, fats_100g: 0.2, fiber_100g: 0.2, sugar_100g: 8.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1732', name: 'Succo di mela 100%', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.1, carbs_100g: 11.4, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 9.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1733', name: 'Bevanda sportiva isotonica (500mL)', category: 'Bevande', kcal_100g: 26, proteins_100g: 0, carbs_100g: 6.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 5.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1734', name: 'Frullato di frutta (homemade con latte)', category: 'Bevande', kcal_100g: 72, proteins_100g: 3, carbs_100g: 12.5, fats_100g: 1.5, fiber_100g: 0.5, sugar_100g: 11, fatSat_100g: 0.9, serving_size_g: 200 },

  // ─── Cereali e derivati ───
  { id: 'dt_1735', name: 'Pane tipo 0', category: 'Cereali', kcal_100g: 279, proteins_100g: 8.9, carbs_100g: 56.8, fats_100g: 1, fiber_100g: 2.2, sugar_100g: 3.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1736', name: 'Pane tipo 00', category: 'Cereali', kcal_100g: 270, proteins_100g: 8.4, carbs_100g: 54.9, fats_100g: 0.9, fiber_100g: 1.9, sugar_100g: 3.2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1737', name: 'Pasta all\'uovo cruda', category: 'Cereali', kcal_100g: 368, proteins_100g: 12.8, carbs_100g: 66.5, fats_100g: 4.2, fiber_100g: 2.2, sugar_100g: 2, fatSat_100g: 1.4, serving_size_g: 80 },
  { id: 'dt_1738', name: 'Farina di frumento tipo 00', category: 'Cereali', kcal_100g: 363, proteins_100g: 11.5, carbs_100g: 75.3, fats_100g: 1.4, fiber_100g: 2.2, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1739', name: 'Farina integrale di frumento', category: 'Cereali', kcal_100g: 339, proteins_100g: 13.4, carbs_100g: 68, fats_100g: 2.5, fiber_100g: 8.4, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1740', name: 'Polenta cotta', category: 'Cereali', kcal_100g: 80, proteins_100g: 1.8, carbs_100g: 16.8, fats_100g: 0.4, fiber_100g: 0.8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Carni e derivati ───
  { id: 'dt_1741', name: 'Vitello (coscia)', category: 'Proteine', kcal_100g: 107, proteins_100g: 21.2, carbs_100g: 0, fats_100g: 2.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 150 },
  { id: 'dt_1742', name: 'Manzo (coscia)', category: 'Proteine', kcal_100g: 133, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.7, serving_size_g: 150 },
  { id: 'dt_1743', name: 'Fegato di manzo', category: 'Proteine', kcal_100g: 139, proteins_100g: 21.1, carbs_100g: 5.2, fats_100g: 5.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1744', name: 'Merluzzo surgelato', category: 'Proteine', kcal_100g: 69, proteins_100g: 15.8, carbs_100g: 0, fats_100g: 0.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Latte e derivati ───
  { id: 'dt_1745', name: 'Latte di mucca intero', category: 'Latticini', kcal_100g: 61, proteins_100g: 3.3, carbs_100g: 4.9, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 2.2, serving_size_g: 125 },
  { id: 'dt_1746', name: 'Formaggio emmenthal', category: 'Latticini', kcal_100g: 382, proteins_100g: 28.8, carbs_100g: 0.5, fats_100g: 30, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 18, serving_size_g: 125 },

  // ─── Frutta ───
  { id: 'dt_1747', name: 'Mele golden', category: 'Frutta', kcal_100g: 49, proteins_100g: 0.2, carbs_100g: 12.3, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 11.7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Ortaggi ───
  { id: 'dt_1748', name: 'Spinaci cotti', category: 'Verdure', kcal_100g: 28, proteins_100g: 3, carbs_100g: 3.7, fats_100g: 0.7, fiber_100g: 2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1749', name: 'Fagioli borlotti cotti', category: 'Verdure', kcal_100g: 93, proteins_100g: 6.2, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 5.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1750', name: 'Ceci cotti', category: 'Verdure', kcal_100g: 116, proteins_100g: 8.4, carbs_100g: 18.5, fats_100g: 2.4, fiber_100g: 5.8, sugar_100g: 0.8, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_1751', name: 'Lenticchie cotte', category: 'Verdure', kcal_100g: 95, proteins_100g: 8, carbs_100g: 15.6, fats_100g: 0.4, fiber_100g: 4.2, sugar_100g: 0.8, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1752', name: 'Piselli freschi', category: 'Verdure', kcal_100g: 80, proteins_100g: 6.7, carbs_100g: 14.5, fats_100g: 0.4, fiber_100g: 5.2, sugar_100g: 5, fatSat_100g: 0.1, serving_size_g: 200 },

  // ─── Grassi e oli ───
  { id: 'dt_1753', name: 'Olio di mais', category: 'Grassi', kcal_100g: 900, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12.7, serving_size_g: 10 },

  // ─── Dolci ───
  { id: 'dt_1754', name: 'Zucchero semolato', category: 'Dolci e Zuccheri', kcal_100g: 392, proteins_100g: 0, carbs_100g: 104, fats_100g: 0, fiber_100g: 0, sugar_100g: 100, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1755', name: 'Croissant (cornetto)', category: 'Dolci e Zuccheri', kcal_100g: 420, proteins_100g: 7.5, carbs_100g: 51, fats_100g: 21.5, fiber_100g: 1.5, sugar_100g: 26.5, fatSat_100g: 8.5, serving_size_g: 50 },

  // ─── Frutta secca e semi ───
  { id: 'dt_1756', name: 'Nocciole tostate', category: 'Frutta', kcal_100g: 654, proteins_100g: 14.1, carbs_100g: 17, fats_100g: 61.5, fiber_100g: 10.5, sugar_100g: 4.3, fatSat_100g: 4.5, serving_size_g: 150 },
  { id: 'dt_1757', name: 'Arachidi tostate salate', category: 'Frutta', kcal_100g: 599, proteins_100g: 28.3, carbs_100g: 16.7, fats_100g: 49.4, fiber_100g: 8.4, sugar_100g: 4.2, fatSat_100g: 7.6, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1758', name: 'Tonno all\'olio d\'oliva (sgocciolato)', category: 'Proteine', kcal_100g: 225, proteins_100g: 24, carbs_100g: 0, fats_100g: 14.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1759', name: 'Pesto genovese', category: 'Condimenti e Salse', kcal_100g: 460, proteins_100g: 7.5, carbs_100g: 4, fats_100g: 46.5, fiber_100g: 1.8, sugar_100g: 1, fatSat_100g: 8, serving_size_g: 20 },

  // ─── Legumi ───
  { id: 'dt_1760', name: 'Ceci in scatola sgocciolati', category: 'Legumi', kcal_100g: 121, proteins_100g: 7.2, carbs_100g: 18.3, fats_100g: 2.6, fiber_100g: 5.4, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1761', name: 'Fagioli cannellini in scatola', category: 'Legumi', kcal_100g: 97, proteins_100g: 7.8, carbs_100g: 13.8, fats_100g: 0.5, fiber_100g: 5.8, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1762', name: 'Piselli surgelati', category: 'Legumi', kcal_100g: 62, proteins_100g: 5.1, carbs_100g: 8.7, fats_100g: 0.4, fiber_100g: 5.5, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1763', name: 'Fave fresche', category: 'Legumi', kcal_100g: 74, proteins_100g: 5.6, carbs_100g: 10, fats_100g: 0.8, fiber_100g: 5, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1764', name: 'Edamame (soia verde)', category: 'Legumi', kcal_100g: 121, proteins_100g: 11.9, carbs_100g: 8.9, fats_100g: 5.2, fiber_100g: 5.2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_1765', name: 'Pistacchi tostati', category: 'Frutta', kcal_100g: 601, proteins_100g: 20.2, carbs_100g: 27.5, fats_100g: 48.4, fiber_100g: 10.3, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1766', name: 'Tonno al naturale in scatola', category: 'Proteine', kcal_100g: 103, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1767', name: 'Tonno sott\'olio sgocciolato', category: 'Proteine', kcal_100g: 198, proteins_100g: 22, carbs_100g: 0, fats_100g: 12, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1768', name: 'Sgombro in scatola', category: 'Proteine', kcal_100g: 156, proteins_100g: 19.4, carbs_100g: 0, fats_100g: 8.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1769', name: 'Salmone in scatola', category: 'Proteine', kcal_100g: 153, proteins_100g: 20, carbs_100g: 0, fats_100g: 7.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1770', name: 'Acciughe / Alici', category: 'Proteine', kcal_100g: 96, proteins_100g: 16.8, carbs_100g: 1.5, fats_100g: 2.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Latticini ───
  { id: 'dt_1771', name: 'Skyr naturale', category: 'Latticini', kcal_100g: 63, proteins_100g: 11, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_1772', name: 'Formaggio Cottage', category: 'Latticini', kcal_100g: 98, proteins_100g: 11.1, carbs_100g: 3.4, fats_100g: 4.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Verdure ───
  { id: 'dt_1773', name: 'Cavolo riccio (Kale)', category: 'Verdure', kcal_100g: 49, proteins_100g: 4.3, carbs_100g: 8.8, fats_100g: 0.9, fiber_100g: 3.6, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1774', name: 'Cavolo cappuccio verde', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.4, carbs_100g: 3.8, fats_100g: 0.2, fiber_100g: 2.5, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1775', name: 'Peperone rosso', category: 'Verdure', kcal_100g: 26, proteins_100g: 0.9, carbs_100g: 4.6, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1776', name: 'Peperone giallo', category: 'Verdure', kcal_100g: 27, proteins_100g: 1, carbs_100g: 5.3, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali ───
  { id: 'dt_1777', name: 'Farro perlato secco', category: 'Cereali', kcal_100g: 335, proteins_100g: 14.7, carbs_100g: 67.1, fats_100g: 2.4, fiber_100g: 7.2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1778', name: 'Sorgo', category: 'Cereali', kcal_100g: 339, proteins_100g: 11.3, carbs_100g: 74.6, fats_100g: 3.3, fiber_100g: 6.3, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1779', name: 'Pasta integrale cotta', category: 'Cereali', kcal_100g: 124, proteins_100g: 4.9, carbs_100g: 23.2, fats_100g: 1, fiber_100g: 3.5, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1780', name: 'Riso basmati crudo', category: 'Cereali', kcal_100g: 356, proteins_100g: 7.4, carbs_100g: 77.7, fats_100g: 0.7, fiber_100g: 1.8, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1781', name: 'Polenta (farina di mais)', category: 'Cereali', kcal_100g: 357, proteins_100g: 8.5, carbs_100g: 78.1, fats_100g: 3.8, fiber_100g: 2.9, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Carni e derivati ───
  { id: 'dt_1782', name: 'Coppa capocollo', category: 'Proteine', kcal_100g: 345, proteins_100g: 24.7, carbs_100g: 0, fats_100g: 26.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8, serving_size_g: 150 },
  { id: 'dt_1783', name: 'Pancetta tesa', category: 'Proteine', kcal_100g: 488, proteins_100g: 11.8, carbs_100g: 0, fats_100g: 47, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 150 },
  { id: 'dt_1784', name: 'Salsiccia stagionata', category: 'Proteine', kcal_100g: 420, proteins_100g: 24, carbs_100g: 0, fats_100g: 36, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13, serving_size_g: 150 },

  // ─── Cereali e derivati ───
  { id: 'dt_1785', name: 'Pane multicereali', category: 'Cereali', kcal_100g: 262, proteins_100g: 9, carbs_100g: 47.5, fats_100g: 3, fiber_100g: 6, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1786', name: 'Grissini artigianali', category: 'Cereali', kcal_100g: 411, proteins_100g: 10.4, carbs_100g: 68.5, fats_100g: 9.2, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_1787', name: 'Pane di casa tipo toscano', category: 'Cereali', kcal_100g: 265, proteins_100g: 8.6, carbs_100g: 53, fats_100g: 1.2, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1788', name: 'Pasta sfoglia cruda', category: 'Cereali', kcal_100g: 423, proteins_100g: 6.6, carbs_100g: 44, fats_100g: 28, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 18, serving_size_g: 80 },

  // ─── Latte e derivati ───
  { id: 'dt_1789', name: 'Formaggino', category: 'Latticini', kcal_100g: 282, proteins_100g: 17, carbs_100g: 3, fats_100g: 22, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_1790', name: 'Panna UHT 35%', category: 'Latticini', kcal_100g: 341, proteins_100g: 2.1, carbs_100g: 3.5, fats_100g: 35, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 23, serving_size_g: 125 },
  { id: 'dt_1791', name: 'Yogurt proteico magro', category: 'Latticini', kcal_100g: 75, proteins_100g: 15, carbs_100g: 5.5, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_1792', name: 'Panna acida', category: 'Latticini', kcal_100g: 193, proteins_100g: 2.9, carbs_100g: 4.6, fats_100g: 19.4, fiber_100g: 0, sugar_100g: 3.7, fatSat_100g: 12, serving_size_g: 125 },

  // ─── Pesce ───
  { id: 'dt_1793', name: 'Spigola da acquacoltura', category: 'Proteine', kcal_100g: 82, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 150 },
  { id: 'dt_1794', name: 'Orata da acquacoltura', category: 'Proteine', kcal_100g: 96, proteins_100g: 18.4, carbs_100g: 0, fats_100g: 2.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1795', name: 'Cefalo', category: 'Proteine', kcal_100g: 117, proteins_100g: 18.6, carbs_100g: 0, fats_100g: 4.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1796', name: 'Tzatziki fatto in casa', category: 'Condimenti e Salse', kcal_100g: 90, proteins_100g: 5, carbs_100g: 4, fats_100g: 5.8, fiber_100g: 0.5, sugar_100g: 2, fatSat_100g: 3, serving_size_g: 20 },
  { id: 'dt_1797', name: 'Salsa di soia ridotto sale', category: 'Condimenti e Salse', kcal_100g: 47, proteins_100g: 6.6, carbs_100g: 3.9, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 3.9, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Grassi e oli ───
  { id: 'dt_1798', name: 'Olio di cocco vergine', category: 'Grassi', kcal_100g: 892, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 86, serving_size_g: 10 },

  // ─── Frutta fresca ───
  { id: 'dt_1799', name: 'Cachi / Kaki', category: 'Frutta', kcal_100g: 70, proteins_100g: 0.6, carbs_100g: 18.6, fats_100g: 0.2, fiber_100g: 3.6, sugar_100g: 12.5, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_1800', name: 'Pesce persico', category: 'Proteine', kcal_100g: 91, proteins_100g: 19.4, carbs_100g: 0, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_1801', name: 'Dado da brodo granulare', category: 'Condimenti e Salse', kcal_100g: 238, proteins_100g: 16.5, carbs_100g: 22, fats_100g: 11, fiber_100g: 0, sugar_100g: 2, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_1802', name: 'Olive verdi denocciolate', category: 'Condimenti e Salse', kcal_100g: 145, proteins_100g: 1, carbs_100g: 3.8, fats_100g: 11, fiber_100g: 3.3, sugar_100g: 0, fatSat_100g: 1.4, serving_size_g: 20 },
  { id: 'dt_1803', name: 'Olive nere in salamoia', category: 'Condimenti e Salse', kcal_100g: 116, proteins_100g: 0.8, carbs_100g: 2, fats_100g: 10.7, fiber_100g: 3.2, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 20 },
  { id: 'dt_1804', name: 'Capperi sott\'aceto', category: 'Condimenti e Salse', kcal_100g: 23, proteins_100g: 2.4, carbs_100g: 4.9, fats_100g: 0.9, fiber_100g: 3.2, sugar_100g: 0.4, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1805', name: 'Senape in grani', category: 'Condimenti e Salse', kcal_100g: 66, proteins_100g: 4.4, carbs_100g: 5.8, fats_100g: 3.4, fiber_100g: 3.4, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 20 },
  { id: 'dt_1806', name: 'Timo essiccato', category: 'Condimenti e Salse', kcal_100g: 276, proteins_100g: 9.1, carbs_100g: 63.9, fats_100g: 7.4, fiber_100g: 37, sugar_100g: 1.7, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_1807', name: 'Rosmarino essiccato', category: 'Condimenti e Salse', kcal_100g: 331, proteins_100g: 4.9, carbs_100g: 64.1, fats_100g: 15.2, fiber_100g: 42.6, sugar_100g: 3.1, fatSat_100g: 1.5, serving_size_g: 20 },
  { id: 'dt_1808', name: 'Salvia essiccata', category: 'Condimenti e Salse', kcal_100g: 315, proteins_100g: 10.6, carbs_100g: 60.7, fats_100g: 12.7, fiber_100g: 40.3, sugar_100g: 1.7, fatSat_100g: 3.8, serving_size_g: 20 },
  { id: 'dt_1809', name: 'Alloro essiccato', category: 'Condimenti e Salse', kcal_100g: 313, proteins_100g: 7.6, carbs_100g: 74.9, fats_100g: 8.4, fiber_100g: 26.3, sugar_100g: 0, fatSat_100g: 2.3, serving_size_g: 20 },
  { id: 'dt_1810', name: 'Erba cipollina fresca', category: 'Condimenti e Salse', kcal_100g: 30, proteins_100g: 3.3, carbs_100g: 4.4, fats_100g: 0.7, fiber_100g: 2.5, sugar_100g: 1.9, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1811', name: 'Paprica dolce in polvere', category: 'Condimenti e Salse', kcal_100g: 282, proteins_100g: 14.1, carbs_100g: 53.9, fats_100g: 13, fiber_100g: 34.9, sugar_100g: 10.3, fatSat_100g: 2, serving_size_g: 20 },
  { id: 'dt_1812', name: 'Noce moscata in polvere', category: 'Condimenti e Salse', kcal_100g: 525, proteins_100g: 5.8, carbs_100g: 49.3, fats_100g: 36.3, fiber_100g: 20.8, sugar_100g: 2.9, fatSat_100g: 25.9, serving_size_g: 20 },

  // ─── Cereali e derivati ───
  { id: 'dt_1813', name: 'Pangrattato', category: 'Cereali', kcal_100g: 395, proteins_100g: 13.7, carbs_100g: 76.6, fats_100g: 3.5, fiber_100g: 3.5, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_1814', name: 'Semolino di grano duro', category: 'Cereali', kcal_100g: 350, proteins_100g: 12.7, carbs_100g: 72.8, fats_100g: 1, fiber_100g: 3.9, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1815', name: 'Amido di mais', category: 'Cereali', kcal_100g: 381, proteins_100g: 0.3, carbs_100g: 91.3, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_1816', name: 'Riso bianco cotto', category: 'Cereali', kcal_100g: 130, proteins_100g: 2.7, carbs_100g: 28.2, fats_100g: 0.3, fiber_100g: 0.4, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1817', name: 'Pasta di semola cotta', category: 'Cereali', kcal_100g: 157, proteins_100g: 5.8, carbs_100g: 30.6, fats_100g: 0.9, fiber_100g: 1.8, sugar_100g: 0.6, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1818', name: 'Quinoa cotta', category: 'Cereali', kcal_100g: 120, proteins_100g: 4.4, carbs_100g: 21.3, fats_100g: 1.9, fiber_100g: 2.8, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1819', name: 'Bulgur cotto', category: 'Cereali', kcal_100g: 83, proteins_100g: 3.1, carbs_100g: 18.6, fats_100g: 0.2, fiber_100g: 4.5, sugar_100g: 0.1, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1820', name: 'Couscous cotto', category: 'Cereali', kcal_100g: 112, proteins_100g: 3.8, carbs_100g: 23.2, fats_100g: 0.2, fiber_100g: 1.4, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1821', name: 'Alghe Nori (essiccate)', category: 'Verdure', kcal_100g: 35, proteins_100g: 5.8, carbs_100g: 5.1, fats_100g: 0.3, fiber_100g: 0.3, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_1822', name: 'Alghe Wakame (essiccate)', category: 'Verdure', kcal_100g: 45, proteins_100g: 3, carbs_100g: 9.1, fats_100g: 0.6, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 200 },

  // ─── Condimenti ───
  { id: 'dt_1823', name: 'Miso (pasta fermentata di soia)', category: 'Condimenti e Salse', kcal_100g: 199, proteins_100g: 11.7, carbs_100g: 26.5, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 6.2, fatSat_100g: 1.1, serving_size_g: 20 },

  // ─── Carni rosse ───
  { id: 'dt_1824', name: 'Ciccioli', category: 'Proteine', kcal_100g: 561, proteins_100g: 27.7, carbs_100g: 2.8, fats_100g: 46.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 15, serving_size_g: 100 },

  // ─── Dolci ───
  { id: 'dt_1825', name: 'Zucchero di canna grezzo', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 0, carbs_100g: 98.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 95, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1826', name: 'Sciroppo d\'acero', category: 'Dolci e Zuccheri', kcal_100g: 260, proteins_100g: 0, carbs_100g: 67.1, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 59.5, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1827', name: 'Sciroppo di agave', category: 'Dolci e Zuccheri', kcal_100g: 310, proteins_100g: 0.1, carbs_100g: 76.2, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 74.9, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Condimenti ───
  { id: 'dt_1828', name: 'Lievito di birra secco attivo', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 40.4, carbs_100g: 41.2, fats_100g: 7.6, fiber_100g: 26.9, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 20 },
  { id: 'dt_1829', name: 'Lievito nutrizionale in scaglie', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 50, carbs_100g: 29, fats_100g: 6.5, fiber_100g: 14, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 20 },

  // ─── Frutta secca ───
  { id: 'dt_1830', name: 'Semi di canapa decorticati', category: 'Frutta', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.8, fiber_100g: 4, sugar_100g: 1.5, fatSat_100g: 3.7, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_1831', name: 'Okra (gombo)', category: 'Verdure', kcal_100g: 33, proteins_100g: 2, carbs_100g: 7.5, fats_100g: 0.2, fiber_100g: 3.2, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1832', name: 'Puntarelle', category: 'Verdure', kcal_100g: 23, proteins_100g: 2.1, carbs_100g: 3.5, fats_100g: 0.4, fiber_100g: 3, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1833', name: 'Lampascioni (cipollotti selvatici)', category: 'Verdure', kcal_100g: 35, proteins_100g: 1.5, carbs_100g: 6.8, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1834', name: 'Cuori di palma', category: 'Verdure', kcal_100g: 36, proteins_100g: 3, carbs_100g: 6.8, fats_100g: 0.3, fiber_100g: 3.5, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1835', name: 'Germogli di bambù', category: 'Verdure', kcal_100g: 27, proteins_100g: 2.6, carbs_100g: 5.2, fats_100g: 0.3, fiber_100g: 2.2, sugar_100g: 1.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1836', name: 'Topinambur cotto', category: 'Verdure', kcal_100g: 70, proteins_100g: 1.9, carbs_100g: 16.5, fats_100g: 0, fiber_100g: 1.4, sugar_100g: 2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1837', name: 'Daikon (ravanello bianco giapponese)', category: 'Verdure', kcal_100g: 18, proteins_100g: 0.6, carbs_100g: 4.1, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1838', name: 'Cavolo rapa', category: 'Verdure', kcal_100g: 27, proteins_100g: 1.7, carbs_100g: 6.2, fats_100g: 0.1, fiber_100g: 3.6, sugar_100g: 3.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1839', name: 'Bieta a coste cotta', category: 'Verdure', kcal_100g: 20, proteins_100g: 1.9, carbs_100g: 4.1, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 1.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1840', name: 'Broccoli cotti', category: 'Verdure', kcal_100g: 28, proteins_100g: 3.3, carbs_100g: 4.7, fats_100g: 0.4, fiber_100g: 3, sugar_100g: 1.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1841', name: 'Cime di rapa cotte', category: 'Verdure', kcal_100g: 27, proteins_100g: 3.1, carbs_100g: 3.5, fats_100g: 0.5, fiber_100g: 3.2, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1842', name: 'Tamarindo fresco', category: 'Frutta', kcal_100g: 239, proteins_100g: 2.8, carbs_100g: 62.5, fats_100g: 0.6, fiber_100g: 5.1, sugar_100g: 38, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1843', name: 'Giuggiole fresche', category: 'Frutta', kcal_100g: 79, proteins_100g: 1.2, carbs_100g: 20.2, fats_100g: 0.2, fiber_100g: 4, sugar_100g: 17.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1844', name: 'Carambola (Starfruit)', category: 'Frutta', kcal_100g: 31, proteins_100g: 1, carbs_100g: 6.7, fats_100g: 0.3, fiber_100g: 2.8, sugar_100g: 3.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1845', name: 'Guava fresca', category: 'Frutta', kcal_100g: 68, proteins_100g: 2.6, carbs_100g: 14.3, fats_100g: 1, fiber_100g: 5.4, sugar_100g: 8.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1846', name: 'Maracuja / Frutto della passione', category: 'Frutta', kcal_100g: 97, proteins_100g: 2.2, carbs_100g: 23.4, fats_100g: 0.7, fiber_100g: 10.4, sugar_100g: 11.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1847', name: 'Rambutano', category: 'Frutta', kcal_100g: 82, proteins_100g: 0.9, carbs_100g: 20.9, fats_100g: 0.2, fiber_100g: 0.9, sugar_100g: 18, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1848', name: 'Corbezzoli', category: 'Frutta', kcal_100g: 50, proteins_100g: 0.5, carbs_100g: 11.4, fats_100g: 0.4, fiber_100g: 3.5, sugar_100g: 7.5, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Legumi ───
  { id: 'dt_1849', name: 'Azuki (adzuki) fagioli rossi cotti', category: 'Legumi', kcal_100g: 128, proteins_100g: 7.5, carbs_100g: 24.8, fats_100g: 0.1, fiber_100g: 7.3, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1850', name: 'Lupini in salamoia sgocciolati', category: 'Legumi', kcal_100g: 119, proteins_100g: 15.8, carbs_100g: 10.1, fats_100g: 2.8, fiber_100g: 2, sugar_100g: 0.4, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Cereali ───
  { id: 'dt_1851', name: 'Teff crudo', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 3.3, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1852', name: 'Freekeh (grano verde tostato)', category: 'Cereali', kcal_100g: 362, proteins_100g: 12.6, carbs_100g: 72, fats_100g: 2.7, fiber_100g: 16.5, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_1853', name: 'Riso integrale cotto', category: 'Cereali', kcal_100g: 110, proteins_100g: 2.6, carbs_100g: 23, fats_100g: 0.9, fiber_100g: 1.8, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Cereali ───
  { id: 'dt_1854', name: 'Semola di mais (fioretto)', category: 'Cereali', kcal_100g: 358, proteins_100g: 8.7, carbs_100g: 76, fats_100g: 4, fiber_100g: 2.4, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_1855', name: 'Farina di riso integrale', category: 'Cereali', kcal_100g: 366, proteins_100g: 7.2, carbs_100g: 78.7, fats_100g: 2.8, fiber_100g: 4.6, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1856', name: 'Farina di avena', category: 'Cereali', kcal_100g: 379, proteins_100g: 13.9, carbs_100g: 70, fats_100g: 7, fiber_100g: 6.5, sugar_100g: 0.7, fatSat_100g: 1.1, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_1857', name: 'Pasta di grano saraceno cruda (soba)', category: 'Cereali', kcal_100g: 368, proteins_100g: 14.7, carbs_100g: 74.4, fats_100g: 3.4, fiber_100g: 8.5, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_1858', name: 'Pane di kamut crudo', category: 'Cereali', kcal_100g: 259, proteins_100g: 11, carbs_100g: 47.5, fats_100g: 3.5, fiber_100g: 4, sugar_100g: 3, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Formaggi ───
  { id: 'dt_1859', name: 'Puzzone di Moena', category: 'Latticini', kcal_100g: 360, proteins_100g: 26.5, carbs_100g: 0.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_1860', name: 'Strachitunt (erborinato bergamasco)', category: 'Latticini', kcal_100g: 368, proteins_100g: 22.5, carbs_100g: 0.5, fats_100g: 29.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 13.5, serving_size_g: 125 },
  { id: 'dt_1861', name: 'Cagliata fresca', category: 'Latticini', kcal_100g: 90, proteins_100g: 9.5, carbs_100g: 4, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 2.5, serving_size_g: 125 },
  { id: 'dt_1862', name: 'Stracciatella di bufala', category: 'Latticini', kcal_100g: 307, proteins_100g: 12.8, carbs_100g: 1.5, fats_100g: 27.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_1863', name: 'Pecorino Romano grattugiato', category: 'Latticini', kcal_100g: 387, proteins_100g: 31.8, carbs_100g: 0.2, fats_100g: 29.5, fiber_100g: 0, sugar_100g: 0.2, fatSat_100g: 13, serving_size_g: 125 },
  { id: 'dt_1864', name: 'Quartirolo lombardo', category: 'Latticini', kcal_100g: 253, proteins_100g: 17.5, carbs_100g: 0.5, fats_100g: 19.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10.5, serving_size_g: 125 },
  { id: 'dt_1865', name: 'Crescenza / Stracchino', category: 'Latticini', kcal_100g: 247, proteins_100g: 15.8, carbs_100g: 1, fats_100g: 19.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12.5, serving_size_g: 125 },

  // ─── Carni rosse ───
  { id: 'dt_1866', name: 'Struzzo filetto', category: 'Proteine', kcal_100g: 105, proteins_100g: 22.4, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_1867', name: 'Cervo coscia', category: 'Proteine', kcal_100g: 120, proteins_100g: 22, carbs_100g: 0, fats_100g: 2.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1868', name: 'Capretto coscia', category: 'Proteine', kcal_100g: 109, proteins_100g: 20.6, carbs_100g: 0, fats_100g: 2.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_1869', name: 'Coniglio coscia', category: 'Proteine', kcal_100g: 136, proteins_100g: 21, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_1870', name: 'Trippa di manzo', category: 'Proteine', kcal_100g: 84, proteins_100g: 15.4, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_1871', name: 'Rognone (reni) di manzo', category: 'Proteine', kcal_100g: 99, proteins_100g: 17.4, carbs_100g: 0.8, fats_100g: 3.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_1872', name: 'Cuore di manzo', category: 'Proteine', kcal_100g: 112, proteins_100g: 17.1, carbs_100g: 0.1, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_1873', name: 'Tonno pinna gialla fresco', category: 'Proteine', kcal_100g: 108, proteins_100g: 23.3, carbs_100g: 0, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_1874', name: 'Cernia di mare surgelata', category: 'Proteine', kcal_100g: 82, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },

  // ─── Molluschi ───
  { id: 'dt_1875', name: 'Calamaro surgelato', category: 'Proteine', kcal_100g: 74, proteins_100g: 15.6, carbs_100g: 0.8, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_1876', name: 'Lumache di mare (murici)', category: 'Proteine', kcal_100g: 70, proteins_100g: 14.5, carbs_100g: 1.5, fats_100g: 0.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 100 },
  { id: 'dt_1877', name: 'Ricci di mare', category: 'Proteine', kcal_100g: 120, proteins_100g: 13, carbs_100g: 3.4, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 100 },
  { id: 'dt_1878', name: 'Ostrica', category: 'Proteine', kcal_100g: 69, proteins_100g: 9, carbs_100g: 4.9, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },

  // ─── Crostacei ───
  { id: 'dt_1879', name: 'Granchio reale', category: 'Proteine', kcal_100g: 84, proteins_100g: 18, carbs_100g: 0, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_1880', name: 'Astice (aragosta)', category: 'Proteine', kcal_100g: 90, proteins_100g: 18.8, carbs_100g: 0.5, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_1881', name: 'Cannocchie / Pannocchie', category: 'Proteine', kcal_100g: 83, proteins_100g: 14.4, carbs_100g: 1.4, fats_100g: 1.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_1882', name: 'Colatura di alici', category: 'Condimenti e Salse', kcal_100g: 26, proteins_100g: 5, carbs_100g: 1, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Grassi e oli ───
  { id: 'dt_1883', name: 'Olio di palma', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 49.3, serving_size_g: 10 },

  // ─── Condimenti ───
  { id: 'dt_1884', name: 'Salsa Caesar industriale', category: 'Condimenti e Salse', kcal_100g: 388, proteins_100g: 2.5, carbs_100g: 5, fats_100g: 40, fiber_100g: 0.3, sugar_100g: 3.5, fatSat_100g: 4.5, serving_size_g: 20 },
  { id: 'dt_1885', name: 'Pasta al pistacchio (pesto)', category: 'Condimenti e Salse', kcal_100g: 480, proteins_100g: 8, carbs_100g: 18, fats_100g: 44, fiber_100g: 4, sugar_100g: 6, fatSat_100g: 9, serving_size_g: 20 },
  { id: 'dt_1886', name: 'Tahini / crema di sesamo', category: 'Condimenti e Salse', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9, sugar_100g: 0.5, fatSat_100g: 7.5, serving_size_g: 20 },

  // ─── Dolci ───
  { id: 'dt_1887', name: 'Marmellata di arance', category: 'Dolci e Zuccheri', kcal_100g: 258, proteins_100g: 0.4, carbs_100g: 65, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 63.5, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_1888', name: 'Marmellata di albicocche', category: 'Dolci e Zuccheri', kcal_100g: 251, proteins_100g: 0.4, carbs_100g: 65, fats_100g: 0.1, fiber_100g: 2, sugar_100g: 60, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Creme e spalmate ───
  { id: 'dt_1889', name: 'Crema di pistacchi senza zucchero', category: 'Condimenti e Salse', kcal_100g: 559, proteins_100g: 18.5, carbs_100g: 24, fats_100g: 44, fiber_100g: 10.5, sugar_100g: 3.5, fatSat_100g: 4.5, serving_size_g: 100 },

  // ─── Dolci ───
  { id: 'dt_1890', name: 'Cioccolato fondente 85%', category: 'Dolci e Zuccheri', kcal_100g: 575, proteins_100g: 12.5, carbs_100g: 32.5, fats_100g: 42.5, fiber_100g: 12.5, sugar_100g: 26, fatSat_100g: 17.5, serving_size_g: 50 },
  { id: 'dt_1891', name: 'Cioccolato fondente 72%', category: 'Dolci e Zuccheri', kcal_100g: 540, proteins_100g: 8, carbs_100g: 45, fats_100g: 36, fiber_100g: 10, sugar_100g: 33.5, fatSat_100g: 13.5, serving_size_g: 50 },
  { id: 'dt_1892', name: 'Cacao amaro in polvere', category: 'Dolci e Zuccheri', kcal_100g: 228, proteins_100g: 19.6, carbs_100g: 10.5, fats_100g: 13.7, fiber_100g: 37, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 50 },
  { id: 'dt_1893', name: 'Cioccolato al latte 35%', category: 'Dolci e Zuccheri', kcal_100g: 541, proteins_100g: 7.3, carbs_100g: 58.5, fats_100g: 30.7, fiber_100g: 1.5, sugar_100g: 55.5, fatSat_100g: 17.5, serving_size_g: 50 },

  // ─── Condimenti ───
  { id: 'dt_1894', name: 'Menta piperita essiccata', category: 'Condimenti e Salse', kcal_100g: 285, proteins_100g: 14.8, carbs_100g: 60.7, fats_100g: 6, fiber_100g: 29.8, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 20 },
  { id: 'dt_1895', name: 'Cardamomo in polvere', category: 'Condimenti e Salse', kcal_100g: 311, proteins_100g: 10.8, carbs_100g: 68.5, fats_100g: 6.7, fiber_100g: 28, sugar_100g: 4, fatSat_100g: 0.7, serving_size_g: 20 },
  { id: 'dt_1896', name: 'Zafferano in polvere', category: 'Condimenti e Salse', kcal_100g: 310, proteins_100g: 11.4, carbs_100g: 65, fats_100g: 5.9, fiber_100g: 3.9, sugar_100g: 1.5, fatSat_100g: 0.6, serving_size_g: 20 },
  { id: 'dt_1897', name: 'Aglio essiccato in polvere', category: 'Condimenti e Salse', kcal_100g: 331, proteins_100g: 16.8, carbs_100g: 72.7, fats_100g: 0.7, fiber_100g: 9, sugar_100g: 3.7, fatSat_100g: 0.4, serving_size_g: 20 },

  // ─── Formaggi ───
  { id: 'dt_1898', name: 'Asiago stagionato', category: 'Latticini', kcal_100g: 385, proteins_100g: 33, carbs_100g: 0.3, fats_100g: 28.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 13.5, serving_size_g: 125 },
  { id: 'dt_1899', name: 'Bitto', category: 'Latticini', kcal_100g: 398, proteins_100g: 26.5, carbs_100g: 0.3, fats_100g: 32, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 14.5, serving_size_g: 125 },
  { id: 'dt_1900', name: 'Grana Padano grattugiato', category: 'Latticini', kcal_100g: 384, proteins_100g: 33, carbs_100g: 0.1, fats_100g: 28, fiber_100g: 0, sugar_100g: 0.1, fatSat_100g: 14, serving_size_g: 125 },

  // ─── Pesce ───
  { id: 'dt_1901', name: 'Tilapia', category: 'Proteine', kcal_100g: 96, proteins_100g: 20.1, carbs_100g: 0, fats_100g: 1.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1902', name: 'Pangasio', category: 'Proteine', kcal_100g: 83, proteins_100g: 15, carbs_100g: 0, fats_100g: 2.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 150 },
  { id: 'dt_1903', name: 'Rombo chiodato', category: 'Proteine', kcal_100g: 95, proteins_100g: 18, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_1904', name: 'Palamita', category: 'Proteine', kcal_100g: 148, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_1905', name: 'Spatola (pesce sciabola)', category: 'Proteine', kcal_100g: 109, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },

  // ─── Carni rosse ───
  { id: 'dt_1906', name: 'Anatra petto (senza pelle)', category: 'Proteine', kcal_100g: 140, proteins_100g: 23.5, carbs_100g: 0, fats_100g: 5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Carni bianche ───
  { id: 'dt_1907', name: 'Faraona petto', category: 'Proteine', kcal_100g: 110, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 100 },

  // ─── Legumi ───
  { id: 'dt_1908', name: 'Cicerchie secche', category: 'Legumi', kcal_100g: 316, proteins_100g: 28.4, carbs_100g: 60.1, fats_100g: 1.5, fiber_100g: 6.2, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1909', name: 'Favino secco', category: 'Legumi', kcal_100g: 341, proteins_100g: 26.1, carbs_100g: 60, fats_100g: 1.5, fiber_100g: 19, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Verdure ───
  { id: 'dt_1910', name: 'Borragine', category: 'Verdure', kcal_100g: 21, proteins_100g: 1.8, carbs_100g: 3.1, fats_100g: 0.7, fiber_100g: 2.5, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1911', name: 'Coste di bietola crude', category: 'Verdure', kcal_100g: 19, proteins_100g: 1.6, carbs_100g: 3.6, fats_100g: 0.2, fiber_100g: 1.6, sugar_100g: 1.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1912', name: 'Friarielli / Cime di rapa crude', category: 'Verdure', kcal_100g: 26, proteins_100g: 2.9, carbs_100g: 4.6, fats_100g: 0.4, fiber_100g: 2.6, sugar_100g: 1.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1913', name: 'Agretti (barba di frate)', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.8, carbs_100g: 1.9, fats_100g: 0.3, fiber_100g: 1.3, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_1914', name: 'Lamponi freschi', category: 'Frutta', kcal_100g: 34, proteins_100g: 1.2, carbs_100g: 5.4, fats_100g: 0.7, fiber_100g: 6.5, sugar_100g: 4.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1915', name: 'More fresche', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 5.3, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1916', name: 'Ribes nero fresco', category: 'Frutta', kcal_100g: 63, proteins_100g: 1.4, carbs_100g: 15.4, fats_100g: 0.4, fiber_100g: 4.3, sugar_100g: 6.8, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1917', name: 'Fico fresco', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.7, carbs_100g: 12.4, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1918', name: 'Susina fresca', category: 'Frutta', kcal_100g: 36, proteins_100g: 0.6, carbs_100g: 8.1, fats_100g: 0.1, fiber_100g: 1.4, sugar_100g: 7.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1919', name: 'Cedro', category: 'Frutta', kcal_100g: 27, proteins_100g: 1.1, carbs_100g: 4.3, fats_100g: 0.3, fiber_100g: 4.7, sugar_100g: 3.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1920', name: 'Pompelmo fresco', category: 'Frutta', kcal_100g: 32, proteins_100g: 0.6, carbs_100g: 8, fats_100g: 0.1, fiber_100g: 1.1, sugar_100g: 6.2, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Cereali e derivati ───
  { id: 'dt_1921', name: 'Pane azzimo (non lievitato)', category: 'Cereali', kcal_100g: 368, proteins_100g: 10.5, carbs_100g: 78.6, fats_100g: 2.5, fiber_100g: 3, sugar_100g: 1, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_1922', name: 'Pane pita', category: 'Cereali', kcal_100g: 275, proteins_100g: 9.1, carbs_100g: 57.5, fats_100g: 1.2, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1923', name: 'Tortilla di farina di mais', category: 'Cereali', kcal_100g: 234, proteins_100g: 5.7, carbs_100g: 47.4, fats_100g: 3.8, fiber_100g: 4, sugar_100g: 0.3, fatSat_100g: 0.4, serving_size_g: 80 },

  // ─── Cereali ───
  { id: 'dt_1924', name: 'Farro integrale crudo', category: 'Cereali', kcal_100g: 338, proteins_100g: 15.1, carbs_100g: 67.6, fats_100g: 2.5, fiber_100g: 9.4, sugar_100g: 2.2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1925', name: 'Orzo decorticato secco', category: 'Cereali', kcal_100g: 304, proteins_100g: 10, carbs_100g: 62.8, fats_100g: 1.4, fiber_100g: 15.6, sugar_100g: 0.8, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_1926', name: 'Aceto di mele non filtrato', category: 'Condimenti e Salse', kcal_100g: 21, proteins_100g: 0.1, carbs_100g: 0.9, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.9, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_1927', name: 'Ketchup industriale', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 1.5, carbs_100g: 25, fats_100g: 0.4, fiber_100g: 0.4, sugar_100g: 21.3, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1928', name: 'Salsa barbecue industriale', category: 'Condimenti e Salse', kcal_100g: 135, proteins_100g: 1.5, carbs_100g: 32, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 28.5, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_1929', name: 'Harissa (pasta di peperoncino)', category: 'Condimenti e Salse', kcal_100g: 75, proteins_100g: 3.5, carbs_100g: 6, fats_100g: 4.5, fiber_100g: 4, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 20 },

  // ─── Biscotti e crackers ───
  { id: 'dt_1930', name: 'Biscotti frollini al burro', category: 'Pane e Prodotti da Forno', kcal_100g: 490, proteins_100g: 6, carbs_100g: 71.5, fats_100g: 19.5, fiber_100g: 1.5, sugar_100g: 24, fatSat_100g: 14, serving_size_g: 30 },

  // ─── Dolci confezionati ───
  { id: 'dt_1931', name: 'Merendina tipo Fiesta (Ferrero)', category: 'Dolci e Zuccheri', kcal_100g: 461, proteins_100g: 5.4, carbs_100g: 62, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 41, fatSat_100g: 7.5, serving_size_g: 50 },

  // ─── Gelati ───
  { id: 'dt_1932', name: 'Cornetto confezionato (Algida tipo)', category: 'Dolci e Zuccheri', kcal_100g: 285, proteins_100g: 4.5, carbs_100g: 34, fats_100g: 16, fiber_100g: 0.5, sugar_100g: 27, fatSat_100g: 6, serving_size_g: 50 },

  // ─── Dolci ───
  { id: 'dt_1933', name: 'Tiramisù artigianale', category: 'Dolci e Zuccheri', kcal_100g: 298, proteins_100g: 5.5, carbs_100g: 32, fats_100g: 18.5, fiber_100g: 0.3, sugar_100g: 27.5, fatSat_100g: 8.5, serving_size_g: 50 },

  // ─── Dolci confezionati ───
  { id: 'dt_1934', name: 'Panna cotta industriale', category: 'Dolci e Zuccheri', kcal_100g: 199, proteins_100g: 3.5, carbs_100g: 21.5, fats_100g: 12.5, fiber_100g: 0, sugar_100g: 19, fatSat_100g: 5, serving_size_g: 50 },

  // ─── Piatti pronti ───
  { id: 'dt_1935', name: 'Minestrone in busta surgelato', category: 'Piatti Pronti', kcal_100g: 38, proteins_100g: 2, carbs_100g: 6.5, fats_100g: 0.5, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 300 },
  { id: 'dt_1936', name: 'Pasta al pomodoro pronta in busta', category: 'Piatti Pronti', kcal_100g: 135, proteins_100g: 4.5, carbs_100g: 25, fats_100g: 2, fiber_100g: 2, sugar_100g: 4.5, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_1937', name: 'Riso in busta pronto (basmati/thai)', category: 'Piatti Pronti', kcal_100g: 128, proteins_100g: 2.7, carbs_100g: 27.5, fats_100g: 0.4, fiber_100g: 0.8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 300 },
  { id: 'dt_1938', name: 'Bastoncini di pesce surgelati', category: 'Piatti Pronti', kcal_100g: 199, proteins_100g: 12.5, carbs_100g: 18.5, fats_100g: 9, fiber_100g: 0.8, sugar_100g: 1.5, fatSat_100g: 1.5, serving_size_g: 300 },

  // ─── Bevande ───
  { id: 'dt_1939', name: 'Succo di arancia 100% frutta', category: 'Bevande', kcal_100g: 38, proteins_100g: 0.7, carbs_100g: 8.8, fats_100g: 0.2, fiber_100g: 0.2, sugar_100g: 7.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1940', name: 'Succo di mela 100% frutta', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.1, carbs_100g: 11.5, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 10.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1941', name: 'Tè verde in foglie (infuso)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.2, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1942', name: 'Tè nero in foglie (infuso)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0.1, carbs_100g: 0.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Alcolici ───
  { id: 'dt_1943', name: 'Birra chiara (330mL)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 3.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 3.6, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_1944', name: 'Vino rosso (125mL)', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_1945', name: 'Vino bianco secco (125mL)', category: 'Bevande', kcal_100g: 83, proteins_100g: 0.1, carbs_100g: 0.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Verdure ───
  { id: 'dt_1946', name: 'Valerianella / Songino', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.8, carbs_100g: 2.1, fats_100g: 0.4, fiber_100g: 1.5, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1947', name: 'Cipollotto / Cipolla verde', category: 'Verdure', kcal_100g: 27, proteins_100g: 1.8, carbs_100g: 5.8, fats_100g: 0.2, fiber_100g: 2.6, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1948', name: 'Cavolo romanesco', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.5, carbs_100g: 4.9, fats_100g: 0.3, fiber_100g: 2.5, sugar_100g: 2.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1949', name: 'Finocchio selvatico (fresco)', category: 'Verdure', kcal_100g: 31, proteins_100g: 2.8, carbs_100g: 2, fats_100g: 0.6, fiber_100g: 5.3, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1950', name: 'Peperoncino fresco rosso', category: 'Verdure', kcal_100g: 40, proteins_100g: 2, carbs_100g: 8.8, fats_100g: 0.4, fiber_100g: 1.5, sugar_100g: 5.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1951', name: 'Zenzero fresco (radice)', category: 'Verdure', kcal_100g: 80, proteins_100g: 1.8, carbs_100g: 17.8, fats_100g: 0.8, fiber_100g: 2, sugar_100g: 1.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1952', name: 'Curcuma fresca (radice)', category: 'Verdure', kcal_100g: 354, proteins_100g: 7.8, carbs_100g: 64.9, fats_100g: 9.9, fiber_100g: 21.1, sugar_100g: 3.8, fatSat_100g: 0.6, serving_size_g: 200 },
  { id: 'dt_1953', name: 'Ravanello fresco', category: 'Verdure', kcal_100g: 16, proteins_100g: 0.7, carbs_100g: 3.4, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1954', name: 'Crescione d\'acqua', category: 'Verdure', kcal_100g: 11, proteins_100g: 2.3, carbs_100g: 1.3, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_1955', name: 'Nasturzio (fiori e foglie)', category: 'Verdure', kcal_100g: 28, proteins_100g: 2.1, carbs_100g: 5.1, fats_100g: 0.5, fiber_100g: 1.8, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta secca ───
  { id: 'dt_1956', name: 'Datteri secchi (Medjool o simili)', category: 'Frutta', kcal_100g: 282, proteins_100g: 2.5, carbs_100g: 74.9, fats_100g: 0.4, fiber_100g: 8, sugar_100g: 63.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1957', name: 'Mirtilli essiccati', category: 'Frutta', kcal_100g: 308, proteins_100g: 0.5, carbs_100g: 77, fats_100g: 1, fiber_100g: 5.5, sugar_100g: 72, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Frutta fresca ───
  { id: 'dt_1958', name: 'Castagne fresche', category: 'Frutta', kcal_100g: 174, proteins_100g: 2.9, carbs_100g: 36.7, fats_100g: 1.7, fiber_100g: 4.7, sugar_100g: 8.9, fatSat_100g: 0.1, serving_size_g: 150 },

  // ─── Frutta secca ───
  { id: 'dt_1959', name: 'Castagne secche', category: 'Frutta', kcal_100g: 354, proteins_100g: 4.4, carbs_100g: 72.9, fats_100g: 2, fiber_100g: 14, sugar_100g: 47, fatSat_100g: 0.2, serving_size_g: 150 },

  // ─── Cereali e derivati ───
  { id: 'dt_1960', name: 'Farina di castagne', category: 'Cereali', kcal_100g: 362, proteins_100g: 5.5, carbs_100g: 77.8, fats_100g: 3.7, fiber_100g: 9.4, sugar_100g: 32.3, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Frutta fresca ───
  { id: 'dt_1961', name: 'Ribes rosso fresco', category: 'Frutta', kcal_100g: 50, proteins_100g: 1.4, carbs_100g: 13.8, fats_100g: 0.2, fiber_100g: 4.3, sugar_100g: 7.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1962', name: 'Frutto della passione / Maracuja', category: 'Frutta', kcal_100g: 97, proteins_100g: 2.2, carbs_100g: 23.4, fats_100g: 0.7, fiber_100g: 10.4, sugar_100g: 11.2, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_1963', name: 'Lychee fresco', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.8, carbs_100g: 16.5, fats_100g: 0.4, fiber_100g: 1.3, sugar_100g: 15.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_1964', name: 'Carambola / Starfruit', category: 'Frutta', kcal_100g: 31, proteins_100g: 1, carbs_100g: 6.7, fats_100g: 0.3, fiber_100g: 2.8, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Legumi ───
  { id: 'dt_1965', name: 'Fave secche sbucciate', category: 'Legumi', kcal_100g: 341, proteins_100g: 26.1, carbs_100g: 60, fats_100g: 1.5, fiber_100g: 19, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_1966', name: 'Piselli secchi', category: 'Legumi', kcal_100g: 285, proteins_100g: 21.7, carbs_100g: 48.2, fats_100g: 2, fiber_100g: 15.7, sugar_100g: 2.9, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_1967', name: 'Fagioli Azuki secchi', category: 'Legumi', kcal_100g: 329, proteins_100g: 19.9, carbs_100g: 62.9, fats_100g: 0.5, fiber_100g: 7.3, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1968', name: 'Fagioli di Spagna secchi', category: 'Legumi', kcal_100g: 280, proteins_100g: 17, carbs_100g: 56.6, fats_100g: 0.9, fiber_100g: 26.1, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1969', name: 'Ceci lessati (in scatola sgocciolati)', category: 'Legumi', kcal_100g: 119, proteins_100g: 7, carbs_100g: 18, fats_100g: 1.9, fiber_100g: 7.6, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_1970', name: 'Lenticchie rosse decorticate secche', category: 'Legumi', kcal_100g: 318, proteins_100g: 23.8, carbs_100g: 56.3, fats_100g: 1.3, fiber_100g: 10.8, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 80 },

  // ─── Formaggi ───
  { id: 'dt_1971', name: 'Emmental / Groviera svizzero', category: 'Latticini', kcal_100g: 380, proteins_100g: 28.4, carbs_100g: 0.4, fats_100g: 29, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 11, serving_size_g: 125 },
  { id: 'dt_1972', name: 'Gruyère stagionato', category: 'Latticini', kcal_100g: 413, proteins_100g: 29.8, carbs_100g: 0.4, fats_100g: 32.3, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 13, serving_size_g: 125 },
  { id: 'dt_1973', name: 'Scamorza fresca bianca', category: 'Latticini', kcal_100g: 270, proteins_100g: 22.5, carbs_100g: 0.5, fats_100g: 20.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 10, serving_size_g: 125 },
  { id: 'dt_1974', name: 'Raclette', category: 'Latticini', kcal_100g: 357, proteins_100g: 25, carbs_100g: 0.5, fats_100g: 28.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 11.5, serving_size_g: 125 },
  { id: 'dt_1975', name: 'Edam (formaggio olandese)', category: 'Latticini', kcal_100g: 357, proteins_100g: 25, carbs_100g: 0.4, fats_100g: 27.8, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 12.5, serving_size_g: 125 },
  { id: 'dt_1976', name: 'Gouda stagionato', category: 'Latticini', kcal_100g: 356, proteins_100g: 24.9, carbs_100g: 2.2, fats_100g: 27.4, fiber_100g: 0, sugar_100g: 2.2, fatSat_100g: 13.1, serving_size_g: 125 },

  // ─── Latticini alternativi ───
  { id: 'dt_1977', name: 'Yogurt di soia naturale non zuccherato', category: 'Latticini', kcal_100g: 59, proteins_100g: 3.5, carbs_100g: 6, fats_100g: 2, fiber_100g: 0.5, sugar_100g: 3.5, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_1978', name: 'Yogurt vegetale al cocco naturale', category: 'Latticini', kcal_100g: 90, proteins_100g: 0.8, carbs_100g: 10, fats_100g: 7, fiber_100g: 0.5, sugar_100g: 7.5, fatSat_100g: 4.5, serving_size_g: 100 },
  { id: 'dt_1979', name: 'Bevanda di avena non zuccherata', category: 'Latticini', kcal_100g: 44, proteins_100g: 1, carbs_100g: 6.6, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 0.1, serving_size_g: 100 },
  { id: 'dt_1980', name: 'Bevanda di riso non zuccherata', category: 'Latticini', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.2, fats_100g: 1, fiber_100g: 0.3, sugar_100g: 5.1, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Latticini ───
  { id: 'dt_1981', name: 'Panna fresca da cucina (30% grassi)', category: 'Latticini', kcal_100g: 292, proteins_100g: 2.7, carbs_100g: 4, fats_100g: 30, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 19, serving_size_g: 125 },
  { id: 'dt_1982', name: 'Panna acida (sour cream)', category: 'Latticini', kcal_100g: 193, proteins_100g: 2.1, carbs_100g: 4.5, fats_100g: 19, fiber_100g: 0, sugar_100g: 3.8, fatSat_100g: 11.5, serving_size_g: 125 },
  { id: 'dt_1983', name: 'Crème fraîche (40% grassi)', category: 'Latticini', kcal_100g: 381, proteins_100g: 2, carbs_100g: 3.1, fats_100g: 40, fiber_100g: 0, sugar_100g: 3.1, fatSat_100g: 23, serving_size_g: 125 },

  // ─── Cereali ───
  { id: 'dt_1984', name: 'Avena cruda (chicchi interi)', category: 'Cereali', kcal_100g: 389, proteins_100g: 16.9, carbs_100g: 66.3, fats_100g: 6.9, fiber_100g: 10.6, sugar_100g: 1, fatSat_100g: 1.2, serving_size_g: 80 },
  { id: 'dt_1985', name: 'Miglio crudo (chicchi)', category: 'Cereali', kcal_100g: 378, proteins_100g: 11, carbs_100g: 72.9, fats_100g: 4.2, fiber_100g: 8.5, sugar_100g: 1, fatSat_100g: 0.9, serving_size_g: 80 },
  { id: 'dt_1986', name: 'Sorgo crudo (chicchi)', category: 'Cereali', kcal_100g: 339, proteins_100g: 11.3, carbs_100g: 74.6, fats_100g: 3.3, fiber_100g: 6.7, sugar_100g: 2, fatSat_100g: 0.6, serving_size_g: 80 },
  { id: 'dt_1987', name: 'Teff crudo (grano etiope)', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73.1, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_1988', name: 'Amaranto crudo', category: 'Cereali', kcal_100g: 371, proteins_100g: 13.6, carbs_100g: 65.3, fats_100g: 7, fiber_100g: 6.7, sugar_100g: 1.7, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_1989', name: 'Riso Basmati bianco crudo', category: 'Cereali', kcal_100g: 349, proteins_100g: 7.1, carbs_100g: 79.3, fats_100g: 0.6, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_1990', name: 'Riso Jasmine bianco crudo', category: 'Cereali', kcal_100g: 350, proteins_100g: 7, carbs_100g: 79.5, fats_100g: 0.5, fiber_100g: 0.4, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_1991', name: 'Gnocchi di patate freschi', category: 'Cereali', kcal_100g: 136, proteins_100g: 3, carbs_100g: 28.5, fats_100g: 1, fiber_100g: 1.5, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 80 },

  // ─── Semi oleosi ───
  { id: 'dt_1992', name: 'Semi di lino interi crudi', category: 'Frutta secca', kcal_100g: 534, proteins_100g: 18.3, carbs_100g: 28.9, fats_100g: 42.2, fiber_100g: 27.3, sugar_100g: 1.5, fatSat_100g: 3.7, serving_size_g: 100 },
  { id: 'dt_1993', name: 'Semi di chia crudi', category: 'Frutta secca', kcal_100g: 486, proteins_100g: 16.5, carbs_100g: 42.1, fats_100g: 30.7, fiber_100g: 34.4, sugar_100g: 0.3, fatSat_100g: 3.3, serving_size_g: 100 },
  { id: 'dt_1994', name: 'Semi di zucca crudi (pepitas)', category: 'Frutta secca', kcal_100g: 559, proteins_100g: 30.2, carbs_100g: 10.7, fats_100g: 49.1, fiber_100g: 6, sugar_100g: 1.4, fatSat_100g: 5.6, serving_size_g: 100 },
  { id: 'dt_1995', name: 'Semi di girasole crudi sbucciati', category: 'Frutta secca', kcal_100g: 584, proteins_100g: 20.8, carbs_100g: 20, fats_100g: 51.5, fiber_100g: 8.6, sugar_100g: 2.4, fatSat_100g: 4.5, serving_size_g: 100 },
  { id: 'dt_1996', name: 'Semi di sesamo crudi', category: 'Frutta secca', kcal_100g: 573, proteins_100g: 17.7, carbs_100g: 23.4, fats_100g: 49.7, fiber_100g: 11.8, sugar_100g: 0.3, fatSat_100g: 7, serving_size_g: 100 },

  // ─── Frutta secca a guscio ───
  { id: 'dt_1997', name: 'Noci del Brasile crude', category: 'Frutta', kcal_100g: 659, proteins_100g: 14.3, carbs_100g: 11.7, fats_100g: 67.1, fiber_100g: 7.5, sugar_100g: 2.3, fatSat_100g: 15.1, serving_size_g: 150 },
  { id: 'dt_1998', name: 'Noci di Macadamia crude', category: 'Frutta', kcal_100g: 718, proteins_100g: 7.9, carbs_100g: 13.8, fats_100g: 75.8, fiber_100g: 8.6, sugar_100g: 1.3, fatSat_100g: 12.1, serving_size_g: 150 },

  // ─── Piatti pronti ───
  { id: 'dt_1999', name: 'Arancino / Arancina di riso (fritto)', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 6, carbs_100g: 26, fats_100g: 8, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 3, serving_size_g: 300 },
  { id: 'dt_2000', name: 'Supplì romano al telefono (fritto)', category: 'Piatti Pronti', kcal_100g: 200, proteins_100g: 6.5, carbs_100g: 24, fats_100g: 9, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2001', name: 'Pizza margherita artigianale (cotta al forno)', category: 'Piatti Pronti', kcal_100g: 235, proteins_100g: 9, carbs_100g: 29, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4.5, serving_size_g: 300 },
  { id: 'dt_2002', name: 'Lasagna al forno artigianale (bovino/maiale)', category: 'Piatti Pronti', kcal_100g: 160, proteins_100g: 8.5, carbs_100g: 16, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2003', name: 'Risotto ai funghi porcini (cotto)', category: 'Piatti Pronti', kcal_100g: 115, proteins_100g: 3.5, carbs_100g: 18, fats_100g: 3.5, fiber_100g: 1.2, sugar_100g: 1, fatSat_100g: 0.8, serving_size_g: 300 },
  { id: 'dt_2004', name: 'Pasta e fagioli (minestra)', category: 'Piatti Pronti', kcal_100g: 95, proteins_100g: 5, carbs_100g: 14, fats_100g: 2.5, fiber_100g: 3.5, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2005', name: 'Ribollita toscana (zuppa pane/fagioli/cavolo)', category: 'Piatti Pronti', kcal_100g: 80, proteins_100g: 3.5, carbs_100g: 12, fats_100g: 2.5, fiber_100g: 3, sugar_100g: 0.8, fatSat_100g: 0.4, serving_size_g: 300 },
  { id: 'dt_2006', name: 'Pappa al pomodoro (piatto tipico toscano)', category: 'Piatti Pronti', kcal_100g: 90, proteins_100g: 3, carbs_100g: 14, fats_100g: 2.5, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2007', name: 'Canederli tirolesi al formaggio (bolliti)', category: 'Piatti Pronti', kcal_100g: 170, proteins_100g: 7, carbs_100g: 20, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 3.5, fatSat_100g: 2.5, serving_size_g: 300 },
  { id: 'dt_2008', name: 'Gnocchi alla sorrentina (con pomodoro e mozzarella)', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 6, carbs_100g: 18, fats_100g: 5.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 2.5, serving_size_g: 300 },
  { id: 'dt_2009', name: 'Piadina romagnola farcita (prosciutto e squacquerone)', category: 'Piatti Pronti', kcal_100g: 245, proteins_100g: 12, carbs_100g: 26, fats_100g: 11, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 4, serving_size_g: 300 },
  { id: 'dt_2010', name: 'Focaccia farcita (olive e pomodoro secco)', category: 'Piatti Pronti', kcal_100g: 260, proteins_100g: 7.5, carbs_100g: 37, fats_100g: 9.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 2, serving_size_g: 300 },

  // ─── Dolci ───
  { id: 'dt_2011', name: 'Cannolo siciliano (ricotta e canditi)', category: 'Dolci e Zuccheri', kcal_100g: 325, proteins_100g: 8, carbs_100g: 39, fats_100g: 16, fiber_100g: 1, sugar_100g: 35, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2012', name: 'Crostata artigianale alla marmellata (fetta 100g)', category: 'Dolci e Zuccheri', kcal_100g: 350, proteins_100g: 5.5, carbs_100g: 52, fats_100g: 14, fiber_100g: 1.5, sugar_100g: 30, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2013', name: 'Panettone artigianale (con uvetta e canditi)', category: 'Dolci e Zuccheri', kcal_100g: 370, proteins_100g: 7, carbs_100g: 55, fats_100g: 15, fiber_100g: 1.5, sugar_100g: 40, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2014', name: 'Colomba pasquale artigianale', category: 'Dolci e Zuccheri', kcal_100g: 385, proteins_100g: 8, carbs_100g: 56, fats_100g: 16, fiber_100g: 2, sugar_100g: 38, fatSat_100g: 8, serving_size_g: 50 },
  { id: 'dt_2015', name: 'Tiramisù artigianale (mascarpone/uova/savoiardi)', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 6.5, carbs_100g: 27, fats_100g: 18, fiber_100g: 0.2, sugar_100g: 27, fatSat_100g: 10, serving_size_g: 50 },
  { id: 'dt_2016', name: 'Seadas / Sebadas sarde (con formaggio e miele)', category: 'Dolci e Zuccheri', kcal_100g: 370, proteins_100g: 8.5, carbs_100g: 48, fats_100g: 17, fiber_100g: 1.5, sugar_100g: 40, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2017', name: 'Struffoli napoletani (con miele e canditi)', category: 'Dolci e Zuccheri', kcal_100g: 410, proteins_100g: 6.5, carbs_100g: 60, fats_100g: 18, fiber_100g: 1, sugar_100g: 52, fatSat_100g: 4.5, serving_size_g: 50 },

  // ─── Verdure ───
  { id: 'dt_2018', name: 'Caponata siciliana (agrodolce con melanzane)', category: 'Verdure', kcal_100g: 90, proteins_100g: 1.8, carbs_100g: 9, fats_100g: 5.5, fiber_100g: 3, sugar_100g: 5.5, fatSat_100g: 0.3, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_2019', name: 'Baccalà fritto in pastella', category: 'Proteine', kcal_100g: 200, proteins_100g: 18, carbs_100g: 13, fats_100g: 9, fiber_100g: 0.5, sugar_100g: 3.5, fatSat_100g: 1.5, serving_size_g: 150 },

  // ─── Piatti pronti ───
  { id: 'dt_2020', name: 'Tramezzino al tonno e maionese (industriale)', category: 'Piatti Pronti', kcal_100g: 230, proteins_100g: 10, carbs_100g: 27, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 4.5, fatSat_100g: 3, serving_size_g: 300 },

  // ─── Carni e derivati ───
  { id: 'dt_2021', name: 'Cotoletta alla milanese fritta (vitello impanato)', category: 'Proteine', kcal_100g: 295, proteins_100g: 22, carbs_100g: 16, fats_100g: 16, fiber_100g: 0.5, sugar_100g: 3, fatSat_100g: 5.5, serving_size_g: 150 },
  { id: 'dt_2022', name: 'Polpette di carne al sugo (bovino/maiale)', category: 'Proteine', kcal_100g: 195, proteins_100g: 15, carbs_100g: 10, fats_100g: 11, fiber_100g: 0.8, sugar_100g: 3, fatSat_100g: 4, serving_size_g: 150 },

  // ─── Salumi ───
  { id: 'dt_2023', name: 'Cotechino (cotto)', category: 'Salumi e Insaccati', kcal_100g: 380, proteins_100g: 18, carbs_100g: 1, fats_100g: 33, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 12, serving_size_g: 100 },
  { id: 'dt_2024', name: 'Zampone (cotto)', category: 'Salumi e Insaccati', kcal_100g: 400, proteins_100g: 17, carbs_100g: 1, fats_100g: 35, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 13, serving_size_g: 100 },
  { id: 'dt_2025', name: 'Soppressata (salame schiacciato del Sud)', category: 'Salumi e Insaccati', kcal_100g: 450, proteins_100g: 22, carbs_100g: 1, fats_100g: 38, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 15, serving_size_g: 100 },
  { id: 'dt_2026', name: 'Capicola / Coppa Piacentina DOP', category: 'Salumi e Insaccati', kcal_100g: 280, proteins_100g: 24, carbs_100g: 0.5, fats_100g: 18, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 7.5, serving_size_g: 100 },
  { id: 'dt_2027', name: 'Finocchiona (salame al finocchio toscano)', category: 'Salumi e Insaccati', kcal_100g: 430, proteins_100g: 22, carbs_100g: 2, fats_100g: 36, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 14, serving_size_g: 100 },

  // ─── Pesce ───
  { id: 'dt_2028', name: 'Polpo alla luciana (cotto con olive e capperi)', category: 'Proteine', kcal_100g: 120, proteins_100g: 16, carbs_100g: 4.5, fats_100g: 4.5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2029', name: 'Pesce azzurro misto fritto in olio EVO', category: 'Proteine', kcal_100g: 245, proteins_100g: 18, carbs_100g: 10, fats_100g: 15, fiber_100g: 0.3, sugar_100g: 2.5, fatSat_100g: 2.5, serving_size_g: 150 },
  { id: 'dt_2030', name: 'Alici fresche marinate al limone', category: 'Proteine', kcal_100g: 150, proteins_100g: 20, carbs_100g: 1.5, fats_100g: 7.5, fiber_100g: 0, sugar_100g: 0.8, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_2031', name: 'Tonno fresco grigliato (senza olio)', category: 'Proteine', kcal_100g: 145, proteins_100g: 31, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2032', name: 'Baccalà dissalato al vapore', category: 'Proteine', kcal_100g: 110, proteins_100g: 25, carbs_100g: 0, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2033', name: 'Cozze in guazzetto (al pomodoro)', category: 'Proteine', kcal_100g: 90, proteins_100g: 11, carbs_100g: 4.5, fats_100g: 2.5, fiber_100g: 0.5, sugar_100g: 2, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2034', name: 'Sarde al forno in porchetta (con finocchietto)', category: 'Proteine', kcal_100g: 180, proteins_100g: 20, carbs_100g: 2.5, fats_100g: 9.5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 1.5, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2035', name: 'Pomodori pelati (in scatola)', category: 'Verdure', kcal_100g: 21, proteins_100g: 1.1, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 1.4, sugar_100g: 2.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2036', name: 'Broccolo romano', category: 'Verdure', kcal_100g: 26, proteins_100g: 3, carbs_100g: 3.6, fats_100g: 0.3, fiber_100g: 2.8, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2037', name: 'Friggitello (peperone friggitello)', category: 'Verdure', kcal_100g: 22, proteins_100g: 1.2, carbs_100g: 4.6, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2038', name: 'Funghi porcini freschi', category: 'Verdure', kcal_100g: 25, proteins_100g: 3.7, carbs_100g: 4.4, fats_100g: 0.7, fiber_100g: 2.5, sugar_100g: 1.6, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_2039', name: 'Funghi porcini secchi', category: 'Verdure', kcal_100g: 280, proteins_100g: 19, carbs_100g: 47, fats_100g: 3.5, fiber_100g: 28, sugar_100g: 7, fatSat_100g: 0.8, serving_size_g: 200 },

  // ─── Crostacei ───
  { id: 'dt_2040', name: 'Scampi crudi', category: 'Proteine', kcal_100g: 77, proteins_100g: 14.7, carbs_100g: 0.3, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 100 },

  // ─── Carni rosse ───
  { id: 'dt_2041', name: 'Costata di manzo', category: 'Proteine', kcal_100g: 175, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 10.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 4, serving_size_g: 100 },
  { id: 'dt_2042', name: 'Hamburger di manzo crudo', category: 'Proteine', kcal_100g: 218, proteins_100g: 17.5, carbs_100g: 0, fats_100g: 16.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 6.5, serving_size_g: 100 },

  // ─── Formaggi ───
  { id: 'dt_2043', name: 'Formaggio spalmabile (Philadelphia tipo)', category: 'Latticini', kcal_100g: 342, proteins_100g: 6.2, carbs_100g: 3.2, fats_100g: 34, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 21.3, serving_size_g: 125 },
  { id: 'dt_2044', name: 'Primosale (pecorino giovane)', category: 'Latticini', kcal_100g: 295, proteins_100g: 18.5, carbs_100g: 0.5, fats_100g: 24, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14.5, serving_size_g: 125 },
  { id: 'dt_2045', name: 'Gruviera (Gruyère)', category: 'Latticini', kcal_100g: 413, proteins_100g: 29.8, carbs_100g: 0.4, fats_100g: 32.3, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 19.9, serving_size_g: 125 },

  // ─── Cereali e pasta ───
  { id: 'dt_2046', name: 'Segale integrale cruda', category: 'Cereali', kcal_100g: 338, proteins_100g: 14.8, carbs_100g: 69.8, fats_100g: 2.5, fiber_100g: 15.1, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2047', name: 'Avena grains (chicchi interi)', category: 'Cereali', kcal_100g: 389, proteins_100g: 16.9, carbs_100g: 66.3, fats_100g: 6.9, fiber_100g: 10.6, sugar_100g: 0.9, fatSat_100g: 1.3, serving_size_g: 80 },

  // ─── Bevande ───
  { id: 'dt_2048', name: 'Cappuccino (latte intero + caffè)', category: 'Bevande', kcal_100g: 40, proteins_100g: 1.8, carbs_100g: 2.4, fats_100g: 1.6, fiber_100g: 0, sugar_100g: 2.4, fatSat_100g: 0.9, serving_size_g: 200 },
  { id: 'dt_2049', name: 'Orzo solubile / tisana orzo', category: 'Bevande', kcal_100g: 3, proteins_100g: 0.1, carbs_100g: 0.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2050', name: 'Latte di cocco light (in lattina)', category: 'Bevande', kcal_100g: 77, proteins_100g: 1, carbs_100g: 3.3, fats_100g: 8, fiber_100g: 0, sugar_100g: 2.2, fatSat_100g: 7, serving_size_g: 200 },

  // ─── Condimenti ───
  { id: 'dt_2051', name: 'Aceto di vino bianco', category: 'Condimenti e Salse', kcal_100g: 18, proteins_100g: 0.1, carbs_100g: 1.7, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Grassi ───
  { id: 'dt_2052', name: 'Burro chiarificato (ghee)', category: 'Grassi', kcal_100g: 876, proteins_100g: 0.3, carbs_100g: 0, fats_100g: 99.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 60, serving_size_g: 10 },

  // ─── Condimenti ───
  { id: 'dt_2053', name: 'Senape classica (tipo Dijon)', category: 'Condimenti e Salse', kcal_100g: 67, proteins_100g: 4.4, carbs_100g: 6.4, fats_100g: 3.3, fiber_100g: 3.4, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 20 },

  // ─── Dolcificanti ───
  { id: 'dt_2054', name: 'Stevia (estratto in polvere)', category: 'Dolci e Zuccheri', kcal_100g: 0, proteins_100g: 0, carbs_100g: 3.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Dolci ───
  { id: 'dt_2055', name: 'Zucchero di cocco', category: 'Dolci e Zuccheri', kcal_100g: 375, proteins_100g: 1.4, carbs_100g: 90, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 85, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Legumi ───
  { id: 'dt_2056', name: 'Fagioli dall\'occhio secchi', category: 'Legumi', kcal_100g: 336, proteins_100g: 23, carbs_100g: 60, fats_100g: 1, fiber_100g: 11, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2057', name: 'Ceci rossi secchi', category: 'Legumi', kcal_100g: 308, proteins_100g: 19, carbs_100g: 56.5, fats_100g: 4.5, fiber_100g: 13, sugar_100g: 5, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Piatti pronti ───
  { id: 'dt_2058', name: 'Risotto bianco cotto (riso+brodo+olio)', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 2.8, carbs_100g: 24, fats_100g: 3.5, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2059', name: 'Minestrone di verdure miste cotto', category: 'Piatti Pronti', kcal_100g: 42, proteins_100g: 2.2, carbs_100g: 6.5, fats_100g: 1, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 300 },

  // ─── Condimenti ───
  { id: 'dt_2060', name: 'Sugo al pomodoro semplice (olio+pomodoro+basilico)', category: 'Condimenti e Salse', kcal_100g: 68, proteins_100g: 1.5, carbs_100g: 7, fats_100g: 4.5, fiber_100g: 1.8, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 20 },

  // ─── Uova ───
  { id: 'dt_2061', name: 'Frittata di verdure cotta', category: 'Proteine', kcal_100g: 145, proteins_100g: 9.5, carbs_100g: 3.5, fats_100g: 10.5, fiber_100g: 0.8, sugar_100g: 1.5, fatSat_100g: 3.5, serving_size_g: 100 },
  { id: 'dt_2062', name: 'Uova strapazzate con olio', category: 'Proteine', kcal_100g: 165, proteins_100g: 11, carbs_100g: 0.6, fats_100g: 12.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 4.5, serving_size_g: 100 },

  // ─── Carni e derivati ───
  { id: 'dt_2063', name: 'Agnello (coscia) crudo', category: 'Proteine', kcal_100g: 162, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 150 },
  { id: 'dt_2064', name: 'Capretto al forno', category: 'Proteine', kcal_100g: 165, proteins_100g: 26, carbs_100g: 0.3, fats_100g: 7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 150 },
  { id: 'dt_2065', name: 'Cinghiale (selvaggina) crudo', category: 'Proteine', kcal_100g: 122, proteins_100g: 21.5, carbs_100g: 0, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2066', name: 'Cervo (selvaggina) crudo', category: 'Proteine', kcal_100g: 120, proteins_100g: 22, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_2067', name: 'Nasello (merluzzo fresco) al vapore', category: 'Proteine', kcal_100g: 76, proteins_100g: 16.8, carbs_100g: 0, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_2068', name: 'Rombo (pesce) crudo', category: 'Proteine', kcal_100g: 92, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2069', name: 'Cernia cruda', category: 'Proteine', kcal_100g: 88, proteins_100g: 18, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2070', name: 'Palamita cruda', category: 'Proteine', kcal_100g: 148, proteins_100g: 22.5, carbs_100g: 0, fats_100g: 6.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 150 },
  { id: 'dt_2071', name: 'Lampuga cruda', category: 'Proteine', kcal_100g: 98, proteins_100g: 21, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2072', name: 'Ricci di mare (gonadi)', category: 'Proteine', kcal_100g: 107, proteins_100g: 13, carbs_100g: 8.5, fats_100g: 4, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2073', name: 'Finocchio selvatico (foglie)', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.8, carbs_100g: 5, fats_100g: 0.6, fiber_100g: 3.1, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2074', name: 'Bieta da coste cotta', category: 'Verdure', kcal_100g: 19, proteins_100g: 2, carbs_100g: 2.3, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2075', name: 'Indivia riccia cruda', category: 'Verdure', kcal_100g: 16, proteins_100g: 1.3, carbs_100g: 2, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2076', name: 'Ortica (foglie) cotta', category: 'Verdure', kcal_100g: 40, proteins_100g: 6, carbs_100g: 5.5, fats_100g: 0.6, fiber_100g: 4.5, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2077', name: 'Luppolo (germogli) crudi', category: 'Verdure', kcal_100g: 28, proteins_100g: 3.2, carbs_100g: 3.8, fats_100g: 0.5, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2078', name: 'Acetosella (sorrel/romice) cruda', category: 'Verdure', kcal_100g: 22, proteins_100g: 2, carbs_100g: 3.2, fats_100g: 0.7, fiber_100g: 2.9, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2079', name: 'Cicoria di campo cruda', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.7, carbs_100g: 4, fats_100g: 0.3, fiber_100g: 3.1, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali e derivati ───
  { id: 'dt_2080', name: 'Orzo perlato cotto', category: 'Cereali', kcal_100g: 123, proteins_100g: 2.3, carbs_100g: 28.2, fats_100g: 0.4, fiber_100g: 3.8, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2081', name: 'Farro cotto (spelta)', category: 'Cereali', kcal_100g: 130, proteins_100g: 5.5, carbs_100g: 27, fats_100g: 1, fiber_100g: 3, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2082', name: 'Kamut® (grano Khorasan) cotto', category: 'Cereali', kcal_100g: 148, proteins_100g: 5.5, carbs_100g: 30.5, fats_100g: 1, fiber_100g: 2.5, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2083', name: 'Sorgho cotto', category: 'Cereali', kcal_100g: 123, proteins_100g: 4, carbs_100g: 25.5, fats_100g: 1.3, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Legumi ───
  { id: 'dt_2084', name: 'Seitan al naturale (glutine di frumento)', category: 'Legumi', kcal_100g: 140, proteins_100g: 25, carbs_100g: 4, fats_100g: 2, fiber_100g: 0.6, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_2085', name: 'Tofu affumicato (tofu duro)', category: 'Legumi', kcal_100g: 132, proteins_100g: 15, carbs_100g: 3.5, fats_100g: 7, fiber_100g: 0.3, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2086', name: 'Tofu fritto (aburage)', category: 'Legumi', kcal_100g: 270, proteins_100g: 17, carbs_100g: 3.5, fats_100g: 20.5, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_2087', name: 'Edamame (soia verde) cotti', category: 'Legumi', kcal_100g: 121, proteins_100g: 11.9, carbs_100g: 8.9, fats_100g: 5.2, fiber_100g: 5.2, sugar_100g: 3, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2088', name: 'Lenticchie rosse decorticate cotte', category: 'Legumi', kcal_100g: 116, proteins_100g: 9, carbs_100g: 20.1, fats_100g: 0.4, fiber_100g: 5.5, sugar_100g: 2.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2089', name: 'Lenticchie beluga (nere) cotte', category: 'Legumi', kcal_100g: 116, proteins_100g: 9, carbs_100g: 20, fats_100g: 0.5, fiber_100g: 8, sugar_100g: 2, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Frutta secca ───
  { id: 'dt_2090', name: 'Arachidi tostate senza sale', category: 'Frutta', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 3.6, fatSat_100g: 6.9, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_2091', name: 'Burro di arachidi (naturale, senza zucchero)', category: 'Condimenti e Salse', kcal_100g: 588, proteins_100g: 25, carbs_100g: 16, fats_100g: 50.5, fiber_100g: 6, sugar_100g: 6, fatSat_100g: 10.5, serving_size_g: 20 },
  { id: 'dt_2092', name: 'Burro di mandorle (crema di mandorle)', category: 'Condimenti e Salse', kcal_100g: 614, proteins_100g: 21, carbs_100g: 19, fats_100g: 55.5, fiber_100g: 10.5, sugar_100g: 5, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2093', name: 'Burro di sesamo (tahini)', category: 'Condimenti e Salse', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9.3, sugar_100g: 1.5, fatSat_100g: 4.5, serving_size_g: 20 },

  // ─── Verdure cotte ───
  { id: 'dt_2094', name: 'Spinaci lessati', category: 'Verdure', kcal_100g: 29, proteins_100g: 3.8, carbs_100g: 4.4, fats_100g: 0.3, fiber_100g: 2.2, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Legumi cotti ───
  { id: 'dt_2095', name: 'Fagioli cannellini lessi', category: 'Legumi', kcal_100g: 97, proteins_100g: 6.8, carbs_100g: 16, fats_100g: 0.5, fiber_100g: 8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2096', name: 'Lenticchie lesse', category: 'Legumi', kcal_100g: 105, proteins_100g: 9, carbs_100g: 20.1, fats_100g: 0.4, fiber_100g: 7.9, sugar_100g: 1.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2097', name: 'Ceci lessati', category: 'Legumi', kcal_100g: 120, proteins_100g: 7.5, carbs_100g: 20, fats_100g: 2, fiber_100g: 7, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2098', name: 'Fagioli borlotti lessati', category: 'Legumi', kcal_100g: 110, proteins_100g: 7.5, carbs_100g: 20.5, fats_100g: 0.5, fiber_100g: 8.5, sugar_100g: 0.8, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2099', name: 'Piselli lessati', category: 'Legumi', kcal_100g: 84, proteins_100g: 5.4, carbs_100g: 15.6, fats_100g: 0.4, fiber_100g: 5.1, sugar_100g: 4, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Carni cotte ───
  { id: 'dt_2100', name: 'Pollo arrosto (senza pelle)', category: 'Proteine', kcal_100g: 189, proteins_100g: 27.5, carbs_100g: 0, fats_100g: 8.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 100 },

  // ─── Uova cotte ───
  { id: 'dt_2101', name: 'Uova sode', category: 'Proteine', kcal_100g: 155, proteins_100g: 12.6, carbs_100g: 1.1, fats_100g: 10.6, fiber_100g: 0, sugar_100g: 1.1, fatSat_100g: 3.5, serving_size_g: 100 },

  // ─── Pesce cotto ───
  { id: 'dt_2102', name: 'Sogliola al forno', category: 'Proteine', kcal_100g: 85, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },

  // ─── Verdure cotte ───
  { id: 'dt_2103', name: 'Broccoli lessati', category: 'Verdure', kcal_100g: 27, proteins_100g: 2.5, carbs_100g: 5.2, fats_100g: 0.3, fiber_100g: 2.6, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2104', name: 'Patate lesse', category: 'Verdure', kcal_100g: 74, proteins_100g: 1.9, carbs_100g: 17, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2105', name: 'Carote lesse', category: 'Verdure', kcal_100g: 27, proteins_100g: 0.8, carbs_100g: 6.5, fats_100g: 0.2, fiber_100g: 3, sugar_100g: 5.2, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Piatti pronti ───
  { id: 'dt_2106', name: 'Minestrone di verdure', category: 'Piatti Pronti', kcal_100g: 45, proteins_100g: 2.2, carbs_100g: 6.6, fats_100g: 1.2, fiber_100g: 2.1, sugar_100g: 2.8, fatSat_100g: 0.2, serving_size_g: 300 },
  { id: 'dt_2107', name: 'Ribollita (zuppa toscana)', category: 'Piatti Pronti', kcal_100g: 82, proteins_100g: 3.5, carbs_100g: 12, fats_100g: 2, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 300 },
  { id: 'dt_2108', name: 'Pappa al pomodoro', category: 'Piatti Pronti', kcal_100g: 76, proteins_100g: 2.5, carbs_100g: 11.5, fats_100g: 2.2, fiber_100g: 1.8, sugar_100g: 2.5, fatSat_100g: 0.4, serving_size_g: 300 },

  // ─── Condimenti ───
  { id: 'dt_2109', name: 'Ragù alla bolognese', category: 'Condimenti e Salse', kcal_100g: 177, proteins_100g: 12, carbs_100g: 7, fats_100g: 11.5, fiber_100g: 0.8, sugar_100g: 2, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2110', name: 'Sugo al pomodoro artigianale', category: 'Condimenti e Salse', kcal_100g: 52, proteins_100g: 2, carbs_100g: 6.5, fats_100g: 2, fiber_100g: 1.5, sugar_100g: 4.8, fatSat_100g: 0.3, serving_size_g: 20 },

  // ─── Dolci ───
  { id: 'dt_2111', name: 'Cornetto (brioche vuoto)', category: 'Dolci e Zuccheri', kcal_100g: 362, proteins_100g: 7.5, carbs_100g: 48, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 14, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2112', name: 'Crostata di frutta fresca', category: 'Dolci e Zuccheri', kcal_100g: 238, proteins_100g: 4.5, carbs_100g: 34.5, fats_100g: 9, fiber_100g: 1.5, sugar_100g: 22.5, fatSat_100g: 4, serving_size_g: 50 },

  // ─── Salumi cotti ───
  { id: 'dt_2113', name: 'Cotechino cotto', category: 'Salumi e Insaccati', kcal_100g: 315, proteins_100g: 15, carbs_100g: 0.2, fats_100g: 27, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 11, serving_size_g: 100 },

  // ─── Carni cotte ───
  { id: 'dt_2114', name: 'Trippa alla romana', category: 'Proteine', kcal_100g: 115, proteins_100g: 11, carbs_100g: 4.5, fats_100g: 6.5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 2.5, serving_size_g: 100 },

  // ─── Cereali cotti ───
  { id: 'dt_2115', name: 'Polenta cotta (gialla)', category: 'Cereali', kcal_100g: 70, proteins_100g: 1.8, carbs_100g: 14.8, fats_100g: 0.5, fiber_100g: 1.4, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 100 },
  { id: 'dt_2116', name: 'Risotto bianco (base)', category: 'Cereali', kcal_100g: 142, proteins_100g: 3.5, carbs_100g: 24, fats_100g: 4, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Cereali e derivati ───
  { id: 'dt_2117', name: 'Farina di grano tenero tipo 0', category: 'Cereali', kcal_100g: 364, proteins_100g: 11.5, carbs_100g: 74.8, fats_100g: 1.4, fiber_100g: 2.8, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2118', name: 'Farina di grano tenero tipo 1', category: 'Cereali', kcal_100g: 352, proteins_100g: 12, carbs_100g: 70.5, fats_100g: 1.8, fiber_100g: 4.5, sugar_100g: 1.8, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2119', name: 'Farina di grano tenero tipo 2', category: 'Cereali', kcal_100g: 340, proteins_100g: 12.5, carbs_100g: 67, fats_100g: 2, fiber_100g: 6.5, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2120', name: 'Semola rimacinata di grano duro', category: 'Cereali', kcal_100g: 356, proteins_100g: 12.5, carbs_100g: 73.8, fats_100g: 1, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Formaggi ───
  { id: 'dt_2121', name: 'Ricotta salata', category: 'Latticini', kcal_100g: 334, proteins_100g: 16.5, carbs_100g: 3.5, fats_100g: 21.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 12, serving_size_g: 125 },

  // ─── Frutta fresca ───
  { id: 'dt_2122', name: 'Nettarina fresca (pesca noce)', category: 'Frutta', kcal_100g: 44, proteins_100g: 1.1, carbs_100g: 10.5, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 8.5, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2123', name: 'Pomodori secchi al sole', category: 'Verdure', kcal_100g: 258, proteins_100g: 14, carbs_100g: 55.8, fats_100g: 3, fiber_100g: 12.3, sugar_100g: 30, fatSat_100g: 0.5, serving_size_g: 200 },
  { id: 'dt_2124', name: 'Pomodori secchi sott\'olio', category: 'Verdure', kcal_100g: 213, proteins_100g: 5, carbs_100g: 16, fats_100g: 14, fiber_100g: 4, sugar_100g: 8, fatSat_100g: 0.4, serving_size_g: 200 },

  // ─── Cereali ───
  { id: 'dt_2125', name: 'Frumento tenero (grano) chicchi interi', category: 'Cereali', kcal_100g: 319, proteins_100g: 12.3, carbs_100g: 60.9, fats_100g: 2.5, fiber_100g: 12.7, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_2126', name: 'Grano duro (chicchi interi)', category: 'Cereali', kcal_100g: 316, proteins_100g: 13, carbs_100g: 61.9, fats_100g: 2.9, fiber_100g: 9.8, sugar_100g: 2, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Grassi e oli ───
  { id: 'dt_2127', name: 'Olio di soia', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 15, serving_size_g: 10 },

  // ─── Pane ───
  { id: 'dt_2128', name: 'Friselle (pane biscottato pugliese)', category: 'Pane e Prodotti da Forno', kcal_100g: 377, proteins_100g: 10.5, carbs_100g: 74, fats_100g: 3, fiber_100g: 3.5, sugar_100g: 4, fatSat_100g: 0.4, serving_size_g: 100 },

  // ─── Bevande ───
  { id: 'dt_2129', name: 'Succo di pompelmo fresco', category: 'Bevande', kcal_100g: 38, proteins_100g: 0.5, carbs_100g: 9.2, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 7.4, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_2130', name: 'Acciughe sotto sale', category: 'Proteine', kcal_100g: 175, proteins_100g: 19.7, carbs_100g: 0, fats_100g: 9.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 150 },

  // ─── Latte e derivati ───
  { id: 'dt_2131', name: 'Latte intero in polvere', category: 'Latticini', kcal_100g: 500, proteins_100g: 26, carbs_100g: 39, fats_100g: 27, fiber_100g: 0, sugar_100g: 39, fatSat_100g: 20, serving_size_g: 125 },
  { id: 'dt_2132', name: 'Latte scremato in polvere', category: 'Latticini', kcal_100g: 357, proteins_100g: 35.6, carbs_100g: 52, fats_100g: 0.8, fiber_100g: 0, sugar_100g: 52, fatSat_100g: 0.1, serving_size_g: 125 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2133', name: 'Gallette di mais (non al sale)', category: 'Pane e Prodotti da Forno', kcal_100g: 358, proteins_100g: 7.5, carbs_100g: 75, fats_100g: 3.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.5, serving_size_g: 30 },

  // ─── Cereali e derivati ───
  { id: 'dt_2134', name: 'Tortellini freschi all\'uovo', category: 'Cereali', kcal_100g: 326, proteins_100g: 13, carbs_100g: 55.5, fats_100g: 6, fiber_100g: 1.8, sugar_100g: 1.5, fatSat_100g: 1.2, serving_size_g: 80 },
  { id: 'dt_2135', name: 'Ravioli freschi di carne', category: 'Cereali', kcal_100g: 230, proteins_100g: 10.5, carbs_100g: 31.5, fats_100g: 6.5, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 1.5, serving_size_g: 80 },
  { id: 'dt_2136', name: 'Lasagna all\'uovo secca', category: 'Cereali', kcal_100g: 368, proteins_100g: 12.5, carbs_100g: 67, fats_100g: 4.2, fiber_100g: 2.2, sugar_100g: 2, fatSat_100g: 1.4, serving_size_g: 80 },

  // ─── Dolci ───
  { id: 'dt_2137', name: 'Zucchero a velo', category: 'Dolci e Zuccheri', kcal_100g: 394, proteins_100g: 0, carbs_100g: 99.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 99, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Bevande ───
  { id: 'dt_2138', name: 'Acqua minerale gasata', category: 'Bevande', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2139', name: 'Succo di limone (solo succo)', category: 'Bevande', kcal_100g: 22, proteins_100g: 0.4, carbs_100g: 6.9, fats_100g: 0.3, fiber_100g: 0.3, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Pesce ───
  { id: 'dt_2140', name: 'Acciughe sotto sale dissalate', category: 'Proteine', kcal_100g: 120, proteins_100g: 20.5, carbs_100g: 0, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2141', name: 'Triglia', category: 'Proteine', kcal_100g: 127, proteins_100g: 19.3, carbs_100g: 0, fats_100g: 5.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.2, serving_size_g: 150 },
  { id: 'dt_2142', name: 'Carpa', category: 'Proteine', kcal_100g: 127, proteins_100g: 17.8, carbs_100g: 0, fats_100g: 5.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2143', name: 'Suro (sugarello)', category: 'Proteine', kcal_100g: 118, proteins_100g: 20.1, carbs_100g: 0, fats_100g: 4.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.8, serving_size_g: 150 },

  // ─── Salumi e insaccati ───
  { id: 'dt_2144', name: 'Wurstel di suino', category: 'Salumi e Insaccati', kcal_100g: 298, proteins_100g: 11.5, carbs_100g: 1.5, fats_100g: 25.5, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 9, serving_size_g: 50 },

  // ─── Latte e derivati ───
  { id: 'dt_2145', name: 'Latte di capra intero fresco', category: 'Latticini', kcal_100g: 72, proteins_100g: 3.6, carbs_100g: 4.5, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 2.7, serving_size_g: 125 },
  { id: 'dt_2146', name: 'Latte di pecora intero fresco', category: 'Latticini', kcal_100g: 105, proteins_100g: 5.5, carbs_100g: 5.1, fats_100g: 6.8, fiber_100g: 0, sugar_100g: 5.1, fatSat_100g: 4.2, serving_size_g: 125 },
  { id: 'dt_2147', name: 'Yogurt di capra', category: 'Latticini', kcal_100g: 63, proteins_100g: 3.6, carbs_100g: 4.5, fats_100g: 3.8, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 2.5, serving_size_g: 125 },

  // ─── Dolci ───
  { id: 'dt_2148', name: 'Pan di Spagna', category: 'Dolci e Zuccheri', kcal_100g: 321, proteins_100g: 8, carbs_100g: 55.5, fats_100g: 8, fiber_100g: 1, sugar_100g: 22, fatSat_100g: 2.5, serving_size_g: 50 },

  // ─── Frutta conservata ───
  { id: 'dt_2149', name: 'Pesche sciroppate', category: 'Frutta', kcal_100g: 82, proteins_100g: 0.5, carbs_100g: 20.5, fats_100g: 0.1, fiber_100g: 1, sugar_100g: 18, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2150', name: 'Albicocche sciroppate', category: 'Frutta', kcal_100g: 73, proteins_100g: 0.5, carbs_100g: 18.5, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 16, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2151', name: 'Portulaca', category: 'Verdure', kcal_100g: 21, proteins_100g: 1.7, carbs_100g: 3.5, fats_100g: 0.4, fiber_100g: 0.9, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2152', name: 'Scarola (indivia scarola)', category: 'Verdure', kcal_100g: 17, proteins_100g: 1.7, carbs_100g: 2.5, fats_100g: 0.2, fiber_100g: 3.1, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2153', name: 'Germogli di alfa alfa (alfalfa)', category: 'Verdure', kcal_100g: 23, proteins_100g: 4, carbs_100g: 2.1, fats_100g: 0.7, fiber_100g: 1.9, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_2154', name: 'Lampone fresco', category: 'Frutta', kcal_100g: 34, proteins_100g: 1.2, carbs_100g: 5.4, fats_100g: 0.7, fiber_100g: 6.5, sugar_100g: 4.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2155', name: 'Mora di rovo fresca', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.6, fats_100g: 0.5, fiber_100g: 5.3, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2156', name: 'Fragoline di bosco', category: 'Frutta', kcal_100g: 31, proteins_100g: 0.9, carbs_100g: 7.1, fats_100g: 0.4, fiber_100g: 2.2, sugar_100g: 5.4, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2157', name: 'Gelso nero fresco', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.8, fats_100g: 0.4, fiber_100g: 1.7, sugar_100g: 8.1, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2158', name: 'Gelso bianco fresco', category: 'Frutta', kcal_100g: 43, proteins_100g: 1.4, carbs_100g: 9.8, fats_100g: 0.4, fiber_100g: 1.7, sugar_100g: 8.1, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2159', name: 'Uva spina fresca', category: 'Frutta', kcal_100g: 44, proteins_100g: 0.9, carbs_100g: 10.5, fats_100g: 0.6, fiber_100g: 4.3, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2160', name: 'Mirtillo rosso (lingonberry) fresco', category: 'Frutta', kcal_100g: 46, proteins_100g: 0.4, carbs_100g: 12.2, fats_100g: 0.5, fiber_100g: 4.2, sugar_100g: 5.3, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2161', name: 'Mela cotogna fresca', category: 'Frutta', kcal_100g: 57, proteins_100g: 0.4, carbs_100g: 15.3, fats_100g: 0.1, fiber_100g: 1.9, sugar_100g: 8.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2162', name: 'Giuggiola fresca', category: 'Frutta', kcal_100g: 79, proteins_100g: 1.2, carbs_100g: 20.2, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 18.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2163', name: 'Nespola comune (medlar) fresca', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 11.1, fats_100g: 0.3, fiber_100g: 3, sugar_100g: 9.2, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2164', name: 'Azzeruolo fresco', category: 'Frutta', kcal_100g: 89, proteins_100g: 0.4, carbs_100g: 23, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 16, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Pesce ───
  { id: 'dt_2165', name: 'Lavarello (coregone) fresco', category: 'Proteine', kcal_100g: 100, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 2.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2166', name: 'Tinca fresca', category: 'Proteine', kcal_100g: 105, proteins_100g: 17.9, carbs_100g: 0, fats_100g: 4.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2167', name: 'Alborella fresca', category: 'Proteine', kcal_100g: 96, proteins_100g: 17, carbs_100g: 0, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2168', name: 'Agone fresco', category: 'Proteine', kcal_100g: 148, proteins_100g: 18, carbs_100g: 0, fats_100g: 8.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_2169', name: 'Storione fresco', category: 'Proteine', kcal_100g: 105, proteins_100g: 16.1, carbs_100g: 0, fats_100g: 4.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2170', name: 'Stoccafisso secco (non ammollato)', category: 'Proteine', kcal_100g: 312, proteins_100g: 72.5, carbs_100g: 0, fats_100g: 2.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2171', name: 'Tellina (vongola comune) fresca', category: 'Proteine', kcal_100g: 72, proteins_100g: 12.8, carbs_100g: 3.6, fats_100g: 1.7, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0.2, serving_size_g: 150 },

  // ─── Carne e derivati ───
  { id: 'dt_2172', name: 'Chiocciole (lumache di terra) crude', category: 'Proteine', kcal_100g: 90, proteins_100g: 16.5, carbs_100g: 2, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Carni ───
  { id: 'dt_2173', name: 'Fagiano intero eviscerato crudo', category: 'Proteine', kcal_100g: 144, proteins_100g: 24.3, carbs_100g: 0, fats_100g: 5.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 100 },
  { id: 'dt_2174', name: 'Pernice (starna) cruda', category: 'Proteine', kcal_100g: 120, proteins_100g: 24, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_2175', name: 'Lepre cruda', category: 'Proteine', kcal_100g: 107, proteins_100g: 21.2, carbs_100g: 0, fats_100g: 2.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_2176', name: 'Daino coscia cruda', category: 'Proteine', kcal_100g: 103, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Erbe aromatiche ───
  { id: 'dt_2177', name: 'Dragoncello fresco (estragone)', category: 'Condimenti e Salse', kcal_100g: 295, proteins_100g: 22.8, carbs_100g: 50.2, fats_100g: 7.2, fiber_100g: 7.4, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2178', name: 'Cerfoglio fresco', category: 'Condimenti e Salse', kcal_100g: 40, proteins_100g: 3.5, carbs_100g: 5.9, fats_100g: 0.6, fiber_100g: 3.3, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2179', name: 'Aneto fresco', category: 'Condimenti e Salse', kcal_100g: 43, proteins_100g: 3.5, carbs_100g: 7, fats_100g: 1.1, fiber_100g: 2.1, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2180', name: 'Maggiorana fresca', category: 'Condimenti e Salse', kcal_100g: 271, proteins_100g: 12.7, carbs_100g: 42.5, fats_100g: 7, fiber_100g: 40.3, sugar_100g: 4.1, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2181', name: 'Origano fresco', category: 'Condimenti e Salse', kcal_100g: 265, proteins_100g: 9, carbs_100g: 43, fats_100g: 4.3, fiber_100g: 10.3, sugar_100g: 4.1, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Formaggi ───
  { id: 'dt_2182', name: 'Provola affumicata', category: 'Latticini', kcal_100g: 335, proteins_100g: 25, carbs_100g: 0.5, fats_100g: 25.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_2183', name: 'Ricotta affumicata', category: 'Latticini', kcal_100g: 220, proteins_100g: 18.5, carbs_100g: 2, fats_100g: 15.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8, serving_size_g: 125 },
  { id: 'dt_2184', name: 'Ricotta romana (di pecora)', category: 'Latticini', kcal_100g: 158, proteins_100g: 11.4, carbs_100g: 3.2, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 3.2, fatSat_100g: 6, serving_size_g: 125 },
  { id: 'dt_2185', name: 'Fiordilatte (mozzarella vaccina fresca)', category: 'Latticini', kcal_100g: 250, proteins_100g: 17.9, carbs_100g: 0.7, fats_100g: 19, fiber_100g: 0, sugar_100g: 0.7, fatSat_100g: 12, serving_size_g: 125 },

  // ─── Latte e derivati ───
  { id: 'dt_2186', name: 'Latte di bufala intero', category: 'Latticini', kcal_100g: 97, proteins_100g: 4.5, carbs_100g: 5.1, fats_100g: 7.5, fiber_100g: 0, sugar_100g: 5.1, fatSat_100g: 4.8, serving_size_g: 125 },

  // ─── Formaggi ───
  { id: 'dt_2187', name: 'Ricotta di capra', category: 'Latticini', kcal_100g: 145, proteins_100g: 9.5, carbs_100g: 3.5, fats_100g: 11, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 7.5, serving_size_g: 125 },

  // ─── Pesce ───
  { id: 'dt_2188', name: 'Grongo fresco', category: 'Proteine', kcal_100g: 109, proteins_100g: 16.3, carbs_100g: 0, fats_100g: 4.7, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 150 },
  { id: 'dt_2189', name: 'Ombrina fresca', category: 'Proteine', kcal_100g: 85, proteins_100g: 17.8, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2190', name: 'Pesce San Pietro fresco', category: 'Proteine', kcal_100g: 90, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 1.4, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2191', name: 'Leccia amia fresca', category: 'Proteine', kcal_100g: 121, proteins_100g: 19.8, carbs_100g: 0, fats_100g: 4.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2192', name: 'Passera di mare fresca', category: 'Proteine', kcal_100g: 78, proteins_100g: 15.5, carbs_100g: 0, fats_100g: 1.3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2193', name: 'Mormora fresca', category: 'Proteine', kcal_100g: 90, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_2194', name: 'Saragò (sargo) fresco', category: 'Proteine', kcal_100g: 95, proteins_100g: 19, carbs_100g: 0, fats_100g: 2.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_2195', name: 'Occhiata fresca', category: 'Proteine', kcal_100g: 88, proteins_100g: 18.2, carbs_100g: 0, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2196', name: 'Zerro fresco', category: 'Proteine', kcal_100g: 93, proteins_100g: 19, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 150 },
  { id: 'dt_2197', name: 'Aguglia fresca', category: 'Proteine', kcal_100g: 98, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2198', name: 'Pagello fragolino fresco', category: 'Proteine', kcal_100g: 105, proteins_100g: 20, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2199', name: 'Boga (boghe) fresca', category: 'Proteine', kcal_100g: 104, proteins_100g: 19.5, carbs_100g: 0, fats_100g: 2.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 150 },
  { id: 'dt_2200', name: 'Murena fresca', category: 'Proteine', kcal_100g: 107, proteins_100g: 19.8, carbs_100g: 0, fats_100g: 2.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2201', name: 'Gallinacci / Finferli freschi', category: 'Verdure', kcal_100g: 38, proteins_100g: 1.5, carbs_100g: 6.9, fats_100g: 0.5, fiber_100g: 3.8, sugar_100g: 1.1, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_2202', name: 'Funghi Pleurotus / Orecchione freschi', category: 'Verdure', kcal_100g: 33, proteins_100g: 3.3, carbs_100g: 6.1, fats_100g: 0.4, fiber_100g: 2.3, sugar_100g: 2.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2203', name: 'Funghi shiitake secchi', category: 'Verdure', kcal_100g: 296, proteins_100g: 9.7, carbs_100g: 57.6, fats_100g: 1, fiber_100g: 38, sugar_100g: 3.8, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_2204', name: 'Tartufo nero estivo fresco', category: 'Verdure', kcal_100g: 50, proteins_100g: 6, carbs_100g: 8.5, fats_100g: 0.5, fiber_100g: 8.5, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_2205', name: 'Cardi freschi', category: 'Verdure', kcal_100g: 17, proteins_100g: 0.7, carbs_100g: 3.7, fats_100g: 0.1, fiber_100g: 1.6, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2206', name: 'Pomodoro verde acerbo', category: 'Verdure', kcal_100g: 19, proteins_100g: 0.9, carbs_100g: 3.9, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 2.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2207', name: 'Radicchio di Chioggia', category: 'Verdure', kcal_100g: 23, proteins_100g: 1.4, carbs_100g: 3.6, fats_100g: 0.3, fiber_100g: 1.7, sugar_100g: 2.4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2208', name: 'Castagna d\'acqua', category: 'Verdure', kcal_100g: 97, proteins_100g: 1.4, carbs_100g: 23.9, fats_100g: 0.1, fiber_100g: 3, sugar_100g: 4.9, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_2209', name: 'Lime / Limetta fresca', category: 'Frutta', kcal_100g: 30, proteins_100g: 0.7, carbs_100g: 10.5, fats_100g: 0.2, fiber_100g: 2.8, sugar_100g: 1.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2210', name: 'Pompelmo rosa fresco', category: 'Frutta', kcal_100g: 32, proteins_100g: 0.8, carbs_100g: 8.3, fats_100g: 0.1, fiber_100g: 1.4, sugar_100g: 7.5, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Legumi ───
  { id: 'dt_2211', name: 'Fave lessate', category: 'Legumi', kcal_100g: 110, proteins_100g: 7.6, carbs_100g: 19.7, fats_100g: 0.5, fiber_100g: 7, sugar_100g: 2.5, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_2212', name: 'Avena soffiata', category: 'Cereali', kcal_100g: 374, proteins_100g: 14.9, carbs_100g: 69.9, fats_100g: 7.2, fiber_100g: 6.5, sugar_100g: 0, fatSat_100g: 1.3, serving_size_g: 80 },
  { id: 'dt_2213', name: 'Mais da pop corn (chicchi secchi)', category: 'Cereali', kcal_100g: 358, proteins_100g: 8.1, carbs_100g: 74.3, fats_100g: 3.8, fiber_100g: 7.3, sugar_100g: 0.6, fatSat_100g: 0.6, serving_size_g: 80 },
  { id: 'dt_2214', name: 'Popcorn soffiato non condito', category: 'Cereali', kcal_100g: 387, proteins_100g: 12.1, carbs_100g: 77.9, fats_100g: 4.5, fiber_100g: 14.5, sugar_100g: 0.7, fatSat_100g: 0.6, serving_size_g: 80 },

  // ─── Carni e derivati ───
  { id: 'dt_2215', name: 'Quaglie intere eviscerate crude', category: 'Proteine', kcal_100g: 111, proteins_100g: 21.8, carbs_100g: 0, fats_100g: 2.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.6, serving_size_g: 150 },
  { id: 'dt_2216', name: 'Gallina (carne, senza pelle)', category: 'Proteine', kcal_100g: 185, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 12.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2, serving_size_g: 150 },
  { id: 'dt_2217', name: 'Lingua di manzo', category: 'Proteine', kcal_100g: 192, proteins_100g: 16, carbs_100g: 0, fats_100g: 14, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5, serving_size_g: 150 },
  { id: 'dt_2218', name: 'Animelle di vitello', category: 'Proteine', kcal_100g: 121, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 6.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2219', name: 'Cuore di manzo', category: 'Proteine', kcal_100g: 118, proteins_100g: 19.5, carbs_100g: 0.2, fats_100g: 4.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1, serving_size_g: 150 },
  { id: 'dt_2220', name: 'Rognone di vitello (rene)', category: 'Proteine', kcal_100g: 96, proteins_100g: 17, carbs_100g: 0, fats_100g: 3, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.7, serving_size_g: 150 },

  // ─── Grassi e oli ───
  { id: 'dt_2221', name: 'Olio di vinaccioli (semi di uva)', category: 'Grassi', kcal_100g: 900, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9.6, serving_size_g: 10 },
  { id: 'dt_2222', name: 'Olio di palma', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 49.3, serving_size_g: 10 },
  { id: 'dt_2223', name: 'Olio di cocco vergine', category: 'Grassi', kcal_100g: 892, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 86.5, serving_size_g: 10 },

  // ─── Cereali e derivati ───
  { id: 'dt_2224', name: 'Farina di soia intera', category: 'Cereali', kcal_100g: 374, proteins_100g: 36.8, carbs_100g: 25, fats_100g: 17, fiber_100g: 11.9, sugar_100g: 0, fatSat_100g: 2.5, serving_size_g: 80 },
  { id: 'dt_2225', name: 'Farina di farro', category: 'Cereali', kcal_100g: 339, proteins_100g: 14.5, carbs_100g: 67, fats_100g: 2.5, fiber_100g: 7.5, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_2226', name: 'Farina di segale integrale', category: 'Cereali', kcal_100g: 325, proteins_100g: 10.8, carbs_100g: 69.5, fats_100g: 1.7, fiber_100g: 11.5, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2227', name: 'Farina di grano tenero tipo 2', category: 'Cereali', kcal_100g: 343, proteins_100g: 12.5, carbs_100g: 70.3, fats_100g: 1.8, fiber_100g: 4.5, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2228', name: 'Farina di canapa decorticata', category: 'Cereali', kcal_100g: 357, proteins_100g: 30.8, carbs_100g: 27.8, fats_100g: 10.5, fiber_100g: 9.8, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 80 },

  // ─── Ortaggi ───
  { id: 'dt_2229', name: 'Pastinaca cruda', category: 'Verdure', kcal_100g: 75, proteins_100g: 1.4, carbs_100g: 17.9, fats_100g: 0.5, fiber_100g: 4.9, sugar_100g: 4.8, fatSat_100g: 0.1, serving_size_g: 200 },
  { id: 'dt_2230', name: 'Rapa (navone) cruda', category: 'Verdure', kcal_100g: 28, proteins_100g: 0.9, carbs_100g: 6.4, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2231', name: 'Rapa rossa (barbabietola) cruda', category: 'Verdure', kcal_100g: 43, proteins_100g: 1.6, carbs_100g: 9.6, fats_100g: 0.1, fiber_100g: 2.8, sugar_100g: 6.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2232', name: 'Topinambur crudo', category: 'Verdure', kcal_100g: 73, proteins_100g: 2, carbs_100g: 17.4, fats_100g: 0, fiber_100g: 1.6, sugar_100g: 9.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2233', name: 'Crescione d\'acqua fresco', category: 'Verdure', kcal_100g: 22, proteins_100g: 2.3, carbs_100g: 1.3, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 0.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2234', name: 'Acetosella fresca (Rumex acetosa)', category: 'Verdure', kcal_100g: 22, proteins_100g: 2, carbs_100g: 3.2, fats_100g: 0.3, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2235', name: 'Broccoletti cime di rapa', category: 'Verdure', kcal_100g: 25, proteins_100g: 2.9, carbs_100g: 2.6, fats_100g: 0.3, fiber_100g: 2.6, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2236', name: 'Ortiche fresche (foglie)', category: 'Verdure', kcal_100g: 42, proteins_100g: 7.2, carbs_100g: 7.5, fats_100g: 0.5, fiber_100g: 6.9, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta ───
  { id: 'dt_2237', name: 'Nespola del Giappone (loquat) fresca', category: 'Frutta', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 12.1, fats_100g: 0.2, fiber_100g: 1.7, sugar_100g: 7.3, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2238', name: 'Corbezzolo (arbutus) fresco', category: 'Frutta', kcal_100g: 34, proteins_100g: 0.6, carbs_100g: 9.9, fats_100g: 0.2, fiber_100g: 3.3, sugar_100g: 9.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2239', name: 'Sorbo domestico fresco', category: 'Frutta', kcal_100g: 66, proteins_100g: 0.7, carbs_100g: 17, fats_100g: 0.2, fiber_100g: 2.7, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2240', name: 'Carambola (star fruit) fresca', category: 'Frutta', kcal_100g: 31, proteins_100g: 1, carbs_100g: 6.7, fats_100g: 0.3, fiber_100g: 2.8, sugar_100g: 3.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2241', name: 'Feijoa fresca', category: 'Frutta', kcal_100g: 55, proteins_100g: 1.2, carbs_100g: 12.4, fats_100g: 0.6, fiber_100g: 6.4, sugar_100g: 3.7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Formaggi ───
  { id: 'dt_2242', name: 'Pecorino sardo stagionato', category: 'Latticini', kcal_100g: 392, proteins_100g: 25.5, carbs_100g: 0, fats_100g: 31.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 22, serving_size_g: 125 },
  { id: 'dt_2243', name: 'Ragusano DOP', category: 'Latticini', kcal_100g: 385, proteins_100g: 25, carbs_100g: 0, fats_100g: 30.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 21, serving_size_g: 125 },
  { id: 'dt_2244', name: 'Canestrato pugliese', category: 'Latticini', kcal_100g: 388, proteins_100g: 24.8, carbs_100g: 0, fats_100g: 31, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 21.5, serving_size_g: 125 },
  { id: 'dt_2245', name: 'Murazzano DOP (pecorino piemontese)', category: 'Latticini', kcal_100g: 290, proteins_100g: 20.5, carbs_100g: 0.5, fats_100g: 22, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 13.5, serving_size_g: 125 },

  // ─── Pesce ───
  { id: 'dt_2246', name: 'Mazzancolla (gambero imperiale) cruda', category: 'Proteine', kcal_100g: 73, proteins_100g: 14.7, carbs_100g: 0, fats_100g: 0.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_2247', name: 'Granchio comune crudo', category: 'Proteine', kcal_100g: 78, proteins_100g: 16.5, carbs_100g: 0, fats_100g: 1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_2248', name: 'Canestrello (mollusco) fresco', category: 'Proteine', kcal_100g: 68, proteins_100g: 12.7, carbs_100g: 2.6, fats_100g: 1.1, fiber_100g: 0, sugar_100g: 2.6, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_2249', name: 'Fasolaro (Callista chione) fresco', category: 'Proteine', kcal_100g: 65, proteins_100g: 10.2, carbs_100g: 3.5, fats_100g: 1, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_2250', name: 'Cicala di mare (Scyllarus)', category: 'Proteine', kcal_100g: 90, proteins_100g: 18, carbs_100g: 0, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2251', name: 'Tartufo di mare (Venerupis decussata)', category: 'Proteine', kcal_100g: 62, proteins_100g: 10.5, carbs_100g: 2.8, fats_100g: 1, fiber_100g: 0, sugar_100g: 2.8, fatSat_100g: 0.2, serving_size_g: 150 },
  { id: 'dt_2252', name: 'Cannolicchio (Ensis siliqua) fresco', category: 'Proteine', kcal_100g: 60, proteins_100g: 10.8, carbs_100g: 3, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 0.1, serving_size_g: 150 },
  { id: 'dt_2253', name: 'Dattero di mare (Lithophaga) fresco', category: 'Proteine', kcal_100g: 75, proteins_100g: 13, carbs_100g: 2.5, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 150 },

  // ─── Bevande ───
  { id: 'dt_2254', name: 'Acqua di cocco pura (non da concentrato)', category: 'Bevande', kcal_100g: 19, proteins_100g: 0.7, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 2.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2255', name: 'Vino cotto (sapa/mosto cotto)', category: 'Bevande', kcal_100g: 258, proteins_100g: 0.5, carbs_100g: 64, fats_100g: 0, fiber_100g: 0, sugar_100g: 63, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2256', name: 'Succo di bergamotto puro', category: 'Bevande', kcal_100g: 28, proteins_100g: 0.5, carbs_100g: 7.2, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 3.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Legumi ───
  { id: 'dt_2257', name: 'Fave fresche (con baccello)', category: 'Legumi', kcal_100g: 41, proteins_100g: 5, carbs_100g: 6, fats_100g: 0.4, fiber_100g: 4.2, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 80 },
  { id: 'dt_2258', name: 'Fave secche decorticate', category: 'Legumi', kcal_100g: 318, proteins_100g: 26, carbs_100g: 55, fats_100g: 1.5, fiber_100g: 8, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2259', name: 'Cicerchie secche', category: 'Legumi', kcal_100g: 295, proteins_100g: 25, carbs_100g: 56.8, fats_100g: 0.8, fiber_100g: 5.8, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2260', name: 'Lupini ammollati e salati', category: 'Legumi', kcal_100g: 119, proteins_100g: 15.6, carbs_100g: 10.9, fats_100g: 5.1, fiber_100g: 2, sugar_100g: 0, fatSat_100g: 0.9, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2261', name: 'Riso Venere (riso nero) crudo', category: 'Cereali', kcal_100g: 357, proteins_100g: 8.5, carbs_100g: 74.5, fats_100g: 3, fiber_100g: 4.5, sugar_100g: 0.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2262', name: 'Riso rosso fermentato', category: 'Cereali', kcal_100g: 346, proteins_100g: 8, carbs_100g: 74.7, fats_100g: 2, fiber_100g: 3, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_2263', name: 'Teff crudo (cereale etiope)', category: 'Cereali', kcal_100g: 367, proteins_100g: 13.3, carbs_100g: 73.1, fats_100g: 2.4, fiber_100g: 8, sugar_100g: 1.8, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_2264', name: 'Sorgo in chicchi crudo', category: 'Cereali', kcal_100g: 329, proteins_100g: 10.6, carbs_100g: 69, fats_100g: 3.5, fiber_100g: 6.3, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 80 },
  { id: 'dt_2265', name: 'Farro monococco crudo', category: 'Cereali', kcal_100g: 340, proteins_100g: 14.5, carbs_100g: 68.5, fats_100g: 2, fiber_100g: 7.5, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2266', name: 'Farro dicocco crudo', category: 'Cereali', kcal_100g: 338, proteins_100g: 13, carbs_100g: 68.5, fats_100g: 2, fiber_100g: 7, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Semi e frutta secca ───
  { id: 'dt_2267', name: 'Semi di canapa decorticati', category: 'Frutta secca', kcal_100g: 553, proteins_100g: 31.6, carbs_100g: 8.7, fats_100g: 48.7, fiber_100g: 4, sugar_100g: 1.1, fatSat_100g: 3.8, serving_size_g: 30 },
  { id: 'dt_2268', name: 'Noci di Macadamia crude', category: 'Frutta secca', kcal_100g: 718, proteins_100g: 7.9, carbs_100g: 13.8, fats_100g: 75.8, fiber_100g: 8.6, sugar_100g: 4.6, fatSat_100g: 12.1, serving_size_g: 30 },
  { id: 'dt_2269', name: 'Noci pecan crude', category: 'Frutta secca', kcal_100g: 691, proteins_100g: 9.2, carbs_100g: 13.9, fats_100g: 72, fiber_100g: 9.6, sugar_100g: 3.9, fatSat_100g: 6.2, serving_size_g: 30 },
  { id: 'dt_2270', name: 'Pistacchi tostati non salati', category: 'Frutta secca', kcal_100g: 594, proteins_100g: 21.4, carbs_100g: 27.2, fats_100g: 45.4, fiber_100g: 10.3, sugar_100g: 7.7, fatSat_100g: 5.9, serving_size_g: 30 },
  { id: 'dt_2271', name: 'Arachidi crude non tostate', category: 'Frutta secca', kcal_100g: 567, proteins_100g: 25.8, carbs_100g: 16.1, fats_100g: 49.2, fiber_100g: 8.5, sugar_100g: 3.9, fatSat_100g: 7, serving_size_g: 30 },
  { id: 'dt_2272', name: 'Mandorle crude con pelle', category: 'Frutta secca', kcal_100g: 578, proteins_100g: 21.1, carbs_100g: 19.7, fats_100g: 49.9, fiber_100g: 12.5, sugar_100g: 3.9, fatSat_100g: 3.8, serving_size_g: 30 },
  { id: 'dt_2273', name: 'Noci brasiliane crude', category: 'Frutta secca', kcal_100g: 659, proteins_100g: 14.3, carbs_100g: 11.7, fats_100g: 67.1, fiber_100g: 7.5, sugar_100g: 2.3, fatSat_100g: 15.1, serving_size_g: 30 },

  // ─── Alimenti vari ───
  { id: 'dt_2274', name: 'Alga nori essiccata', category: 'Proteine', kcal_100g: 35, proteins_100g: 5.8, carbs_100g: 5.1, fats_100g: 0.3, fiber_100g: 3.5, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_2275', name: 'Alga wakame essiccata', category: 'Proteine', kcal_100g: 45, proteins_100g: 3, carbs_100g: 9.1, fats_100g: 0.6, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 100 },
  { id: 'dt_2276', name: 'Alga kombu essiccata', category: 'Proteine', kcal_100g: 43, proteins_100g: 1.7, carbs_100g: 9.6, fats_100g: 0.6, fiber_100g: 1.3, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_2277', name: 'Aceto di mele biologico non filtrato', category: 'Condimenti e Salse', kcal_100g: 22, proteins_100g: 0, carbs_100g: 5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.4, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2278', name: 'Miso (pasta di soia fermentata)', category: 'Condimenti e Salse', kcal_100g: 200, proteins_100g: 12, carbs_100g: 26.5, fats_100g: 6, fiber_100g: 5.4, sugar_100g: 3.2, fatSat_100g: 1, serving_size_g: 20 },
  { id: 'dt_2279', name: 'Tahini (pasta di sesamo)', category: 'Condimenti e Salse', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9.3, sugar_100g: 0.5, fatSat_100g: 8.1, serving_size_g: 20 },
  { id: 'dt_2280', name: 'Harissa (salsa piccante nordafricana)', category: 'Condimenti e Salse', kcal_100g: 90, proteins_100g: 3.8, carbs_100g: 9.8, fats_100g: 5.5, fiber_100g: 4.5, sugar_100g: 3.5, fatSat_100g: 1.3, serving_size_g: 20 },

  // ─── Formaggi ───
  { id: 'dt_2281', name: 'Piave DOP (stagionato)', category: 'Latticini', kcal_100g: 390, proteins_100g: 30, carbs_100g: 0, fats_100g: 27, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 18.5, serving_size_g: 125 },
  { id: 'dt_2282', name: 'Pecorino toscano DOP semi-stagionato', category: 'Latticini', kcal_100g: 355, proteins_100g: 28, carbs_100g: 0, fats_100g: 27.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 19.5, serving_size_g: 125 },
  { id: 'dt_2283', name: 'Cacioricotta fresco', category: 'Latticini', kcal_100g: 230, proteins_100g: 16.5, carbs_100g: 1.5, fats_100g: 15.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 9.5, serving_size_g: 125 },
  { id: 'dt_2284', name: 'Scamorza bianca fresca', category: 'Latticini', kcal_100g: 334, proteins_100g: 24, carbs_100g: 0.5, fats_100g: 25, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 15, serving_size_g: 125 },
  { id: 'dt_2285', name: 'Valtellina Casera DOP', category: 'Latticini', kcal_100g: 360, proteins_100g: 27, carbs_100g: 0, fats_100g: 25.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16.5, serving_size_g: 125 },
  { id: 'dt_2286', name: 'Asiago pressato DOP', category: 'Latticini', kcal_100g: 326, proteins_100g: 25.5, carbs_100g: 1.5, fats_100g: 22.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14, serving_size_g: 125 },

  // ─── Carni e derivati ───
  { id: 'dt_2287', name: 'Braciola di maiale (bistecca lombo)', category: 'Proteine', kcal_100g: 172, proteins_100g: 20.8, carbs_100g: 0, fats_100g: 9.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.2, serving_size_g: 150 },
  { id: 'dt_2288', name: 'Costine di maiale crude', category: 'Proteine', kcal_100g: 292, proteins_100g: 17.5, carbs_100g: 0, fats_100g: 25, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7.5, serving_size_g: 150 },
  { id: 'dt_2289', name: 'Pollo coscia con pelle cruda', category: 'Proteine', kcal_100g: 215, proteins_100g: 18.5, carbs_100g: 0, fats_100g: 15.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.5, serving_size_g: 150 },
  { id: 'dt_2290', name: 'Tacchino intero con pelle crudo', category: 'Proteine', kcal_100g: 218, proteins_100g: 17.5, carbs_100g: 0, fats_100g: 16.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3, serving_size_g: 150 },
  { id: 'dt_2291', name: 'Maiale pancetta magra', category: 'Proteine', kcal_100g: 215, proteins_100g: 17.5, carbs_100g: 0, fats_100g: 15.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 3.5, serving_size_g: 150 },

  // ─── Verdure ───
  { id: 'dt_2292', name: 'Taccola (pisello mangiatutto) fresca', category: 'Verdure', kcal_100g: 42, proteins_100g: 2.8, carbs_100g: 7.6, fats_100g: 0.2, fiber_100g: 2.6, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2293', name: 'Zucca delica / Butternut cruda', category: 'Verdure', kcal_100g: 40, proteins_100g: 1, carbs_100g: 10.5, fats_100g: 0.1, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2294', name: 'Senape in foglie cruda (Brassica juncea)', category: 'Verdure', kcal_100g: 27, proteins_100g: 2.9, carbs_100g: 4.7, fats_100g: 0.4, fiber_100g: 3.2, sugar_100g: 0.7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2295', name: 'Broccolo romanesco crudo', category: 'Verdure', kcal_100g: 22, proteins_100g: 2.5, carbs_100g: 3.5, fats_100g: 0.3, fiber_100g: 2.4, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2296', name: 'Porro crudo', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.5, carbs_100g: 7.3, fats_100g: 0.3, fiber_100g: 1.8, sugar_100g: 3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2297', name: 'Cavolo cappuccio bianco crudo', category: 'Verdure', kcal_100g: 25, proteins_100g: 1.3, carbs_100g: 5.8, fats_100g: 0.1, fiber_100g: 2.5, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2298', name: 'Cavolo cappuccio rosso crudo', category: 'Verdure', kcal_100g: 31, proteins_100g: 1.5, carbs_100g: 7.4, fats_100g: 0.2, fiber_100g: 2.1, sugar_100g: 4.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2299', name: 'Germogli di soia crudi', category: 'Verdure', kcal_100g: 30, proteins_100g: 3, carbs_100g: 5.9, fats_100g: 0.2, fiber_100g: 1.8, sugar_100g: 2.2, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Frutta fresca ───
  { id: 'dt_2300', name: 'Mela annurca IGP fresca', category: 'Frutta', kcal_100g: 48, proteins_100g: 0.3, carbs_100g: 12.3, fats_100g: 0.1, fiber_100g: 1.8, sugar_100g: 10.9, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2301', name: 'Ribes bianco fresco', category: 'Frutta', kcal_100g: 42, proteins_100g: 1.1, carbs_100g: 12, fats_100g: 0.2, fiber_100g: 4.3, sugar_100g: 5.6, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2302', name: 'Cedro frutto fresco (Citrus medica)', category: 'Frutta', kcal_100g: 30, proteins_100g: 0.7, carbs_100g: 8.5, fats_100g: 0.2, fiber_100g: 3.3, sugar_100g: 2.7, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2303', name: 'Chinotto fresco (Citrus myrtifolia)', category: 'Frutta', kcal_100g: 32, proteins_100g: 0.8, carbs_100g: 7.5, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2304', name: 'Mandarancio fresco', category: 'Frutta', kcal_100g: 48, proteins_100g: 0.8, carbs_100g: 11.5, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 8.5, fatSat_100g: 0, serving_size_g: 150 },
  { id: 'dt_2305', name: 'Pesca tabacchiera fresca', category: 'Frutta', kcal_100g: 39, proteins_100g: 0.9, carbs_100g: 9.5, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 7, fatSat_100g: 0, serving_size_g: 150 },

  // ─── Spezie ───
  { id: 'dt_2306', name: 'Chiodi di garofano in polvere', category: 'Condimenti e Salse', kcal_100g: 274, proteins_100g: 5.5, carbs_100g: 65.5, fats_100g: 13, fiber_100g: 33.9, sugar_100g: 2.6, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2307', name: 'Basilico essiccato', category: 'Condimenti e Salse', kcal_100g: 233, proteins_100g: 22.8, carbs_100g: 47.8, fats_100g: 4, fiber_100g: 37.7, sugar_100g: 1.7, fatSat_100g: 0.4, serving_size_g: 20 },
  { id: 'dt_2308', name: 'Prezzemolo essiccato', category: 'Condimenti e Salse', kcal_100g: 292, proteins_100g: 26.6, carbs_100g: 50.6, fats_100g: 5.5, fiber_100g: 26.7, sugar_100g: 2.5, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_2309', name: 'Peperoncino rosso fresco', category: 'Condimenti e Salse', kcal_100g: 40, proteins_100g: 1.9, carbs_100g: 8.8, fats_100g: 0.4, fiber_100g: 1.5, sugar_100g: 5.3, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_2310', name: 'Aceto balsamico tradizionale DOP (invecchiato)', category: 'Condimenti e Salse', kcal_100g: 88, proteins_100g: 0.5, carbs_100g: 17.1, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 15.6, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Cereali e derivati ───
  { id: 'dt_2311', name: 'Polenta taragna cotta', category: 'Cereali', kcal_100g: 147, proteins_100g: 3.8, carbs_100g: 22.5, fats_100g: 5.5, fiber_100g: 1.2, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 80 },
  { id: 'dt_2312', name: 'Riso Basmati cotto', category: 'Cereali', kcal_100g: 136, proteins_100g: 2.7, carbs_100g: 29.6, fats_100g: 0.4, fiber_100g: 0.6, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2313', name: 'Riso parboiled cotto', category: 'Cereali', kcal_100g: 145, proteins_100g: 2.7, carbs_100g: 31.5, fats_100g: 0.4, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2314', name: 'Farro spelta (grande) cotto', category: 'Cereali', kcal_100g: 127, proteins_100g: 4.9, carbs_100g: 27, fats_100g: 0.9, fiber_100g: 3.9, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2315', name: 'Kamut (frumento khorasan) cotto', category: 'Cereali', kcal_100g: 142, proteins_100g: 5.5, carbs_100g: 29, fats_100g: 0.8, fiber_100g: 3.2, sugar_100g: 0.3, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2316', name: 'Orzo perlato cotto', category: 'Cereali', kcal_100g: 123, proteins_100g: 2.3, carbs_100g: 28.2, fats_100g: 0.4, fiber_100g: 3.8, sugar_100g: 0.1, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2317', name: 'Grano saraceno cotto', category: 'Cereali', kcal_100g: 92, proteins_100g: 3.4, carbs_100g: 19.9, fats_100g: 0.6, fiber_100g: 2.7, sugar_100g: 0.9, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Alcolici ───
  { id: 'dt_2318', name: 'Vino rosato da tavola', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.1, carbs_100g: 2.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Bevande ───
  { id: 'dt_2319', name: 'Succo di pesca 100% (senza zuccheri aggiunti)', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.4, carbs_100g: 11.5, fats_100g: 0.1, fiber_100g: 0.4, sugar_100g: 9.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2320', name: 'Infuso di melissa (non zuccherato)', category: 'Bevande', kcal_100g: 2, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2321', name: 'Infuso di menta piperita (non zuccherato)', category: 'Bevande', kcal_100g: 2, proteins_100g: 0.1, carbs_100g: 0.3, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_2322', name: 'Latte di riso non zuccherato', category: 'Latticini', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.5, fats_100g: 1, fiber_100g: 0.1, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Zuccheri ───
  { id: 'dt_2323', name: 'Glucosio (destrosio)', category: 'Dolci e Zuccheri', kcal_100g: 374, proteins_100g: 0, carbs_100g: 99.7, fats_100g: 0, fiber_100g: 0, sugar_100g: 99, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Cereali da colazione ───
  { id: 'dt_2324', name: 'Fiocchi di farro', category: 'Cereali', kcal_100g: 354, proteins_100g: 14, carbs_100g: 67.5, fats_100g: 2.7, fiber_100g: 8.5, sugar_100g: 3.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2325', name: 'Semola di grano duro cruda', category: 'Cereali', kcal_100g: 360, proteins_100g: 12.5, carbs_100g: 72.5, fats_100g: 1.7, fiber_100g: 4.5, sugar_100g: 0.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2326', name: 'Farina di grano saraceno integrale', category: 'Cereali', kcal_100g: 335, proteins_100g: 12.6, carbs_100g: 70.6, fats_100g: 3.1, fiber_100g: 10, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Cereali da colazione ───
  { id: 'dt_2327', name: 'Riso soffiato (base, non condito)', category: 'Cereali', kcal_100g: 381, proteins_100g: 6.5, carbs_100g: 87.5, fats_100g: 0.5, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2328', name: 'Malto d\'orzo in polvere', category: 'Cereali', kcal_100g: 371, proteins_100g: 11, carbs_100g: 77.4, fats_100g: 2.3, fiber_100g: 6, sugar_100g: 62, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Zuccheri ───
  { id: 'dt_2329', name: 'Sciroppo di glucosio', category: 'Dolci e Zuccheri', kcal_100g: 305, proteins_100g: 0, carbs_100g: 76, fats_100g: 0, fiber_100g: 0, sugar_100g: 76, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Latte e derivati ───
  { id: 'dt_2330', name: 'Latte condensato non zuccherato (evaporato)', category: 'Latticini', kcal_100g: 137, proteins_100g: 6.8, carbs_100g: 10, fats_100g: 8.2, fiber_100g: 0, sugar_100g: 9.7, fatSat_100g: 5.1, serving_size_g: 125 },
  { id: 'dt_2331', name: 'Crema di latte fresca (panna 35%)', category: 'Latticini', kcal_100g: 340, proteins_100g: 2, carbs_100g: 3.1, fats_100g: 35, fiber_100g: 0, sugar_100g: 3.1, fatSat_100g: 20.4, serving_size_g: 125 },

  // ─── Cereali e derivati ───
  { id: 'dt_2332', name: 'Farinata di ceci (piatto tipico genovese cotto)', category: 'Cereali', kcal_100g: 152, proteins_100g: 5.5, carbs_100g: 14.5, fats_100g: 8.5, fiber_100g: 2, sugar_100g: 0.5, fatSat_100g: 0.8, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_2333', name: 'Gelatina in fogli (colla di pesce)', category: 'Condimenti e Salse', kcal_100g: 335, proteins_100g: 84.4, carbs_100g: 0, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Cereali e derivati ───
  { id: 'dt_2334', name: 'Crusca di riso', category: 'Cereali', kcal_100g: 316, proteins_100g: 13.4, carbs_100g: 49.7, fats_100g: 20.8, fiber_100g: 21, sugar_100g: 0, fatSat_100g: 1.8, serving_size_g: 80 },
  { id: 'dt_2335', name: 'Farina di lenticchie rosse', category: 'Cereali', kcal_100g: 340, proteins_100g: 25.7, carbs_100g: 58.5, fats_100g: 1.2, fiber_100g: 11, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2336', name: 'Farina di piselli secchi', category: 'Cereali', kcal_100g: 335, proteins_100g: 21.7, carbs_100g: 60.4, fats_100g: 1.5, fiber_100g: 8.3, sugar_100g: 3, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Spezie e aromi ───
  { id: 'dt_2337', name: 'Anice stellato (badiana)', category: 'Condimenti e Salse', kcal_100g: 337, proteins_100g: 17.6, carbs_100g: 50, fats_100g: 15.9, fiber_100g: 14.6, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_2338', name: 'Pepe di Cayenna (capsicum)', category: 'Condimenti e Salse', kcal_100g: 318, proteins_100g: 12, carbs_100g: 56.6, fats_100g: 17.3, fiber_100g: 27.2, sugar_100g: 0.7, fatSat_100g: 1.9, serving_size_g: 20 },
  { id: 'dt_2339', name: 'Pepe lungo (piper longum)', category: 'Condimenti e Salse', kcal_100g: 310, proteins_100g: 11, carbs_100g: 64.8, fats_100g: 4.9, fiber_100g: 13.2, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 20 },
  { id: 'dt_2340', name: 'Curry in polvere (miscela spezie)', category: 'Condimenti e Salse', kcal_100g: 325, proteins_100g: 12.7, carbs_100g: 55.8, fats_100g: 13.8, fiber_100g: 33.2, sugar_100g: 0.7, fatSat_100g: 2.3, serving_size_g: 20 },
  { id: 'dt_2341', name: 'Garam masala (miscela spezie indiana)', category: 'Condimenti e Salse', kcal_100g: 379, proteins_100g: 14.1, carbs_100g: 50.4, fats_100g: 15, fiber_100g: 22.2, sugar_100g: 1.5, fatSat_100g: 2, serving_size_g: 20 },

  // ─── Condimenti ───
  { id: 'dt_2342', name: 'Pasta di acciughe (tube)', category: 'Condimenti e Salse', kcal_100g: 185, proteins_100g: 18, carbs_100g: 0, fats_100g: 11.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 20 },
  { id: 'dt_2343', name: 'Salsa Worcestershire (inglese)', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 1.1, carbs_100g: 19.5, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10.7, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2344', name: 'Estratto di lievito (tipo Marmite)', category: 'Condimenti e Salse', kcal_100g: 180, proteins_100g: 35.6, carbs_100g: 17.6, fats_100g: 0.7, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Grassi ───
  { id: 'dt_2345', name: 'Olio di mandorle dolci', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 8.2, serving_size_g: 10 },
  { id: 'dt_2346', name: 'Olio di ricino', category: 'Grassi', kcal_100g: 884, proteins_100g: 0, carbs_100g: 0, fats_100g: 99.9, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 2.9, serving_size_g: 10 },

  // ─── Latte e derivati ───
  { id: 'dt_2347', name: 'Panna acida (sour cream 20%)', category: 'Latticini', kcal_100g: 206, proteins_100g: 2.7, carbs_100g: 3.5, fats_100g: 20, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 12.6, serving_size_g: 125 },

  // ─── Zuccheri ───
  { id: 'dt_2348', name: 'Zucchero grezzo di canna (mascobado)', category: 'Dolci e Zuccheri', kcal_100g: 373, proteins_100g: 0.4, carbs_100g: 96, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 83.3, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Snack salati ───
  { id: 'dt_2349', name: 'Patatine fritte in busta (chips classiche)', category: 'Snack e Ultra-Processati', kcal_100g: 536, proteins_100g: 7, carbs_100g: 53, fats_100g: 34, fiber_100g: 2.5, sugar_100g: 0.5, fatSat_100g: 3.1, serving_size_g: 30 },
  { id: 'dt_2350', name: 'Patatine al formaggio (Fonzies/simili)', category: 'Snack e Ultra-Processati', kcal_100g: 510, proteins_100g: 5, carbs_100g: 58, fats_100g: 29, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2351', name: 'Crackers snack con sesamo (tipo MixBowl)', category: 'Snack e Ultra-Processati', kcal_100g: 465, proteins_100g: 9, carbs_100g: 65, fats_100g: 18, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2352', name: 'Pop corn da microonde al burro', category: 'Snack e Ultra-Processati', kcal_100g: 424, proteins_100g: 9, carbs_100g: 52, fats_100g: 22, fiber_100g: 8, sugar_100g: 0, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2353', name: 'Pretzels/grissini salati industriali', category: 'Snack e Ultra-Processati', kcal_100g: 383, proteins_100g: 9.5, carbs_100g: 78, fats_100g: 3, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 30 },
  { id: 'dt_2354', name: 'Nachos/tortilla chips al formaggio', category: 'Snack e Ultra-Processati', kcal_100g: 495, proteins_100g: 7, carbs_100g: 61, fats_100g: 26, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2355', name: 'Crackers Ritz (classici)', category: 'Snack e Ultra-Processati', kcal_100g: 484, proteins_100g: 7, carbs_100g: 66, fats_100g: 21, fiber_100g: 1.5, sugar_100g: 5, fatSat_100g: 4, serving_size_g: 30 },

  // ─── Dolci confezionati ───
  { id: 'dt_2356', name: 'Merendina tipo Crostatina/Merenda (Mulino B.)', category: 'Dolci e Zuccheri', kcal_100g: 405, proteins_100g: 4.5, carbs_100g: 65, fats_100g: 14, fiber_100g: 1, sugar_100g: 27, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2357', name: 'Pan di stelle / biscotti al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 472, proteins_100g: 6, carbs_100g: 67, fats_100g: 19, fiber_100g: 2, sugar_100g: 33, fatSat_100g: 7, serving_size_g: 50 },
  { id: 'dt_2358', name: 'Kinder Bueno (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 566, proteins_100g: 8, carbs_100g: 53, fats_100g: 35, fiber_100g: 1, sugar_100g: 47, fatSat_100g: 18, serving_size_g: 50 },

  // ─── Creme e spalmate ───
  { id: 'dt_2359', name: 'Nutella (crema alla nocciola)', category: 'Condimenti e Salse', kcal_100g: 539, proteins_100g: 6, carbs_100g: 57.5, fats_100g: 30.9, fiber_100g: 3, sugar_100g: 57, fatSat_100g: 10.6, serving_size_g: 100 },

  // ─── Dolci confezionati ───
  { id: 'dt_2360', name: 'Panna cotta industriale confezionata', category: 'Dolci e Zuccheri', kcal_100g: 178, proteins_100g: 3, carbs_100g: 22, fats_100g: 10, fiber_100g: 0, sugar_100g: 18, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2361', name: 'Tiramisù industriale (porzione 100g)', category: 'Dolci e Zuccheri', kcal_100g: 316, proteins_100g: 4.5, carbs_100g: 36, fats_100g: 18, fiber_100g: 0.3, sugar_100g: 30, fatSat_100g: 10, serving_size_g: 50 },
  { id: 'dt_2362', name: 'Torta confezionata al cioccolato (tipo Sacher)', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 5, carbs_100g: 55, fats_100g: 16, fiber_100g: 2, sugar_100g: 48, fatSat_100g: 8, serving_size_g: 50 },
  { id: 'dt_2363', name: 'Brioche industriale (brioches confezionate)', category: 'Dolci e Zuccheri', kcal_100g: 388, proteins_100g: 7.5, carbs_100g: 54, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 20, fatSat_100g: 7, serving_size_g: 50 },
  { id: 'dt_2364', name: 'Croissant/cornetto industriale', category: 'Dolci e Zuccheri', kcal_100g: 397, proteins_100g: 7, carbs_100g: 47, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 15, fatSat_100g: 9, serving_size_g: 50 },
  { id: 'dt_2365', name: 'Wafer al cioccolato (KitKat/simili)', category: 'Dolci e Zuccheri', kcal_100g: 519, proteins_100g: 6.8, carbs_100g: 63, fats_100g: 27, fiber_100g: 1.5, sugar_100g: 55, fatSat_100g: 15, serving_size_g: 50 },
  { id: 'dt_2366', name: 'Biscotti digestive industriali', category: 'Dolci e Zuccheri', kcal_100g: 464, proteins_100g: 6.5, carbs_100g: 63, fats_100g: 20, fiber_100g: 3, sugar_100g: 22, fatSat_100g: 5, serving_size_g: 50 },
  { id: 'dt_2367', name: 'Torta di riso industriale', category: 'Dolci e Zuccheri', kcal_100g: 260, proteins_100g: 5, carbs_100g: 40, fats_100g: 10, fiber_100g: 0.5, sugar_100g: 28, fatSat_100g: 4, serving_size_g: 50 },

  // ─── Gelati ───
  { id: 'dt_2368', name: 'Gelato al cioccolato industriale', category: 'Dolci e Zuccheri', kcal_100g: 216, proteins_100g: 3.5, carbs_100g: 26, fats_100g: 12, fiber_100g: 0.5, sugar_100g: 23, fatSat_100g: 7, serving_size_g: 50 },
  { id: 'dt_2369', name: 'Ghiacciolo alla fragola (tipo Polaretti)', category: 'Dolci e Zuccheri', kcal_100g: 68, proteins_100g: 0, carbs_100g: 17, fats_100g: 0, fiber_100g: 0, sugar_100g: 17, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2370', name: 'Gelato Magnum (cioccolato, stima per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 288, proteins_100g: 3.5, carbs_100g: 27, fats_100g: 20, fiber_100g: 0.8, sugar_100g: 25, fatSat_100g: 13, serving_size_g: 50 },
  { id: 'dt_2371', name: 'Gelato alla crema industriale', category: 'Dolci e Zuccheri', kcal_100g: 185, proteins_100g: 3.5, carbs_100g: 24, fats_100g: 9, fiber_100g: 0, sugar_100g: 20, fatSat_100g: 6, serving_size_g: 50 },

  // ─── Alcolici ───
  { id: 'dt_2372', name: 'Vino rosso (12% vol.)', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.2, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2373', name: 'Vino bianco secco (12% vol.)', category: 'Bevande', kcal_100g: 82, proteins_100g: 0.1, carbs_100g: 2, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2374', name: 'Birra chiara (5% vol.)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 3.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2375', name: 'Birra scura/doppio malto (7% vol.)', category: 'Bevande', kcal_100g: 62, proteins_100g: 0.7, carbs_100g: 5, fats_100g: 0, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2376', name: 'Prosecco / spumante (11% vol.)', category: 'Bevande', kcal_100g: 77, proteins_100g: 0.1, carbs_100g: 3, fats_100g: 0, fiber_100g: 0, sugar_100g: 1.2, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2377', name: 'Vodka (40% vol.)', category: 'Bevande', kcal_100g: 231, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2378', name: 'Whisky/Rum (40% vol.)', category: 'Bevande', kcal_100g: 231, proteins_100g: 0, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2379', name: 'Aperol Spritz (porzione 200mL)', category: 'Bevande', kcal_100g: 76, proteins_100g: 0, carbs_100g: 8, fats_100g: 0, fiber_100g: 0, sugar_100g: 8, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2380', name: 'Cocktail Mojito (porzione 200mL)', category: 'Bevande', kcal_100g: 105, proteins_100g: 0, carbs_100g: 15, fats_100g: 0, fiber_100g: 0, sugar_100g: 15, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2381', name: 'Coca-Cola / cola classica', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2382', name: 'Fanta / aranciata zuccherata', category: 'Bevande', kcal_100g: 44, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2383', name: 'Succo di frutta industriale (brick)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.3, carbs_100g: 11.5, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2384', name: 'Energy drink (Monster/Red Bull tipo)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2385', name: 'Tè freddo industriale zuccherato', category: 'Bevande', kcal_100g: 38, proteins_100g: 0.1, carbs_100g: 9.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2386', name: 'Smoothie industriale (bottiglia)', category: 'Bevande', kcal_100g: 55, proteins_100g: 0.5, carbs_100g: 13, fats_100g: 0.2, fiber_100g: 0.5, sugar_100g: 12, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Fast food ───
  { id: 'dt_2387', name: 'Hamburger industriale (burger surgelato)', category: 'Snack e Ultra-Processati', kcal_100g: 285, proteins_100g: 15, carbs_100g: 21, fats_100g: 17, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 6, serving_size_g: 30 },
  { id: 'dt_2388', name: 'Pizza margherita surgelata', category: 'Snack e Ultra-Processati', kcal_100g: 225, proteins_100g: 9, carbs_100g: 30, fats_100g: 8, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2389', name: 'Lasagne industriali surgelate', category: 'Snack e Ultra-Processati', kcal_100g: 150, proteins_100g: 8, carbs_100g: 15, fats_100g: 7, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2390', name: 'Nuggets di pollo surgelati', category: 'Snack e Ultra-Processati', kcal_100g: 250, proteins_100g: 15, carbs_100g: 17, fats_100g: 14, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 2.5, serving_size_g: 30 },

  // ─── Salumi processati ───
  { id: 'dt_2391', name: 'Hotdog/würstel industriale', category: 'Salumi e Insaccati', kcal_100g: 280, proteins_100g: 11, carbs_100g: 3, fats_100g: 25, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 10, serving_size_g: 100 },
  { id: 'dt_2392', name: 'Wurstel di pollo industriale', category: 'Salumi e Insaccati', kcal_100g: 215, proteins_100g: 13, carbs_100g: 2, fats_100g: 17, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 5.5, serving_size_g: 100 },
  { id: 'dt_2393', name: 'Salame Milano industriale', category: 'Salumi e Insaccati', kcal_100g: 406, proteins_100g: 22, carbs_100g: 0.3, fats_100g: 35, fiber_100g: 0, sugar_100g: 0.3, fatSat_100g: 14, serving_size_g: 100 },
  { id: 'dt_2394', name: 'Mortadella industriale', category: 'Salumi e Insaccati', kcal_100g: 311, proteins_100g: 14.7, carbs_100g: 1.5, fats_100g: 26.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 11, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_2395', name: 'Maionese industriale', category: 'Condimenti e Salse', kcal_100g: 680, proteins_100g: 1.5, carbs_100g: 2, fats_100g: 75, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 8, serving_size_g: 20 },
  { id: 'dt_2396', name: 'Ketchup industriale', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 1.3, carbs_100g: 25, fats_100g: 0.1, fiber_100g: 1.5, sugar_100g: 22, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_2397', name: 'Salsa barbecue industriale', category: 'Condimenti e Salse', kcal_100g: 172, proteins_100g: 1.5, carbs_100g: 40, fats_100g: 0.3, fiber_100g: 1, sugar_100g: 37, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Creme e spalmate ───
  { id: 'dt_2398', name: 'Crema di nocciole bianca (tipo Bianca)', category: 'Condimenti e Salse', kcal_100g: 535, proteins_100g: 5, carbs_100g: 65, fats_100g: 27, fiber_100g: 1, sugar_100g: 65, fatSat_100g: 14, serving_size_g: 100 },
  { id: 'dt_2399', name: 'Crema al pistacchio industriale', category: 'Condimenti e Salse', kcal_100g: 520, proteins_100g: 7, carbs_100g: 61, fats_100g: 28, fiber_100g: 2, sugar_100g: 57, fatSat_100g: 12, serving_size_g: 100 },

  // ─── Cereali da colazione ───
  { id: 'dt_2400', name: 'Cereali al cioccolato tipo Coco Pops', category: 'Cereali', kcal_100g: 381, proteins_100g: 5, carbs_100g: 83, fats_100g: 3.5, fiber_100g: 2, sugar_100g: 37, fatSat_100g: 0.7, serving_size_g: 80 },
  { id: 'dt_2401', name: 'Muesli industriale con frutta e zucchero', category: 'Cereali', kcal_100g: 368, proteins_100g: 9, carbs_100g: 63, fats_100g: 8, fiber_100g: 6, sugar_100g: 28, fatSat_100g: 2, serving_size_g: 80 },
  { id: 'dt_2402', name: 'Cereali Frosties (glassati allo zucchero)', category: 'Cereali', kcal_100g: 378, proteins_100g: 6.2, carbs_100g: 87, fats_100g: 0.9, fiber_100g: 2, sugar_100g: 37, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Fast food ───
  { id: 'dt_2403', name: 'Pizza da asporto / pizzeria (margherita)', category: 'Snack e Ultra-Processati', kcal_100g: 266, proteins_100g: 11, carbs_100g: 36, fats_100g: 9, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2404', name: 'Tramezzino industriale prosciutto', category: 'Snack e Ultra-Processati', kcal_100g: 255, proteins_100g: 10, carbs_100g: 31, fats_100g: 10, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2405', name: 'Piadina industriale con prosciutto', category: 'Snack e Ultra-Processati', kcal_100g: 240, proteins_100g: 9.5, carbs_100g: 31, fats_100g: 9, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 3, serving_size_g: 30 },
  { id: 'dt_2406', name: 'Kebab in pita (stima per 200g porzione)', category: 'Snack e Ultra-Processati', kcal_100g: 240, proteins_100g: 13, carbs_100g: 23, fats_100g: 12, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2407', name: 'Hot dog industriale con panino', category: 'Snack e Ultra-Processati', kcal_100g: 290, proteins_100g: 10, carbs_100g: 30, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 6, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_2408', name: 'Cotoletta impanata surgelata', category: 'Snack e Ultra-Processati', kcal_100g: 228, proteins_100g: 17, carbs_100g: 14, fats_100g: 12, fiber_100g: 1, sugar_100g: 0.5, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2409', name: 'Sofficini (Findus/simili)', category: 'Snack e Ultra-Processati', kcal_100g: 220, proteins_100g: 7.5, carbs_100g: 22, fats_100g: 12, fiber_100g: 1, sugar_100g: 1.5, fatSat_100g: 4, serving_size_g: 30 },

  // ─── Piatti pronti ───
  { id: 'dt_2410', name: 'Minestrone surgelato industriale', category: 'Piatti Pronti', kcal_100g: 45, proteins_100g: 2.5, carbs_100g: 6.5, fats_100g: 1.2, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 300 },

  // ─── Alcolici ───
  { id: 'dt_2411', name: 'Gin tonic (porzione 200mL)', category: 'Bevande', kcal_100g: 88, proteins_100g: 0, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2412', name: 'Amaro digestivo (40% vol.)', category: 'Bevande', kcal_100g: 250, proteins_100g: 0, carbs_100g: 15, fats_100g: 0, fiber_100g: 0, sugar_100g: 15, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Gelati ───
  { id: 'dt_2413', name: 'Gelato gastronomico (coppa mista 200g)', category: 'Dolci e Zuccheri', kcal_100g: 190, proteins_100g: 3.5, carbs_100g: 25, fats_100g: 10, fiber_100g: 0.3, sugar_100g: 22, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2414', name: 'Cono gelato industriale (tipo Cornetto)', category: 'Dolci e Zuccheri', kcal_100g: 275, proteins_100g: 4, carbs_100g: 32, fats_100g: 16, fiber_100g: 0.8, sugar_100g: 27, fatSat_100g: 9.5, serving_size_g: 50 },

  // ─── Dolci confezionati ───
  { id: 'dt_2415', name: 'Biscotti al burro tipo shortbread', category: 'Dolci e Zuccheri', kcal_100g: 502, proteins_100g: 6.5, carbs_100g: 62, fats_100g: 26, fiber_100g: 1.5, sugar_100g: 25, fatSat_100g: 16, serving_size_g: 50 },
  { id: 'dt_2416', name: 'Merendina Kinder Fetta al Latte', category: 'Dolci e Zuccheri', kcal_100g: 395, proteins_100g: 8, carbs_100g: 54, fats_100g: 17, fiber_100g: 0.3, sugar_100g: 36, fatSat_100g: 9, serving_size_g: 50 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2417', name: 'Succo ACE (carota-arancia-limone, brick)', category: 'Bevande', kcal_100g: 44, proteins_100g: 0.4, carbs_100g: 10.5, fats_100g: 0.1, fiber_100g: 0.3, sugar_100g: 9.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2418', name: 'Bibita tonica (acqua tonica)', category: 'Bevande', kcal_100g: 34, proteins_100g: 0, carbs_100g: 8.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 8.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2419', name: 'Gatorade / bevanda isotonica', category: 'Bevande', kcal_100g: 26, proteins_100g: 0, carbs_100g: 6, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Condimenti ───
  { id: 'dt_2420', name: 'Salsa di soia (industriale shoyu)', category: 'Condimenti e Salse', kcal_100g: 60, proteins_100g: 5.6, carbs_100g: 5.6, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 5.6, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2421', name: 'Salsa tahini / crema di sesamo', category: 'Condimenti e Salse', kcal_100g: 595, proteins_100g: 17, carbs_100g: 21.2, fats_100g: 53.8, fiber_100g: 9, sugar_100g: 0.5, fatSat_100g: 7.5, serving_size_g: 20 },

  // ─── Dolci confezionati ───
  { id: 'dt_2422', name: 'Pandoro porzione 100g', category: 'Dolci e Zuccheri', kcal_100g: 367, proteins_100g: 7.5, carbs_100g: 49, fats_100g: 16.5, fiber_100g: 0.8, sugar_100g: 22, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2423', name: 'Panettone classico porzione 100g', category: 'Dolci e Zuccheri', kcal_100g: 367, proteins_100g: 7, carbs_100g: 52, fats_100g: 16, fiber_100g: 1.2, sugar_100g: 24, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2424', name: 'Colomba pasquale porzione 100g', category: 'Dolci e Zuccheri', kcal_100g: 390, proteins_100g: 7.5, carbs_100g: 53, fats_100g: 18, fiber_100g: 1, sugar_100g: 26, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2425', name: 'Torrone al cioccolato duro', category: 'Dolci e Zuccheri', kcal_100g: 488, proteins_100g: 9.5, carbs_100g: 60, fats_100g: 24, fiber_100g: 2.5, sugar_100g: 52, fatSat_100g: 11, serving_size_g: 50 },
  { id: 'dt_2426', name: 'Torrone morbido', category: 'Dolci e Zuccheri', kcal_100g: 420, proteins_100g: 6, carbs_100g: 73, fats_100g: 13, fiber_100g: 1.5, sugar_100g: 65, fatSat_100g: 5, serving_size_g: 50 },
  { id: 'dt_2427', name: 'Cantucci di Prato', category: 'Dolci e Zuccheri', kcal_100g: 450, proteins_100g: 10.5, carbs_100g: 67, fats_100g: 15, fiber_100g: 3.5, sugar_100g: 28, fatSat_100g: 3.5, serving_size_g: 50 },
  { id: 'dt_2428', name: 'Amaretti confezionati', category: 'Dolci e Zuccheri', kcal_100g: 395, proteins_100g: 7.5, carbs_100g: 81, fats_100g: 5, fiber_100g: 2.5, sugar_100g: 55, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2429', name: 'Savoiardi industriali', category: 'Dolci e Zuccheri', kcal_100g: 385, proteins_100g: 7.8, carbs_100g: 78, fats_100g: 7, fiber_100g: 1, sugar_100g: 32, fatSat_100g: 4, serving_size_g: 50 },
  { id: 'dt_2430', name: 'Ciambella krapfen industriale', category: 'Dolci e Zuccheri', kcal_100g: 400, proteins_100g: 6, carbs_100g: 52, fats_100g: 20, fiber_100g: 1, sugar_100g: 22, fatSat_100g: 8.5, serving_size_g: 50 },
  { id: 'dt_2431', name: 'Barretta Mars Snickers tipo per 100g', category: 'Dolci e Zuccheri', kcal_100g: 460, proteins_100g: 5, carbs_100g: 70, fats_100g: 18.5, fiber_100g: 1.5, sugar_100g: 59, fatSat_100g: 13.5, serving_size_g: 50 },
  { id: 'dt_2432', name: 'Ferrero Rocher tipo praline per 100g', category: 'Dolci e Zuccheri', kcal_100g: 568, proteins_100g: 7.8, carbs_100g: 47, fats_100g: 39, fiber_100g: 2.5, sugar_100g: 44, fatSat_100g: 16, serving_size_g: 50 },
  { id: 'dt_2433', name: 'Cheesecake industriale porzione 100g', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 4.5, carbs_100g: 29, fats_100g: 18.5, fiber_100g: 0.5, sugar_100g: 24, fatSat_100g: 11, serving_size_g: 50 },
  { id: 'dt_2434', name: 'Torta al limone confezionata', category: 'Dolci e Zuccheri', kcal_100g: 370, proteins_100g: 5.5, carbs_100g: 52, fats_100g: 16, fiber_100g: 1, sugar_100g: 42, fatSat_100g: 7, serving_size_g: 50 },
  { id: 'dt_2435', name: 'Muffin industriale ai mirtilli', category: 'Dolci e Zuccheri', kcal_100g: 388, proteins_100g: 5.5, carbs_100g: 55, fats_100g: 17, fiber_100g: 1.5, sugar_100g: 30, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2436', name: 'Caramelle gommose alla frutta', category: 'Dolci e Zuccheri', kcal_100g: 348, proteins_100g: 7, carbs_100g: 78, fats_100g: 0, fiber_100g: 0, sugar_100g: 56, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2437', name: 'Liquirizia industriale', category: 'Dolci e Zuccheri', kcal_100g: 349, proteins_100g: 4, carbs_100g: 77, fats_100g: 0.5, fiber_100g: 0.3, sugar_100g: 62, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2438', name: 'Cioccolato bianco industriale', category: 'Dolci e Zuccheri', kcal_100g: 539, proteins_100g: 5.9, carbs_100g: 59, fats_100g: 32, fiber_100g: 0.2, sugar_100g: 57, fatSat_100g: 20, serving_size_g: 50 },
  { id: 'dt_2439', name: 'Gianduiotto cioccolatino', category: 'Dolci e Zuccheri', kcal_100g: 576, proteins_100g: 7, carbs_100g: 47, fats_100g: 40, fiber_100g: 3, sugar_100g: 43, fatSat_100g: 17, serving_size_g: 50 },

  // ─── Snack salati ───
  { id: 'dt_2440', name: 'Popcorn caramellato confezionato', category: 'Snack e Ultra-Processati', kcal_100g: 450, proteins_100g: 4.5, carbs_100g: 76, fats_100g: 14, fiber_100g: 3.5, sugar_100g: 45, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2441', name: 'Ciambelline salate al rosmarino', category: 'Snack e Ultra-Processati', kcal_100g: 419, proteins_100g: 10, carbs_100g: 57, fats_100g: 17, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2442', name: 'Mix frutta secca speziata confezionato', category: 'Snack e Ultra-Processati', kcal_100g: 590, proteins_100g: 16, carbs_100g: 24, fats_100g: 47, fiber_100g: 7, sugar_100g: 10, fatSat_100g: 6, serving_size_g: 30 },

  // ─── Piatti pronti ───
  { id: 'dt_2443', name: 'Risotto in busta pronto', category: 'Piatti Pronti', kcal_100g: 370, proteins_100g: 8, carbs_100g: 77, fats_100g: 2.5, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2444', name: 'Pasta al pomodoro in vasetto pronta', category: 'Piatti Pronti', kcal_100g: 132, proteins_100g: 4.5, carbs_100g: 22, fats_100g: 3, fiber_100g: 1.5, sugar_100g: 3.5, fatSat_100g: 0.8, serving_size_g: 300 },
  { id: 'dt_2445', name: 'Ragù industriale in vasetto', category: 'Piatti Pronti', kcal_100g: 92, proteins_100g: 5.5, carbs_100g: 5, fats_100g: 6.5, fiber_100g: 1, sugar_100g: 2.5, fatSat_100g: 3, serving_size_g: 300 },
  { id: 'dt_2446', name: 'Sugo ai funghi industriale vasetto', category: 'Piatti Pronti', kcal_100g: 68, proteins_100g: 2, carbs_100g: 5.5, fats_100g: 4.5, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 300 },

  // ─── Condimenti ───
  { id: 'dt_2447', name: 'Pesto rosso industriale vasetto', category: 'Condimenti e Salse', kcal_100g: 365, proteins_100g: 6, carbs_100g: 20, fats_100g: 30, fiber_100g: 3, sugar_100g: 6, fatSat_100g: 5.5, serving_size_g: 20 },

  // ─── Piatti pronti ───
  { id: 'dt_2448', name: 'Polpette in scatola al pomodoro', category: 'Piatti Pronti', kcal_100g: 142, proteins_100g: 9.5, carbs_100g: 8, fats_100g: 8.5, fiber_100g: 0.8, sugar_100g: 2.5, fatSat_100g: 4, serving_size_g: 300 },
  { id: 'dt_2449', name: 'Zuppa di verdure in lattina', category: 'Piatti Pronti', kcal_100g: 42, proteins_100g: 1.8, carbs_100g: 6, fats_100g: 1, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 0.2, serving_size_g: 300 },
  { id: 'dt_2450', name: 'Pasta e fagioli pronta in barattolo', category: 'Piatti Pronti', kcal_100g: 98, proteins_100g: 5.5, carbs_100g: 14.5, fats_100g: 2.8, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 300 },

  // ─── Salumi processati ───
  { id: 'dt_2451', name: 'Carne in scatola corned beef', category: 'Salumi e Insaccati', kcal_100g: 218, proteins_100g: 25.9, carbs_100g: 0, fats_100g: 12.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 5.5, serving_size_g: 100 },

  // ─── Alcolici ───
  { id: 'dt_2452', name: 'Birra artigianale IPA 6%', category: 'Bevande', kcal_100g: 52, proteins_100g: 0.5, carbs_100g: 4.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2453', name: 'Grappa 40%', category: 'Bevande', kcal_100g: 231, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2454', name: 'Limoncello 30%', category: 'Bevande', kcal_100g: 272, proteins_100g: 0, carbs_100g: 31, fats_100g: 0, fiber_100g: 0, sugar_100g: 31, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2455', name: 'Porto vino liquoroso dolce 20%', category: 'Bevande', kcal_100g: 163, proteins_100g: 0.1, carbs_100g: 12, fats_100g: 0, fiber_100g: 0, sugar_100g: 12, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2456', name: 'Birra senza glutine', category: 'Bevande', kcal_100g: 40, proteins_100g: 0.3, carbs_100g: 3.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 2, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2457', name: 'Sidro di mele secco 5%', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 4, fats_100g: 0, fiber_100g: 0, sugar_100g: 2.6, fatSat_100g: 0, serving_size_g: 100 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2458', name: 'Nettare di pesca brick', category: 'Bevande', kcal_100g: 52, proteins_100g: 0.3, carbs_100g: 13, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 12, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2459', name: 'Succo di pera brick', category: 'Bevande', kcal_100g: 48, proteins_100g: 0.2, carbs_100g: 12, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2460', name: 'Latte al cioccolato industriale', category: 'Bevande', kcal_100g: 71, proteins_100g: 3.2, carbs_100g: 11.5, fats_100g: 2, fiber_100g: 0, sugar_100g: 11.5, fatSat_100g: 1.2, serving_size_g: 200 },
  { id: 'dt_2461', name: 'Bevanda alla soia zuccherata', category: 'Bevande', kcal_100g: 50, proteins_100g: 2.8, carbs_100g: 7.5, fats_100g: 1.4, fiber_100g: 0.3, sugar_100g: 6.5, fatSat_100g: 0.2, serving_size_g: 200 },
  { id: 'dt_2462', name: 'Latte di cocco in lattina', category: 'Bevande', kcal_100g: 197, proteins_100g: 2, carbs_100g: 3, fats_100g: 21, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 18, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_2463', name: 'Yogurt proteico industriale 15g', category: 'Latticini', kcal_100g: 75, proteins_100g: 15, carbs_100g: 5.5, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Dolci confezionati ───
  { id: 'dt_2464', name: 'Panna cotta da pasticceria 100g', category: 'Dolci e Zuccheri', kcal_100g: 200, proteins_100g: 2.5, carbs_100g: 18.5, fats_100g: 13, fiber_100g: 0, sugar_100g: 18.5, fatSat_100g: 7, serving_size_g: 50 },

  // ─── Latte e derivati ───
  { id: 'dt_2465', name: 'Sottilette fette di formaggio', category: 'Latticini', kcal_100g: 295, proteins_100g: 16, carbs_100g: 3, fats_100g: 24, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 14, serving_size_g: 125 },

  // ─── Snack salati ───
  { id: 'dt_2466', name: 'Barretta energetica tipo Clif', category: 'Snack e Ultra-Processati', kcal_100g: 382, proteins_100g: 10, carbs_100g: 65, fats_100g: 7, fiber_100g: 5, sugar_100g: 27, fatSat_100g: 2, serving_size_g: 30 },

  // ─── Proteine in Polvere ───
  { id: 'dt_2467', name: 'Barretta proteica industriale 20g prot', category: 'Integratori', kcal_100g: 356, proteins_100g: 33, carbs_100g: 35, fats_100g: 10, fiber_100g: 2.5, sugar_100g: 18, fatSat_100g: 3.5, serving_size_g: 10 },

  // ─── Cereali da colazione ───
  { id: 'dt_2468', name: 'Granola industriale miele e frutta', category: 'Cereali', kcal_100g: 450, proteins_100g: 8.5, carbs_100g: 66, fats_100g: 16, fiber_100g: 5.5, sugar_100g: 32, fatSat_100g: 3, serving_size_g: 80 },
  { id: 'dt_2469', name: 'Porridge industriale confezionato', category: 'Cereali', kcal_100g: 368, proteins_100g: 10, carbs_100g: 63, fats_100g: 7, fiber_100g: 8, sugar_100g: 12, fatSat_100g: 1.4, serving_size_g: 80 },

  // ─── Dolci confezionati ───
  { id: 'dt_2470', name: 'Wafer al miele confezionato', category: 'Dolci e Zuccheri', kcal_100g: 490, proteins_100g: 6.5, carbs_100g: 67, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 42, fatSat_100g: 7, serving_size_g: 50 },

  // ─── Snack salati ───
  { id: 'dt_2471', name: 'Focaccia industriale confezionata', category: 'Snack e Ultra-Processati', kcal_100g: 310, proteins_100g: 7.5, carbs_100g: 44, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 2.5, serving_size_g: 30 },

  // ─── Fast food ───
  { id: 'dt_2472', name: 'Toast confezionato prosciutto e formaggio', category: 'Snack e Ultra-Processati', kcal_100g: 248, proteins_100g: 11, carbs_100g: 28, fats_100g: 11, fiber_100g: 1.5, sugar_100g: 3.5, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2473', name: 'Wrap industriale pollo e verdure', category: 'Snack e Ultra-Processati', kcal_100g: 220, proteins_100g: 10, carbs_100g: 28, fats_100g: 8, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2474', name: 'Panino hamburger industriale completo', category: 'Snack e Ultra-Processati', kcal_100g: 260, proteins_100g: 12, carbs_100g: 32, fats_100g: 10, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 4, serving_size_g: 30 },

  // ─── Cereali e derivati ───
  { id: 'dt_2475', name: 'Piadina romagnola industriale', category: 'Cereali', kcal_100g: 338, proteins_100g: 9.5, carbs_100g: 48, fats_100g: 12, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 4.5, serving_size_g: 80 },
  { id: 'dt_2476', name: 'Focaccine tipo Tigelle industriali', category: 'Cereali', kcal_100g: 305, proteins_100g: 8.5, carbs_100g: 47, fats_100g: 9, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 2, serving_size_g: 80 },

  // ─── Snack salati ───
  { id: 'dt_2477', name: 'Crackers wasa tipo crispbread', category: 'Snack e Ultra-Processati', kcal_100g: 348, proteins_100g: 9.5, carbs_100g: 68, fats_100g: 2.5, fiber_100g: 12, sugar_100g: 1.5, fatSat_100g: 0.4, serving_size_g: 30 },
  { id: 'dt_2478', name: 'Chips di lenticchie BBQ', category: 'Snack e Ultra-Processati', kcal_100g: 410, proteins_100g: 12, carbs_100g: 57, fats_100g: 16, fiber_100g: 7, sugar_100g: 4, fatSat_100g: 1.5, serving_size_g: 30 },
  { id: 'dt_2479', name: 'Rice cakes aromatizzate', category: 'Snack e Ultra-Processati', kcal_100g: 396, proteins_100g: 7.5, carbs_100g: 80, fats_100g: 4, fiber_100g: 2.5, sugar_100g: 5, fatSat_100g: 0.5, serving_size_g: 30 },

  // ─── Proteine in Polvere ───
  { id: 'dt_2480', name: 'Frullato proteico industriale (330mL, 20g prot)', category: 'Integratori', kcal_100g: 121, proteins_100g: 6.1, carbs_100g: 12, fats_100g: 3.3, fiber_100g: 0.3, sugar_100g: 10, fatSat_100g: 1.2, serving_size_g: 10 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2481', name: 'Bevanda proteica colazione (bottiglia 250mL)', category: 'Bevande', kcal_100g: 95, proteins_100g: 8, carbs_100g: 12, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 1.5, serving_size_g: 200 },
  { id: 'dt_2482', name: 'Smoothie proteico alla banana industriale', category: 'Bevande', kcal_100g: 78, proteins_100g: 5, carbs_100g: 12, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 10, fatSat_100g: 0.5, serving_size_g: 200 },

  // ─── Condimenti ───
  { id: 'dt_2483', name: 'Salsa guacamole industriale in vaschetta', category: 'Condimenti e Salse', kcal_100g: 148, proteins_100g: 1.5, carbs_100g: 5, fats_100g: 14, fiber_100g: 4, sugar_100g: 1, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2484', name: 'Salsa tzatziki industriale in vaschetta', category: 'Condimenti e Salse', kcal_100g: 85, proteins_100g: 4, carbs_100g: 3.5, fats_100g: 6, fiber_100g: 0.3, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2485', name: 'Salsa Sriracha piccante', category: 'Condimenti e Salse', kcal_100g: 93, proteins_100g: 2, carbs_100g: 17, fats_100g: 0.5, fiber_100g: 1.5, sugar_100g: 14, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_2486', name: 'Salsa Teriyaki industriale', category: 'Condimenti e Salse', kcal_100g: 89, proteins_100g: 4, carbs_100g: 17.5, fats_100g: 0.2, fiber_100g: 0.3, sugar_100g: 17, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Grassi e oli ───
  { id: 'dt_2487', name: 'Burro di cocco industriale', category: 'Grassi', kcal_100g: 700, proteins_100g: 2, carbs_100g: 23, fats_100g: 63, fiber_100g: 9, sugar_100g: 5.5, fatSat_100g: 55, serving_size_g: 10 },

  // ─── Gelati ───
  { id: 'dt_2488', name: 'Gelato alla fragola industriale', category: 'Dolci e Zuccheri', kcal_100g: 102, proteins_100g: 2.5, carbs_100g: 18, fats_100g: 2.5, fiber_100g: 0.2, sugar_100g: 16, fatSat_100g: 2.5, serving_size_g: 50 },
  { id: 'dt_2489', name: 'Gelato vegan soia industriale', category: 'Dolci e Zuccheri', kcal_100g: 150, proteins_100g: 2.5, carbs_100g: 20, fats_100g: 7, fiber_100g: 0.8, sugar_100g: 16, fatSat_100g: 2, serving_size_g: 50 },
  { id: 'dt_2490', name: 'Sorbetto limone industriale', category: 'Dolci e Zuccheri', kcal_100g: 120, proteins_100g: 0.3, carbs_100g: 30, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 29, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Cereali e pasta ───
  { id: 'dt_2491', name: 'Pasta senza glutine di mais-riso (Barilla/Garofalo)', category: 'Cereali', kcal_100g: 360, proteins_100g: 4.5, carbs_100g: 79, fats_100g: 1.5, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2492', name: 'Pane senza glutine confezionato', category: 'Cereali', kcal_100g: 255, proteins_100g: 3.5, carbs_100g: 48, fats_100g: 5.5, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Dolci confezionati ───
  { id: 'dt_2493', name: 'Biscotti senza glutine al burro', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 4.5, carbs_100g: 68, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 28, fatSat_100g: 15, serving_size_g: 50 },

  // ─── Snack salati ───
  { id: 'dt_2494', name: 'Crackers senza glutine di mais', category: 'Snack e Ultra-Processati', kcal_100g: 440, proteins_100g: 5, carbs_100g: 80, fats_100g: 10, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 30 },

  // ─── Salumi processati ───
  { id: 'dt_2495', name: 'Burger vegetale Beyond Meat / simile', category: 'Salumi e Insaccati', kcal_100g: 250, proteins_100g: 20, carbs_100g: 3, fats_100g: 18, fiber_100g: 2, sugar_100g: 0, fatSat_100g: 5, serving_size_g: 100 },
  { id: 'dt_2496', name: 'Cotoletta di soia / seitan impanata', category: 'Salumi e Insaccati', kcal_100g: 230, proteins_100g: 16, carbs_100g: 20, fats_100g: 10, fiber_100g: 3, sugar_100g: 1, fatSat_100g: 2, serving_size_g: 100 },
  { id: 'dt_2497', name: 'Wurstel di soia vegetali', category: 'Salumi e Insaccati', kcal_100g: 185, proteins_100g: 14, carbs_100g: 8, fats_100g: 11, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 3, serving_size_g: 100 },

  // ─── Latte e derivati ───
  { id: 'dt_2498', name: 'Formaggio vegano fette (tipo violife)', category: 'Latticini', kcal_100g: 280, proteins_100g: 1.5, carbs_100g: 12, fats_100g: 22, fiber_100g: 0.5, sugar_100g: 2.5, fatSat_100g: 14, serving_size_g: 125 },
  { id: 'dt_2499', name: 'Panna vegetale di soia UHT', category: 'Latticini', kcal_100g: 195, proteins_100g: 3, carbs_100g: 4, fats_100g: 19, fiber_100g: 0.3, sugar_100g: 3.5, fatSat_100g: 2.5, serving_size_g: 125 },
  { id: 'dt_2500', name: 'Yogurt vegano cocco-ananas industriale', category: 'Latticini', kcal_100g: 105, proteins_100g: 1.5, carbs_100g: 12, fats_100g: 7, fiber_100g: 0.5, sugar_100g: 8, fatSat_100g: 4, serving_size_g: 125 },

  // ─── Legumi ───
  { id: 'dt_2501', name: 'Tofu affumicato tipo naturli', category: 'Legumi', kcal_100g: 145, proteins_100g: 15, carbs_100g: 3, fats_100g: 8.5, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 2, serving_size_g: 80 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2502', name: 'Bevanda al caffè latte zuccherato (lattina)', category: 'Bevande', kcal_100g: 52, proteins_100g: 1.8, carbs_100g: 8.5, fats_100g: 2, fiber_100g: 0, sugar_100g: 7.5, fatSat_100g: 1.5, serving_size_g: 200 },
  { id: 'dt_2503', name: 'Kombucha commerciale zuccherato', category: 'Bevande', kcal_100g: 30, proteins_100g: 0, carbs_100g: 7, fats_100g: 0, fiber_100g: 0, sugar_100g: 7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2504', name: 'Acqua aromatizzata zuccherata', category: 'Bevande', kcal_100g: 25, proteins_100g: 0, carbs_100g: 6, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Bevande ───
  { id: 'dt_2505', name: 'Acqua di cocco naturale (lattina)', category: 'Bevande', kcal_100g: 19, proteins_100g: 0.7, carbs_100g: 3.7, fats_100g: 0.2, fiber_100g: 1.1, sugar_100g: 2.6, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_2506', name: 'Latte di riso naturale', category: 'Latticini', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.2, fats_100g: 1, fiber_100g: 0.3, sugar_100g: 5, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_2507', name: 'Latte di piselli (Ripple tipo)', category: 'Latticini', kcal_100g: 52, proteins_100g: 8, carbs_100g: 1, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 125 },

  // ─── Dolci confezionati ───
  { id: 'dt_2508', name: 'Crostatina Mulino Bianco tipo', category: 'Dolci e Zuccheri', kcal_100g: 385, proteins_100g: 5, carbs_100g: 61, fats_100g: 13, fiber_100g: 1.5, sugar_100g: 26, fatSat_100g: 6, serving_size_g: 50 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2509', name: 'Pan di Stelle tipo (biscotti cacao)', category: 'Pane e Prodotti da Forno', kcal_100g: 484, proteins_100g: 8, carbs_100g: 66, fats_100g: 20.5, fiber_100g: 2, sugar_100g: 31, fatSat_100g: 9.5, serving_size_g: 30 },

  // ─── Dolci confezionati ───
  { id: 'dt_2510', name: 'Merendina spugnosa tipo Twinkie', category: 'Dolci e Zuccheri', kcal_100g: 393, proteins_100g: 4, carbs_100g: 62, fats_100g: 13, fiber_100g: 0.5, sugar_100g: 49, fatSat_100g: 4.5, serving_size_g: 50 },
  { id: 'dt_2511', name: 'Brioche con crema industriale', category: 'Dolci e Zuccheri', kcal_100g: 340, proteins_100g: 6.5, carbs_100g: 52, fats_100g: 12, fiber_100g: 1, sugar_100g: 28, fatSat_100g: 5, serving_size_g: 50 },
  { id: 'dt_2512', name: 'Wafer cioccolato tipo KitKat', category: 'Dolci e Zuccheri', kcal_100g: 519, proteins_100g: 7.5, carbs_100g: 64, fats_100g: 27, fiber_100g: 1.5, sugar_100g: 58, fatSat_100g: 18, serving_size_g: 50 },

  // ─── Fast food ───
  { id: 'dt_2513', name: 'Hot dog industriale (salsiccia in panino)', category: 'Snack e Ultra-Processati', kcal_100g: 295, proteins_100g: 12, carbs_100g: 31, fats_100g: 14, fiber_100g: 1, sugar_100g: 24, fatSat_100g: 7, serving_size_g: 30 },
  { id: 'dt_2514', name: 'Panino da hamburger tipo Big Mac', category: 'Snack e Ultra-Processati', kcal_100g: 254, proteins_100g: 13, carbs_100g: 29, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 22, fatSat_100g: 5.5, serving_size_g: 30 },
  { id: 'dt_2515', name: 'Patatine fritte fast food (porz. 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 312, proteins_100g: 3.5, carbs_100g: 41, fats_100g: 15, fiber_100g: 3, sugar_100g: 3, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2516', name: 'Nuggets di pollo industriali (100g)', category: 'Snack e Ultra-Processati', kcal_100g: 297, proteins_100g: 15, carbs_100g: 18, fats_100g: 18, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2517', name: 'Arancino / supplì (fritto, 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 207, proteins_100g: 5.5, carbs_100g: 27, fats_100g: 9, fiber_100g: 1.2, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2518', name: 'Pizza margherita industriale surgelata', category: 'Snack e Ultra-Processati', kcal_100g: 210, proteins_100g: 8, carbs_100g: 27, fats_100g: 8, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 3.5, serving_size_g: 30 },

  // ─── Salumi processati ───
  { id: 'dt_2519', name: 'Mortadella Bologna', category: 'Salumi e Insaccati', kcal_100g: 311, proteins_100g: 15, carbs_100g: 1.5, fats_100g: 28, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9, serving_size_g: 100 },
  { id: 'dt_2520', name: 'Würstel di maiale e vitello', category: 'Salumi e Insaccati', kcal_100g: 274, proteins_100g: 12, carbs_100g: 1.5, fats_100g: 24, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 9, serving_size_g: 100 },
  { id: 'dt_2521', name: 'Bresaola della Valtellina', category: 'Salumi e Insaccati', kcal_100g: 151, proteins_100g: 32, carbs_100g: 0, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_2522', name: 'Coppa / Capocollo', category: 'Salumi e Insaccati', kcal_100g: 377, proteins_100g: 22, carbs_100g: 0, fats_100g: 32, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 11, serving_size_g: 100 },
  { id: 'dt_2523', name: 'Pancetta affumicata (bacon italiano)', category: 'Salumi e Insaccati', kcal_100g: 458, proteins_100g: 16, carbs_100g: 0, fats_100g: 43, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 100 },

  // ─── Dolci confezionati ───
  { id: 'dt_2524', name: 'Panna cotta industriale in vaschetta', category: 'Dolci e Zuccheri', kcal_100g: 210, proteins_100g: 3, carbs_100g: 24, fats_100g: 14, fiber_100g: 0, sugar_100g: 22, fatSat_100g: 9, serving_size_g: 50 },
  { id: 'dt_2525', name: 'Tiramisù industriale in vaschetta', category: 'Dolci e Zuccheri', kcal_100g: 298, proteins_100g: 5.5, carbs_100g: 27, fats_100g: 19, fiber_100g: 0.3, sugar_100g: 25, fatSat_100g: 10, serving_size_g: 50 },
  { id: 'dt_2526', name: 'Crostata industriale marmellata', category: 'Dolci e Zuccheri', kcal_100g: 398, proteins_100g: 5, carbs_100g: 61, fats_100g: 15, fiber_100g: 2, sugar_100g: 35, fatSat_100g: 6.5, serving_size_g: 50 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2527', name: 'Biscotti Digestive (McVitie\'s tipo)', category: 'Pane e Prodotti da Forno', kcal_100g: 481, proteins_100g: 7, carbs_100g: 67.5, fats_100g: 20, fiber_100g: 3.5, sugar_100g: 22.5, fatSat_100g: 9, serving_size_g: 30 },

  // ─── Cereali da colazione ───
  { id: 'dt_2528', name: 'Cereali al miele tipo Cheerios', category: 'Cereali', kcal_100g: 375, proteins_100g: 8, carbs_100g: 73, fats_100g: 4.5, fiber_100g: 7, sugar_100g: 17, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_2529', name: 'Cereali al cacao tipo Chocapic', category: 'Cereali', kcal_100g: 386, proteins_100g: 7.5, carbs_100g: 78.5, fats_100g: 5, fiber_100g: 4.5, sugar_100g: 32, fatSat_100g: 1.5, serving_size_g: 80 },
  { id: 'dt_2530', name: 'Cereali tipo Frosties (mais zuccherato)', category: 'Cereali', kcal_100g: 378, proteins_100g: 6, carbs_100g: 88, fats_100g: 0.5, fiber_100g: 1, sugar_100g: 37, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2531', name: 'Riso soffiato tipo Rice Krispies', category: 'Cereali', kcal_100g: 381, proteins_100g: 7, carbs_100g: 85.5, fats_100g: 1, fiber_100g: 1.2, sugar_100g: 9.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2532', name: 'Musli svizzero industriale misto', category: 'Cereali', kcal_100g: 362, proteins_100g: 8.5, carbs_100g: 64, fats_100g: 7, fiber_100g: 7, sugar_100g: 23, fatSat_100g: 2.5, serving_size_g: 80 },

  // ─── Piatti pronti ───
  { id: 'dt_2533', name: 'Lasagne al ragù surgelate (porz. 300g)', category: 'Piatti Pronti', kcal_100g: 142, proteins_100g: 7.5, carbs_100g: 13.5, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 4.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2534', name: 'Risotto ai funghi pronto in busta', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 3.5, carbs_100g: 27.5, fats_100g: 2.5, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2535', name: 'Pollo al curry pronto in vaschetta', category: 'Piatti Pronti', kcal_100g: 118, proteins_100g: 10, carbs_100g: 7.5, fats_100g: 6.5, fiber_100g: 1.5, sugar_100g: 5, fatSat_100g: 2.5, serving_size_g: 300 },
  { id: 'dt_2536', name: 'Pasta carbonara pronta in vaschetta', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 9, carbs_100g: 21, fats_100g: 9.5, fiber_100g: 1, sugar_100g: 4, fatSat_100g: 4.5, serving_size_g: 300 },
  { id: 'dt_2537', name: 'Zuppa di legumi pronta in tetrapak', category: 'Piatti Pronti', kcal_100g: 68, proteins_100g: 4, carbs_100g: 10.5, fats_100g: 1.5, fiber_100g: 3.5, sugar_100g: 5.5, fatSat_100g: 0.2, serving_size_g: 300 },
  { id: 'dt_2538', name: 'Gnocchi di patate surgelati', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 3, carbs_100g: 29, fats_100g: 1.5, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 0, serving_size_g: 300 },
  { id: 'dt_2539', name: 'Cotoletta di pollo panata surgelata', category: 'Piatti Pronti', kcal_100g: 225, proteins_100g: 14.5, carbs_100g: 18.5, fats_100g: 11, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 2, serving_size_g: 300 },
  { id: 'dt_2540', name: 'Crocchette di patate tipo Tater Tots', category: 'Piatti Pronti', kcal_100g: 217, proteins_100g: 2.5, carbs_100g: 27, fats_100g: 11, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 300 },

  // ─── Snack salati ───
  { id: 'dt_2541', name: 'Pop corn al burro commerciale (busta)', category: 'Snack e Ultra-Processati', kcal_100g: 494, proteins_100g: 8, carbs_100g: 57.5, fats_100g: 28.5, fiber_100g: 8.5, sugar_100g: 6.5, fatSat_100g: 10.5, serving_size_g: 30 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2542', name: 'Biscotti Oreo (o tipo sandwich cacao)', category: 'Pane e Prodotti da Forno', kcal_100g: 481, proteins_100g: 5, carbs_100g: 71, fats_100g: 20.5, fiber_100g: 2.5, sugar_100g: 44.5, fatSat_100g: 7.5, serving_size_g: 30 },

  // ─── Dolci confezionati ───
  { id: 'dt_2543', name: 'Muffin ai mirtilli industriale', category: 'Dolci e Zuccheri', kcal_100g: 361, proteins_100g: 5.5, carbs_100g: 55, fats_100g: 14.5, fiber_100g: 1.5, sugar_100g: 36.5, fatSat_100g: 3.5, serving_size_g: 50 },
  { id: 'dt_2544', name: 'Snickers / Mars tipo (barretta cioccolato)', category: 'Dolci e Zuccheri', kcal_100g: 489, proteins_100g: 5.5, carbs_100g: 68, fats_100g: 20, fiber_100g: 1, sugar_100g: 59, fatSat_100g: 11, serving_size_g: 50 },
  { id: 'dt_2545', name: 'Ferrero Rocher (cioccolatino pralinato)', category: 'Dolci e Zuccheri', kcal_100g: 567, proteins_100g: 8.5, carbs_100g: 54, fats_100g: 38.5, fiber_100g: 2.5, sugar_100g: 46, fatSat_100g: 10.5, serving_size_g: 50 },

  // ─── Snack salati ───
  { id: 'dt_2546', name: 'Patatine soffiato tipo Cheetos', category: 'Snack e Ultra-Processati', kcal_100g: 544, proteins_100g: 6.5, carbs_100g: 60.5, fats_100g: 30.5, fiber_100g: 1.5, sugar_100g: 5, fatSat_100g: 3, serving_size_g: 30 },

  // ─── Fast food ───
  { id: 'dt_2547', name: 'Kebab in pita industriale', category: 'Snack e Ultra-Processati', kcal_100g: 235, proteins_100g: 14, carbs_100g: 24.5, fats_100g: 10.5, fiber_100g: 2, sugar_100g: 5, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2548', name: 'Falafel industriale surgelato', category: 'Snack e Ultra-Processati', kcal_100g: 290, proteins_100g: 12.5, carbs_100g: 27.5, fats_100g: 16, fiber_100g: 6.5, sugar_100g: 3.5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2549', name: 'Spring roll / Rotoli primavera surgelati', category: 'Snack e Ultra-Processati', kcal_100g: 199, proteins_100g: 5.5, carbs_100g: 24.5, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2550', name: 'Onion rings surgelati (cipolla fritta)', category: 'Snack e Ultra-Processati', kcal_100g: 335, proteins_100g: 4.5, carbs_100g: 40.5, fats_100g: 18, fiber_100g: 2.5, sugar_100g: 6.5, fatSat_100g: 1.5, serving_size_g: 30 },
  { id: 'dt_2551', name: 'Panzerotto / calzone surgelato', category: 'Snack e Ultra-Processati', kcal_100g: 255, proteins_100g: 9, carbs_100g: 32, fats_100g: 10.5, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 4.5, serving_size_g: 30 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2552', name: 'Succo di frutta multivitaminico zuccherato', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.2, carbs_100g: 11.5, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2553', name: 'Frullato di frutta industriale (smoothie)', category: 'Bevande', kcal_100g: 65, proteins_100g: 0.5, carbs_100g: 16, fats_100g: 0.2, fiber_100g: 1, sugar_100g: 13.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2554', name: 'Tè freddo zuccherato aromatizzato (bottiglia)', category: 'Bevande', kcal_100g: 32, proteins_100g: 0.1, carbs_100g: 8, fats_100g: 0, fiber_100g: 0, sugar_100g: 7.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2555', name: 'Succo di melograno zuccherato', category: 'Bevande', kcal_100g: 54, proteins_100g: 0.2, carbs_100g: 13.5, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 12.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Fast food ───
  { id: 'dt_2556', name: 'Hamburger fast food classico', category: 'Snack e Ultra-Processati', kcal_100g: 296, proteins_100g: 13, carbs_100g: 30, fats_100g: 13, fiber_100g: 1, sugar_100g: 7, fatSat_100g: 5.5, serving_size_g: 30 },
  { id: 'dt_2557', name: 'Cheeseburger doppio fast food', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 22, carbs_100g: 27, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 8, fatSat_100g: 12, serving_size_g: 30 },
  { id: 'dt_2558', name: 'Nuggets di pollo (tipo fast food, 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 250, proteins_100g: 14, carbs_100g: 20, fats_100g: 14, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 3, serving_size_g: 30 },
  { id: 'dt_2559', name: 'Patate fritte fast food (porzione media, 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 312, proteins_100g: 3.5, carbs_100g: 41, fats_100g: 15, fiber_100g: 3, sugar_100g: 0.5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2560', name: 'Hot dog / Würstel in panino', category: 'Snack e Ultra-Processati', kcal_100g: 290, proteins_100g: 11, carbs_100g: 28, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 4, fatSat_100g: 6, serving_size_g: 30 },

  // ─── Piatti pronti ───
  { id: 'dt_2561', name: 'Pizza surgelata margherita', category: 'Piatti Pronti', kcal_100g: 222, proteins_100g: 8, carbs_100g: 32, fats_100g: 7.5, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2562', name: 'Lasagne surgelate bolognese', category: 'Piatti Pronti', kcal_100g: 130, proteins_100g: 7, carbs_100g: 11.5, fats_100g: 6.5, fiber_100g: 1, sugar_100g: 3, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2563', name: 'Sofficini di formaggio surgelati', category: 'Piatti Pronti', kcal_100g: 230, proteins_100g: 8, carbs_100g: 27, fats_100g: 10, fiber_100g: 1.5, sugar_100g: 2, fatSat_100g: 3, serving_size_g: 300 },
  { id: 'dt_2564', name: 'Bastoncini di pesce impanati surgelati', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 11, carbs_100g: 23, fats_100g: 7, fiber_100g: 1.2, sugar_100g: 1.5, fatSat_100g: 1.2, serving_size_g: 300 },
  { id: 'dt_2565', name: 'Pasta istantanea (ramen industriale, 100g cotto)', category: 'Piatti Pronti', kcal_100g: 436, proteins_100g: 9, carbs_100g: 62, fats_100g: 17, fiber_100g: 2, sugar_100g: 1, fatSat_100g: 7.5, serving_size_g: 300 },
  { id: 'dt_2566', name: 'Minestra in busta liofilizzata', category: 'Piatti Pronti', kcal_100g: 85, proteins_100g: 3, carbs_100g: 11, fats_100g: 3.5, fiber_100g: 1, sugar_100g: 5, fatSat_100g: 1.5, serving_size_g: 300 },

  // ─── Salumi ───
  { id: 'dt_2567', name: 'Wurstel di pollo e maiale', category: 'Salumi e Insaccati', kcal_100g: 289, proteins_100g: 13, carbs_100g: 3, fats_100g: 25, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 8, serving_size_g: 100 },
  { id: 'dt_2568', name: 'Salamino piccante tipo pepperoni', category: 'Salumi e Insaccati', kcal_100g: 490, proteins_100g: 20, carbs_100g: 1, fats_100g: 44, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 19, serving_size_g: 100 },
  { id: 'dt_2569', name: 'Pancetta affumicata (bacon)', category: 'Salumi e Insaccati', kcal_100g: 540, proteins_100g: 14.5, carbs_100g: 0.5, fats_100g: 50, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 100 },
  { id: 'dt_2570', name: 'Prosciutto cotto affumicato industriale', category: 'Salumi e Insaccati', kcal_100g: 170, proteins_100g: 18, carbs_100g: 3.5, fats_100g: 9, fiber_100g: 0, sugar_100g: 2, fatSat_100g: 3, serving_size_g: 100 },

  // ─── Dolci confezionati ───
  { id: 'dt_2571', name: 'Barretta cioccolato tipo Snickers (100g)', category: 'Dolci e Zuccheri', kcal_100g: 455, proteins_100g: 5, carbs_100g: 64, fats_100g: 18, fiber_100g: 1, sugar_100g: 48, fatSat_100g: 10, serving_size_g: 50 },
  { id: 'dt_2572', name: 'Cioccolato al latte confezionato (tipo Milka, 100g)', category: 'Dolci e Zuccheri', kcal_100g: 535, proteins_100g: 7.5, carbs_100g: 58, fats_100g: 30, fiber_100g: 1.5, sugar_100g: 53, fatSat_100g: 17.5, serving_size_g: 50 },
  { id: 'dt_2573', name: 'Budino confezionato alla vaniglia', category: 'Dolci e Zuccheri', kcal_100g: 110, proteins_100g: 3.5, carbs_100g: 17, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 14.5, fatSat_100g: 1.5, serving_size_g: 50 },
  { id: 'dt_2574', name: 'Gelato confezionato tipo Oreo', category: 'Dolci e Zuccheri', kcal_100g: 275, proteins_100g: 3.5, carbs_100g: 33, fats_100g: 15, fiber_100g: 0.5, sugar_100g: 28, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2575', name: 'Torta confezionata tipo plumcake (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 385, proteins_100g: 5.5, carbs_100g: 68, fats_100g: 10, fiber_100g: 1, sugar_100g: 38, fatSat_100g: 4, serving_size_g: 50 },

  // ─── Cereali confezionati ───
  { id: 'dt_2576', name: 'Cereali zuccherati tipo Corn Flakes', category: 'Cereali', kcal_100g: 381, proteins_100g: 6.5, carbs_100g: 84, fats_100g: 1.5, fiber_100g: 3, sugar_100g: 37, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_2577', name: 'Muesli con cioccolato industriale', category: 'Cereali', kcal_100g: 395, proteins_100g: 8, carbs_100g: 65, fats_100g: 10, fiber_100g: 6, sugar_100g: 22, fatSat_100g: 3, serving_size_g: 100 },
  { id: 'dt_2578', name: 'Barretta ai cereali e miele industriale', category: 'Cereali', kcal_100g: 420, proteins_100g: 5.5, carbs_100g: 68, fats_100g: 12, fiber_100g: 3.5, sugar_100g: 30, fatSat_100g: 4, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_2579', name: 'Dado da brodo industriale (per 100g)', category: 'Condimenti e Salse', kcal_100g: 195, proteins_100g: 20, carbs_100g: 15, fats_100g: 11, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 3, serving_size_g: 20 },
  { id: 'dt_2580', name: 'Salsa di soia industriale', category: 'Condimenti e Salse', kcal_100g: 53, proteins_100g: 8.1, carbs_100g: 4.9, fats_100g: 0, fiber_100g: 0.8, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2581', name: 'Ketchup industriale', category: 'Condimenti e Salse', kcal_100g: 112, proteins_100g: 1.5, carbs_100g: 25, fats_100g: 0.2, fiber_100g: 0.3, sugar_100g: 22.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2582', name: 'Maionese industriale', category: 'Condimenti e Salse', kcal_100g: 680, proteins_100g: 1.5, carbs_100g: 3.5, fats_100g: 75, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 11, serving_size_g: 20 },
  { id: 'dt_2583', name: 'Salsa barbecue industriale', category: 'Condimenti e Salse', kcal_100g: 172, proteins_100g: 1.5, carbs_100g: 38, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 34, fatSat_100g: 0.1, serving_size_g: 20 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2584', name: 'Energy drink tipo Red Bull (per 100mL)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.4, carbs_100g: 11.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2585', name: 'Cola (tipo Coca-Cola, per 100mL)', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2586', name: 'Cola Zero / Diet (per 100mL)', category: 'Bevande', kcal_100g: 0.3, proteins_100g: 0, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2587', name: 'Bevanda isotonica sportiva tipo Gatorade (per 100mL)', category: 'Bevande', kcal_100g: 26, proteins_100g: 0, carbs_100g: 6.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2588', name: 'Succo di frutta 100% in brick (per 100mL)', category: 'Bevande', kcal_100g: 50, proteins_100g: 0.3, carbs_100g: 11.5, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Dolcificanti ───
  { id: 'dt_2589', name: 'Eritritolo (dolcificante naturale)', category: 'Dolci e Zuccheri', kcal_100g: 20, proteins_100g: 0, carbs_100g: 5, fats_100g: 0, fiber_100g: 0, sugar_100g: 5, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2590', name: 'Xilitolo (dolcificante betulla)', category: 'Dolci e Zuccheri', kcal_100g: 240, proteins_100g: 0, carbs_100g: 60, fats_100g: 0, fiber_100g: 0, sugar_100g: 60, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2591', name: 'Maltitolo (sciroppo/polvere)', category: 'Dolci e Zuccheri', kcal_100g: 210, proteins_100g: 0, carbs_100g: 52, fats_100g: 0, fiber_100g: 0, sugar_100g: 52, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2592', name: 'Sorbitolo (E420)', category: 'Dolci e Zuccheri', kcal_100g: 254, proteins_100g: 0, carbs_100g: 63, fats_100g: 0, fiber_100g: 0, sugar_100g: 63, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2593', name: 'Isomalto (E953)', category: 'Dolci e Zuccheri', kcal_100g: 200, proteins_100g: 0, carbs_100g: 50, fats_100g: 0, fiber_100g: 0, sugar_100g: 50, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2594', name: 'Sciroppo di agave biologico', category: 'Dolci e Zuccheri', kcal_100g: 310, proteins_100g: 0.1, carbs_100g: 76, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 78, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2595', name: 'Sciroppo d\'acero (maple syrup)', category: 'Dolci e Zuccheri', kcal_100g: 260, proteins_100g: 0, carbs_100g: 67, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 60, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2596', name: 'Sciroppo di riso integrale', category: 'Dolci e Zuccheri', kcal_100g: 316, proteins_100g: 0.5, carbs_100g: 79, fats_100g: 0, fiber_100g: 0, sugar_100g: 79, fatSat_100g: 0, serving_size_g: 50 },

  // ─── Cereali e derivati ───
  { id: 'dt_2597', name: 'Pane proteico keto commerciale', category: 'Cereali', kcal_100g: 245, proteins_100g: 18, carbs_100g: 8, fats_100g: 14, fiber_100g: 5, sugar_100g: 2, fatSat_100g: 3, serving_size_g: 80 },

  // ─── Cereali e pasta ───
  { id: 'dt_2598', name: 'Pasta proteica keto (lupin/konjac)', category: 'Cereali', kcal_100g: 90, proteins_100g: 8, carbs_100g: 8, fats_100g: 1.5, fiber_100g: 6, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Dolci confezionati ───
  { id: 'dt_2599', name: 'Barretta keto con cioccolato fondente', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 12, carbs_100g: 15, fats_100g: 28, fiber_100g: 8, sugar_100g: 8, fatSat_100g: 10, serving_size_g: 50 },

  // ─── Snack salati ───
  { id: 'dt_2600', name: 'Cracker di semi misti keto', category: 'Snack e Ultra-Processati', kcal_100g: 520, proteins_100g: 18, carbs_100g: 12, fats_100g: 42, fiber_100g: 8, sugar_100g: 4, fatSat_100g: 5, serving_size_g: 30 },

  // ─── Cereali e derivati ───
  { id: 'dt_2601', name: 'Farina di mandorle degraissata', category: 'Cereali', kcal_100g: 500, proteins_100g: 23, carbs_100g: 18, fats_100g: 30, fiber_100g: 10, sugar_100g: 5, fatSat_100g: 4, serving_size_g: 80 },
  { id: 'dt_2602', name: 'Farina di cocco disidratata', category: 'Cereali', kcal_100g: 415, proteins_100g: 17, carbs_100g: 58, fats_100g: 9, fiber_100g: 39, sugar_100g: 9, fatSat_100g: 28, serving_size_g: 80 },

  // ─── Latte e derivati ───
  { id: 'dt_2603', name: 'Quark proteico 0% grassi', category: 'Latticini', kcal_100g: 70, proteins_100g: 12, carbs_100g: 4, fats_100g: 0.2, fiber_100g: 0, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_2604', name: 'Fiocchi di latte proteici high-protein', category: 'Latticini', kcal_100g: 78, proteins_100g: 14, carbs_100g: 3.5, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 3, fatSat_100g: 0.1, serving_size_g: 125 },
  { id: 'dt_2605', name: 'Yogurt greco 17% proteine', category: 'Latticini', kcal_100g: 96, proteins_100g: 17, carbs_100g: 6, fats_100g: 0.4, fiber_100g: 0, sugar_100g: 5.5, fatSat_100g: 0.1, serving_size_g: 125 },

  // ─── Dolci confezionati ───
  { id: 'dt_2606', name: 'Budino proteico (tipo FitBar/Max)', category: 'Dolci e Zuccheri', kcal_100g: 105, proteins_100g: 20, carbs_100g: 8, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 6, fatSat_100g: 0.5, serving_size_g: 50 },

  // ─── Cereali e pasta ───
  { id: 'dt_2607', name: 'Pasta di lenticchie rosse (alto prot.)', category: 'Cereali', kcal_100g: 342, proteins_100g: 25, carbs_100g: 58, fats_100g: 1.5, fiber_100g: 8, sugar_100g: 0.5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2608', name: 'Pasta di ceci (alto prot.)', category: 'Cereali', kcal_100g: 345, proteins_100g: 22, carbs_100g: 55, fats_100g: 6, fiber_100g: 9, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2609', name: 'Pasta di soia (alto prot.)', category: 'Cereali', kcal_100g: 350, proteins_100g: 30, carbs_100g: 48, fats_100g: 4.5, fiber_100g: 4, sugar_100g: 0.5, fatSat_100g: 0.8, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2610', name: 'Gallette di riso proteiche', category: 'Cereali', kcal_100g: 380, proteins_100g: 18, carbs_100g: 60, fats_100g: 2.5, fiber_100g: 6, sugar_100g: 5, fatSat_100g: 0.3, serving_size_g: 80 },

  // ─── Latte e derivati ───
  { id: 'dt_2611', name: 'Mozzarella light (2% grassi)', category: 'Latticini', kcal_100g: 125, proteins_100g: 20, carbs_100g: 2, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 1.5, serving_size_g: 125 },
  { id: 'dt_2612', name: 'Philadelphia light (spalmabile)', category: 'Latticini', kcal_100g: 150, proteins_100g: 7, carbs_100g: 4, fats_100g: 9, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 7, serving_size_g: 125 },
  { id: 'dt_2613', name: 'Feta light in salamoia', category: 'Latticini', kcal_100g: 180, proteins_100g: 14, carbs_100g: 2, fats_100g: 12, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 6.5, serving_size_g: 125 },
  { id: 'dt_2614', name: 'Parmigiano Reggiano DOP 30 mesi', category: 'Latticini', kcal_100g: 392, proteins_100g: 33, carbs_100g: 0, fats_100g: 28, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 17, serving_size_g: 125 },
  { id: 'dt_2615', name: 'Grana Padano DOP', category: 'Latticini', kcal_100g: 384, proteins_100g: 33, carbs_100g: 0, fats_100g: 25.6, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 16.5, serving_size_g: 125 },
  { id: 'dt_2616', name: 'Latte senza lattosio intero', category: 'Latticini', kcal_100g: 66, proteins_100g: 3.3, carbs_100g: 4.8, fats_100g: 3.7, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 1.5, serving_size_g: 125 },
  { id: 'dt_2617', name: 'Latte senza lattosio parz. scremato', category: 'Latticini', kcal_100g: 46, proteins_100g: 3.4, carbs_100g: 4.8, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 0.5, serving_size_g: 125 },
  { id: 'dt_2618', name: 'Yogurt senza lattosio naturale', category: 'Latticini', kcal_100g: 58, proteins_100g: 4, carbs_100g: 4.7, fats_100g: 3.2, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 0.1, serving_size_g: 125 },
  { id: 'dt_2619', name: 'Ricotta vaccina senza lattosio', category: 'Latticini', kcal_100g: 134, proteins_100g: 10.5, carbs_100g: 3.5, fats_100g: 10.5, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 4.5, serving_size_g: 125 },

  // ─── Cereali e pasta ───
  { id: 'dt_2620', name: 'Pasta integrale senza glutine (quinoa-mais)', category: 'Cereali', kcal_100g: 355, proteins_100g: 8, carbs_100g: 70, fats_100g: 3, fiber_100g: 6, sugar_100g: 1, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Cereali e derivati ───
  { id: 'dt_2621', name: 'Pane integrale senza glutine con semi', category: 'Cereali', kcal_100g: 265, proteins_100g: 6, carbs_100g: 44, fats_100g: 7, fiber_100g: 7, sugar_100g: 4, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_2622', name: 'Fette biscottate integrali senza glutine', category: 'Cereali', kcal_100g: 395, proteins_100g: 7, carbs_100g: 76, fats_100g: 7.5, fiber_100g: 5, sugar_100g: 4, fatSat_100g: 0.5, serving_size_g: 80 },

  // ─── Latte e derivati ───
  { id: 'dt_2623', name: 'Kefir di capra intero', category: 'Latticini', kcal_100g: 69, proteins_100g: 3.6, carbs_100g: 5, fats_100g: 4.2, fiber_100g: 0, sugar_100g: 4.8, fatSat_100g: 2.7, serving_size_g: 125 },
  { id: 'dt_2624', name: 'Latte di avena naturale non zuccherato', category: 'Latticini', kcal_100g: 45, proteins_100g: 1, carbs_100g: 7.5, fats_100g: 1.5, fiber_100g: 0.8, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_2625', name: 'Latte di soia non zuccherato (UHT)', category: 'Latticini', kcal_100g: 33, proteins_100g: 3.3, carbs_100g: 1.7, fats_100g: 1.9, fiber_100g: 0.3, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 125 },
  { id: 'dt_2626', name: 'Latte di mandorla non zuccherato', category: 'Latticini', kcal_100g: 15, proteins_100g: 0.5, carbs_100g: 0.4, fats_100g: 1.1, fiber_100g: 0.2, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Bevande ───
  { id: 'dt_2627', name: 'Bevanda di farina di avena fermentata', category: 'Bevande', kcal_100g: 52, proteins_100g: 1.2, carbs_100g: 8, fats_100g: 1.8, fiber_100g: 1.2, sugar_100g: 4, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Spezie ───
  { id: 'dt_2628', name: 'Curcuma in polvere', category: 'Condimenti e Salse', kcal_100g: 354, proteins_100g: 7.8, carbs_100g: 64.9, fats_100g: 9.9, fiber_100g: 21.1, sugar_100g: 3.2, fatSat_100g: 1.7, serving_size_g: 20 },
  { id: 'dt_2629', name: 'Cannella in polvere', category: 'Condimenti e Salse', kcal_100g: 247, proteins_100g: 3.9, carbs_100g: 80.6, fats_100g: 1.2, fiber_100g: 53.1, sugar_100g: 4.8, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_2630', name: 'Pepe nero in grani', category: 'Condimenti e Salse', kcal_100g: 251, proteins_100g: 10.4, carbs_100g: 63.9, fats_100g: 3.3, fiber_100g: 25.3, sugar_100g: 0.6, fatSat_100g: 3.1, serving_size_g: 20 },
  { id: 'dt_2631', name: 'Aglio in polvere', category: 'Condimenti e Salse', kcal_100g: 331, proteins_100g: 16.8, carbs_100g: 72.7, fats_100g: 0.7, fiber_100g: 9, sugar_100g: 5.3, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_2632', name: 'Origano essiccato', category: 'Condimenti e Salse', kcal_100g: 265, proteins_100g: 9, carbs_100g: 68.9, fats_100g: 10.3, fiber_100g: 42.5, sugar_100g: 21, fatSat_100g: 4.3, serving_size_g: 20 },
  { id: 'dt_2633', name: 'Timo essiccato', category: 'Condimenti e Salse', kcal_100g: 276, proteins_100g: 9.1, carbs_100g: 63.9, fats_100g: 7.4, fiber_100g: 37, sugar_100g: 15, fatSat_100g: 2.7, serving_size_g: 20 },

  // ─── Prodotti clinici ───
  { id: 'dt_2634', name: 'Polvere addensante (per disfagia, tipo Nutilis)', category: 'Integratori', kcal_100g: 370, proteins_100g: 0.5, carbs_100g: 90, fats_100g: 0.5, fiber_100g: 2, sugar_100g: 89, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2635', name: 'Modulare calorico lipidico (Calogen)', category: 'Integratori', kcal_100g: 900, proteins_100g: 0, carbs_100g: 0, fats_100g: 100, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 38, serving_size_g: 10 },
  { id: 'dt_2636', name: 'Modulare proteico (Protifar polvere, 100g)', category: 'Integratori', kcal_100g: 380, proteins_100g: 90, carbs_100g: 3, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.1, serving_size_g: 10 },
  { id: 'dt_2637', name: 'Modulare glucidico (Maxijul/Fantomalt)', category: 'Integratori', kcal_100g: 385, proteins_100g: 0, carbs_100g: 96, fats_100g: 0, fiber_100g: 0, sugar_100g: 96, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2638', name: 'Soluzione reidratante orale (ORS WHO)', category: 'Integratori', kcal_100g: 17, proteins_100g: 0, carbs_100g: 4.2, fats_100g: 0, fiber_100g: 0, sugar_100g: 4.2, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Fast food ───
  { id: 'dt_2639', name: 'McDonald\'s Big Mac (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 257, proteins_100g: 13, carbs_100g: 27, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 6.5, fatSat_100g: 5.5, serving_size_g: 30 },
  { id: 'dt_2640', name: 'McDonald\'s Patatine fritte grandi (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 312, proteins_100g: 3.4, carbs_100g: 41, fats_100g: 15, fiber_100g: 3, sugar_100g: 1.5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2641', name: 'McDonald\'s McNuggets (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 233, proteins_100g: 14, carbs_100g: 16, fats_100g: 13, fiber_100g: 0.5, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2642', name: 'McDonald\'s McFlurry Oreo (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 180, proteins_100g: 4, carbs_100g: 28, fats_100g: 5.5, fiber_100g: 0.5, sugar_100g: 27, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_2643', name: 'Burger King Whopper (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 254, proteins_100g: 12, carbs_100g: 28, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 5.5, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_2644', name: 'KFC Pollo fritto croccante (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 320, proteins_100g: 26, carbs_100g: 11, fats_100g: 19, fiber_100g: 0.5, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2645', name: 'Pizza surgelata Margherita (Dr. Oetker, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 252, proteins_100g: 9.5, carbs_100g: 33, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2646', name: 'Pizza surgelata Diavola/Pepperoni (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 275, proteins_100g: 11, carbs_100g: 31, fats_100g: 12, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_2647', name: 'Subway Veggie Delite (sandwich 6", per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 155, proteins_100g: 8.5, carbs_100g: 26, fats_100g: 2.5, fiber_100g: 2.5, sugar_100g: 4, fatSat_100g: 0.8, serving_size_g: 30 },
  { id: 'dt_2648', name: 'Subway Tuna sub (sandwich 6", per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 250, proteins_100g: 12, carbs_100g: 27, fats_100g: 12, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 3, serving_size_g: 30 },
  { id: 'dt_2649', name: 'Kebab (gyros) con pane pita e salse (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 240, proteins_100g: 11, carbs_100g: 25, fats_100g: 11, fiber_100g: 1.5, sugar_100g: 5.5, fatSat_100g: 4, serving_size_g: 30 },
  { id: 'dt_2650', name: 'Hot dog americano con pane e senape (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 265, proteins_100g: 10, carbs_100g: 28, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 5.5, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2651', name: 'Panino con hamburger da fast food (generico, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 255, proteins_100g: 12, carbs_100g: 27, fats_100g: 12, fiber_100g: 1.5, sugar_100g: 5.5, fatSat_100g: 4.5, serving_size_g: 30 },

  // ─── Dolci confezionati ───
  { id: 'dt_2652', name: 'Oreo biscotti (originali)', category: 'Dolci e Zuccheri', kcal_100g: 472, proteins_100g: 5, carbs_100g: 71, fats_100g: 18, fiber_100g: 2.5, sugar_100g: 45, fatSat_100g: 4.5, serving_size_g: 50 },
  { id: 'dt_2653', name: 'Digestive McVitie\'s originali', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 7, carbs_100g: 63, fats_100g: 21, fiber_100g: 3, sugar_100g: 26, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2654', name: 'Kinder Ferrero (mini, per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 555, proteins_100g: 7, carbs_100g: 60, fats_100g: 32, fiber_100g: 0.3, sugar_100g: 57, fatSat_100g: 10, serving_size_g: 50 },
  { id: 'dt_2655', name: 'Ferrero Rocher (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 608, proteins_100g: 8, carbs_100g: 50, fats_100g: 40, fiber_100g: 2.5, sugar_100g: 53, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2656', name: 'Raffaello Ferrero (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 605, proteins_100g: 6.5, carbs_100g: 48, fats_100g: 42, fiber_100g: 2, sugar_100g: 54, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2657', name: 'Kinder Sorpresa/Surprise uovo (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 520, proteins_100g: 7.5, carbs_100g: 61, fats_100g: 28, fiber_100g: 0.5, sugar_100g: 57, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2658', name: 'Bounty (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 471, proteins_100g: 4, carbs_100g: 62, fats_100g: 24, fiber_100g: 2, sugar_100g: 59, fatSat_100g: 13, serving_size_g: 50 },
  { id: 'dt_2659', name: 'Snickers (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 488, proteins_100g: 8, carbs_100g: 60, fats_100g: 21, fiber_100g: 1.5, sugar_100g: 59, fatSat_100g: 8.5, serving_size_g: 50 },
  { id: 'dt_2660', name: 'Twix (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 495, proteins_100g: 5, carbs_100g: 67, fats_100g: 22, fiber_100g: 1, sugar_100g: 60, fatSat_100g: 8.5, serving_size_g: 50 },
  { id: 'dt_2661', name: 'M&Ms al cioccolato al latte (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 494, proteins_100g: 5, carbs_100g: 70, fats_100g: 20, fiber_100g: 1, sugar_100g: 65, fatSat_100g: 8, serving_size_g: 50 },
  { id: 'dt_2662', name: 'Haribo caramelle gommose (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 343, proteins_100g: 6.5, carbs_100g: 82, fats_100g: 0.5, fiber_100g: 0, sugar_100g: 75, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2663', name: 'Mentos originali (rotolo, per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 387, proteins_100g: 0, carbs_100g: 96, fats_100g: 2, fiber_100g: 0, sugar_100g: 79, fatSat_100g: 0.8, serving_size_g: 50 },
  { id: 'dt_2664', name: 'Barretta proteica tipo Mars Hi-Protein (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 30, carbs_100g: 47, fats_100g: 10, fiber_100g: 1.5, sugar_100g: 43, fatSat_100g: 4.5, serving_size_g: 50 },

  // ─── Piatti pronti ───
  { id: 'dt_2665', name: 'Piadina confezionata industriale (Buitoni o sim.)', category: 'Piatti Pronti', kcal_100g: 295, proteins_100g: 9, carbs_100g: 43, fats_100g: 10, fiber_100g: 2, sugar_100g: 5, fatSat_100g: 4, serving_size_g: 300 },
  { id: 'dt_2666', name: 'Tortilla di grano (industriale, tipo El Sabor)', category: 'Piatti Pronti', kcal_100g: 310, proteins_100g: 8.5, carbs_100g: 49, fats_100g: 9, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2667', name: 'Wrap di fajita confezionato (pronto)', category: 'Piatti Pronti', kcal_100g: 240, proteins_100g: 10, carbs_100g: 30, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 5, fatSat_100g: 3, serving_size_g: 300 },
  { id: 'dt_2668', name: 'Tramezzino industriale prosciutto/mozzarella', category: 'Piatti Pronti', kcal_100g: 235, proteins_100g: 10, carbs_100g: 27, fats_100g: 10, fiber_100g: 1.5, sugar_100g: 4, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2669', name: 'Insalata pronta in busta (mista, 100g)', category: 'Piatti Pronti', kcal_100g: 18, proteins_100g: 1.5, carbs_100g: 2.5, fats_100g: 0.3, fiber_100g: 2, sugar_100g: 0.8, fatSat_100g: 0.1, serving_size_g: 300 },
  { id: 'dt_2670', name: 'Riso in busta pronto micro (basmati, cotto)', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 3.5, carbs_100g: 32, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 300 },
  { id: 'dt_2671', name: 'Brodo di pollo industriale (tetrapak pronto, per 100mL)', category: 'Piatti Pronti', kcal_100g: 8, proteins_100g: 0.5, carbs_100g: 0.5, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 300 },
  { id: 'dt_2672', name: 'Minestrone pronto in tetrapak (per 100g)', category: 'Piatti Pronti', kcal_100g: 52, proteins_100g: 2.5, carbs_100g: 8, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 300 },
  { id: 'dt_2673', name: 'Crema di zucca in vasetto industriale', category: 'Piatti Pronti', kcal_100g: 50, proteins_100g: 1.5, carbs_100g: 6, fats_100g: 2.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2674', name: 'Hummus industriale in vasetto (chickpea spread)', category: 'Piatti Pronti', kcal_100g: 165, proteins_100g: 7.5, carbs_100g: 14, fats_100g: 9, fiber_100g: 5, sugar_100g: 2, fatSat_100g: 1.5, serving_size_g: 300 },
  { id: 'dt_2675', name: 'Guacamole industriale in vasetto', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 1.5, carbs_100g: 8, fats_100g: 11, fiber_100g: 4.5, sugar_100g: 2.5, fatSat_100g: 1, serving_size_g: 300 },
  { id: 'dt_2676', name: 'Tzatziki industriale (salsa greca)', category: 'Piatti Pronti', kcal_100g: 88, proteins_100g: 4, carbs_100g: 4.5, fats_100g: 5.5, fiber_100g: 0.5, sugar_100g: 3.5, fatSat_100g: 1.2, serving_size_g: 300 },
  { id: 'dt_2677', name: 'Arrosto di pollo pronto in busta (taglio fette)', category: 'Piatti Pronti', kcal_100g: 140, proteins_100g: 22, carbs_100g: 3.5, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 1, serving_size_g: 300 },
  { id: 'dt_2678', name: 'Lasagne pronte surgelate (Findus o sim.)', category: 'Piatti Pronti', kcal_100g: 128, proteins_100g: 6.5, carbs_100g: 14, fats_100g: 5.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 2.5, serving_size_g: 300 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2679', name: 'Red Bull Energy Drink (lattina 250mL, per 100mL)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2680', name: 'Monster Energy (lattina 500mL, per 100mL)', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Bevande ───
  { id: 'dt_2681', name: 'Gatorade (bevanda sportiva isotonica, per 100mL)', category: 'Bevande', kcal_100g: 25, proteins_100g: 0, carbs_100g: 6, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2682', name: 'Powerade (bevanda sportiva, per 100mL)', category: 'Bevande', kcal_100g: 24, proteins_100g: 0, carbs_100g: 5.9, fats_100g: 0, fiber_100g: 0, sugar_100g: 5.9, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2683', name: 'Tè freddo al limone Nestea (per 100mL)', category: 'Bevande', kcal_100g: 18, proteins_100g: 0, carbs_100g: 4.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 4.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2684', name: 'Capri-Sun (bustina 200mL, per 100mL)', category: 'Bevande', kcal_100g: 47, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2685', name: 'Frappuccino Starbucks in bottiglia (per 100mL)', category: 'Bevande', kcal_100g: 72, proteins_100g: 2.5, carbs_100g: 13, fats_100g: 2.5, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 1.5, serving_size_g: 200 },
  { id: 'dt_2686', name: 'Succo ACE (carota, arancia, limone, per 100mL)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.5, carbs_100g: 10, fats_100g: 0.1, fiber_100g: 0.5, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Cereali da colazione ───
  { id: 'dt_2687', name: 'Frosties Kellogg\'s (per 100g)', category: 'Cereali', kcal_100g: 378, proteins_100g: 5, carbs_100g: 87, fats_100g: 1.5, fiber_100g: 1.5, sugar_100g: 39, fatSat_100g: 0.6, serving_size_g: 80 },
  { id: 'dt_2688', name: 'Coco Pops Kellogg\'s (per 100g)', category: 'Cereali', kcal_100g: 381, proteins_100g: 4.5, carbs_100g: 84, fats_100g: 2, fiber_100g: 3, sugar_100g: 38, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2689', name: 'All Bran Kellogg\'s (per 100g)', category: 'Cereali', kcal_100g: 290, proteins_100g: 14, carbs_100g: 53, fats_100g: 3.5, fiber_100g: 27, sugar_100g: 18, fatSat_100g: 0.8, serving_size_g: 80 },
  { id: 'dt_2690', name: 'Special K Kellogg\'s (per 100g)', category: 'Cereali', kcal_100g: 382, proteins_100g: 15, carbs_100g: 73, fats_100g: 2, fiber_100g: 4, sugar_100g: 17, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_2691', name: 'Granola industriale miele e noci (per 100g)', category: 'Cereali', kcal_100g: 455, proteins_100g: 9, carbs_100g: 65, fats_100g: 16, fiber_100g: 6.5, sugar_100g: 27, fatSat_100g: 2, serving_size_g: 80 },
  { id: 'dt_2692', name: 'Muesli industriale classico (per 100g)', category: 'Cereali', kcal_100g: 372, proteins_100g: 9.5, carbs_100g: 65, fats_100g: 6.5, fiber_100g: 9, sugar_100g: 13, fatSat_100g: 1.5, serving_size_g: 80 },

  // ─── Condimenti ───
  { id: 'dt_2693', name: 'Pesto rosso industriale (Barilla o sim., per 100g)', category: 'Condimenti e Salse', kcal_100g: 200, proteins_100g: 5.5, carbs_100g: 16, fats_100g: 12, fiber_100g: 2.5, sugar_100g: 5.5, fatSat_100g: 3.5, serving_size_g: 20 },
  { id: 'dt_2694', name: 'Pesto genovese industriale (Barilla, per 100g)', category: 'Condimenti e Salse', kcal_100g: 420, proteins_100g: 6.5, carbs_100g: 5.5, fats_100g: 42, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 5, serving_size_g: 20 },
  { id: 'dt_2695', name: 'Salsa di pomodoro pronta (Mutti, per 100g)', category: 'Condimenti e Salse', kcal_100g: 52, proteins_100g: 2, carbs_100g: 6.5, fats_100g: 2, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 20 },
  { id: 'dt_2696', name: 'Passata di pomodoro industriale (Mutti)', category: 'Condimenti e Salse', kcal_100g: 35, proteins_100g: 1.5, carbs_100g: 5, fats_100g: 0.3, fiber_100g: 1.2, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 20 },
  { id: 'dt_2697', name: 'Concentrato di pomodoro industriale (triplo)', category: 'Condimenti e Salse', kcal_100g: 82, proteins_100g: 4.5, carbs_100g: 14, fats_100g: 0.6, fiber_100g: 3, sugar_100g: 4.5, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_2698', name: 'Salsa Caesar industriale (bottiglia)', category: 'Condimenti e Salse', kcal_100g: 340, proteins_100g: 2, carbs_100g: 8, fats_100g: 33, fiber_100g: 0.3, sugar_100g: 5.5, fatSat_100g: 4, serving_size_g: 20 },
  { id: 'dt_2699', name: 'Maionese Hellmann\'s (per 100g)', category: 'Condimenti e Salse', kcal_100g: 662, proteins_100g: 1.2, carbs_100g: 4.5, fats_100g: 72, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 7, serving_size_g: 20 },
  { id: 'dt_2700', name: 'Senape di Digione (Maille, per 100g)', category: 'Condimenti e Salse', kcal_100g: 92, proteins_100g: 5.5, carbs_100g: 8.5, fats_100g: 4.5, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 20 },
  { id: 'dt_2701', name: 'Aceto di mele Ponti in bottiglia (per 100mL)', category: 'Condimenti e Salse', kcal_100g: 22, proteins_100g: 0, carbs_100g: 5, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Fast food ───
  { id: 'dt_2702', name: 'Hamburger McDonald\'s Big Mac (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 257, proteins_100g: 13.5, carbs_100g: 22.5, fats_100g: 13.5, fiber_100g: 1.5, sugar_100g: 4.5, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2703', name: 'Chicken McNuggets McDonald\'s (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 244, proteins_100g: 15, carbs_100g: 16.5, fats_100g: 14, fiber_100g: 0.8, sugar_100g: 0.8, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2704', name: 'Patatine fritte McDonald\'s (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 312, proteins_100g: 3.4, carbs_100g: 41.5, fats_100g: 15, fiber_100g: 3.8, sugar_100g: 0.8, fatSat_100g: 1.5, serving_size_g: 30 },
  { id: 'dt_2705', name: 'Hot dog (wurstel in panino industriale)', category: 'Snack e Ultra-Processati', kcal_100g: 290, proteins_100g: 11.5, carbs_100g: 23, fats_100g: 17.5, fiber_100g: 1, sugar_100g: 3.5, fatSat_100g: 5, serving_size_g: 30 },
  { id: 'dt_2706', name: 'Pizza surgelata margherita (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 249, proteins_100g: 10.5, carbs_100g: 31.5, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2707', name: 'Pizza surgelata 4 stagioni (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 238, proteins_100g: 10, carbs_100g: 29, fats_100g: 9, fiber_100g: 2, sugar_100g: 2.5, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2708', name: 'Kebab (doner, pane+carne+salse, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 265, proteins_100g: 14.5, carbs_100g: 20.5, fats_100g: 13.5, fiber_100g: 1.5, sugar_100g: 3.5, fatSat_100g: 4.5, serving_size_g: 30 },

  // ─── Carni e derivati ───
  { id: 'dt_2709', name: 'Würstel di pollo (industriale)', category: 'Proteine', kcal_100g: 195, proteins_100g: 12, carbs_100g: 4.5, fats_100g: 14.5, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 3, serving_size_g: 150 },
  { id: 'dt_2710', name: 'Würstel di maiale (industriale)', category: 'Proteine', kcal_100g: 305, proteins_100g: 11.5, carbs_100g: 2.5, fats_100g: 27, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 6, serving_size_g: 150 },
  { id: 'dt_2711', name: 'Cotechino (precotto in busta)', category: 'Proteine', kcal_100g: 330, proteins_100g: 16.5, carbs_100g: 2, fats_100g: 28, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 10, serving_size_g: 150 },

  // ─── Sostituti carne vegetali ───
  { id: 'dt_2712', name: 'Burger vegetale Beyond Meat (per 100g)', category: 'Proteine', kcal_100g: 250, proteins_100g: 18, carbs_100g: 5, fats_100g: 18, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 3.5, serving_size_g: 150 },
  { id: 'dt_2713', name: 'Burger vegetale Impossible Burger (per 100g)', category: 'Proteine', kcal_100g: 240, proteins_100g: 19, carbs_100g: 9, fats_100g: 14, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 4, serving_size_g: 150 },
  { id: 'dt_2714', name: 'Salsiccia vegetale (tipo Heura/Linda McCartney)', category: 'Proteine', kcal_100g: 210, proteins_100g: 17.5, carbs_100g: 7.5, fats_100g: 12.5, fiber_100g: 3, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 150 },
  { id: 'dt_2715', name: 'Nuggets di soia (plant-based)', category: 'Proteine', kcal_100g: 220, proteins_100g: 14, carbs_100g: 15.5, fats_100g: 11.5, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 1.5, serving_size_g: 150 },
  { id: 'dt_2716', name: 'Affettato vegano (soia/glutine, tipo deli)', category: 'Proteine', kcal_100g: 160, proteins_100g: 18.5, carbs_100g: 9.5, fats_100g: 5, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 0.5, serving_size_g: 150 },

  // ─── Bevande vegetali ───
  { id: 'dt_2717', name: 'Latte di avena industriale (Oatly, con zucchero)', category: 'Latticini', kcal_100g: 47, proteins_100g: 1, carbs_100g: 6.5, fats_100g: 1.5, fiber_100g: 0.5, sugar_100g: 4, fatSat_100g: 0.2, serving_size_g: 125 },
  { id: 'dt_2718', name: 'Latte di mandorla industriale (Alpro/Vaalia)', category: 'Latticini', kcal_100g: 24, proteins_100g: 0.5, carbs_100g: 3, fats_100g: 1.1, fiber_100g: 0.4, sugar_100g: 2.5, fatSat_100g: 0.1, serving_size_g: 125 },
  { id: 'dt_2719', name: 'Latte di soia industriale (Alpro originale)', category: 'Latticini', kcal_100g: 39, proteins_100g: 3.3, carbs_100g: 2.8, fats_100g: 1.8, fiber_100g: 0.5, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 125 },
  { id: 'dt_2720', name: 'Latte di riso (Rice Dream, per 100mL)', category: 'Latticini', kcal_100g: 47, proteins_100g: 0.3, carbs_100g: 9.5, fats_100g: 1, fiber_100g: 0.1, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 125 },
  { id: 'dt_2721', name: 'Yogurt di cocco (coconut yogurt)', category: 'Latticini', kcal_100g: 130, proteins_100g: 1, carbs_100g: 8.5, fats_100g: 12.5, fiber_100g: 0.5, sugar_100g: 4, fatSat_100g: 9, serving_size_g: 125 },
  { id: 'dt_2722', name: 'Yogurt di soia (Alpro, gusto neutro)', category: 'Latticini', kcal_100g: 65, proteins_100g: 4.5, carbs_100g: 5.5, fats_100g: 2.7, fiber_100g: 0.5, sugar_100g: 4, fatSat_100g: 0.4, serving_size_g: 125 },

  // ─── Sostituti latticini ───
  { id: 'dt_2723', name: 'Formaggio vegano a base cocco (tipo Violife)', category: 'Latticini', kcal_100g: 280, proteins_100g: 0.5, carbs_100g: 11.5, fats_100g: 25.5, fiber_100g: 0.5, sugar_100g: 1.5, fatSat_100g: 12, serving_size_g: 125 },
  { id: 'dt_2724', name: 'Panna vegetale (soia/cocco, tipo Soy Whip)', category: 'Latticini', kcal_100g: 195, proteins_100g: 0.8, carbs_100g: 8.5, fats_100g: 18, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 6.5, serving_size_g: 125 },

  // ─── Energy drink ───
  { id: 'dt_2725', name: 'Red Bull Energy Drink (per 100mL)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2726', name: 'Monster Energy (per 100mL)', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2727', name: 'Rockstar Energy Drink (per 100mL)', category: 'Bevande', kcal_100g: 42, proteins_100g: 0.1, carbs_100g: 10, fats_100g: 0, fiber_100g: 0, sugar_100g: 10, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2728', name: 'Red Bull Zero/Sugarfree (per 100mL)', category: 'Bevande', kcal_100g: 3, proteins_100g: 0, carbs_100g: 0.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2729', name: 'Gatorade (bevanda sportiva, per 100mL)', category: 'Bevande', kcal_100g: 26, proteins_100g: 0, carbs_100g: 6, fats_100g: 0, fiber_100g: 0, sugar_100g: 6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2730', name: 'Powerade (bevanda sportiva, per 100mL)', category: 'Bevande', kcal_100g: 27, proteins_100g: 0, carbs_100g: 6.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 6.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Barrette proteiche ───
  { id: 'dt_2731', name: 'Barretta proteica Quest Bar (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 366, proteins_100g: 41.5, carbs_100g: 43.5, fats_100g: 10.5, fiber_100g: 23, sugar_100g: 5, fatSat_100g: 2.5, serving_size_g: 30 },
  { id: 'dt_2732', name: 'Barretta proteica Snickers Protein (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 415, proteins_100g: 30, carbs_100g: 44, fats_100g: 17, fiber_100g: 5, sugar_100g: 20, fatSat_100g: 8, serving_size_g: 30 },
  { id: 'dt_2733', name: 'Barretta proteica Clif Bar (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 372, proteins_100g: 22.5, carbs_100g: 60, fats_100g: 8.5, fiber_100g: 7.5, sugar_100g: 22, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2734', name: 'Barretta energetica Cereal (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 390, proteins_100g: 7.5, carbs_100g: 68, fats_100g: 10.5, fiber_100g: 4, sugar_100g: 24, fatSat_100g: 4.5, serving_size_g: 30 },
  { id: 'dt_2735', name: 'Barretta ai cereali Kellogg\'s Special K (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 12, carbs_100g: 67, fats_100g: 8, fiber_100g: 4.5, sugar_100g: 28, fatSat_100g: 2.5, serving_size_g: 30 },

  // ─── Dolci ───
  { id: 'dt_2736', name: 'Tiramisù industriale (porzione confezionata)', category: 'Dolci e Zuccheri', kcal_100g: 316, proteins_100g: 5.5, carbs_100g: 31.5, fats_100g: 19, fiber_100g: 0.5, sugar_100g: 23, fatSat_100g: 8, serving_size_g: 50 },
  { id: 'dt_2737', name: 'Panna cotta surgelata (monoporzione)', category: 'Dolci e Zuccheri', kcal_100g: 195, proteins_100g: 3, carbs_100g: 19.5, fats_100g: 13.5, fiber_100g: 0, sugar_100g: 14, fatSat_100g: 10.5, serving_size_g: 50 },
  { id: 'dt_2738', name: 'Cheesecake industriale (porzione)', category: 'Dolci e Zuccheri', kcal_100g: 322, proteins_100g: 5.5, carbs_100g: 34.5, fats_100g: 18.5, fiber_100g: 0.5, sugar_100g: 22, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2739', name: 'Merendina Mulino Bianco tipo Plumcake', category: 'Dolci e Zuccheri', kcal_100g: 393, proteins_100g: 7.5, carbs_100g: 55.5, fats_100g: 16.5, fiber_100g: 1.5, sugar_100g: 22.5, fatSat_100g: 5.5, serving_size_g: 50 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2740', name: 'Biscotti Pan di Stelle (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 494, proteins_100g: 8, carbs_100g: 62.5, fats_100g: 23, fiber_100g: 2, sugar_100g: 28, fatSat_100g: 7, serving_size_g: 30 },
  { id: 'dt_2741', name: 'Biscotti Digestive McVitie\'s (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 468, proteins_100g: 7.5, carbs_100g: 64, fats_100g: 20, fiber_100g: 3.5, sugar_100g: 22, fatSat_100g: 6.5, serving_size_g: 30 },

  // ─── Latte e derivati ───
  { id: 'dt_2742', name: 'Yogurt alla frutta Müller (per 100g)', category: 'Latticini', kcal_100g: 88, proteins_100g: 3.8, carbs_100g: 13, fats_100g: 3.5, fiber_100g: 0.2, sugar_100g: 12.5, fatSat_100g: 1.8, serving_size_g: 125 },
  { id: 'dt_2743', name: 'Yogurt al caffè Müller Corner (per 100g)', category: 'Latticini', kcal_100g: 125, proteins_100g: 4.5, carbs_100g: 17.5, fats_100g: 4.5, fiber_100g: 0, sugar_100g: 15.5, fatSat_100g: 2, serving_size_g: 125 },

  // ─── Dolci ───
  { id: 'dt_2744', name: 'Pandoro (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 401, proteins_100g: 7.5, carbs_100g: 62, fats_100g: 14.5, fiber_100g: 1, sugar_100g: 26, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2745', name: 'Panettone (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 365, proteins_100g: 7.5, carbs_100g: 56, fats_100g: 13.5, fiber_100g: 2, sugar_100g: 26.5, fatSat_100g: 7.5, serving_size_g: 50 },
  { id: 'dt_2746', name: 'Colomba pasquale (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 390, proteins_100g: 7, carbs_100g: 58.5, fats_100g: 15.5, fiber_100g: 1.5, sugar_100g: 26, fatSat_100g: 9, serving_size_g: 50 },
  { id: 'dt_2747', name: 'Torrone morbido (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 448, proteins_100g: 8, carbs_100g: 64, fats_100g: 19, fiber_100g: 2.5, sugar_100g: 52, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2748', name: 'Torrone duro (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 460, proteins_100g: 9, carbs_100g: 68.5, fats_100g: 17.5, fiber_100g: 3, sugar_100g: 58, fatSat_100g: 5, serving_size_g: 50 },

  // ─── Salumi e insaccati ───
  { id: 'dt_2749', name: 'Bacon affumicato (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 541, proteins_100g: 12.5, carbs_100g: 0.8, fats_100g: 52, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 19, serving_size_g: 50 },

  // ─── Pesce e prodotti ittici ───
  { id: 'dt_2750', name: 'Bastoncini di pesce surgelati (per 100g)', category: 'Proteine', kcal_100g: 209, proteins_100g: 11, carbs_100g: 24.5, fats_100g: 7.5, fiber_100g: 1, sugar_100g: 1, fatSat_100g: 1.3, serving_size_g: 150 },

  // ─── Prodotti pronti ───
  { id: 'dt_2751', name: 'Arancino/Arancina surgelato (per 100g)', category: 'Piatti Pronti', kcal_100g: 198, proteins_100g: 6.5, carbs_100g: 31.5, fats_100g: 5.5, fiber_100g: 1.5, sugar_100g: 1.5, fatSat_100g: 1.5, serving_size_g: 300 },
  { id: 'dt_2752', name: 'Risotto surgelato pronto (per 100g)', category: 'Piatti Pronti', kcal_100g: 115, proteins_100g: 2.8, carbs_100g: 21, fats_100g: 2.5, fiber_100g: 0.8, sugar_100g: 1.2, fatSat_100g: 1, serving_size_g: 300 },
  { id: 'dt_2753', name: 'Paella surgelata pronta (per 100g)', category: 'Piatti Pronti', kcal_100g: 130, proteins_100g: 6, carbs_100g: 21.5, fats_100g: 2.8, fiber_100g: 1.2, sugar_100g: 1.5, fatSat_100g: 0.8, serving_size_g: 300 },
  { id: 'dt_2754', name: 'Lasagne surgelate al ragù (per 100g)', category: 'Piatti Pronti', kcal_100g: 145, proteins_100g: 7.5, carbs_100g: 18.5, fats_100g: 5.5, fiber_100g: 1.5, sugar_100g: 2.8, fatSat_100g: 2.5, serving_size_g: 300 },
  { id: 'dt_2755', name: 'Pizza surgelata margherita (per 100g)', category: 'Piatti Pronti', kcal_100g: 242, proteins_100g: 9.5, carbs_100g: 31.5, fats_100g: 9.5, fiber_100g: 2, sugar_100g: 4, fatSat_100g: 4.5, serving_size_g: 300 },
  { id: 'dt_2756', name: 'Hot dog (würstel in pane, per 100g)', category: 'Piatti Pronti', kcal_100g: 271, proteins_100g: 10.5, carbs_100g: 30.5, fats_100g: 12.5, fiber_100g: 1.5, sugar_100g: 5.5, fatSat_100g: 5.5, serving_size_g: 300 },

  // ─── Dolci ───
  { id: 'dt_2757', name: 'Caramelle gommose (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 330, proteins_100g: 5, carbs_100g: 77, fats_100g: 0, fiber_100g: 0, sugar_100g: 55, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2758', name: 'Chewing gum senza zucchero (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 165, proteins_100g: 0, carbs_100g: 68, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2759', name: 'Barretta Kinder Bueno (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 557, proteins_100g: 8.5, carbs_100g: 56.5, fats_100g: 33.5, fiber_100g: 2, sugar_100g: 47, fatSat_100g: 19.5, serving_size_g: 50 },
  { id: 'dt_2760', name: 'Barretta Snickers (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 488, proteins_100g: 8.5, carbs_100g: 62.5, fats_100g: 21.5, fiber_100g: 1.5, sugar_100g: 47, fatSat_100g: 13, serving_size_g: 50 },
  { id: 'dt_2761', name: 'Barretta Mars (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 449, proteins_100g: 4.5, carbs_100g: 69.5, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 58, fatSat_100g: 13.5, serving_size_g: 50 },
  { id: 'dt_2762', name: 'Barretta Kit Kat (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 518, proteins_100g: 6.5, carbs_100g: 63.5, fats_100g: 26.5, fiber_100g: 1.5, sugar_100g: 47, fatSat_100g: 16, serving_size_g: 50 },

  // ─── Snack ───
  { id: 'dt_2763', name: 'Patatine Lay\'s Classic (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 536, proteins_100g: 6.5, carbs_100g: 52, fats_100g: 34, fiber_100g: 4.5, sugar_100g: 0.5, fatSat_100g: 3.5, serving_size_g: 100 },
  { id: 'dt_2764', name: 'Patatine Pringles Original (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 529, proteins_100g: 4.5, carbs_100g: 62.5, fats_100g: 30, fiber_100g: 3, sugar_100g: 2.5, fatSat_100g: 4, serving_size_g: 100 },
  { id: 'dt_2765', name: 'Popcorn microonde burro (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 456, proteins_100g: 8, carbs_100g: 58, fats_100g: 22.5, fiber_100g: 9.5, sugar_100g: 1, fatSat_100g: 10, serving_size_g: 100 },
  { id: 'dt_2766', name: 'Nachos con formaggio Doritos (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 490, proteins_100g: 7.5, carbs_100g: 67.5, fats_100g: 21, fiber_100g: 3.5, sugar_100g: 2.5, fatSat_100g: 4.5, serving_size_g: 100 },

  // ─── Condimenti ───
  { id: 'dt_2767', name: 'Salsa ketchup Heinz (per 100g)', category: 'Condimenti e Salse', kcal_100g: 101, proteins_100g: 1.3, carbs_100g: 24, fats_100g: 0.1, fiber_100g: 0.8, sugar_100g: 22, fatSat_100g: 0.1, serving_size_g: 20 },
  { id: 'dt_2768', name: 'Maionese industriale (per 100g)', category: 'Condimenti e Salse', kcal_100g: 700, proteins_100g: 1.1, carbs_100g: 2.9, fats_100g: 78, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 8, serving_size_g: 20 },
  { id: 'dt_2769', name: 'Senape (per 100g)', category: 'Condimenti e Salse', kcal_100g: 66, proteins_100g: 3.7, carbs_100g: 6.5, fats_100g: 4, fiber_100g: 3.2, sugar_100g: 2.5, fatSat_100g: 0.3, serving_size_g: 20 },

  // ─── Prodotti pronti ───
  { id: 'dt_2770', name: 'Burger vegano industriale (per 100g)', category: 'Piatti Pronti', kcal_100g: 230, proteins_100g: 17.5, carbs_100g: 22.5, fats_100g: 8.5, fiber_100g: 4.5, sugar_100g: 3.5, fatSat_100g: 1.5, serving_size_g: 300 },

  // ─── Salumi e insaccati ───
  { id: 'dt_2771', name: 'Wurstel di pollo (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 220, proteins_100g: 12.5, carbs_100g: 3.5, fats_100g: 17.5, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2772', name: 'Wurstel di suino (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 296, proteins_100g: 11.5, carbs_100g: 1.5, fats_100g: 26, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 10.5, serving_size_g: 50 },
  { id: 'dt_2773', name: 'Salame Milano affettato (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 406, proteins_100g: 27.5, carbs_100g: 0.5, fats_100g: 33, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 14.5, serving_size_g: 50 },
  { id: 'dt_2774', name: 'Mortadella IGP (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 286, proteins_100g: 15, carbs_100g: 2.5, fats_100g: 24.5, fiber_100g: 0, sugar_100g: 1.5, fatSat_100g: 10.5, serving_size_g: 50 },

  // ─── Prodotti pronti ───
  { id: 'dt_2775', name: 'Nuggets di pollo surgelati (per 100g)', category: 'Piatti Pronti', kcal_100g: 247, proteins_100g: 14.5, carbs_100g: 23, fats_100g: 12, fiber_100g: 1, sugar_100g: 1.5, fatSat_100g: 2.5, serving_size_g: 300 },
  { id: 'dt_2776', name: 'Stick di mozzarella impanata surgelata (per 100g)', category: 'Piatti Pronti', kcal_100g: 285, proteins_100g: 13, carbs_100g: 26.5, fats_100g: 15.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 6.5, serving_size_g: 300 },

  // ─── Dolci ───
  { id: 'dt_2777', name: 'Cornetto confezionato (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 415, proteins_100g: 6.5, carbs_100g: 57.5, fats_100g: 19.5, fiber_100g: 1.5, sugar_100g: 22, fatSat_100g: 12.5, serving_size_g: 50 },
  { id: 'dt_2778', name: 'Merendina Kinder Pinguì (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 420, proteins_100g: 7, carbs_100g: 51, fats_100g: 22, fiber_100g: 0.5, sugar_100g: 39.5, fatSat_100g: 14.5, serving_size_g: 50 },

  // ─── Bevande ───
  { id: 'dt_2779', name: 'Bevanda energy drink tipo Monster (per 100ml)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2780', name: 'Bevanda energy drink tipo Red Bull (per 100ml)', category: 'Bevande', kcal_100g: 45, proteins_100g: 0.4, carbs_100g: 11.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 11, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2781', name: 'Bibita gassata tipo Cola (per 100ml)', category: 'Bevande', kcal_100g: 42, proteins_100g: 0, carbs_100g: 10.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2782', name: 'Succo di frutta industriale ACE (per 100ml)', category: 'Bevande', kcal_100g: 47, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10.8, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_2783', name: 'Latte condensato zuccherato (per 100g)', category: 'Latticini', kcal_100g: 321, proteins_100g: 7.9, carbs_100g: 55.5, fats_100g: 9, fiber_100g: 0, sugar_100g: 54.5, fatSat_100g: 6, serving_size_g: 125 },

  // ─── Dolci ───
  { id: 'dt_2784', name: 'Crema spalmabile nocciole e cioccolato Nutella (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 539, proteins_100g: 6.3, carbs_100g: 57.5, fats_100g: 30.9, fiber_100g: 3.4, sugar_100g: 56.3, fatSat_100g: 10.6, serving_size_g: 50 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2785', name: 'Biscotto Oreo (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 473, proteins_100g: 5, carbs_100g: 68.5, fats_100g: 21, fiber_100g: 2.5, sugar_100g: 45, fatSat_100g: 6.5, serving_size_g: 30 },

  // ─── Dolci ───
  { id: 'dt_2786', name: 'Crostata industriale alla marmellata (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 387, proteins_100g: 5, carbs_100g: 61.5, fats_100g: 14.5, fiber_100g: 2, sugar_100g: 30.5, fatSat_100g: 6.5, serving_size_g: 50 },
  { id: 'dt_2787', name: 'Cioccolato bianco industriale (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 539, proteins_100g: 5.9, carbs_100g: 59.5, fats_100g: 32.5, fiber_100g: 0, sugar_100g: 55.5, fatSat_100g: 20.5, serving_size_g: 50 },
  { id: 'dt_2788', name: 'Brioches confezionata (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 380, proteins_100g: 8.5, carbs_100g: 52, fats_100g: 16.5, fiber_100g: 1.5, sugar_100g: 20, fatSat_100g: 7.5, serving_size_g: 50 },

  // ─── Cereali e derivati ───
  { id: 'dt_2789', name: 'Cereali da colazione tipo Frosties Kellogg\'s (per 100g)', category: 'Cereali', kcal_100g: 378, proteins_100g: 5.5, carbs_100g: 87.5, fats_100g: 0.8, fiber_100g: 2, sugar_100g: 37, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2790', name: 'Cereali Chocapic Nestlé (per 100g)', category: 'Cereali', kcal_100g: 386, proteins_100g: 7.5, carbs_100g: 78.5, fats_100g: 5, fiber_100g: 5, sugar_100g: 28.5, fatSat_100g: 1.5, serving_size_g: 80 },

  // ─── Dolci ───
  { id: 'dt_2791', name: 'Croissant industriale (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 406, proteins_100g: 7, carbs_100g: 50.5, fats_100g: 21.5, fiber_100g: 2, sugar_100g: 12.5, fatSat_100g: 13, serving_size_g: 50 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2792', name: 'Ringo al cioccolato (Pavesi, per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 490, proteins_100g: 6, carbs_100g: 67, fats_100g: 22, fiber_100g: 1.5, sugar_100g: 41, fatSat_100g: 9, serving_size_g: 30 },
  { id: 'dt_2793', name: 'Abbracci Mulino Bianco (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 480, proteins_100g: 7.5, carbs_100g: 68.5, fats_100g: 18.5, fiber_100g: 2.5, sugar_100g: 28, fatSat_100g: 6.5, serving_size_g: 30 },
  { id: 'dt_2794', name: 'Baiocchi Mulino Bianco (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 502, proteins_100g: 7, carbs_100g: 64.5, fats_100g: 24.5, fiber_100g: 2, sugar_100g: 31, fatSat_100g: 7.5, serving_size_g: 30 },
  { id: 'dt_2795', name: 'Macine Mulino Bianco (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 445, proteins_100g: 8, carbs_100g: 69, fats_100g: 14, fiber_100g: 3.5, sugar_100g: 24, fatSat_100g: 3.5, serving_size_g: 30 },
  { id: 'dt_2796', name: 'TUC crackers salati (Lu, per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 475, proteins_100g: 8, carbs_100g: 63.5, fats_100g: 19, fiber_100g: 2.5, sugar_100g: 4.5, fatSat_100g: 4.5, serving_size_g: 30 },

  // ─── Alimenti prima infanzia ───
  { id: 'dt_2797', name: 'Plasmon biscotti per bambini (per 100g)', category: 'Alimenti infanzia', kcal_100g: 405, proteins_100g: 10.5, carbs_100g: 72, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 23, fatSat_100g: 3.5, serving_size_g: 100 },

  // ─── Dolci confezionati ───
  { id: 'dt_2798', name: 'Ciocorì (Kinder/Ferrero, per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 540, proteins_100g: 7.5, carbs_100g: 61.5, fats_100g: 30.5, fiber_100g: 1.5, sugar_100g: 54.5, fatSat_100g: 11.5, serving_size_g: 50 },

  // ─── Latte e derivati ───
  { id: 'dt_2799', name: 'Fruttolo (Danone, yogurt da bere frutta, per 100g)', category: 'Latticini', kcal_100g: 75, proteins_100g: 3.5, carbs_100g: 12.5, fats_100g: 1.5, fiber_100g: 0.3, sugar_100g: 11.5, fatSat_100g: 0.8, serving_size_g: 125 },

  // ─── Gelati ───
  { id: 'dt_2800', name: 'Magnum Classic Algida (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 290, proteins_100g: 3.5, carbs_100g: 33, fats_100g: 18.5, fiber_100g: 0.5, sugar_100g: 29, fatSat_100g: 15.5, serving_size_g: 50 },
  { id: 'dt_2801', name: 'Cornetto Algida classico (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 275, proteins_100g: 4, carbs_100g: 37, fats_100g: 13.5, fiber_100g: 1, sugar_100g: 30, fatSat_100g: 9.5, serving_size_g: 50 },
  { id: 'dt_2802', name: 'Calippo Algida limone (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 70, proteins_100g: 0.2, carbs_100g: 16.8, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 16.5, fatSat_100g: 0, serving_size_g: 50 },
  { id: 'dt_2803', name: 'Twister Algida fragola (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 82, proteins_100g: 1, carbs_100g: 15, fats_100g: 2, fiber_100g: 0.2, sugar_100g: 14.5, fatSat_100g: 1, serving_size_g: 50 },
  { id: 'dt_2804', name: 'Häagen-Dazs Vanilla (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 271, proteins_100g: 4, carbs_100g: 26.5, fats_100g: 17.5, fiber_100g: 0, sugar_100g: 23.5, fatSat_100g: 11.5, serving_size_g: 50 },
  { id: 'dt_2805', name: 'Sammontana Cremino (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 295, proteins_100g: 3, carbs_100g: 36.5, fats_100g: 17, fiber_100g: 0.5, sugar_100g: 33, fatSat_100g: 12, serving_size_g: 50 },
  { id: 'dt_2806', name: 'Solero al mango (per 100g)', category: 'Dolci e Zuccheri', kcal_100g: 78, proteins_100g: 1, carbs_100g: 16, fats_100g: 1.5, fiber_100g: 0.5, sugar_100g: 15, fatSat_100g: 0.5, serving_size_g: 50 },

  // ─── Bibite zuccherate ───
  { id: 'dt_2807', name: 'Aranciata San Pellegrino (per 100mL)', category: 'Bevande', kcal_100g: 39, proteins_100g: 0, carbs_100g: 9.4, fats_100g: 0, fiber_100g: 0, sugar_100g: 9, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2808', name: 'Chinotto San Pellegrino (per 100mL)', category: 'Bevande', kcal_100g: 34, proteins_100g: 0, carbs_100g: 8.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2809', name: 'Lemonsoda (San Pellegrino, per 100mL)', category: 'Bevande', kcal_100g: 38, proteins_100g: 0, carbs_100g: 9.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 8.8, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2810', name: 'Sprite (per 100mL)', category: 'Bevande', kcal_100g: 29, proteins_100g: 0, carbs_100g: 7, fats_100g: 0, fiber_100g: 0, sugar_100g: 7, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2811', name: 'Fanta Arancia (per 100mL)', category: 'Bevande', kcal_100g: 48, proteins_100g: 0, carbs_100g: 11.3, fats_100g: 0, fiber_100g: 0, sugar_100g: 11.3, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2812', name: 'Pepsi Cola (per 100mL)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0, carbs_100g: 10.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2813', name: 'San Benedetto Ice Tea pesca (per 100mL)', category: 'Bevande', kcal_100g: 19, proteins_100g: 0, carbs_100g: 4.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2814', name: 'Succo di frutta Yoga ACE brick (per 100mL)', category: 'Bevande', kcal_100g: 46, proteins_100g: 0.5, carbs_100g: 11, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 10.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2815', name: 'Succo Yoga pesca (brick 200mL, per 100mL)', category: 'Bevande', kcal_100g: 49, proteins_100g: 0.3, carbs_100g: 11.8, fats_100g: 0.1, fiber_100g: 0.2, sugar_100g: 11.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2816', name: 'Coca-Cola Zero Sugar (per 100mL)', category: 'Bevande', kcal_100g: 1, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Piatti pronti ───
  { id: 'dt_2817', name: 'Tortellini ricotta e spinaci Giovanni Rana (per 100g)', category: 'Piatti Pronti', kcal_100g: 265, proteins_100g: 11.5, carbs_100g: 37, fats_100g: 8.5, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2818', name: 'Ravioli di carne Giovanni Rana (per 100g)', category: 'Piatti Pronti', kcal_100g: 250, proteins_100g: 11, carbs_100g: 34.5, fats_100g: 7.5, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 3, serving_size_g: 300 },
  { id: 'dt_2819', name: 'Buitoni pasta ripiena ricotta (per 100g)', category: 'Piatti Pronti', kcal_100g: 248, proteins_100g: 10, carbs_100g: 34.5, fats_100g: 8, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2820', name: 'Findus 4 Salti in Padella pollo e verdure (per 100g)', category: 'Piatti Pronti', kcal_100g: 105, proteins_100g: 7.5, carbs_100g: 11.5, fats_100g: 3.5, fiber_100g: 3, sugar_100g: 2, fatSat_100g: 1, serving_size_g: 300 },
  { id: 'dt_2821', name: 'Findus 4 Salti in Padella carbonara (per 100g)', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 6.5, carbs_100g: 19.5, fats_100g: 8.5, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 3.5, serving_size_g: 300 },
  { id: 'dt_2822', name: 'Wok surgelato misto asia (per 100g)', category: 'Piatti Pronti', kcal_100g: 95, proteins_100g: 5, carbs_100g: 12.5, fats_100g: 2.5, fiber_100g: 3.5, sugar_100g: 5, fatSat_100g: 0.5, serving_size_g: 300 },
  { id: 'dt_2823', name: 'Polpette di carne surgelate (per 100g)', category: 'Piatti Pronti', kcal_100g: 240, proteins_100g: 14.5, carbs_100g: 10.5, fats_100g: 16, fiber_100g: 1, sugar_100g: 2.5, fatSat_100g: 4, serving_size_g: 300 },
  { id: 'dt_2824', name: 'Cordon bleu di pollo surgelato (per 100g)', category: 'Piatti Pronti', kcal_100g: 225, proteins_100g: 14, carbs_100g: 16, fats_100g: 12, fiber_100g: 1, sugar_100g: 1.5, fatSat_100g: 4.5, serving_size_g: 300 },
  { id: 'dt_2825', name: 'Sofficini al formaggio Findus (per 100g)', category: 'Piatti Pronti', kcal_100g: 215, proteins_100g: 7.5, carbs_100g: 25.5, fats_100g: 9.5, fiber_100g: 1.5, sugar_100g: 3, fatSat_100g: 4.5, serving_size_g: 300 },

  // ─── Bevande ───
  { id: 'dt_2826', name: 'Kombucha (bevanda fermentata tè, per 100mL)', category: 'Bevande', kcal_100g: 16, proteins_100g: 0, carbs_100g: 3.8, fats_100g: 0, fiber_100g: 0, sugar_100g: 2.5, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Latte e derivati ───
  { id: 'dt_2827', name: 'Kefir di latte vaccino intero (per 100g)', category: 'Latticini', kcal_100g: 65, proteins_100g: 3.4, carbs_100g: 4.6, fats_100g: 3.5, fiber_100g: 0, sugar_100g: 4.5, fatSat_100g: 1.5, serving_size_g: 125 },

  // ─── Sostituti carne vegetali ───
  { id: 'dt_2828', name: 'Tofu al naturale (industriale, per 100g)', category: 'Proteine', kcal_100g: 80, proteins_100g: 8.1, carbs_100g: 1.9, fats_100g: 4.8, fiber_100g: 0.3, sugar_100g: 0.3, fatSat_100g: 0.7, serving_size_g: 150 },
  { id: 'dt_2829', name: 'Seitan al naturale (per 100g)', category: 'Proteine', kcal_100g: 140, proteins_100g: 25, carbs_100g: 4.5, fats_100g: 1.9, fiber_100g: 0.6, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 150 },
  { id: 'dt_2830', name: 'Tempeh di soia pastorizzato (per 100g)', category: 'Proteine', kcal_100g: 195, proteins_100g: 19, carbs_100g: 9.4, fats_100g: 11, fiber_100g: 4.1, sugar_100g: 0, fatSat_100g: 1.5, serving_size_g: 150 },

  // ─── Condimenti ───
  { id: 'dt_2831', name: 'Salsa BBQ (ketchup affumicato, per 100g)', category: 'Condimenti e Salse', kcal_100g: 106, proteins_100g: 1, carbs_100g: 25, fats_100g: 0.4, fiber_100g: 0.5, sugar_100g: 23, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2832', name: 'Salsa ranch (per 100g)', category: 'Condimenti e Salse', kcal_100g: 310, proteins_100g: 1.5, carbs_100g: 5, fats_100g: 31, fiber_100g: 0.2, sugar_100g: 3.5, fatSat_100g: 4, serving_size_g: 20 },
  { id: 'dt_2833', name: 'Salsa teriyaki industriale (per 100g)', category: 'Condimenti e Salse', kcal_100g: 87, proteins_100g: 5, carbs_100g: 18.5, fats_100g: 0.1, fiber_100g: 0.1, sugar_100g: 15.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2834', name: 'Salsa Worcestershire (per 100mL)', category: 'Condimenti e Salse', kcal_100g: 78, proteins_100g: 1.2, carbs_100g: 18.4, fats_100g: 0.1, fiber_100g: 0.4, sugar_100g: 16, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2835', name: 'Tabasco (salsa piccante, per 100mL)', category: 'Condimenti e Salse', kcal_100g: 12, proteins_100g: 0.5, carbs_100g: 1, fats_100g: 0.3, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2836', name: 'Miele millefiori industriale (per 100g)', category: 'Condimenti e Salse', kcal_100g: 304, proteins_100g: 0.3, carbs_100g: 82.4, fats_100g: 0, fiber_100g: 0.2, sugar_100g: 75, fatSat_100g: 0, serving_size_g: 20 },
  { id: 'dt_2837', name: 'Confettura fragole industriale (per 100g)', category: 'Condimenti e Salse', kcal_100g: 250, proteins_100g: 0.5, carbs_100g: 65, fats_100g: 0.1, fiber_100g: 1.2, sugar_100g: 55, fatSat_100g: 0, serving_size_g: 20 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2838', name: 'Nutella Biscuits (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 510, proteins_100g: 6.5, carbs_100g: 64.5, fats_100g: 25, fiber_100g: 1.5, sugar_100g: 38, fatSat_100g: 7, serving_size_g: 30 },

  // ─── Alimenti prima infanzia ───
  { id: 'dt_2839', name: 'Plasmon Omogeneizzato frutta mela-pera (per 100g)', category: 'Alimenti infanzia', kcal_100g: 54, proteins_100g: 0.4, carbs_100g: 12.8, fats_100g: 0.1, fiber_100g: 0.9, sugar_100g: 11.5, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2840', name: 'Plasmon Omogeneizzato carne manzo (per 100g)', category: 'Alimenti infanzia', kcal_100g: 70, proteins_100g: 10, carbs_100g: 3.5, fats_100g: 1.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.4, serving_size_g: 100 },
  { id: 'dt_2841', name: 'Plasmon Omogeneizzato tacchino (per 100g)', category: 'Alimenti infanzia', kcal_100g: 65, proteins_100g: 9.5, carbs_100g: 3, fats_100g: 1.2, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.3, serving_size_g: 100 },
  { id: 'dt_2842', name: 'Plasmon Crema di verdure liofilizzata (per 100g polvere)', category: 'Alimenti infanzia', kcal_100g: 352, proteins_100g: 15, carbs_100g: 65, fats_100g: 3, fiber_100g: 8, sugar_100g: 8, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_2843', name: 'Latte formula 2 seguito (6-12 mesi, polvere per 100g)', category: 'Alimenti infanzia', kcal_100g: 503, proteins_100g: 13.5, carbs_100g: 55.5, fats_100g: 26.5, fiber_100g: 1.5, sugar_100g: 49, fatSat_100g: 10, serving_size_g: 100 },
  { id: 'dt_2844', name: 'Latte formula 3 crescita (1-3 anni, polvere per 100g)', category: 'Alimenti infanzia', kcal_100g: 485, proteins_100g: 15, carbs_100g: 58.5, fats_100g: 23, fiber_100g: 3, sugar_100g: 47.5, fatSat_100g: 8.5, serving_size_g: 100 },
  { id: 'dt_2845', name: 'Liofilizzato frutta banana (Heinz/Hipp, per 100g polvere)', category: 'Alimenti infanzia', kcal_100g: 360, proteins_100g: 4.5, carbs_100g: 85, fats_100g: 0.8, fiber_100g: 8.5, sugar_100g: 62, fatSat_100g: 0, serving_size_g: 100 },
  { id: 'dt_2846', name: 'Pastina stelline per bambini (Barilla, per 100g cruda)', category: 'Alimenti infanzia', kcal_100g: 353, proteins_100g: 12.5, carbs_100g: 70, fats_100g: 1.5, fiber_100g: 2.5, sugar_100g: 3, fatSat_100g: 0.2, serving_size_g: 100 },

  // ─── Integratori ───
  { id: 'dt_2847', name: 'Creatina monoidrato (polvere, per 100g)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2848', name: 'Pre-workout polvere (caffeina+beta-alanina, per 100g)', category: 'Integratori', kcal_100g: 240, proteins_100g: 12, carbs_100g: 48, fats_100g: 1, fiber_100g: 0, sugar_100g: 40, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2849', name: 'Maltodestrine (integratore, polvere, per 100g)', category: 'Integratori', kcal_100g: 385, proteins_100g: 0, carbs_100g: 96, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2850', name: 'Aminoacidi ramificati BCAA compresse (per compressa)', category: 'Integratori', kcal_100g: 4, proteins_100g: 1, carbs_100g: 0.1, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2851', name: 'Glutammina polvere (per 100g)', category: 'Integratori', kcal_100g: 210, proteins_100g: 53, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Pane e derivati ───
  { id: 'dt_2852', name: 'Pancarré industriale tipo Bauletto (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 265, proteins_100g: 8.5, carbs_100g: 47.5, fats_100g: 4.5, fiber_100g: 2.5, sugar_100g: 5, fatSat_100g: 0.8, serving_size_g: 100 },
  { id: 'dt_2853', name: 'Fette biscottate Mulino Bianco classiche (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 405, proteins_100g: 12, carbs_100g: 73.5, fats_100g: 5.5, fiber_100g: 3.5, sugar_100g: 7.5, fatSat_100g: 1.5, serving_size_g: 100 },
  { id: 'dt_2854', name: 'Fette biscottate integrali (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 390, proteins_100g: 12.5, carbs_100g: 68, fats_100g: 5, fiber_100g: 8.5, sugar_100g: 5, fatSat_100g: 1, serving_size_g: 100 },
  { id: 'dt_2855', name: 'Crackers integrali tipo Wasa (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 350, proteins_100g: 10, carbs_100g: 70, fats_100g: 3, fiber_100g: 11, sugar_100g: 2, fatSat_100g: 0.5, serving_size_g: 100 },
  { id: 'dt_2856', name: 'Grissini con olio e rosmarino industriali (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 420, proteins_100g: 10.5, carbs_100g: 68.5, fats_100g: 10.5, fiber_100g: 3, sugar_100g: 2.5, fatSat_100g: 1, serving_size_g: 100 },
  { id: 'dt_2857', name: 'Piadina romagnola IGP (artigianale, per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 298, proteins_100g: 8.5, carbs_100g: 44, fats_100g: 10, fiber_100g: 2, sugar_100g: 4.5, fatSat_100g: 4, serving_size_g: 100 },
  { id: 'dt_2858', name: 'Focaccia industriale (Ligure, per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 270, proteins_100g: 7.5, carbs_100g: 40, fats_100g: 8.5, fiber_100g: 2, sugar_100g: 2, fatSat_100g: 1.5, serving_size_g: 100 },

  // ─── Salumi e insaccati ───
  { id: 'dt_2859', name: 'Prosciutto cotto alta qualità (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 147, proteins_100g: 19, carbs_100g: 1.5, fats_100g: 5.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 1.5, serving_size_g: 50 },
  { id: 'dt_2860', name: 'Salame Felino IGP (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 400, proteins_100g: 27, carbs_100g: 1, fats_100g: 31.5, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 12.5, serving_size_g: 50 },
  { id: 'dt_2861', name: 'Capicola/Capocollo (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 290, proteins_100g: 23.5, carbs_100g: 0.8, fats_100g: 21, fiber_100g: 0, sugar_100g: 0.5, fatSat_100g: 7, serving_size_g: 50 },
  { id: 'dt_2862', name: 'Bresaola della Valtellina IGP (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 151, proteins_100g: 32.5, carbs_100g: 0.5, fats_100g: 1.8, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0.2, serving_size_g: 50 },
  { id: 'dt_2863', name: 'Pancetta tesa affumicata (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 620, proteins_100g: 14.5, carbs_100g: 0.5, fats_100g: 60, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 22.5, serving_size_g: 50 },
  { id: 'dt_2864', name: 'Guanciale stagionato (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 655, proteins_100g: 12, carbs_100g: 0.5, fats_100g: 64.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 23, serving_size_g: 50 },
  { id: 'dt_2865', name: 'Speck dell\'Alto Adige IGP (per 100g)', category: 'Salumi e Insaccati', kcal_100g: 320, proteins_100g: 26, carbs_100g: 0.5, fats_100g: 22.5, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 7.5, serving_size_g: 50 },

  // ─── Bevande alcoliche ───
  { id: 'dt_2866', name: 'Birra chiara tipo Peroni (5% vol, per 100mL)', category: 'Bevande', kcal_100g: 43, proteins_100g: 0.5, carbs_100g: 3.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2867', name: 'Birra artigianale IPA (6-7% vol, per 100mL)', category: 'Bevande', kcal_100g: 58, proteins_100g: 0.5, carbs_100g: 4.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 3.5, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2868', name: 'Vino rosso secco (13% vol, per 100mL)', category: 'Bevande', kcal_100g: 85, proteins_100g: 0.1, carbs_100g: 2.6, fats_100g: 0, fiber_100g: 0, sugar_100g: 0.6, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2869', name: 'Prosecco DOC (11% vol, per 100mL)', category: 'Bevande', kcal_100g: 68, proteins_100g: 0.1, carbs_100g: 3, fats_100g: 0, fiber_100g: 0, sugar_100g: 1, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2870', name: 'Aperol Spritz (tipica mistura, per 100mL)', category: 'Bevande', kcal_100g: 80, proteins_100g: 0, carbs_100g: 12.5, fats_100g: 0, fiber_100g: 0, sugar_100g: 12, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2871', name: 'Limoncello (28-30% vol, per 100mL)', category: 'Bevande', kcal_100g: 230, proteins_100g: 0, carbs_100g: 28, fats_100g: 0, fiber_100g: 0, sugar_100g: 28, fatSat_100g: 0, serving_size_g: 200 },
  { id: 'dt_2872', name: 'Grappa (40% vol, per 100mL)', category: 'Bevande', kcal_100g: 225, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 200 },

  // ─── Senza glutine ───
  { id: 'dt_2873', name: 'Pasta senza glutine mais-riso (per 100g cruda)', category: 'Cereali', kcal_100g: 355, proteins_100g: 6.5, carbs_100g: 78, fats_100g: 1.8, fiber_100g: 2.5, sugar_100g: 1, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2874', name: 'Pane senza glutine con semini (per 100g)', category: 'Cereali', kcal_100g: 240, proteins_100g: 4, carbs_100g: 43.5, fats_100g: 5.5, fiber_100g: 4, sugar_100g: 3.5, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_2875', name: 'Fette biscottate senza glutine (per 100g)', category: 'Cereali', kcal_100g: 388, proteins_100g: 5.5, carbs_100g: 78.5, fats_100g: 5, fiber_100g: 3, sugar_100g: 5, fatSat_100g: 0.5, serving_size_g: 80 },
  { id: 'dt_2876', name: 'Pizza base senza glutine surgelata (per 100g)', category: 'Cereali', kcal_100g: 265, proteins_100g: 3.5, carbs_100g: 52, fats_100g: 4, fiber_100g: 2.5, sugar_100g: 3.5, fatSat_100g: 1, serving_size_g: 80 },
  { id: 'dt_2877', name: 'Biscotti senza glutine al cioccolato (per 100g)', category: 'Cereali', kcal_100g: 468, proteins_100g: 5, carbs_100g: 68.5, fats_100g: 20, fiber_100g: 3, sugar_100g: 40, fatSat_100g: 7.5, serving_size_g: 80 },

  // ─── Snack salati ───
  { id: 'dt_2878', name: 'Schiacciatine / grissini al sesamo (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 435, proteins_100g: 10.5, carbs_100g: 68.5, fats_100g: 12.5, fiber_100g: 4.5, sugar_100g: 2.5, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2879', name: 'Chips di lenticchie (snack, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 415, proteins_100g: 16, carbs_100g: 60.5, fats_100g: 12.5, fiber_100g: 8.5, sugar_100g: 3, fatSat_100g: 2, serving_size_g: 30 },
  { id: 'dt_2880', name: 'Chips di barbabietola (snack, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 5.5, carbs_100g: 55, fats_100g: 14.5, fiber_100g: 5.5, sugar_100g: 22, fatSat_100g: 3, serving_size_g: 30 },

  // ─── Snack dolci ───
  { id: 'dt_2881', name: 'Popcorn caramellati (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 420, proteins_100g: 4.5, carbs_100g: 80, fats_100g: 8.5, fiber_100g: 4, sugar_100g: 52, fatSat_100g: 1.5, serving_size_g: 30 },
  { id: 'dt_2882', name: 'Rice cakes con cioccolato fondente (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 400, proteins_100g: 5.5, carbs_100g: 67.5, fats_100g: 11.5, fiber_100g: 4, sugar_100g: 35, fatSat_100g: 5.5, serving_size_g: 30 },

  // ─── ONS Ipercalorico ───
  { id: 'dt_2883', name: 'Ensure Plus (porz. 200mL=300kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2884', name: 'Fortimel Extra (porz. 200mL=300kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2885', name: 'Resource 2.0 (porz. 200mL=400kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Normocalorico ───
  { id: 'dt_2886', name: 'Ensure Original (porz. 200mL=200kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2887', name: 'Fresubin Original (porz. 200mL=200kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Iperproteico ───
  { id: 'dt_2888', name: 'Fortimel Compact Protein (porz. 125mL=225kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2889', name: 'Resource Protein (porz. 200mL=200kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Renale ───
  { id: 'dt_2890', name: 'Renilon 7.5 Renale (porz. 125mL=188kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2891', name: 'Suplena (porz. 200mL=400kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Diabete ───
  { id: 'dt_2892', name: 'Glucerna (porz. 200mL=200kcal, basso IG)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2893', name: 'Diben (porz. 200mL=200kcal, diabete)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Oncologico ───
  { id: 'dt_2894', name: 'Forticare Oncologico (porz. 125mL=188kcal, EPA 2.2g)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS Polmonare ───
  { id: 'dt_2895', name: 'Pulmocare BPCO (porz. 250mL=375kcal, alto grassi)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── ONS IBD/CDED ───
  { id: 'dt_2896', name: 'Modulen IBD (porz. 100mL=150kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2897', name: 'Peptamen Junior CDED (porz. 100mL=100kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Proteine in Polvere ───
  { id: 'dt_2898', name: 'Whey Protein concentrato (porz. 30g=120kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2899', name: 'Whey Protein isolato (porz. 30g=115kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2900', name: 'Caseine micellari (porz. 30g=112kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Aminoacidi ───
  { id: 'dt_2901', name: 'EAA Aminoacidi Essenziali (porz. 10g=40kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2902', name: 'BCAA 2:1:1 (porz. 5g=20kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Omega-3 ───
  { id: 'dt_2903', name: 'Omega-3 EPA+DHA olio pesce (porz. 1g capsula)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Vitamine ───
  { id: 'dt_2904', name: 'Vitamina D3 1000UI (per compressa)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Minerali ───
  { id: 'dt_2905', name: 'Calcio citrato 500mg (per compressa)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2906', name: 'Ferro solfato ferroso 65mg (per compressa)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },
  { id: 'dt_2907', name: 'Magnesio citrato 200mg (per compressa)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Grassi Speciali ───
  { id: 'dt_2908', name: 'MCT Oil - Olio C8/C10 (porz. 15mL=115kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Fibra Integratore ───
  { id: 'dt_2909', name: 'Psyllium / Psillio polvere (porz. 5g=15kcal)', category: 'Integratori', kcal_100g: 0, proteins_100g: 0, carbs_100g: 0, fats_100g: 0, fiber_100g: 0, sugar_100g: 0, fatSat_100g: 0, serving_size_g: 10 },

  // ─── Snack salati ───
  { id: 'dt_2910', name: 'Gallette di riso soffiato (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 387, proteins_100g: 7.9, carbs_100g: 82.5, fats_100g: 2.2, fiber_100g: 2, sugar_100g: 0.6, fatSat_100g: 0.4, serving_size_g: 30 },

  // ─── Barrette proteiche ───
  { id: 'dt_2911', name: 'Barretta proteica whey generica (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 32, carbs_100g: 42, fats_100g: 11, fiber_100g: 2.5, sugar_100g: 24, fatSat_100g: 4.2, serving_size_g: 30 },

  // ─── Bevande vegetali ───
  { id: 'dt_2912', name: 'Bevanda di soia zuccherata (per 100g)', category: 'Latticini', kcal_100g: 54, proteins_100g: 3.3, carbs_100g: 6.8, fats_100g: 1.8, fiber_100g: 0.5, sugar_100g: 5.6, fatSat_100g: 0.3, serving_size_g: 125 },

  // ─── Barrette proteiche ───
  { id: 'dt_2913', name: 'Barretta ai cereali con cioccolato (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 418, proteins_100g: 5.2, carbs_100g: 67, fats_100g: 13.5, fiber_100g: 2.8, sugar_100g: 32, fatSat_100g: 6.8, serving_size_g: 30 },

  // ─── Latte e derivati ───
  { id: 'dt_2914', name: 'Yogurt greco proteico 0% grassi (per 100g)', category: 'Latticini', kcal_100g: 59, proteins_100g: 10, carbs_100g: 3.9, fats_100g: 0.1, fiber_100g: 0, sugar_100g: 3.8, fatSat_100g: 0, serving_size_g: 125 },

  // ─── Barrette proteiche ───
  { id: 'dt_2915', name: 'Proteina del siero di latte in polvere (per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 380, proteins_100g: 80, carbs_100g: 8, fats_100g: 5, fiber_100g: 0, sugar_100g: 5, fatSat_100g: 1.5, serving_size_g: 30 },

  // ─── Piatti pronti ───
  { id: 'dt_2916', name: 'Polpette vegetali surgelate (per 100g)', category: 'Piatti Pronti', kcal_100g: 175, proteins_100g: 12.5, carbs_100g: 15.8, fats_100g: 7.5, fiber_100g: 3.5, sugar_100g: 1.5, fatSat_100g: 1.8, serving_size_g: 300 },
  { id: 'dt_2917', name: 'Burger di soia surgelato (per 100g)', category: 'Piatti Pronti', kcal_100g: 195, proteins_100g: 17, carbs_100g: 12.5, fats_100g: 9.5, fiber_100g: 3, sugar_100g: 1.2, fatSat_100g: 2.2, serving_size_g: 300 },

  // ─── Biscotti e crackers ───
  { id: 'dt_2918', name: 'Pane senza glutine industriale (per 100g)', category: 'Pane e Prodotti da Forno', kcal_100g: 240, proteins_100g: 3.5, carbs_100g: 50, fats_100g: 3, fiber_100g: 2, sugar_100g: 3.5, fatSat_100g: 0.5, serving_size_g: 30 },

  // ─── Snack salati ───
  { id: 'dt_2919', name: 'Snack di soia (edamame tostati, per 100g)', category: 'Snack e Ultra-Processati', kcal_100g: 416, proteins_100g: 36.5, carbs_100g: 30.5, fats_100g: 17.5, fiber_100g: 13, sugar_100g: 5, fatSat_100g: 2.8, serving_size_g: 30 },

  // ─── Aproteici - Pasta ───
  { id: 'dt_2920', name: 'Pasta aproteica (Loprofin)', category: 'Cereali', kcal_100g: 362, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1, fiber_100g: 1.2, sugar_100g: 1.5, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2921', name: 'Pasta aproteica rigatoni (Aproten)', category: 'Cereali', kcal_100g: 358, proteins_100g: 0.5, carbs_100g: 85, fats_100g: 0.9, fiber_100g: 0.8, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2922', name: 'Pasta aproteica spaghetti (DrSchär)', category: 'Cereali', kcal_100g: 360, proteins_100g: 0.5, carbs_100g: 85, fats_100g: 1.1, fiber_100g: 1, sugar_100g: 1.8, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2923', name: 'Pasta aproteica penne (Nutricia)', category: 'Cereali', kcal_100g: 355, proteins_100g: 0.4, carbs_100g: 84, fats_100g: 1.2, fiber_100g: 1.1, sugar_100g: 1.6, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2924', name: 'Gnocchi aproteici (Loprofin)', category: 'Cereali', kcal_100g: 220, proteins_100g: 0.3, carbs_100g: 53, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 1, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2925', name: 'Pasta all\'uovo aproteica', category: 'Cereali', kcal_100g: 350, proteins_100g: 0.4, carbs_100g: 84, fats_100g: 1, fiber_100g: 0.9, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Aproteici - Pane ───
  { id: 'dt_2926', name: 'Fette biscottate aproteiche (Loprofin)', category: 'Pane e Prodotti da Forno', kcal_100g: 395, proteins_100g: 0.4, carbs_100g: 82, fats_100g: 5.5, fiber_100g: 1.5, sugar_100g: 6, fatSat_100g: 0.3, serving_size_g: 30 },
  { id: 'dt_2927', name: 'Fette biscottate aproteiche (Aproten)', category: 'Pane e Prodotti da Forno', kcal_100g: 390, proteins_100g: 0.5, carbs_100g: 82, fats_100g: 5, fiber_100g: 1, sugar_100g: 5.5, fatSat_100g: 0.3, serving_size_g: 30 },
  { id: 'dt_2928', name: 'Pane aproteico (Loprofin)', category: 'Pane e Prodotti da Forno', kcal_100g: 255, proteins_100g: 0.4, carbs_100g: 52, fats_100g: 4.5, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 30 },
  { id: 'dt_2929', name: 'Pane aproteico in cassetta', category: 'Pane e Prodotti da Forno', kcal_100g: 258, proteins_100g: 0.3, carbs_100g: 53, fats_100g: 4, fiber_100g: 2, sugar_100g: 3, fatSat_100g: 0.3, serving_size_g: 30 },
  { id: 'dt_2930', name: 'Cracker aproteici (Loprofin)', category: 'Pane e Prodotti da Forno', kcal_100g: 440, proteins_100g: 0.4, carbs_100g: 76, fats_100g: 14, fiber_100g: 1.5, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 30 },
  { id: 'dt_2931', name: 'Grissini aproteici', category: 'Pane e Prodotti da Forno', kcal_100g: 425, proteins_100g: 0.4, carbs_100g: 80, fats_100g: 10, fiber_100g: 1.2, sugar_100g: 3, fatSat_100g: 0.4, serving_size_g: 30 },

  // ─── Aproteici - Biscotti ───
  { id: 'dt_2932', name: 'Biscotti aproteici al cioccolato (Loprofin)', category: 'Dolci e Zuccheri', kcal_100g: 480, proteins_100g: 0.5, carbs_100g: 70, fats_100g: 18, fiber_100g: 1.5, sugar_100g: 32, fatSat_100g: 5.5, serving_size_g: 50 },
  { id: 'dt_2933', name: 'Biscotti aproteici secchi (Nutricia)', category: 'Dolci e Zuccheri', kcal_100g: 455, proteins_100g: 0.4, carbs_100g: 73, fats_100g: 14, fiber_100g: 1.8, sugar_100g: 22, fatSat_100g: 3, serving_size_g: 50 },
  { id: 'dt_2934', name: 'Biscotti aproteici frollini (Aproten)', category: 'Dolci e Zuccheri', kcal_100g: 465, proteins_100g: 0.4, carbs_100g: 71, fats_100g: 15, fiber_100g: 1.2, sugar_100g: 28, fatSat_100g: 3.5, serving_size_g: 50 },
  { id: 'dt_2935', name: 'Biscotti aproteici vaniglia (PKU Foods)', category: 'Dolci e Zuccheri', kcal_100g: 470, proteins_100g: 0.5, carbs_100g: 72, fats_100g: 16, fiber_100g: 1, sugar_100g: 30, fatSat_100g: 3, serving_size_g: 50 },
  { id: 'dt_2936', name: 'Wafer aproteici (Loprofin)', category: 'Dolci e Zuccheri', kcal_100g: 495, proteins_100g: 0.5, carbs_100g: 68, fats_100g: 22, fiber_100g: 0.8, sugar_100g: 35, fatSat_100g: 7, serving_size_g: 50 },

  // ─── Aproteici - Cereali ───
  { id: 'dt_2937', name: 'Riso aproteico (Loprofin)', category: 'Cereali', kcal_100g: 360, proteins_100g: 0.2, carbs_100g: 88, fats_100g: 0.5, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2938', name: 'Mix di farine aproteiche (Loprofin)', category: 'Cereali', kcal_100g: 370, proteins_100g: 0.4, carbs_100g: 88, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Aproteici - Dessert ───
  { id: 'dt_2939', name: 'Gelato aproteico alla vaniglia (Loprofin)', category: 'Dolci e Zuccheri', kcal_100g: 155, proteins_100g: 0.2, carbs_100g: 22, fats_100g: 7.5, fiber_100g: 0.2, sugar_100g: 19, fatSat_100g: 5, serving_size_g: 50 },
  { id: 'dt_2940', name: 'Torta/plumcake aproteico (Loprofin)', category: 'Dolci e Zuccheri', kcal_100g: 378, proteins_100g: 0.5, carbs_100g: 54, fats_100g: 16, fiber_100g: 1.5, sugar_100g: 28, fatSat_100g: 5, serving_size_g: 50 },
  { id: 'dt_2941', name: 'Budino aproteico (Loprofin)', category: 'Dolci e Zuccheri', kcal_100g: 85, proteins_100g: 0.2, carbs_100g: 16, fats_100g: 2, fiber_100g: 0.2, sugar_100g: 13, fatSat_100g: 0.5, serving_size_g: 50 },

  // ─── Aproteici - Condimenti ───
  { id: 'dt_2942', name: 'Maionese aproteica (senza uova)', category: 'Condimenti e Salse', kcal_100g: 355, proteins_100g: 0.2, carbs_100g: 8, fats_100g: 37, fiber_100g: 0.1, sugar_100g: 2, fatSat_100g: 4, serving_size_g: 20 },

  // ─── Aproteici - Formula ───
  { id: 'dt_2943', name: 'Loprofin Energy (liquido, per 100ml)', category: 'Integratori', kcal_100g: 150, proteins_100g: 0.1, carbs_100g: 22, fats_100g: 5.6, fiber_100g: 0, sugar_100g: 20, fatSat_100g: 2.2, serving_size_g: 10 },

  // ─── Flavis - Pasta ───
  { id: 'dt_2944', name: 'Flavis Pasta Penne Rigate aproteiche', category: 'Cereali', kcal_100g: 367, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.5, fiber_100g: 1, sugar_100g: 1.8, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2945', name: 'Flavis Pasta Fusilli aproteici', category: 'Cereali', kcal_100g: 366, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.4, fiber_100g: 1, sugar_100g: 1.7, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2946', name: 'Flavis Pasta Spaghetti aproteici', category: 'Cereali', kcal_100g: 365, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.2, fiber_100g: 0.9, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2947', name: 'Flavis Pasta Farfalle aproteiche', category: 'Cereali', kcal_100g: 366, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.4, fiber_100g: 1, sugar_100g: 1.7, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2948', name: 'Flavis Pasta Tagliatelle aproteiche', category: 'Cereali', kcal_100g: 364, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.3, fiber_100g: 0.9, sugar_100g: 1.6, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2949', name: 'Flavis Lasagne aproteiche', category: 'Cereali', kcal_100g: 362, proteins_100g: 0.4, carbs_100g: 85, fats_100g: 1.2, fiber_100g: 0.9, sugar_100g: 1.5, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2950', name: 'Flavis Pasta Ditalini aproteici', category: 'Cereali', kcal_100g: 366, proteins_100g: 0.4, carbs_100g: 86, fats_100g: 1.4, fiber_100g: 1, sugar_100g: 1.7, fatSat_100g: 0.3, serving_size_g: 80 },
  { id: 'dt_2951', name: 'Flavis Gnocchi di patate aproteici', category: 'Cereali', kcal_100g: 215, proteins_100g: 0.3, carbs_100g: 52, fats_100g: 0.4, fiber_100g: 0.5, sugar_100g: 0.8, fatSat_100g: 0.2, serving_size_g: 80 },

  // ─── Flavis - Pane ───
  { id: 'dt_2952', name: 'Flavis Fette biscottate aproteiche', category: 'Pane e Prodotti da Forno', kcal_100g: 388, proteins_100g: 0.5, carbs_100g: 80, fats_100g: 6, fiber_100g: 1.8, sugar_100g: 5, fatSat_100g: 0.4, serving_size_g: 30 },
  { id: 'dt_2953', name: 'Flavis Pane bianco aproteico a fette', category: 'Pane e Prodotti da Forno', kcal_100g: 248, proteins_100g: 0.4, carbs_100g: 51, fats_100g: 4.2, fiber_100g: 2.8, sugar_100g: 2.2, fatSat_100g: 0.4, serving_size_g: 30 },
  { id: 'dt_2954', name: 'Flavis Crackers aproteici', category: 'Pane e Prodotti da Forno', kcal_100g: 438, proteins_100g: 0.5, carbs_100g: 76, fats_100g: 13, fiber_100g: 1.8, sugar_100g: 2, fatSat_100g: 0.6, serving_size_g: 30 },
  { id: 'dt_2955', name: 'Flavis Grissini aproteici', category: 'Pane e Prodotti da Forno', kcal_100g: 428, proteins_100g: 0.4, carbs_100g: 80, fats_100g: 11, fiber_100g: 1.4, sugar_100g: 2.5, fatSat_100g: 0.5, serving_size_g: 30 },
  { id: 'dt_2956', name: 'Flavis Mix per pane aproteico', category: 'Pane e Prodotti da Forno', kcal_100g: 372, proteins_100g: 0.4, carbs_100g: 88, fats_100g: 1.8, fiber_100g: 1.2, sugar_100g: 2, fatSat_100g: 0.2, serving_size_g: 30 },
  { id: 'dt_2957', name: 'Flavis Panini aproteici (cotti)', category: 'Pane e Prodotti da Forno', kcal_100g: 242, proteins_100g: 0.4, carbs_100g: 50, fats_100g: 3.8, fiber_100g: 2.5, sugar_100g: 2, fatSat_100g: 0.4, serving_size_g: 30 },

  // ─── Flavis - Biscotti ───
  { id: 'dt_2958', name: 'Flavis Biscotti aproteici secchi', category: 'Dolci e Zuccheri', kcal_100g: 458, proteins_100g: 0.4, carbs_100g: 73, fats_100g: 14, fiber_100g: 1.6, sugar_100g: 24, fatSat_100g: 3.2, serving_size_g: 50 },
  { id: 'dt_2959', name: 'Flavis Biscotti aproteici al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 478, proteins_100g: 0.5, carbs_100g: 69, fats_100g: 19, fiber_100g: 1.8, sugar_100g: 33, fatSat_100g: 6, serving_size_g: 50 },
  { id: 'dt_2960', name: 'Flavis Frollini aproteici', category: 'Dolci e Zuccheri', kcal_100g: 468, proteins_100g: 0.4, carbs_100g: 71, fats_100g: 16, fiber_100g: 1.2, sugar_100g: 29, fatSat_100g: 3.8, serving_size_g: 50 },
  { id: 'dt_2961', name: 'Flavis Wafer aproteici alle nocciole', category: 'Dolci e Zuccheri', kcal_100g: 492, proteins_100g: 0.5, carbs_100g: 67, fats_100g: 23, fiber_100g: 0.9, sugar_100g: 36, fatSat_100g: 7.5, serving_size_g: 50 },

  // ─── Flavis - Cereali ───
  { id: 'dt_2962', name: 'Flavis Riso aproteico', category: 'Cereali', kcal_100g: 362, proteins_100g: 0.2, carbs_100g: 89, fats_100g: 0.4, fiber_100g: 0.4, sugar_100g: 0.4, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2963', name: 'Flavis Farina aproteica di mais', category: 'Cereali', kcal_100g: 368, proteins_100g: 0.3, carbs_100g: 90, fats_100g: 0.8, fiber_100g: 0.6, sugar_100g: 1, fatSat_100g: 0.1, serving_size_g: 80 },
  { id: 'dt_2964', name: 'Flavis Mix per dolci aproteico', category: 'Cereali', kcal_100g: 374, proteins_100g: 0.4, carbs_100g: 88, fats_100g: 2, fiber_100g: 1, sugar_100g: 4, fatSat_100g: 0.2, serving_size_g: 80 },
  { id: 'dt_2965', name: 'Flavis Semolino aproteico', category: 'Cereali', kcal_100g: 358, proteins_100g: 0.3, carbs_100g: 87, fats_100g: 0.6, fiber_100g: 0.5, sugar_100g: 0.5, fatSat_100g: 0.1, serving_size_g: 80 },

  // ─── Flavis - Dessert ───
  { id: 'dt_2966', name: 'Flavis Budino aproteico al cioccolato', category: 'Dolci e Zuccheri', kcal_100g: 88, proteins_100g: 0.2, carbs_100g: 16, fats_100g: 2.2, fiber_100g: 0.2, sugar_100g: 14, fatSat_100g: 0.6, serving_size_g: 50 },
  { id: 'dt_2967', name: 'Flavis Crema dessert aproteica alla vaniglia', category: 'Dolci e Zuccheri', kcal_100g: 82, proteins_100g: 0.2, carbs_100g: 15, fats_100g: 1.8, fiber_100g: 0.1, sugar_100g: 12, fatSat_100g: 0.4, serving_size_g: 50 },
  { id: 'dt_2968', name: 'Flavis Gelato aproteico fior di latte', category: 'Dolci e Zuccheri', kcal_100g: 148, proteins_100g: 0.2, carbs_100g: 21, fats_100g: 7, fiber_100g: 0.2, sugar_100g: 18, fatSat_100g: 4.8, serving_size_g: 50 },
  { id: 'dt_2969', name: 'Flavis Torta/plumcake aproteico', category: 'Dolci e Zuccheri', kcal_100g: 372, proteins_100g: 0.5, carbs_100g: 55, fats_100g: 15, fiber_100g: 1.4, sugar_100g: 27, fatSat_100g: 4.8, serving_size_g: 50 },

  // ─── Flavis - Condimenti ───
  { id: 'dt_2970', name: 'Flavis Besciamella aproteica', category: 'Condimenti e Salse', kcal_100g: 92, proteins_100g: 0.2, carbs_100g: 11, fats_100g: 5, fiber_100g: 0.1, sugar_100g: 3.5, fatSat_100g: 1.8, serving_size_g: 20 },
]

export const DIETITIAN_CATEGORIES = ['Tutti', 'Proteine', 'Cereali', 'Verdure', 'Frutta', 'Frutta secca', 'Latticini', 'Grassi', 'Legumi', 'Dolci e Zuccheri', 'Condimenti e Salse', 'Bevande', 'Pane e Prodotti da Forno', 'Salumi e Insaccati', 'Piatti Pronti', 'Snack e Ultra-Processati', 'Integratori', 'Alimenti infanzia']
