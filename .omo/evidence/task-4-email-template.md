# Task 4: Email Template & HTML Rendering Analysis

**Date:** 2026-05-20
**Task:** Explore email template and HTML rendering, identify improvement points for engaging multimedia emails

---

## Current Template Structure

The template is defined inline in `src/app/api/send-report/route.ts` (lines 8-43).

### Template Architecture

```
HTML_TEMPLATE(title, body, siteUrl, unsubscribeUrl) → string
├── <!DOCTYPE html> + <head>
│   ├── <meta charset="UTF-8">
│   ├── <meta name="viewport" content="width=device-width, initial-scale=1.0">
│   ├── <title>${title}</title>
│   └── <style> (inline CSS)
└── <body>
    ├── ${body} (markdown-converted HTML via marked)
    └── <div class="footer">
        ├── Disclaimer text
        └── Links: Visit site | Unsubscribe
```

### Current CSS Styling

| Element | Styling |
|---------|---------|
| body | Georgia serif, max-width 680px, padding 2rem, background #faf9f7, color #292827, line-height 1.7 |
| h1 | font-size 2rem, font-weight 400, color #1b1938 |
| h2 | font-size 1.35rem, color #1b1938, border-bottom 1px solid #d4cfc9 |
| h3 | font-size 1.05rem, color #1b1938 |
| a | color #714cb6 (purple) |
| blockquote | left border 3px solid #714cb6, italic |
| footer | font-size 0.8rem, color #8a847d, border-top |
| mobile | max-width 600px: body padding 1rem, h1 1.5rem |

### Current Flow

1. Report markdown read from filesystem (`public/reports/YYYY-MM-DD.md`)
2. Frontmatter stripped (`---...---`)
3. `marked.parse()` converts markdown to HTML
4. HTML injected into template
5. Sent via Resend API with subject "Parkinson's Research — {formattedDate}"

---

## Identified Improvement Points

### 1. **Responsive Email Compatibility**

**Issue:** Current template uses basic CSS that may not render well in Gmail mobile or Outlook.

**Missing:**
- No email reset styles (email clients strip global styles)
- No `max-width` on table elements for Outlook
- No explicit `table` layout for email client compatibility
- Missing `-webkit-text-size-adjust` for iOS

### 2. **Multimedia Support**

**Issue:** Currently text-only; no images, icons, or video embedding capability.

**Missing:**
- Header image/logo support
- Section icons or visual markers
- No video thumbnail/link support
- No embedded image placeholders for research visuals

### 3. **CSS Email Client Compatibility**

**Issues:**
- Using `serif` font family — not consistent across email clients
- `max-width` on `body` doesn't work in many email clients
- No VML fallback styles for Outlook
- No `mso` conditionals for Microsoft Outlook

### 4. **Template Extensibility**

**Issues:**
- Template is a hardcoded string function — not maintainable for complex layouts
- No component-based structure
- All styling is inline in the template string

### 5. **Resend API Best Practices Not Followed**

**Missing:**
- No `X-Entity-Ref-ID` header to prevent Gmail threading (can cause emails to be grouped incorrectly)
- No `textPart`/`htmlPart` for multipart MIME alternative (plain text fallback)

---

## Recommended Improvements

### High Priority

1. **Add Gmail threading prevention header**
   ```typescript
   headers: { 'X-Entity-Ref-ID': randomUUID() }
   ```

2. **Switch to table-based layout** for email client compatibility (Outlook requires tables)

3. **Add preheader text** (hidden preview text) for email clients that show preview

4. **Use system-safe font stack** (Arial, Helvetica, sans-serif)

### Medium Priority

5. **Add logo/header image support** via CID attachments or hosted images

6. **Create React Email component template** using `@react-email/components` for maintainability

7. **Add section dividers with icons** for the 4 report sections

8. **Include video link thumbnails** for any video content in reports

### Lower Priority

9. **Add social sharing links** at top/bottom of email

10. **Personalization placeholders** (subscriber name)

---

## Resources

- Resend Examples: https://github.com/resend/resend-examples
- React Email: https://react.email — component library for email templates
- Can I Email: https://www.caniemail.com — email client compatibility reference