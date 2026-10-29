/*
INSERT INTO flashcards (subject, question, answer) VALUES
    ('Matemática', 'Qual é a fórmula de Bhaskara para encontrar as raízes de uma equação do 2º grau?', 'x = (-b ± √(b² - 4ac)) / 2a, onde a, b e c são os coeficientes da equação ax² + bx + c = 0.'),
    ('Matemática', 'O que é o Teorema de Pitágoras?', 'Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: a² = b² + c².'),
    ('História', 'Em que ano o Brasil foi proclamado República e quem liderou o movimento?', 'A República foi proclamada em 15 de novembro de 1889, liderada pelo Marechal Deodoro da Fonseca.'),
    ('História', 'O que foi a Revolução Industrial e onde ela começou?', 'Foi a transição de métodos de produção artesanais para a manufatura por máquinas. Começou na Inglaterra, na segunda metade do século XVIII.'),
    ('Ciências', 'Quais são os três estados físicos da matéria e dê um exemplo de cada?', 'Sólido (gelo), líquido (água) e gasoso (vapor d''água). A mudança entre eles ocorre por variação de temperatura e pressão.'),
    ('Ciências', 'O que é a fotossíntese?', 'É o processo pelo qual as plantas convertem luz solar, água e gás carbônico (CO₂) em glicose e oxigênio (O₂), utilizando a clorofila presente nas folhas.'),
    ('Português', 'O que é um verbo transitivo direto? Dê um exemplo.', 'É um verbo que necessita de um complemento (objeto direto) sem preposição. Exemplo: "Ela leu o livro." — "o livro" é o objeto direto.'),
    ('Português', 'Qual a diferença entre "mas" e "mais"?', '"Mas" é uma conjunção adversativa, equivalente a "porém". "Mais" é um advérbio de intensidade ou pronome indefinido. Exemplo: "Estudei, mas não passei." / "Preciso de mais tempo."'),
    ('Geografia', 'Quais são as cinco regiões do Brasil definidas pelo IBGE?', 'Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Essa divisão considera aspectos naturais, sociais e econômicos.'),
    ('Geografia', 'O que é a Amazônia Legal e quantos estados ela abrange?', 'A Amazônia Legal é uma área que abrange nove estados brasileiros (Acre, Amapá, Amazonas, Maranhão, Mato Grosso, Pará, Rondônia, Roraima e Tocantins), criada para fins de planejamento e desenvolvimento da região.');
*/
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { flashcards } from '.schema.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const dados = [
  {
    subject: 'Matemática',
    question: 'Qual é a fórmula de Bhaskara para encontrar as raízes de uma equação do 2º grau?',
    answer: 'x = (-b ± √(b² - 4ac)) / 2a, onde a, b e c são os coeficientes da equação ax² + bx + c = 0.',
  },
  {
    subject: 'Matemática',
    question: 'O que é o Teorema de Pitágoras?',
    answer: 'Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: a² = b² + c².',
  },
  {
    subject: 'História',
    question: 'Em que ano o Brasil foi proclamado República e quem liderou o movimento?',
    answer: 'A República foi proclamada em 15 de novembro de 1889, liderada pelo Marechal Deodoro da Fonseca.',
  },
  {
    subject: 'História',
    question: 'O que foi a Revolução Industrial e onde ela começou?',
    answer: 'Foi a transição de métodos de produção artesanais para a manufatura por máquinas. Começou na Inglaterra, na segunda metade do século XVIII.',
  },
  {
    subject: 'Ciências',
    question: 'Quais são os três estados físicos da matéria e dê um exemplo de cada?',
    answer: "Sólido (gelo), líquido (água) e gasoso (vapor d'água). A mudança entre eles ocorre por variação de temperatura e pressão.",
  },
  {
    subject: 'Ciências',
    question: 'O que é a fotossíntese?',
    answer: 'É o processo pelo qual as plantas convertem luz solar, água e gás carbônico (CO₂) em glicose e oxigênio (O₂), utilizando a clorofila presente nas folhas.',
  },
  {
    subject: 'Português',
    question: 'O que é um verbo transitivo direto? Dê um exemplo.',
    answer: 'É um verbo que necessita de um complemento (objeto direto) sem preposição. Exemplo: "Ela leu o livro." — "o livro" é o objeto direto.',
  },
  {
    subject: 'Português',
    question: 'Qual a diferença entre "mas" e "mais"?',
    answer: '"Mas" é uma conjunção adversativa, equivalente a "porém". "Mais" é um advérbio de intensidade ou pronome indefinido. Exemplo: "Estudei, mas não passei." / "Preciso de mais tempo."',
  },
  {
    subject: 'Geografia',
    question: 'Quais são as cinco regiões do Brasil definidas pelo IBGE?',
    answer: 'Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Essa divisão considera aspectos naturais, sociais e econômicos.',
  },
  {
    subject: 'Geografia',
    question: 'O que é a Amazônia Legal e quantos estados ela abrange?',
    answer: 'A Amazônia Legal é uma área que abrange nove estados brasileiros (Acre, Amapá, Amazonas, Maranhão, Mato Grosso, Pará, Rondônia, Roraima e Tocantins), criada para fins de planejamento e desenvolvimento da região.',
  },
];

async function main() {
  await db.insert(flashcards).values(dados);
  console.log(`✔ ${dados.length} flashcards inseridos.`);
}

main()
  .catch((err) => {
    console.error('Erro ao rodar o seed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());