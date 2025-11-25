export interface Essay {
  id: string;
  title: string;
  content: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'pendente' | 'corrigida' | 'em_analise';
  imageUrl?: string;
  scores?: {
    competencia1: number;
    competencia2: number;
    competencia3: number;
    competencia4: number;
    competencia5: number;
    total: number;
  };
  comments?: Array<{
    id: string;
    text: string;
    position: { start: number; end: number };
    competencia: string;
    createdAt: string;
  }>;
  audioFeedbacks?: Array<{
    id: string;
    url: string;
    duration: number;
    createdAt: string;
    competencia: string;
  }>;
  imageAnnotations?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    competencia: number;
    audioUrl?: string;
    createdAt: string;
  }>;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  totalEssays: number;
  averageScore: number;
  lastSubmission: string;
}


// Dados mockados para demonstração
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    totalEssays: 5,
    averageScore: 720,
    lastSubmission: '2024-01-28'
  },
  {
    id: '2',
    name: 'Bruno Silva',
    email: 'bruno.silva@email.com',
    totalEssays: 3,
    averageScore: 640,
    lastSubmission: '2024-01-27'
  },
  {
    id: '3',
    name: 'Carla Santos',
    email: 'carla.santos@email.com',
    totalEssays: 7,
    averageScore: 810,
    lastSubmission: '2024-01-29'
  }
];

