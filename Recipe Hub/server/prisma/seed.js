const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const recipes = [
  {
    title: "Ciorbă de burtă",
    description: "Ciorbă tradițională românească, acrișoară și cremoasă.",
    mealType: "lunch",
    dietTypes: "fara-gluten",
    difficulty: "hard",
    prepTime: 30,
    cookTime: 90,
    servings: 6,
    calories: 320,
    protein: 22,
    carbs: 8,
    fat: 21,
    ingredients: [
      { name: "Burtă de vită", quantity: 1000, unit: "g", category: "Carne" },
      { name: "Smântână", quantity: 500, unit: "ml", category: "Lactate" },
      { name: "Gălbenușuri", quantity: 4, unit: "buc", category: "Lactate" },
      { name: "Morcovi", quantity: 2, unit: "buc", category: "Legume" },
      { name: "Țelină", quantity: 1, unit: "buc", category: "Legume" },
      { name: "Oțet", quantity: 30, unit: "ml", category: "Condimente" },
      { name: "Usturoi", quantity: 4, unit: "catei", category: "Legume" },
    ],
    steps: [
      { text: "Fierbe burta până se înmoaie, apoi taie fâșii.", timerSeconds: 5400 },
      { text: "Fierbe legumele în zeamă până se înmoaie.", timerSeconds: 1200 },
      { text: "Adaugă burta tăiată în oala cu legume.", timerSeconds: 300 },
      { text: "Dreg cu smântână, gălbenușuri și oțet." },
      { text: "Servește cu ardei iute și usturoi." },
    ],
  },
  {
    title: "Salată Caesar cu pui",
    description: "Salată clasică cu pui, parmezan și dressing cremos.",
    mealType: "lunch",
    dietTypes: "",
    difficulty: "easy",
    prepTime: 20,
    cookTime: 10,
    servings: 2,
    calories: 410,
    protein: 35,
    carbs: 12,
    fat: 24,
    ingredients: [
      { name: "Piept de pui", quantity: 200, unit: "g", category: "Carne" },
      { name: "Salată romană", quantity: 1, unit: "buc", category: "Legume" },
      { name: "Parmezan", quantity: 50, unit: "g", category: "Lactate" },
      { name: "Crutoane", quantity: 60, unit: "g", category: "Panificatie" },
      { name: "Dressing Caesar", quantity: 60, unit: "ml", category: "Condimente" },
    ],
    steps: [
      { text: "Prăjește pieptul de pui și taie fâșii.", timerSeconds: 600 },
      { text: "Toacă salata și pune-o într-un bol." },
      { text: "Adaugă puiul, crutoanele și parmezanul." },
      { text: "Amestecă cu dressing-ul Caesar." },
    ],
  },
  {
    title: "Omletă cu legume",
    description: "Mic dejun rapid, proteic, gata în 10 minute.",
    mealType: "breakfast",
    dietTypes: "vegetarian,fara-gluten",
    difficulty: "easy",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    calories: 280,
    protein: 18,
    carbs: 6,
    fat: 20,
    ingredients: [
      { name: "Ouă", quantity: 3, unit: "buc", category: "Lactate" },
      { name: "Ardei gras", quantity: 0.5, unit: "buc", category: "Legume" },
      { name: "Ceapă", quantity: 0.5, unit: "buc", category: "Legume" },
      { name: "Ulei de măsline", quantity: 10, unit: "ml", category: "Condimente" },
      { name: "Sare", quantity: 2, unit: "g", category: "Condimente" },
    ],
    steps: [
      { text: "Taie ardeiul și ceapa mărunt." },
      { text: "Călește legumele în ulei.", timerSeconds: 180 },
      { text: "Bate ouăle și adaugă-le în tigaie.", timerSeconds: 240 },
      { text: "Sărează și servește." },
    ],
  },
  {
    title: "Bol vegan cu quinoa",
    description: "Bol colorat, plin de nutrienți, 100% vegan.",
    mealType: "dinner",
    dietTypes: "vegan,vegetarian,fara-gluten",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    calories: 390,
    protein: 14,
    carbs: 52,
    fat: 12,
    ingredients: [
      { name: "Quinoa", quantity: 150, unit: "g", category: "Cereale" },
      { name: "Năut fiert", quantity: 200, unit: "g", category: "Leguminoase" },
      { name: "Avocado", quantity: 1, unit: "buc", category: "Legume" },
      { name: "Roșii cherry", quantity: 100, unit: "g", category: "Legume" },
      { name: "Castravete", quantity: 1, unit: "buc", category: "Legume" },
      { name: "Ulei de măsline", quantity: 20, unit: "ml", category: "Condimente" },
    ],
    steps: [
      { text: "Fierbe quinoa conform instrucțiunilor.", timerSeconds: 900 },
      { text: "Taie legumele cubulețe." },
      { text: "Asamblează bolul cu quinoa, năut și legume." },
      { text: "Stropește cu ulei de măsline și servește." },
    ],
  },
  {
    title: "Paste Carbonara",
    description: "Rețetă italiană autentică, cremoasă, fără smântână.",
    mealType: "dinner",
    dietTypes: "",
    difficulty: "medium",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 520,
    protein: 24,
    carbs: 58,
    fat: 22,
    ingredients: [
      { name: "Spaghete", quantity: 400, unit: "g", category: "Cereale" },
      { name: "Bacon", quantity: 150, unit: "g", category: "Carne" },
      { name: "Ouă", quantity: 3, unit: "buc", category: "Lactate" },
      { name: "Parmezan", quantity: 80, unit: "g", category: "Lactate" },
      { name: "Piper negru", quantity: 3, unit: "g", category: "Condimente" },
    ],
    steps: [
      { text: "Fierbe pastele în apă cu sare.", timerSeconds: 600 },
      { text: "Prăjește baconul până e crocant.", timerSeconds: 300 },
      { text: "Amestecă ouăle cu parmezanul." },
      { text: "Combină pastele calde cu baconul și amestecul de ou, fără foc." },
    ],
  },
  {
    title: "Smoothie bowl cu fructe de pădure",
    description: "Mic dejun vegan, rece, plin de antioxidanți.",
    mealType: "breakfast",
    dietTypes: "vegan,vegetarian,fara-gluten",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    calories: 250,
    protein: 6,
    carbs: 45,
    fat: 5,
    ingredients: [
      { name: "Fructe de pădure congelate", quantity: 150, unit: "g", category: "Fructe" },
      { name: "Banană", quantity: 1, unit: "buc", category: "Fructe" },
      { name: "Lapte de migdale", quantity: 100, unit: "ml", category: "Lactate" },
      { name: "Fulgi de ovăz", quantity: 30, unit: "g", category: "Cereale" },
    ],
    steps: [
      { text: "Mixează fructele congelate cu banana și laptele.", timerSeconds: 60 },
      { text: "Toarnă în bol și decorează cu fulgi de ovăz." },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@recipehub.ro",
      passwordHash,
      name: "Demo User",
    },
  });

  for (const { ingredients, steps, ...recipeData } of recipes) {
    await prisma.recipe.create({
      data: {
        ...recipeData,
        authorId: demoUser.id,
        popularity: Math.floor(Math.random() * 50),
        ingredients: {
          create: ingredients.map((ing, idx) => ({ ...ing, order: idx })),
        },
        steps: {
          create: steps.map((step, idx) => ({ ...step, order: idx })),
        },
      },
    });
  }

  console.log("Seed complet. Cont demo: demo@recipehub.ro / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
