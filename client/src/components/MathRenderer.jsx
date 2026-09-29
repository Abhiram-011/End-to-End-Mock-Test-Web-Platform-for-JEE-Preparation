import React from 'react';

/**
 * Cleanly renders text with mathematical symbols, sub/superscripts, and scientific notation
 */
export default function MathRenderer({ text = '', className = '' }) {
  if (!text) return null;

  // Split text by common formula patterns or preserve line breaks
  const paragraphs = text.split('\n');

  return (
    <div className={`math-content ${className}`} style={{ lineHeight: 1.6 }}>
      {paragraphs.map((p, pIdx) => {
        // Look for basic math formatting like x^2 or v_0
        const formatted = p
          .replace(/\^([0-9a-zA-Z\+\-]+)/g, '<sup>$1</sup>')
          .replace(/_([0-9a-zA-Z\+\-]+)/g, '<sub>$1</sub>')
          .replace(/λ/g, '<span class="math-inline">&lambda;</span>')
          .replace(/θ/g, '<span class="math-inline">&theta;</span>')
          .replace(/ω/g, '<span class="math-inline">&omega;</span>')
          .replace(/π/g, '<span class="math-inline">&pi;</span>')
          .replace(/Δ/g, '<span class="math-inline">&Delta;</span>')
          .replace(/ε₀/g, '<span class="math-inline">&epsilon;<sub>0</sub></span>')
          .replace(/∫/g, '<span class="math-inline">&int;</span>');

        return (
          <p
            key={pIdx}
            style={{ marginBottom: pIdx === paragraphs.length - 1 ? 0 : '8px' }}
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}
