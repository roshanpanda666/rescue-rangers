const fs = require('fs');
const marked = require('marked');
const PDFDocument = require('pdfkit');

const markdown = fs.readFileSync('README.md', 'utf8');

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('README.pdf'));

// Basic styling setup
doc.font('Helvetica');
doc.fontSize(12);

const tokens = marked.lexer(markdown);

for (const token of tokens) {
  if (token.type === 'heading') {
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.fontSize(18 - (token.depth * 2));
    doc.text(token.text.replace(/&[a-z]+;/g, ' '));
    doc.font('Helvetica');
    doc.fontSize(12);
    doc.moveDown(0.5);
  } else if (token.type === 'paragraph') {
    doc.text(token.text.replace(/&[a-z]+;/g, ' '));
    doc.moveDown(0.5);
  } else if (token.type === 'list') {
    for (const item of token.items) {
      doc.text(`• ${item.text.replace(/&[a-z]+;/g, ' ')}`, { indent: 20 });
    }
    doc.moveDown(0.5);
  } else if (token.type === 'code') {
    doc.font('Courier');
    doc.fontSize(10);
    doc.rect(doc.x, doc.y, 500, (token.text.split('\n').length * 15) + 10).fillAndStroke('#f0f0f0', '#cccccc');
    doc.fillColor('black');
    doc.text(token.text, doc.x + 10, doc.y + 10);
    doc.moveDown(1.5);
    doc.font('Helvetica');
    doc.fontSize(12);
  }
}

doc.end();
console.log('PDF generated at README.pdf');