export const mockEssays: Essay[] = [
  {
    id: '1',
    title: 'Os desafios da mobilidade urbana no Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
    content: `A mobilidade urbana no Brasil enfrenta diversos desafios que impactam diretamente a qualidade de vida dos cidadãos. Nas grandes metrópoles brasileiras, o transporte público insuficiente e ineficiente tem levado a um aumento significativo no uso de veículos particulares, resultando em congestionamentos que se estendem por horas.

O problema da mobilidade urbana brasileira tem raízes históricas profundas. Durante décadas, as cidades cresceram de forma desordenada, sem planejamento adequado para o transporte público. Esse crescimento acelerado e mal planejado criou uma dependência excessiva do transporte individual, sobrecarregando as vias públicas e prejudicando a circulação urbana.

Além disso, a falta de investimento em infraestrutura de transporte público contribui para perpetuar esse ciclo vicioso. Sistemas de metrô e trens urbanos são limitados a poucas cidades, e mesmo onde existem, muitas vezes não atendem adequadamente toda a população. Os ônibus, principal meio de transporte público na maioria das cidades, frequentemente operam com frotas insuficientes e em condições precárias.

Para resolver essa questão, é fundamental implementar políticas públicas eficazes que priorizem o transporte coletivo. Investimentos em sistemas de transporte de massa, como metrôs, VLTs e corredores de ônibus, são essenciais. Além disso, é necessário promover meios de transporte alternativos e sustentáveis, como ciclovias e sistemas de bike-sharing.

Portanto, a solução para os problemas de mobilidade urbana no Brasil requer uma abordagem integrada que combine investimentos em infraestrutura, planejamento urbano eficiente e políticas que incentivem o uso do transporte público. Somente dessa forma será possível criar cidades mais sustentáveis e melhorar a qualidade de vida da população brasileira.`,
    studentId: '1',
    studentName: 'Ana Costa',
    submittedAt: '2024-01-28T10:30:00Z',
    status: 'corrigida',
    scores: {
      competencia1: 160,
      competencia2: 140,
      competencia3: 150,
      competencia4: 140,
      competencia5: 130,
      total: 720
    },
     comments: [
      {
        id: '1',
        text: 'Boa contextualização do problema',
        position: { start: 0, end: 200 },
        competencia: '1',
        createdAt: '2024-01-28T14:00:00Z'
      },
      {
        id: '2',
        text: 'Desenvolva mais este argumento',
        position: { start: 500, end: 700 },
        competencia: '3',
        createdAt: '2024-01-28T14:05:00Z'
      }
    ],
    imageAnnotations: [
      {
        id: '1',
        x: 100,
        y: 150,
        width: 200,
        height: 50,
        comment: 'Boa introdução, mas pode ser mais específica sobre o contexto brasileiro',
        competencia: 1,
        createdAt: '2024-01-28T14:00:00Z'
      },
      {
        id: '2',
        x: 150,
        y: 300,
        width: 250,
        height: 80,
        comment: 'Desenvolva melhor este argumento com dados estatísticos',
        competencia: 3,
        createdAt: '2024-01-28T14:05:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'A importância da educação digital no século XXI',
    content: `A educação digital tornou-se uma necessidade urgente no século XXI, especialmente após a pandemia de COVID-19, que evidenciou as desigualdades no acesso à tecnologia educacional. A inclusão digital nas escolas não é mais uma opção, mas uma obrigação para preparar os estudantes para o mercado de trabalho do futuro.

Atualmente, muitas escolas brasileiras ainda enfrentam dificuldades para implementar adequadamente a educação digital. A falta de infraestrutura tecnológica, como computadores e internet de qualidade, combinada com a deficiência na formação de professores para o uso de ferramentas digitais, cria barreiras significativas para o avanço educacional.

É importante destacar que a educação digital vai além do simples uso de computadores e tablets em sala de aula. Ela envolve o desenvolvimento do pensamento crítico para navegar na era da informação, a capacidade de avaliar fontes confiáveis e a habilidade de usar a tecnologia de forma ética e responsável.

Para superar esses desafios, é necessário um investimento maciço em infraestrutura tecnológica nas escolas, capacitação continuada de professores e desenvolvimento de políticas públicas que garantam o acesso equitativo à educação digital para todos os estudantes, independentemente de sua condição socioeconômica.

Assim, a educação digital deve ser encarada como uma ferramenta fundamental para reduzir desigualdades e preparar uma nova geração capaz de enfrentar os desafios tecnológicos do futuro, contribuindo para o desenvolvimento econômico e social do país.`,
    studentId: '2',
    studentName: 'Bruno Silva',
    submittedAt: '2024-01-27T15:45:00Z',
    status: 'em_analise',
    scores: {
      competencia1: 120,
      competencia2: 130,
      competencia3: 120,
      competencia4: 140,
      competencia5: 130,
      total: 640
    }
  },
  {
    id: '3',
    title: 'Sustentabilidade ambiental e desenvolvimento econômico',
    content: `O século XXI tem sido marcado por um dilema aparente entre sustentabilidade ambiental e desenvolvimento econômico. Durante muito tempo, acreditou-se que o crescimento econômico necessariamente implicava degradação ambiental, porém, estudos recentes demonstram que é possível conciliar desenvolvimento sustentável com prosperidade econômica.

A economia circular emerge como um paradigma inovador que rompe com o modelo linear tradicional de "extrair, produzir, descartar". Este novo modelo propõe a reutilização, reciclagem e reaproveitamento de recursos, criando ciclos sustentáveis de produção que minimizam o desperdício e maximizam a eficiência dos recursos naturais disponíveis.

Diversos países já demonstram que investimentos em energias renováveis, tecnologias limpas e práticas sustentáveis podem gerar empregos e impulsionar o crescimento econômico. A Alemanha, por exemplo, tornou-se líder mundial em energia solar, criando milhares de empregos no setor de energias renováveis enquanto reduzia significativamente suas emissões de carbono.

No Brasil, a transição para uma economia sustentável representa uma oportunidade única devido à abundância de recursos naturais e potencial para energias renováveis. Políticas públicas que incentivem a inovação sustentável, investimentos em pesquisa e desenvolvimento de tecnologias limpas, e parcerias público-privadas são fundamentais para essa transformação.

Portanto, a sustentabilidade ambiental não deve ser vista como um obstáculo ao desenvolvimento econômico, mas como uma oportunidade de criar um modelo de crescimento mais eficiente, duradouro e socialmente responsável, capaz de garantir prosperidade às gerações futuras sem comprometer os recursos do planeta.`,
    studentId: '3',
    studentName: 'Carla Santos',
    submittedAt: '2024-01-29T09:15:00Z',
    status: 'corrigida',
    scores: {
      competencia1: 180,
      competencia2: 160,
      competencia3: 170,
      competencia4: 150,
      competencia5: 150,
      total: 810
    },
    comments: [
      {
        id: '3',
        text: 'Excelente introdução com problematização clara',
        position: { start: 0, end: 250 },
        competencia: '1',
        createdAt: '2024-01-29T16:00:00Z'
      },
      {
        id: '4',
        text: 'Boa articulação entre os argumentos',
        position: { start: 800, end: 1200 },
        competencia: '3',
        createdAt: '2024-01-29T16:05:00Z'
      }
    ]
  }
];

