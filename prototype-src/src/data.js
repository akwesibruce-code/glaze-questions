// Prices come from Glaze's Art Menu and Kids Events PDFs. Bookings, workshops
// and numbers are example data for the prototype.

export const ADULT_MENU = [
  { id: 'canvas', name: 'Canvas painting', price: 250, art: true, blurb: 'Your own artwork on stretched canvas with acrylic and metallic paints.' },
  { id: 'calabash-s', name: 'Calabash bowl painting (small)', price: 200, art: true, blurb: 'Paint and decorate a locally made calabash with shells, beads and jute rope.' },
  { id: 'calabash-b', name: 'Calabash bowl painting (big)', price: 350, art: true, blurb: 'The large calabash, same materials.' },
  { id: 'textured', name: 'Textured art', price: 350, art: true, blurb: 'Tissue, salt and paste for a 3D-style textured piece.' },
  { id: 'collage', name: 'Mixed media collage', price: 400, art: true, blurb: 'Fabrics, paper, magazine cut-outs and accessories.' },
  { id: 'charcoal', name: 'Charcoal sketching', price: 250, art: true, blurb: 'With a Glaze sketchbook: sketching and shading with pencils and charcoal.' },
  { id: 'clay-250', name: 'Clay modelling (250g)', price: 250, art: true, blurb: 'Model, paint and glaze your own air-dry clay piece.' },
  { id: 'clay-500', name: 'Clay modelling (500g)', price: 400, art: true, blurb: 'The bigger 500g option.' },
  { id: 'shea', name: 'Shea body butter making', price: 500, art: true, star: true, blurb: 'A 150ml jar of whipped body butter, 15+ scents, and you paint the jar.' },
  { id: 'dance', name: 'Dance class', price: 200, art: false, star: true, blurb: 'Afro-fusion dance with great beats and vibes.' },
  { id: 'sewing', name: 'Fabric sewing class', price: 350, art: true, star: true, blurb: 'Sew a keychain, tote, pouch or clothing piece. Take your kit home.' },
  { id: 'crochet', name: 'Crocheting class', price: 350, art: true, star: true, blurb: 'Crochet basics and a coaster, pouch or small accessory.' },
  { id: 'candle-1', name: 'Candle making (1 jar)', price: 455, art: true, star: true, blurb: 'A fragrance bar with 10+ scents and your own embellishments.' },
  { id: 'candle-2', name: 'Candle making (2 jars)', price: 650, art: true, star: true, blurb: 'Two jars.' },
  { id: 'basket', name: 'Basket weaving', price: 350, art: true, star: true, blurb: 'Weave your own mat or coaster.' },
  { id: 'plant', name: 'Paint & plant', price: 300, art: true, star: true, blurb: 'Paint a terracotta pot and add a plant.' },
  { id: 'charm', name: 'Charm bracelet making', price: 400, art: true, star: true, blurb: 'Gold-plated bracelet with up to 4 charms, and a pouch.' },
  { id: 'bedazzle', name: 'Bedazzle canvas', price: 330, art: true, star: true, blurb: 'Bedazzle a custom-printed canvas with gems.' },
  { id: 'gypsum', name: 'Gypsum tray painting', price: 250, art: true, star: true, blurb: 'Paint and design your own tray.' },
  { id: 'tote', name: 'Tote bag painting', price: 200, art: true, star: true, blurb: 'Customise your own tote bag.' },
  { id: 'wood-planter', name: 'Woodworking: planter stand', price: 600, art: true, wood: true, blurb: 'Build the base, paint the pot and add a plant.' },
  { id: 'wood-table', name: 'Woodworking: side table', price: 850, art: true, wood: true, blurb: 'Assemble, paint and varnish your own side table.' },
]

