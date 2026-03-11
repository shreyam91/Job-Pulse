import he from 'he';
const html = '&lt;div class=&quot;content-intro&quot;&gt;&lt;p&gt;Airtable is the no-code&lt;/p&gt;&lt;/div&gt;';
console.log('Original:', html);
const decoded = he.decode(html);
console.log('Decoded:', decoded);
const stripped = decoded.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('Stripped:', stripped);
