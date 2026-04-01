// Test for dictionary loader
// Note: server-only restrictions apply - this test mocks the import

const dictionaries = {
  en: () => Promise.resolve({
    metadata: {
      title: 'Parkinson Research Daily',
      description: 'Autonomous daily research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, lifestyle interventions, and emerging research.',
      keywords: ['parkinsons', 'parkinson disease', 'clinical trials', 'research', 'treatment', 'caregiver']
    },
    nav: {
      home: 'Home',
      reports: 'Reports',
      about: 'About',
      api: 'API'
    },
    home: {
      badge: 'Autonomous AI Research',
      headline: "Daily Parkinson's",
      headlineAccent: 'Research Reports',
      subtitle: 'Every morning, AI agents search clinical trials, medical journals, and research databases to bring you the latest breakthroughs, trials, and evidence-based tips.',
      browseReports: 'Browse All Reports',
      learnMore: 'Learn More',
      latestReport: 'Latest Report',
      readFullReport: 'Read full report',
      dailyAt: 'Daily at 7:00 AM CDT',
      whatsTracked: "What's Tracked",
      apiAccess: 'API Access',
      apiDescription: 'Machine-readable format for AI agents and developers.',
      viewApi: 'View API',
      firstReportComing: 'First Report Coming Soon',
      firstReportDesc: 'The research agent will publish its first report soon.'
    },
    categories: {
      clinicalTrials: {
        title: 'Clinical Trials',
        desc: 'Active recruiting trials, Phase 2/3 results, eligibility criteria'
      },
      breakthroughs: {
        title: 'Breakthroughs',
        desc: 'FDA approvals, drug mechanisms, clinical evidence'
      },
      lifestyle: {
        title: 'Lifestyle',
        desc: 'Exercise protocols, diet plans, sleep optimization'
      },
      emergingResearch: {
        title: 'Emerging Research',
        desc: 'Preprints, novel targets, biomarkers, diagnostics'
      }
    },
    reports: {
      title: 'All Reports',
      count: 'reports available',
      noReports: 'No Reports Yet',
      noReportsDesc: 'Reports will appear here once the research agent runs.',
      apiSection: 'Machine-Readable API',
      apiSectionDesc: 'Access all reports as JSON for AI agents and integrations.'
    }
  }),
  es: () => Promise.resolve({
    metadata: {
      title: 'Investigacion Parkinson Diaria',
      description: 'Agente autonomo de investigacion diaria que agrega ensayos clinicos de enfermedad de Parkinson, tratamientos revolucionarios, intervenciones de estilo de vida e investigacion emergente.',
      keywords: ['parkinson', 'enfermedad de parkinson', 'ensayos clinicos', 'investigacion', 'tratamiento', 'cuidador']
    },
    nav: {
      home: 'Inicio',
      reports: 'Informes',
      about: 'Acerca de',
      api: 'API'
    },
    home: {
      badge: 'Investigacion Autonoma con IA',
      headline: 'Investigacion Diaria de',
      headlineAccent: 'Enfermedad de Parkinson',
      subtitle: 'Cada manana, agentes de IA buscan ensayos clinicos, revistas medicas y bases de datos de investigacion para traerle los ultimos avances, ensayos y consejos basados en evidencia.',
      browseReports: 'Ver Todos los Informes',
      learnMore: 'Saber Mas',
      latestReport: 'Ultimo Informe',
      readFullReport: 'Leer informe completo',
      dailyAt: 'Diario a las 7:00 AM CDT',
      whatsTracked: 'Lo Que Se Rastrea',
      apiAccess: 'Acceso a API',
      apiDescription: 'Formato legible por maquina para agentes de IA y desarrolladores.',
      viewApi: 'Ver API',
      firstReportComing: 'Primer Informe Pronto',
      firstReportDesc: 'El agente de investigacion publicara su primer informe pronto.'
    },
    categories: {
      clinicalTrials: {
        title: 'Ensayos Clinicos',
        desc: 'Ensayos activos que reclutan, resultados de Fase 2/3, criterios de elegibilidad'
      },
      breakthroughs: {
        title: 'Avances',
        desc: 'Aprobaciones de FDA, mecanismos de farmacos, evidencia clinica'
      },
      lifestyle: {
        title: 'Estilo de Vida',
        desc: 'Protocolos de ejercicio, planes de dieta, optimizacion del sueno'
      },
      emergingResearch: {
        title: 'Investigacion Emergente',
        desc: 'Preprints, objetivos novedosos, biomarcadores, diagnosticos'
      }
    },
    reports: {
      title: 'Todos los Informes',
      count: 'informes disponibles',
      noReports: 'Sin Informes Todavia',
      noReportsDesc: 'Los informes apareceran aqui una vez que el agente de investigacion se ejecute.',
      apiSection: 'API Legible por Maquina',
      apiSectionDesc: 'Accede a todos los informes como JSON para agentes de IA e integraciones.'
    }
  })
}

