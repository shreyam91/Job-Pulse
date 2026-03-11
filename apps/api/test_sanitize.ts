import sanitizeHtml from 'sanitize-html';
import he from 'he';

const htmlStr = '&lt;div class=&quot;content-intro&quot;&gt;&lt;p&gt;Airtable is the no-code&lt;/p&gt;&lt;/div&gt;&lt;script&gt;alert(1)&lt;/script&gt;';
const decoded = he.decode(htmlStr);
const sanitized = sanitizeHtml(decoded, {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  allowedAttributes: {
    'a': ['href']
  }
});
console.log('Sanitized:', sanitized);
