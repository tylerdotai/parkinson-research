import type { ReportSection } from './types'

const CATEGORY_MAP: Record<string, string> = {
  'Clinical Trials': 'clinical',
  'Ensayos Clinicos': 'clinical',
  'Ensayos clínicos': 'clinical',
  'Pruebas Clínicas': 'clinical',
  'Breakthrough Treatments': 'breakthrough',
  'Tratamientos Innovadores': 'breakthrough',
  'Investigación sobre tratamientos': 'breakthrough',
  'Tratamientos innovadores': 'breakthrough',
  'Lifestyle Interventions': 'lifestyle',
  'Intervenciones de Estilo de Vida': 'lifestyle',
  'Intervenciones de estilo de vida': 'lifestyle',
  'Emerging Research': 'emerging',
  'Investigacion Emergente': 'emerging',
  'Investigación emergente': 'emerging',
  'Tech Tools & Assistive Technology': 'tech',
  'Tecnologia y Herramientas Asistenciales': 'tech',
  'Community & Support': 'community',
  'Apoyo Comunitario': 'community',
  'Caregiver Resources': 'caregiver',
  'Recursos para Cuidadores': 'caregiver',
}

function cleanDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

function inferEvidence(body: string, lang: 'en' | 'es') {
  const text = body.toLowerCase()
  const spanish = lang === 'es'
  if (/systematic review|meta-analysis|revisión sistemática|metaanálisis/.test(text)) return { type: spanish ? 'Revisión sistemática' : 'Systematic review', level: spanish ? 'Evidencia sintetizada' : 'Synthesized evidence', design: spanish ? 'Reúne varios estudios' : 'Combines multiple studies' }
  if (/mouse|mice|rat model|cell-model|cell model|laboratory|preclinical|ratón|modelo animal|estudio de laboratorio|preclínic/.test(text)) return { type: spanish ? 'Investigación preclínica' : 'Preclinical research', level: spanish ? 'Temprana' : 'Early', design: spanish ? 'Laboratorio o modelo animal' : 'Laboratory or animal model' }
  if (/randomized|randomised|placebo|phase [1-4]|recruiting|trial|ensayo|aleatorizado|reclutando|fase [1-4]/.test(text)) return { type: spanish ? 'Ensayo clínico' : 'Clinical trial', level: spanish ? 'En evaluación' : 'Under evaluation', design: spanish ? 'Prueba en personas' : 'Study in people' }
  if (/observational|cohort|database study|base de datos|observacional|cohorte/.test(text)) return { type: spanish ? 'Estudio observacional' : 'Observational study', level: spanish ? 'Asociación, no causalidad' : 'Association, not causation', design: spanish ? 'Observa datos de personas' : 'Observes people or records' }
  return { type: spanish ? 'Estudio de investigación' : 'Research study', level: spanish ? 'No indicado en el informe' : 'Not stated in report', design: spanish ? 'Diseño no indicado' : 'Design not stated' }
}

export function parseReportSections(content: string): ReportSection[] {
  const lines = content.split('\n')
  const lang = /\b(?:investigación|estudio|ensayo|familias)\b/i.test(content) ? 'es' as const : 'en' as const
  const sections: ReportSection[] = []
  let currentSection: ReportSection | null = null
  let currentEntryTitle = ''
  let currentBody = ''

  const flushEntry = () => {
    if (currentSection && (currentEntryTitle || currentBody.trim())) {
      // Extract source from body if present
      let source = ''
      let sourceUrl = ''
      let snippet = currentBody.trim()
      const metadata = (label: string) => currentBody.match(new RegExp(`\\*?\\*?${label}:\\s*(.+?)(?:\\n|$)`, 'i'))?.[1]?.replace(/\*+/g, '').trim()

      // Look for "From: domain.com (https://...)" or "*From/De: domain.com (https://...)*" (markdown italic)
      const sourceLine = currentBody.match(/^\*?(?:From|De|Source):\s*(.+?)\s*$/im)
      if (sourceLine) {
        const raw = sourceLine[1].replace(/\*+/g, '').trim()
        // Extract URL from parenthetical: "domain.com (https://...)"
        const urlMatch = raw.match(/\(https?:\/\/[^\)]+\)/)
        if (urlMatch) {
          sourceUrl = urlMatch[0].replace(/[()]/g, '')
          source = cleanDomain(sourceUrl)
        } else {
          source = cleanDomain(raw)
        }
        snippet = currentBody.split('\n').filter((line) => !/^\*?(?:From|De|Source):/i.test(line.trim())).join(' ').trim()
      }

      // Clean markdown from snippet
      snippet = snippet
        .replace(/\*?\*?(?:Evidence|Evidencia|Evidence level|Nivel de evidencia|Study design|Diseño del estudio|Source quality|Calidad de la fuente|Why it matters|Por qué importa|Limitations|Limitaciones):\s*[^\n]+/gi, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\n+/g, ' ')
        .trim()

      if (snippet || currentEntryTitle) {
        const inferred = inferEvidence(currentBody, lang)
        currentSection.entries.push({
          title: currentEntryTitle.trim() || 'Research Update',
          snippet: snippet || undefined,
          source: source || undefined,
          url: sourceUrl || undefined,
          evidenceType: metadata('Evidence') || metadata('Evidencia') || inferred.type,
          evidenceLevel: metadata('Evidence level') || metadata('Nivel de evidencia') || inferred.level,
          studyDesign: metadata('Study design') || metadata('Diseño del estudio') || inferred.design,
          sourceQuality: metadata('Source quality') || metadata('Calidad de la fuente'),
          whyItMatters: metadata('Why it matters') || metadata('Por qué importa'),
          limitations: metadata('Limitations') || metadata('Limitaciones'),
        })
      }
    }
    currentEntryTitle = ''
    currentBody = ''
  }

  for (const rawLine of lines) {
    const line = rawLine
    const trimmed = line.trim()

    if (!trimmed || trimmed === '---') continue

    // Skip top-level headers
    if (trimmed.startsWith('# ')) continue

    // Section header
    if (trimmed.startsWith('## ')) {
      flushEntry()
      if (currentSection) sections.push(currentSection)
      const title = trimmed.slice(3).trim()
      currentSection = {
        title,
        emoji: '',
        category: (CATEGORY_MAP[title] || 'clinical') as ReportSection['category'],
        entries: [],
      }
      continue
    }

    // Entry title (### Title)
    if (trimmed.startsWith('### ')) {
      flushEntry()
      currentEntryTitle = trimmed.slice(4).trim()
      continue
    }

    // Body text (accumulate until next ### or ##)
    if (currentSection) {
      currentBody += `${currentBody ? '\n' : ''}${trimmed}`
    }
  }

  flushEntry()
  if (currentSection) sections.push(currentSection)
  return sections
}