export const KIDS_MENU = [
  { id: 'k-canvas', name: 'Canvas painting', price: 150, art: true, blurb: 'Their own artwork on stretched canvas.' },
  { id: 'k-textured', name: 'Textured art', price: 250, art: true, blurb: '3D-style art with tissue, salt and paste.' },
  { id: 'k-collage', name: 'Mixed media collage', price: 300, art: true, blurb: 'Fabrics, paper and magazine cut-outs.' },
  { id: 'k-calabash-s', name: 'Calabash bowl painting (small)', price: 200, art: true, blurb: 'Shells, beads and jute rope.' },
  { id: 'k-calabash-b', name: 'Calabash bowl painting (big)', price: 350, art: true, blurb: 'The large calabash.' },
  { id: 'k-charcoal', name: 'Charcoal sketching', price: 150, art: true, blurb: 'With a Glaze sketchbook.' },
  { id: 'k-clay-250', name: 'Clay modelling (250g)', price: 250, art: true, blurb: 'Model, paint and glaze air-dry clay.' },
  { id: 'k-clay-500', name: 'Clay modelling (500g)', price: 400, art: true, blurb: 'The bigger option.' },
  { id: 'k-frame', name: 'Picture frame decorating', price: 150, art: true, blurb: 'Paint, gems, pompoms and stickers.' },
  { id: 'k-wand', name: 'Wooden wand decorating', price: 150, art: true, blurb: 'Paint, gems, ribbon, lots of shapes.' },
  { id: 'k-cap', name: 'Baseball cap painting', price: 180, art: true, blurb: 'White or black cap.' },
  { id: 'k-tote', name: 'Tote bag painting', price: 180, art: true, blurb: 'Their own painted tote.' },
  { id: 'k-tshirt', name: 'T-shirt painting', price: 180, art: true, blurb: 'Wearable art, white or black tee.' },
  { id: 'k-plant', name: 'Paint & plant', price: 280, art: true, blurb: 'Paint a pot, add soil and a plant.' },
  { id: 'k-bedazzle', name: 'Bedazzle canvas', price: 280, art: true, blurb: 'Gems on a custom-printed canvas.' },
  { id: 'k-gypsum', name: 'Gypsum tray painting', price: 250, art: true, blurb: 'Custom shapes available by theme.' },
]

export const EVENT_TYPES = ['Birthday', 'Group gathering', 'Workshop', 'Corporate bonding', 'Pop-up', 'Other']

export const CAP_ART = 45
export const CAP_OTHER = 70
export const DEPOSIT = 0.7
export const GROUP_DISCOUNT = 0.1 // 6 or more

export const ROLES = {
  darlene: { name: 'Darlene', label: 'Owner', can: { bookings: 1, approve: 1, money: 1, prices: 1, post: 1, tools: 1, stock: 1 } },
  frontdesk: { name: 'Front desk', label: 'Front desk', can: { bookings: 1, money: 1, tools: 1, stock: 1 } },
  lead: { name: 'Lead instructor', label: 'Lead instructor', can: { bookings: 1, tools: 1, stock: 1 } },
  ops: { name: 'Ops manager', label: 'Ops manager', can: { bookings: 1, money: 1, post: 1, tools: 1, stock: 1, log: 1 } },
}

export const ghs = n => (n < 0 ? '−' : '') + 'GH₵' + Math.abs(Math.round(n)).toLocaleString('en-GH')

export function allMenu() { return [...ADULT_MENU, ...KIDS_MENU] }
export function findActivity(id) { return allMenu().find(a => a.id === id) }

export function quoteFor(req) {
  const act = findActivity(req.activity)
  const guests = +req.guests || 0
  const lines = []
  if (act) lines.push({ label: `${act.name} × ${guests}`, amount: act.price * guests })
  else lines.push({ label: 'Activity to confirm', amount: 0 })
  const sub = lines.reduce((s, l) => s + l.amount, 0)
  if (guests >= 6 && sub) lines.push({ label: 'Group discount (10%)', amount: -sub * GROUP_DISCOUNT })
  if (isOffDay(req.date)) lines.push({ label: 'Monday/Tuesday fee (amount TBC)', amount: 0, tbc: true })
  const total = lines.reduce((s, l) => s + l.amount, 0)
  return { lines, total, deposit: total * DEPOSIT }
}

