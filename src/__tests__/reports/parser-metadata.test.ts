import { parseReportSections } from '../../lib/parseReport'

describe('report evidence metadata', () => {
  it('preserves prose after metadata while excluding citation and metadata lines', () => {
    const [section] = parseReportSections(`## Clinical Trials
### A finding
First paragraph.
**Evidence:** Clinical trial
Second paragraph with a caution.
*From: PubMed (https://pubmed.ncbi.nlm.nih.gov/123/)*`)

    expect(section.entries[0]).toMatchObject({
      snippet: 'First paragraph. Second paragraph with a caution.',
      evidenceType: 'Clinical trial',
      url: 'https://pubmed.ncbi.nlm.nih.gov/123/',
    })
  })

  it('preserves the authored Spanish takeaway used by report fixtures', () => {
    const [section] = parseReportSections(`## Ensayos clínicos
### Un estudio
Este estudio observó a varias personas.
**Por qué es importante:** Hace falta seguimiento.
**Limitaciones:** Un grupo pequeño.
*Fuente: PubMed (https://pubmed.ncbi.nlm.nih.gov/123/)*`)

    expect(section.entries[0]).toMatchObject({
      snippet: 'Este estudio observó a varias personas.',
      whyItMatters: 'Hace falta seguimiento.',
      limitations: 'Un grupo pequeño.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/123/',
    })
  })
})
