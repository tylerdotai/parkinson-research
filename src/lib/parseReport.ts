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

function inferLegacyInterpretation(title: string, body: string, lang: 'en' | 'es') {
  const text = `${title} ${body}`.toLowerCase()
  const subject = title.replace(/[—–].*$/, '').trim()
  if (lang === 'es') {
    if (/phase|fase|placebo|recruit|reclut/.test(text)) return { why: `Este informe describe una prueba en personas sobre ${subject}. Para una familia, la pregunta clave es si el estudio demuestra un beneficio medible, no solo si el tratamiento está siendo probado.`, limit: 'Un ensayo en curso no demuestra eficacia ni significa que el tratamiento esté disponible.' }
    if (/cohort|cohorte|long-term|largo plazo|follow-up|seguimiento|database|base de datos/.test(text)) return { why: `Este resultado sigue a un grupo de personas o registros relacionados con ${subject}. Puede mostrar qué ocurrió en ese grupo y orientar decisiones futuras.`, limit: 'La comparación no aleatorizada puede mostrar una asociación sin demostrar que una intervención causó el resultado.' }
    if (/review|revisión|meta-analysis|metaanálisis|tai chi|tai-chi/.test(text)) return { why: `Este informe reúne evidencia sobre ${subject}, por lo que ayuda a ver si distintos estudios apuntan en la misma dirección.`, limit: 'La conclusión depende de la calidad y diferencias entre los estudios incluidos; no predice el resultado de cada persona.' }
    if (/biomarker|biomarcador|urine|orina|sensor|microrna|test|panel/.test(text)) return { why: `Este hallazgo busca señales medibles relacionadas con ${subject}. Podría ayudar a desarrollar una prueba o a seleccionar participantes en el futuro.`, limit: 'Una señal prometedora no es todavía una prueba diagnóstica validada ni guía por sí sola un tratamiento.' }
    if (/genetic|genét|mapt|gba1|lrrk2|variant|variante/.test(text)) return { why: `Este estudio relaciona factores genéticos con ${subject}. Puede ayudar a entender por qué el riesgo o la respuesta varía entre personas.`, limit: 'Una asociación genética no determina el futuro de una persona ni implica que exista una terapia dirigida disponible.' }
    if (/mouse|mice|rat|animal|cell|laboratory|laboratorio|preclinical|preclín/.test(text)) return { why: `Este trabajo prueba una idea sobre ${subject} antes de estudiarla ampliamente en personas. Sirve para decidir qué preguntas merecen ensayos humanos.`, limit: 'Los resultados de células o animales pueden no reproducirse en personas.' }
    return { why: `El hallazgo concreto de este informe es: “${subject}”. Esa afirmación debe leerse junto con el diseño del estudio y la fuente original.`, limit: 'El informe no aporta suficiente contexto para convertir este titular en una recomendación médica.' }
  }
  if (/phase|placebo|recruit/.test(text)) return { why: `This report describes a study in people about ${subject}. For a family, the key question is whether the study shows a measurable benefit—not merely that the treatment is being tested.`, limit: 'An ongoing trial does not prove effectiveness or mean the treatment is available.' }
  if (/cohort|long-term|follow-up|database/.test(text)) return { why: `This result follows a group of people or records related to ${subject}. It can show what happened in that group and help shape future questions.`, limit: 'Without randomization, an association may reflect other differences rather than the intervention causing the result.' }
  if (/review|meta-analysis|tai chi|tai-chi/.test(text)) return { why: `This report brings together evidence about ${subject}, helping show whether separate studies point in the same direction.`, limit: 'The conclusion depends on the quality and differences among the included studies; it cannot predict an individual outcome.' }
  if (/biomarker|urine|sensor|microrna|test|panel/.test(text)) return { why: `This finding looks for measurable signals related to ${subject}. It could inform a future test or help select research participants.`, limit: 'A promising signal is not yet a validated diagnostic test and cannot guide treatment by itself.' }
  if (/genetic|mapt|gba1|lrrk2|variant/.test(text)) return { why: `This study links genetic factors with ${subject}. It may help explain why risk or treatment response differs between people.`, limit: 'A genetic association does not determine an individual’s future and does not mean a targeted therapy is available.' }
  if (/mouse|mice|rat|animal|cell|laboratory|preclinical/.test(text)) return { why: `This work tests an idea about ${subject} before it is studied broadly in people. It helps researchers decide which questions deserve human trials.`, limit: 'Results from cells or animals may not reproduce in people.' }
  return { why: `The specific claim in this report is “${subject}.” It should be read alongside the study design and original source.`, limit: 'The report does not provide enough context to turn this headline into medical advice.' }
}

function extractLegacyTakeaway(snippet: string, lang: 'en' | 'es') {
  const sentences = snippet.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 35)
  const pattern = lang === 'es' ? /no demuestra|no es|sin demostrar|sugiere|asociad|podría|requiere|limit|pero|aunque/i : /not evidence|not a |cannot prove|associated|linked|suggest|could|requires|but|although|remains/i
  return sentences.find((sentence) => pattern.test(sentence)) || sentences[sentences.length - 1]
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
        const interpretation = inferLegacyInterpretation(currentEntryTitle.trim() || 'this finding', currentBody, lang)
        const takeaway = extractLegacyTakeaway(snippet, lang)
        currentSection.entries.push({
          title: currentEntryTitle.trim() || 'Research Update',
          snippet: snippet || undefined,
          source: source || undefined,
          url: sourceUrl || undefined,
          evidenceType: metadata('Evidence') || metadata('Evidencia') || inferred.type,
          evidenceLevel: metadata('Evidence level') || metadata('Nivel de evidencia') || inferred.level,
          studyDesign: metadata('Study design') || metadata('Diseño del estudio') || inferred.design,
          sourceQuality: metadata('Source quality') || metadata('Calidad de la fuente'),
          whyItMatters: metadata('Why it matters') || metadata('Por qué importa') || takeaway || interpretation.why,
          limitations: metadata('Limitations') || metadata('Limitaciones') || interpretation.limit,
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