export function isOffDay(date) {
  if (!date) return false
  const d = new Date(date + 'T12:00:00').getDay()
  return d === 1 || d === 2
}

export const TODAY = new Date().toISOString().slice(0, 10)
export const addDays = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
export const longToday = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

export const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''

export function seed() {
  return {
    requests: [
      { id: 'r1', status: 'new', created: '2026-11-06', type: 'Birthday', audience: 'Kids', ages: '6–8', celebrant: 'Esi', bookingName: 'Example: Mensah family', date: '2026-11-21', time: '14:00', duration: '2 hours', guests: 12, activity: 'k-canvas', unsure: '', vendor: 'own', vendorName: 'Example Cakes & Co', vendorPhone: '024 000 0000', inspo: '', logistics: 'Cake at 3:30pm, we bring our own balloons.', contactName: 'Example parent', phone: '020 000 0000', email: 'parent@example.com', channel: 'Both' },
      { id: 'r2', status: 'new', created: '2026-11-06', type: 'Corporate bonding', audience: 'Adults', ages: '25–40', celebrant: '', bookingName: 'Example: Sankofa Ltd team', date: '2026-12-01', time: '10:00', duration: '3 hours', guests: 28, activity: 'candle-1', unsure: '', vendor: 'glaze', vendorName: '', vendorPhone: '', inspo: 'Neutral tones, greenery, a long table set-up', logistics: 'Need a projector for a short welcome talk.', contactName: 'Example HR lead', phone: '050 000 0000', email: 'hr@example.com', channel: 'Both' },
      { id: 'r3', status: 'quoted', created: '2026-11-03', type: 'Group gathering', audience: 'Adults', ages: '20s', celebrant: '', bookingName: 'Example: Book club', date: '2026-11-15', time: '16:00', duration: '2 hours', guests: 10, activity: 'calabash-s', unsure: '', vendor: 'none', logistics: '', contactName: 'Example organiser', phone: '026 000 0000', email: '', channel: 'WhatsApp', quoteTotal: 1800, depositDue: '2026-11-08' },
      { id: 'r4', status: 'booked', created: '2026-10-28', type: 'Birthday', audience: 'Kids', ages: '9–11', celebrant: 'Kofi', bookingName: 'Example: Owusu family', date: '2026-11-14', time: '13:00', duration: '2 hours', guests: 15, activity: 'k-tshirt', vendor: 'glaze', logistics: '', contactName: 'Example parent', phone: '027 000 0000', email: '', channel: 'Both', quoteTotal: 2430, depositPaid: 1701 },
    ],
    tables: [
      { id: 't1', date: '2026-11-08', time: '14:00', adults: 2, kids: 2, people: 4, activity: '', pay: 'studio', name: 'Example: Boateng family', phone: '024 000 0000', status: 'pay at studio' },
      { id: 't2', date: '2026-11-08', time: '16:00', adults: 3, kids: 0, people: 3, activity: 'canvas', pay: 'now', name: 'Example: Adjoa + friends', phone: '055 000 0000', total: 750, status: 'paid' },
    ],
    workshops: [
      { id: 'w1', title: 'Christmas ornament painting', date: '2026-12-05', time: '11:00', price: 250, spots: 16, img: 'calabash', booked: 11, holds: [{ name: 'Example guest', until: '2026-11-09' }], waitlist: [] },
      { id: 'w2', title: 'Charcoal sketching basics', date: '2026-12-06', time: '15:00', price: 250, spots: 12, img: 'sketch', booked: 12, holds: [], waitlist: ['Example guest A', 'Example guest B'] },
      { id: 'w3', title: 'Candle making night', date: '2026-12-12', time: '18:00', price: 455, spots: 20, img: 'paint', booked: 7, holds: [], waitlist: [] },
      { id: 'w4', title: 'Kids holiday art camp', date: '2026-12-19', time: '10:00', price: 300, spots: 20, img: 'kids', booked: 14, holds: [{ name: 'Example parent', until: '2026-11-10' }], waitlist: [] },
    ],
    sales: [
      { day: 'Fri 31 Oct', cash: 1240, momo: 2860, card: 1950, transfer: 600 },
      { day: 'Sat 1 Nov', cash: 2100, momo: 4320, card: 3180, transfer: 0 },
      { day: 'Sun 2 Nov', cash: 1780, momo: 3900, card: 2460, transfer: 850 },
      { day: 'Wed 4 Nov', cash: 640, momo: 1520, card: 980, transfer: 0 },
      { day: 'Thu 5 Nov', cash: 910, momo: 1880, card: 1200, transfer: 450 },
      { day: 'Today', cash: 1320, momo: 2410, card: 1760, transfer: 0 },
    ],
    till: { expected: 1320, counted: 1300, note: 'GH₵20 short, front desk to check receipts' },
    stock: [
      { group: 'Materials', item: 'Clay', unit: 'kg', count: 4, min: 10 },
      { group: 'Materials', item: 'Canvases (stretched)', unit: '', count: 38, min: 20 },
      { group: 'Materials', item: 'Canvases (flat)', unit: '', count: 12, min: 20 },
      { group: 'Materials', item: 'Sketchbooks', unit: '', count: 22, min: 15 },
      { group: 'Materials', item: 'Paint levels', unit: '%', count: 35, min: 40 },
      { group: 'Materials', item: 'Calabashes (small)', unit: '', count: 26, min: 15 },
      { group: 'Materials', item: 'Calabashes (big)', unit: '', count: 6, min: 10 },
      { group: 'Aprons', item: 'Adult aprons', unit: '', count: 24, min: 20 },
      { group: 'Aprons', item: 'Kids aprons', unit: '', count: 18, min: 20 },
      { group: 'Aprons', item: 'XS kids aprons', unit: '', count: 8, min: 8 },
      { group: 'Snacks', item: 'Bottled water', unit: '', count: 30, min: 24 },
      { group: 'Snacks', item: 'Juice boxes', unit: '', count: 10, min: 24 },
      { group: 'Cleaning', item: 'Trash bags', unit: 'rolls', count: 3, min: 2 },
      { group: 'Cleaning', item: 'Toilet paper', unit: 'rolls', count: 5, min: 12 },
      { group: 'Cleaning', item: 'Kitchen roll', unit: 'rolls', count: 6, min: 4 },
      { group: 'Cleaning', item: 'Table covers', unit: '', count: 14, min: 10 },
    ],
    sources: { Materials: 'Storage (bulk shipment)', Aprons: 'Laundry every two weeks', Snacks: "Auntie's shop (delivered)", Cleaning: 'Melcom downstairs' },
    power: [
      { date: '2026-10-24', amount: 500 },
      { date: '2026-10-30', amount: 600 },
      { date: '2026-11-04', amount: 500 },
    ],
    reports: [
      { id: 'lr1', date: '2026-11-04', student: 'Example student (age 9)', did: 'Colour mixing and a landscape on canvas board', notes: 'Really enjoyed blending skies. Getting more confident with brush control. Next step is slowing down on edges.', next: 'Painting water and reflections' },
    ],
    log: [
      { id: 'l1', date: '2026-11-05', from: 'Front desk', kind: 'Payment request', what: 'Needs GH₵150 for printer ink', action: 'Approved from petty cash', escalate: false },
      { id: 'l2', date: '2026-11-06', from: 'Instructor', kind: 'Running late', what: 'Traffic, 20 minutes late for 10am class', action: 'Lead instructor covered the start', escalate: false },
    ],
    tuesday: [],
  }
}