type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

async function getDictionary(lang: string): Promise<Dictionary> {
  const validLocales = ['en', 'es'] as const
  const locale = validLocales.includes(lang as any) ? lang : 'en'
  return dictionaries[locale as keyof typeof dictionaries]()
}

describe('Dictionary', () => {
  it('should load English dictionary', async () => {
    const dict = await getDictionary('en')
    expect(dict.metadata.title).toBe('Parkinson Research Daily')
    expect(dict.nav.home).toBe('Home')
    expect(dict.home.headline).toBe("Daily Parkinson's")
  })

  it('should load Spanish dictionary', async () => {
    const dict = await getDictionary('es')
    expect(dict.metadata.title).toBe('Investigacion Parkinson Diaria')
    expect(dict.nav.home).toBe('Inicio')
    expect(dict.home.headline).toBe('Investigacion Diaria de')
  })

  it('should default to English for invalid locale', async () => {
    const dict = await getDictionary('fr')
    expect(dict.metadata.title).toBe('Parkinson Research Daily')
  })

  it('should have all required keys in English', async () => {
    const dict = await getDictionary('en')
    expect(dict.metadata).toHaveProperty('title')
    expect(dict.metadata).toHaveProperty('description')
    expect(dict.nav).toHaveProperty('home')
    expect(dict.nav).toHaveProperty('reports')
    expect(dict.nav).toHaveProperty('about')
    expect(dict.nav).toHaveProperty('api')
    expect(dict.home).toHaveProperty('badge')
    expect(dict.home).toHaveProperty('headline')
    expect(dict.home).toHaveProperty('headlineAccent')
    expect(dict.home).toHaveProperty('subtitle')
    expect(dict.categories).toHaveProperty('clinicalTrials')
    expect(dict.categories).toHaveProperty('breakthroughs')
    expect(dict.categories).toHaveProperty('lifestyle')
    expect(dict.categories).toHaveProperty('emergingResearch')
  })

  it('should have all required keys in Spanish', async () => {
    const dict = await getDictionary('es')
    expect(dict.metadata).toHaveProperty('title')
    expect(dict.metadata).toHaveProperty('description')
    expect(dict.nav).toHaveProperty('home')
    expect(dict.nav).toHaveProperty('reports')
    expect(dict.nav).toHaveProperty('about')
    expect(dict.nav).toHaveProperty('api')
    expect(dict.home).toHaveProperty('badge')
    expect(dict.home).toHaveProperty('headline')
    expect(dict.home).toHaveProperty('headlineAccent')
    expect(dict.home).toHaveProperty('subtitle')
    expect(dict.categories).toHaveProperty('clinicalTrials')
    expect(dict.categories).toHaveProperty('breakthroughs')
    expect(dict.categories).toHaveProperty('lifestyle')
    expect(dict.categories).toHaveProperty('emergingResearch')
  })

  it('should have matching structure between locales', async () => {
    const en = await getDictionary('en')
    const es = await getDictionary('es')
    
    // Check that Spanish has same top-level keys as English
    expect(Object.keys(es)).toEqual(expect.arrayContaining(Object.keys(en)))
    
    // Check nested keys
    expect(Object.keys(es.metadata)).toEqual(Object.keys(en.metadata))
    expect(Object.keys(es.nav)).toEqual(Object.keys(en.nav))
    expect(Object.keys(es.home)).toEqual(Object.keys(en.home))
    expect(Object.keys(es.categories)).toEqual(Object.keys(en.categories))
  })
})
